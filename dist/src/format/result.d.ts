import { ParamType, Result } from "ethers/lib/utils";
import { TracerDependencies } from "../types";
interface FormatOptions {
    decimals?: number;
    shorten?: boolean;
}
export declare function formatResult(result: Result, params: ParamType[] | undefined, { decimals, shorten }: FormatOptions, dependencies: TracerDependencies): string;
export {};
//# sourceMappingURL=result.d.ts.map