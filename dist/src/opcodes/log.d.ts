import { Item, TracerDependencies } from "../types";
export interface LOG {
    data: string;
    topics: string[];
    address: string;
}
declare function format(item: Item<LOG>, dependencies: TracerDependencies): Promise<string>;
declare const _default: {
    format: typeof format;
};
export default _default;
//# sourceMappingURL=log.d.ts.map