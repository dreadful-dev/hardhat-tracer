import { InterpreterStep } from "@nomicfoundation/ethereumjs-evm";
import { AwaitedItem, Item } from "../types";
export interface EXTCODESIZE {
    address: string;
    size: number;
}
declare function parse(step: InterpreterStep): AwaitedItem<EXTCODESIZE>;
declare function format(item: Item<EXTCODESIZE>): string;
declare const _default: {
    parse: typeof parse;
    format: typeof format;
};
export default _default;
//# sourceMappingURL=extcodesize.d.ts.map