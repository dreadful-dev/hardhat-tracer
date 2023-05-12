"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const config_1 = require("hardhat/config");
const call_1 = require("../format/call");
const error_1 = require("../format/error");
const utils_1 = require("../utils");
(0, utils_1.addCliParams)((0, config_1.task)("decode", "Decodes calldata or error data"))
    .addParam("data", "Calldata or error data to decode")
    .addOptionalParam("returndata", "Return data if any")
    .setAction(async (args, hre) => {
    const td = {
        artifacts: hre.artifacts,
        tracerEnv: hre.tracer,
        provider: hre.network.provider,
        nameTags: hre.tracer.nameTags,
    };
    // see if the data is a call
    const formattedCallPromise = (0, call_1.formatCall)(ethers_1.ethers.constants.AddressZero, args.data, args.returndata ?? "0x", 0, 0, 0, true, td);
    const formattedErrorPromise = (0, error_1.formatError)(args.data, td);
    const formattedCall = await formattedCallPromise;
    const uncolored = (0, utils_1.removeColor)(formattedCall);
    if (!uncolored.startsWith("UnknownContractAndFunction(") &&
        !uncolored.includes("<UnknownFunction>")) {
        console.log(formattedCall);
    }
    else {
        // see the data is an error
        const formattedError = await formattedErrorPromise;
        if (!(0, utils_1.removeColor)(formattedError).includes("UnknownError(")) {
            console.log(formattedError);
        }
        else {
            console.log("Failed to decode the data");
            console.log(formattedCall);
        }
    }
});
//# sourceMappingURL=decode.js.map