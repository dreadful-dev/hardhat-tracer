"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatContract = void 0;
const ethers_1 = require("ethers");
const utils_1 = require("ethers/lib/utils");
const utils_2 = require("../utils");
const colors_1 = require("../utils/colors");
const param_1 = require("./param");
const result_1 = require("./result");
async function formatContract(code, value, salt, deployedAddress, dependencies) {
    value = ethers_1.BigNumber.from(value);
    if (salt !== null) {
        salt = ethers_1.BigNumber.from(salt);
    }
    const names = await dependencies.artifacts.getAllFullyQualifiedNames();
    for (const name of names) {
        const artifact = await dependencies.artifacts.readArtifact(name);
        const iface = new utils_1.Interface(artifact.abi);
        if (artifact.bytecode.length > 2 &&
            artifact.bytecode.length <= code.length &&
            (0, utils_2.compareBytecode)(artifact.bytecode, code) > 0.5) {
            // we found the artifact with matching bytecode
            try {
                const constructorParamsDecoded = iface._decodeParams(iface.deploy.inputs, "0x" + code.slice(artifact.bytecode.length));
                const inputArgs = (0, result_1.formatResult)(constructorParamsDecoded, iface.deploy.inputs, { decimals: -1, shorten: false }, dependencies);
                const extra = [];
                if (value.gt(0)) {
                    extra.push(`value: ${(0, param_1.formatParam)(value, dependencies)}`);
                }
                if (salt !== null) {
                    extra.push(`salt: ${(0, param_1.formatParam)(salt.gt(2 ** 32) ? salt.toHexString() : salt, dependencies)}`);
                }
                return `${(0, colors_1.colorContract)(artifact.contractName)}.${(0, colors_1.colorFunctionSuccess)("constructor")}${extra.length !== 0 ? `{${extra.join(",")}}` : ""}(${inputArgs})${deployedAddress
                    ? ` => (${(0, param_1.formatParam)(deployedAddress, dependencies)})`
                    : ""}`;
            }
            catch { }
        }
    }
    return `${(0, colors_1.colorContract)("UnknownContract")}(${(0, colors_1.colorKey)("deployCodeSize=")}${(0, utils_1.arrayify)(code).length})`;
}
exports.formatContract = formatContract;
//# sourceMappingURL=contract.js.map