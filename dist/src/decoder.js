"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Decoder = void 0;
const ethers_1 = require("ethers");
const utils_1 = require("ethers/lib/utils");
class Decoder {
    constructor(artifacts, cache) {
        this.functionFragmentsBySelector = new Map();
        this.errorFragmentsBySelector = new Map();
        this.eventFragmentsByTopic0 = new Map();
        this.cache = cache;
        this.ready = this._updateArtifacts(artifacts);
    }
    async updateArtifacts(artifacts) {
        this.ready = this._updateArtifacts(artifacts);
    }
    async _updateArtifacts(artifacts) {
        const names = await artifacts.getAllFullyQualifiedNames();
        const everyArtifact = await Promise.all(names.map((name) => artifacts.readArtifact(name)));
        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            const artifact = everyArtifact[i];
            const iface = new ethers_1.ethers.utils.Interface(artifact.abi);
            copyFragments(name, iface.functions, this.functionFragmentsBySelector);
            copyFragments(name, iface.errors, this.errorFragmentsBySelector);
            copyFragments(name, iface.events, this.eventFragmentsByTopic0);
        }
        // common errors, these are in function format because Ethers.js does not accept them as errors
        const commonErrors = [
            "function Error(string reason)",
            "function Panic(uint256 code)",
        ];
        const commonErrorsIface = new utils_1.Interface(commonErrors);
        copyFragments("", commonErrorsIface.functions, this.errorFragmentsBySelector);
    }
    async decode(inputData, returnData) {
        await this.ready;
        try {
            return decode(inputData, returnData, "function", this.functionFragmentsBySelector, this.cache);
        }
        catch { }
        return decode(inputData, returnData, "error", this.errorFragmentsBySelector, this.cache);
    }
    async decodeFunction(inputData, returnData) {
        await this.ready;
        return decode(inputData, returnData, "function", this.functionFragmentsBySelector, this.cache);
    }
    async decodeError(revertData) {
        await this.ready;
        const { fragment, inputResult, contractName } = await decode(revertData, "0x", "error", this.errorFragmentsBySelector, this.cache);
        return { fragment, revertResult: inputResult, contractName };
    }
    async decodeEvent(topics, data) {
        await this.ready;
        if (topics.length === 0) {
            throw new Error("[hardhat-tracer]: No topics, cannot decode");
        }
        const topic0 = topics[0];
        const fragments = this.eventFragmentsByTopic0.get(topic0);
        if (fragments) {
            for (const { contractName, fragment } of fragments) {
                try {
                    const iface = new ethers_1.ethers.utils.Interface([fragment]);
                    const result = iface.parseLog({ data, topics });
                    return { fragment, result: result.args, contractName };
                }
                catch { }
            }
        }
        throw decodeError(topic0);
    }
}
exports.Decoder = Decoder;
function copyFragments(contractName, fragments, mapping) {
    for (const fragment of Object.values(fragments)) {
        addFragmentToMapping(contractName, fragment, mapping);
    }
}
function addFragmentToMapping(contractName, fragment, mapping) {
    const selector = utils_1.EventFragment.isEventFragment(fragment)
        ? ethers_1.ethers.utils.Interface.getEventTopic(fragment)
        : ethers_1.ethers.utils.Interface.getSighash(fragment);
    let fragments = mapping.get(selector);
    if (!fragments) {
        mapping.set(selector, (fragments = []));
    }
    // TODO while adding, see if we already have a same signature fragment
    fragments.push({ contractName, fragment });
}
async function decode(inputData, returnData, type, mapping, cache) {
    const selector = inputData.slice(0, 10);
    // console.log("selector", selector);
    // if we have a local fragment for this selector, try using it
    const fragments = mapping.get(selector);
    if (fragments) {
        for (const { fragment, contractName } of fragments) {
            try {
                const iface = new utils_1.Interface([fragment]);
                if (type === "function") {
                    const inputResult = iface.decodeFunctionData(inputData.slice(0, 10), inputData);
                    let returnResult;
                    try {
                        returnResult = iface.decodeFunctionResult(inputData.slice(0, 10), returnData);
                    }
                    catch { }
                    return { fragment, inputResult, returnResult, contractName };
                }
                else if (type === "error") {
                    const inputResult = iface.decodeErrorResult(fragment, inputData);
                    return { fragment, inputResult, contractName };
                }
            }
            catch { }
        }
    }
    // we couldn't decode it using local ABI, try 4byte.directory
    // currently only supports function calls
    if (type === "function") {
        try {
            const { fragment, inputResult } = await decodeUsing4byteDirectory(selector, inputData, mapping, cache);
            return { fragment, inputResult };
        }
        catch { }
    }
    // we couldn't decode it after even using 4byte.directory, give up
    throw decodeError(selector);
}
async function decodeUsing4byteDirectory(selector, inputData, mapping, cache) {
    let responseResults;
    const cacheVal = cache.fourByteDir.get(selector);
    if (cacheVal) {
        responseResults = cacheVal;
    }
    else {
        const response = await (0, utils_1.fetchJson)("https://www.4byte.directory/api/v1/signatures/?hex_signature=" + selector);
        responseResults = response.results;
        cache.fourByteDir.set(selector, responseResults);
        cache.save();
    }
    // console.log("response", response);
    for (const result of responseResults) {
        // console.log({ result });
        try {
            const iface = new utils_1.Interface(["function " + result.text_signature]);
            const inputResult = iface.decodeFunctionData(inputData.slice(0, 10), inputData);
            // there's some weird Node.js bug, error from above line doesn't get catched by try/catch
            // the following line looks inside inputResult, so Node.js has to resolve it.
            for (const _ of inputResult) {
            }
            // cache the fragment for next time (within the same run)
            const fragment = iface.getFunction(result.text_signature);
            // console.log(fragment);
            addFragmentToMapping("", fragment, mapping);
            return { fragment, inputResult };
        }
        catch (E) {
            // console.log("error xyzzz", E);
        }
    }
    throw decodeError(selector);
}
function decodeError(selector) {
    return new Error(`Could not decode data for selector ${selector}, no ABI available.`);
}
//# sourceMappingURL=decoder.js.map