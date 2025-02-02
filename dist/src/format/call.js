"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCall = void 0;
const ethers_1 = require("ethers");
const utils_1 = require("ethers/lib/utils");
const constants_1 = require("../constants");
const utils_2 = require("../utils");
const colors_1 = require("../utils/colors");
const param_1 = require("./param");
const result_1 = require("./result");
async function formatCall(to, input, ret, value, gasUsed, gasLimit, success, dependencies) {
    let contractName;
    let contractDecimals;
    let inputResult;
    let returnResult;
    let fragment;
    try {
        ({
            fragment,
            contractName,
            inputResult,
            returnResult,
        } = await dependencies.tracerEnv.decoder.decodeFunction(input, ret));
        // use just contract name
        contractName = contractName.split(":")[1];
    }
    catch { }
    // find a better contract name
    const betterContractName = await (0, utils_2.getBetterContractName)(to, dependencies);
    if (betterContractName) {
        contractName = betterContractName;
    }
    else if (contractName) {
        dependencies.tracerEnv.nameTags[to] = contractName;
    }
    // if ERC20 method found then fetch decimals
    if (input.slice(0, 10) === "0x70a08231" || // balanceOf
        input.slice(0, 10) === "0xa9059cbb" || // transfer
        input.slice(0, 10) === "0x23b872dd" // transferFrom
    ) {
        // see if we already know the decimals
        const { cache } = dependencies.tracerEnv._internal;
        const decimals = cache.tokenDecimals.get(to);
        if (decimals) {
            // if we know decimals then use it
            contractDecimals = decimals !== -1 ? decimals : undefined;
        }
        else {
            // otherwise fetch it
            contractDecimals = await (0, utils_2.fetchContractDecimals)(to, dependencies);
            // and cache it
            if (contractDecimals !== undefined) {
                cache.tokenDecimals.set(to, contractDecimals);
            }
            else {
                cache.tokenDecimals.set(to, -1);
            }
            cache.save();
        }
    }
    const extra = [];
    if ((value = ethers_1.BigNumber.from(value)).gt(0)) {
        extra.push(`value${constants_1.SEPARATOR}${(0, utils_1.formatEther)(value)}`);
    }
    if ((gasLimit = ethers_1.BigNumber.from(gasLimit)).gt(0) &&
        (gasUsed = ethers_1.BigNumber.from(gasUsed)).gt(0) &&
        dependencies.tracerEnv.gasCost) {
        extra.push(`gasLimit${constants_1.SEPARATOR}${(0, param_1.formatParam)(gasLimit, dependencies)}`);
        extra.push(`gasUsed${constants_1.SEPARATOR}${(0, param_1.formatParam)(gasUsed, dependencies)}`);
    }
    const colorFunction = success ? colors_1.colorFunctionSuccess : colors_1.colorFunctioFail;
    if (inputResult && fragment) {
        const inputArgs = (0, result_1.formatResult)(inputResult, fragment.inputs, { decimals: contractDecimals, shorten: false }, dependencies);
        const outputArgs = returnResult
            ? (0, result_1.formatResult)(returnResult, fragment.outputs, { decimals: contractDecimals, shorten: true }, dependencies)
            : // if return data is not decoded, then show return data only if call was success
                ret !== "0x" && success !== false // success can be undefined
                    ? ret
                    : "";
        const nameToPrint = contractName ?? "UnknownContract";
        return `${dependencies.tracerEnv.showAddresses || nameToPrint === "UnknownContract"
            ? `${(0, colors_1.colorContract)(nameToPrint)}(${to})`
            : (0, colors_1.colorContract)(nameToPrint)}.${colorFunction(fragment.name)}${extra.length !== 0 ? (0, colors_1.colorExtra)(`{${extra.join(", ")}}`) : ""}(${inputArgs})${outputArgs ? ` => (${outputArgs})` : ""}`;
    }
    // TODO add flag to hide unrecognized stuff
    if (contractName) {
        return `${dependencies.tracerEnv.showAddresses
            ? `${(0, colors_1.colorContract)(contractName)}(${to})`
            : (0, colors_1.colorContract)(contractName)}.<${colorFunction("UnknownFunction")}>${extra.length !== 0 ? (0, colors_1.colorExtra)(`{${extra.join(", ")}}`) : ""}(${(0, colors_1.colorKey)("input" + constants_1.SEPARATOR)}${(0, colors_1.colorValue)(input)}, ${(0, colors_1.colorKey)("ret" + constants_1.SEPARATOR)}${(0, colors_1.colorValue)(ret)})`;
    }
    else {
        return `${colorFunction("UnknownContractAndFunction")}${extra.length !== 0 ? (0, colors_1.colorExtra)(`{${extra.join(", ")}}`) : ""}(${(0, colors_1.colorKey)("to" + constants_1.SEPARATOR)}${(0, colors_1.colorValue)(to)}, ${(0, colors_1.colorKey)("input" + constants_1.SEPARATOR)}${input}, ${(0, colors_1.colorKey)("ret" + constants_1.SEPARATOR)}${(0, colors_1.colorValue)(ret || "0x")})`;
    }
}
exports.formatCall = formatCall;
//# sourceMappingURL=call.js.map