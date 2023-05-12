"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTracerAlreadyWrappedInHreProvider = exports.wrapHardhatProvider = void 0;
const backwards_compatibility_1 = require("hardhat/internal/core/providers/backwards-compatibility");
const wrapper_1 = require("hardhat/internal/core/providers/wrapper");
const print_1 = require("./print");
/**
 * Wrapped provider which extends requests
 */
class TracerWrapper extends wrapper_1.ProviderWrapper {
    constructor(dependencies) {
        super(dependencies.provider);
        this.txPrinted = {};
        this.dependencies = dependencies;
    }
    async request(args) {
        let result;
        let error;
        // console.log("wrapper->args.method", args.method);
        try {
            result = await this.dependencies.provider.send(args.method, args.params);
        }
        catch (_error) {
            error = _error;
        }
        // take decision whether to print last trace or not
        const isSendTransaction = args.method === "eth_sendTransaction";
        const isSendRawTransaction = args.method === "eth_sendRawTransaction";
        const isEthCall = args.method === "eth_call";
        const isEstimateGas = args.method === "eth_estimateGas";
        const isSendTransactionFailed = isSendTransaction && !!error;
        const isSendRawTransactionFailed = isSendRawTransaction && !!error;
        const isEthCallFailed = isEthCall && !!error;
        const isEstimateGasFailed = isEstimateGas && !!error;
        let shouldPrint;
        switch (this.dependencies.tracerEnv.verbosity) {
            case 0:
                shouldPrint = false;
                break;
            case 1:
            case 2:
                shouldPrint =
                    isSendTransactionFailed ||
                        isSendRawTransactionFailed ||
                        isEthCallFailed ||
                        isEstimateGasFailed ||
                        (!!this.dependencies.tracerEnv.printNext &&
                            (isSendTransaction ||
                                isSendRawTransaction ||
                                isEthCall ||
                                isEstimateGasFailed));
                break;
            case 3:
            case 4:
                shouldPrint =
                    isSendTransaction ||
                        isSendRawTransaction ||
                        isEthCall ||
                        isEstimateGasFailed;
                break;
            default:
                throw new Error("[hardhat-tracer]: Invalid verbosity value: " +
                    this.dependencies.tracerEnv.verbosity);
        }
        if (this.dependencies.tracerEnv.enabled && shouldPrint) {
            if (this.dependencies.tracerEnv.ignoreNext) {
                this.dependencies.tracerEnv.ignoreNext = false;
            }
            else {
                const lastTrace = this.dependencies.tracerEnv.lastTrace();
                if (lastTrace) {
                    this.dependencies.tracerEnv.printNext = false;
                    await (0, print_1.print)(lastTrace, this.dependencies);
                }
            }
        }
        if (error) {
            throw error;
        }
        return result;
    }
}
/**
 * Add hardhat-tracer to your environment
 * @param hre: HardhatRuntimeEnvironment - required to get access to contract artifacts and tracer env
 */
function wrapHardhatProvider(hre) {
    // do not wrap if already wrapped
    if (isTracerAlreadyWrappedInHreProvider(hre)) {
        return;
    }
    const tracerProvider = new TracerWrapper({
        artifacts: hre.artifacts,
        tracerEnv: hre.tracer,
        provider: hre.network.provider,
    });
    const compatibleProvider = new backwards_compatibility_1.BackwardsCompatibilityProviderAdapter(tracerProvider);
    hre.network.provider = compatibleProvider;
}
exports.wrapHardhatProvider = wrapHardhatProvider;
function isTracerAlreadyWrappedInHreProvider(hre) {
    const maxLoopIterations = 1024;
    let currentLoopIterations = 0;
    let provider = hre.network.provider;
    while (provider !== undefined) {
        if (provider instanceof TracerWrapper) {
            return true;
        }
        // move down the chain
        provider = provider._wrapped;
        // Just throw if we ever end up in (what seems to be) an infinite loop.
        currentLoopIterations += 1;
        if (currentLoopIterations > maxLoopIterations) {
            return false;
        }
    }
    return false;
}
exports.isTracerAlreadyWrappedInHreProvider = isTracerAlreadyWrappedInHreProvider;
//# sourceMappingURL=wrapper.js.map