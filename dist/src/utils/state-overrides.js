"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyStateOverrides = void 0;
const ethereumjs_util_1 = require("@nomicfoundation/ethereumjs-util");
const ethers_1 = require("ethers");
const utils_1 = require("ethers/lib/utils");
async function setBytecode(contractInfo, artifacts, addressThis, vm) {
    if (typeof contractInfo === "string") {
        if (ethers_1.ethers.utils.isHexString(contractInfo)) {
            // directly bytecode was given
            return contractInfo;
        }
        else {
            // name was given
            contractInfo = {
                name: contractInfo,
            };
        }
    }
    // its possible artifacts are not compiled here
    const artifact = artifacts.readArtifactSync(contractInfo.name);
    let bytecode = artifact.deployedBytecode;
    if (bytecode.startsWith("0x730000000000000000000000000000000000000000")) {
        // this is a library, so we need to replace the placeholder address
        bytecode = "0x73" + addressThis.slice(2) + bytecode.slice(44);
    }
    if (artifact.deployedLinkReferences) {
        const paths = Object.keys(artifact.deployedLinkReferences);
        for (const path of paths) {
            const libraryNames = Object.keys(artifact.deployedLinkReferences[path]);
            for (const libraryName of libraryNames) {
                const fullName = path + ":" + libraryName;
                let libraryInfo = contractInfo.libraries?.[libraryName] ??
                    contractInfo.libraries?.[fullName];
                if (!libraryInfo) {
                    // add guess for library, if it's available in the same repo
                    libraryInfo = {
                        name: fullName,
                    };
                    // throw new Error(
                    //   `[hardhat-tracer]: Library ${libraryName} not found in libraries object for ${contractInfo.name}`
                    // );
                }
                let addressToLink;
                if (typeof libraryInfo === "string" &&
                    ethers_1.ethers.utils.isHexString(libraryInfo) &&
                    libraryInfo.length === 42) {
                    // address was given for library
                    addressToLink = libraryInfo;
                }
                else {
                    // since we don't have an address for library, lets generate a random one
                    addressToLink = ethers_1.ethers.utils.id(fullName).slice(0, 42);
                    await setBytecode(libraryInfo, artifacts, addressToLink, vm);
                }
                // we have the address of library now, so let's link it
                bytecode = bytecode.replace(new RegExp(`__\\$${ethers_1.ethers.utils.id(fullName).slice(2, 36)}\\$__`, "g"), addressToLink.replace(/^0x/, "").toLowerCase());
            }
        }
    }
    if (!ethers_1.ethers.utils.isHexString(bytecode)) {
        throw new Error(`[hardhat-tracer]: Invalid bytecode specified in stateOverrides for ${contractInfo.name}: ${bytecode}`);
    }
    // set the bytecode
    await vm.stateManager.putContractCode(ethereumjs_util_1.Address.fromString(addressThis), Buffer.from(bytecode.slice(2), "hex"));
}
async function applyStateOverrides(stateOverrides, vm, artifacts) {
    for (const [_address, overrides] of Object.entries(stateOverrides)) {
        if (!ethers_1.ethers.utils.isAddress(_address)) {
            throw new Error(`[hardhat-tracer]: Invalid address ${_address} in stateOverrides`);
        }
        const address = ethereumjs_util_1.Address.fromString(_address);
        // for balance and nonce
        if (overrides.balance !== undefined || overrides.nonce !== undefined) {
            const account = await vm.stateManager.getAccount(address);
            if (overrides.nonce !== undefined) {
                account.nonce = ethers_1.BigNumber.from(overrides.nonce).toBigInt();
            }
            if (overrides.balance) {
                account.balance = ethers_1.BigNumber.from(overrides.balance).toBigInt();
            }
            await vm.stateManager.putAccount(address, account);
        }
        // for bytecode
        if (overrides.bytecode) {
            await setBytecode(overrides.bytecode, artifacts, _address, vm);
        }
        // for storage slots
        if (overrides.storage) {
            for (const [key, value] of Object.entries(overrides.storage)) {
                await vm.stateManager.putContractStorage(address, Buffer.from((0, utils_1.hexZeroPad)(ethers_1.BigNumber.from(key).toHexString(), 32).slice(2), "hex"), Buffer.from((0, utils_1.hexZeroPad)(ethers_1.BigNumber.from(value).toHexString(), 32).slice(2), "hex"));
            }
        }
    }
}
exports.applyStateOverrides = applyStateOverrides;
//# sourceMappingURL=state-overrides.js.map