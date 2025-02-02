import { EvmError } from "@nomicfoundation/ethereumjs-evm/src/exceptions";
import { Item, TracerDependencies } from "../types";
export interface CALL {
    from: string;
    to: string;
    inputData: string;
    value: string;
    returnData?: string;
    exception?: EvmError;
    gasLimit: number;
    gasUsed?: number;
    success?: boolean;
}
declare function format(item: Item<CALL>, dependencies: TracerDependencies): Promise<string>;
declare const _default: {
    format: typeof format;
};
export default _default;
//# sourceMappingURL=call.d.ts.map