"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const config_1 = require("hardhat/config");
const print_1 = require("../print");
const utils_1 = require("../utils");
(0, utils_1.addCliParams)((0, config_1.task)("tracecall", "Traces a call"))
    .addParam("to", "destination address")
    .addOptionalParam("data", "input call data")
    .addOptionalParam("value", "value to send")
    .addOptionalParam("gasLimit", "gas limit")
    .addOptionalParam("gasPrice", "gas price")
    .addOptionalParam("blocknumber", "block number")
    .addOptionalParam("from", "from address")
    .addOptionalParam("rpc", "archive node")
    .setAction(async (args, hre, runSuper) => {
    (0, utils_1.applyCliArgsToTracer)(args, hre);
    if (!args.nocompile) {
        await hre.run("compile");
    }
    // try using current mainnet fork url as rpc url
    const mainnetForkUrl = hre.network.config.forking?.url;
    if (mainnetForkUrl && args.rpc === undefined) {
        args.rpc = mainnetForkUrl;
    }
    // try using url specified in network as rpc url
    if (args.network) {
        const userNetworks = hre.userConfig.networks;
        if (userNetworks === undefined) {
            throw new Error("[hardhat-tracer]: No networks found in hardhat config");
        }
        if (userNetworks[args.network] === undefined) {
            throw new Error(`[hardhat-tracer]: Network ${args.network} not found in hardhat config`);
        }
        const url = userNetworks[args.network].url;
        if (url === undefined) {
            throw new Error(`[hardhat-tracer]: Url not found in hardhat-config->networks->${args.network}`);
        }
        args.rpc = url;
    }
    if (!args.rpc) {
        // TODO add auto-detect network
        throw new Error("[hardhat-tracer]: rpc url not provided, please either use --network <network-name> or --rpc <rpc-url>");
    }
    const provider = new ethers_1.ethers.providers.StaticJsonRpcProvider(args.rpc);
    if (args.blocknumber === undefined) {
        args.blocknumber = await provider.getBlockNumber();
    }
    console.warn("Activating mainnet fork at block", args.blocknumber);
    await hre.network.provider.send("hardhat_reset", [
        {
            forking: {
                jsonRpcUrl: args.rpc,
                blockNumber: Number(args.blocknumber),
            },
        },
    ]);
    try {
        const result = await hre.ethers.provider.call({
            to: args.to,
            data: args.data,
            value: args.value,
            gasLimit: args.gasLimit,
            gasPrice: args.gasPrice,
            from: args.from,
        });
        console.log("result:", result);
    }
    catch { }
    // TODO try to do this properly
    // @ts-ignore
    const recorder = global?._hardhat_tracer_recorder;
    await (0, print_1.print)(recorder.previousTraces[recorder.previousTraces.length - 1], {
        artifacts: hre.artifacts,
        tracerEnv: hre.tracer,
        provider: hre.ethers.provider,
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return;
    // const txFromRpc = await provider.getTransaction(args.hash);
    // after the above hardhat reset, tx should be present on the local node
});
//# sourceMappingURL=tracecall.js.map