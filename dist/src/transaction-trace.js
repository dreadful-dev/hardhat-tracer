"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionTrace = void 0;
class TransactionTrace {
    insertItem(item, options) {
        if (item.params === undefined) {
            item.params = {};
        }
        if (!this.top || !this.parent) {
            // if top and parent not set, then this is the first item, should be a call
            this.top = item;
            this.parent = this.top;
            if (!this.parent.children) {
                this.parent.children = [];
            }
        }
        else {
            // insert this item in the parent item's children array
            this.parent.children.push(item);
            // set the parent of the item
            item.parent = this.parent;
            // // if the item is a call, then further items should be it's children
            if (options?.increaseDepth) {
                item.children = [];
                this.parent = item;
            }
        }
    }
    returnCurrentCall(returnData, executionGas, exception) {
        if (!this.parent) {
            throw new Error("[hardhat-tracer]: this.parent is undefined in returnCurrentCall");
        }
        this.parent.params.returnData = returnData;
        this.parent.params.gasUsed = executionGas;
        this.parent.params.success = !exception;
        this.parent.params.exception = exception;
        this.parent = this.parent.parent;
    }
}
exports.TransactionTrace = TransactionTrace;
//# sourceMappingURL=transaction-trace.js.map