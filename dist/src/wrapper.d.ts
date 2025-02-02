import { HardhatRuntimeEnvironment } from "hardhat/types";
/**
 * Add hardhat-tracer to your environment
 * @param hre: HardhatRuntimeEnvironment - required to get access to contract artifacts and tracer env
 */
export declare function wrapHardhatProvider(hre: HardhatRuntimeEnvironment): void;
export declare function isTracerAlreadyWrappedInHreProvider(hre: HardhatRuntimeEnvironment): boolean;
//# sourceMappingURL=wrapper.d.ts.map