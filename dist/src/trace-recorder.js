"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraceRecorder = void 0;
const opcodes_1 = require("./opcodes");
const transaction_trace_1 = require("./transaction-trace");
const check_opcodes_1 = require("./utils/check-opcodes");
const hex_1 = require("./utils/hex");
const item_1 = require("./utils/item");
class TraceRecorder {
    constructor(vm, tracerEnv) {
        this.previousTraces = [];
        this.vm = vm;
        this.tracerEnv = tracerEnv;
        (0, check_opcodes_1.checkIfOpcodesAreValid)(tracerEnv.opcodes, vm);
        this.awaitedItems = [];
        this.addressStack = [];
        vm.events.on("beforeTx", this.handleBeforeTx.bind(this));
        vm.evm.events?.on("beforeMessage", this.handleBeforeMessage.bind(this));
        vm.evm.events?.on("newContract", this.handleNewContract.bind(this));
        vm.evm.events?.on("step", this.handleStep.bind(this));
        vm.evm.events?.on("afterMessage", this.handleAfterMessage.bind(this));
        vm.events.on("afterTx", this.handleAfterTx.bind(this));
    }
    handleBeforeTx(tx, resolve) {
        this.trace = new transaction_trace_1.TransactionTrace();
        this.trace.hash = (0, hex_1.hexPrefix)(tx.hash().toString("hex"));
        resolve?.();
    }
    handleBeforeMessage(message, resolve) {
        if (!this.trace) {
            throw new Error("[hardhat-tracer]: trace is undefined in handleBeforeMessage");
        }
        let item;
        if (message.delegatecall) {
            if (message.to === undefined) {
                throw new Error("[hardhat-tracer]: message.to is undefined in handleBeforeMessage");
            }
            this.addressStack.push(message.caller?.toString());
            item = {
                opcode: "DELEGATECALL",
                params: {
                    from: (0, hex_1.hexPrefix)(message.caller.toString()),
                    to: (0, hex_1.hexPrefix)((message._codeAddress ?? message.to).toString()),
                    inputData: (0, hex_1.hexPrefix)(message.data.toString("hex")),
                    gasLimit: Number(message.gasLimit.toString()),
                },
                children: [],
            };
        }
        else if (message.to) {
            this.addressStack.push(message.caller?.toString());
            item = {
                opcode: message.isStatic ? "STATICCALL" : "CALL",
                params: {
                    from: (0, hex_1.hexPrefix)(message.caller.toString()),
                    to: (0, hex_1.hexPrefix)(message.to.toString()),
                    inputData: (0, hex_1.hexPrefix)(message.data.toString("hex")),
                    gasLimit: Number(message.gasLimit.toString()),
                    value: (0, hex_1.hexPrefix)(message.value.toString(16)),
                },
                children: [],
            };
        }
        else if (message.to === undefined && message.salt === undefined) {
            item = {
                opcode: "CREATE",
                params: {
                    from: (0, hex_1.hexPrefix)(message.caller.toString()),
                    initCode: (0, hex_1.hexPrefix)(message.data.toString("hex")),
                    gasLimit: Number(message.gasLimit.toString()),
                    value: (0, hex_1.hexPrefix)(message.value.toString(16)),
                },
                children: [],
            };
        }
        else if (message.to === undefined && message.salt !== undefined) {
            item = {
                opcode: "CREATE2",
                params: {
                    from: (0, hex_1.hexPrefix)(message.caller.toString()),
                    initCode: (0, hex_1.hexPrefix)(message.data.toString("hex")),
                    gasLimit: Number(message.gasLimit.toString()),
                    value: (0, hex_1.hexPrefix)(message.value.toString(16)),
                    salt: (0, hex_1.hexPrefix)(message.salt.toString("hex")),
                },
                children: [],
            };
        }
        else {
            item = {
                opcode: "UNKNOWN",
                params: {},
                children: [],
            };
            console.error("handleBeforeMessage: message type not handled", message);
        }
        this.trace.insertItem(item, { increaseDepth: true });
        resolve?.();
    }
    handleNewContract(contract, resolve) {
        if (!this.trace || !this.trace.parent) {
            console.error("handleNewContract: trace.parent not present");
        }
        else {
            switch (this.trace.parent.opcode) {
                case "CREATE":
                    const createItem = this.trace.parent;
                    createItem.params.deployedAddress = (0, hex_1.hexPrefix)(contract.address.toString());
                    break;
                case "CREATE2":
                    const create2Item = this.trace.parent;
                    create2Item.params.deployedAddress = (0, hex_1.hexPrefix)(contract.address.toString());
                    break;
                default:
                    console.log(this.trace.parent);
                    console.error("handleNewContract: opcode not handled");
                    break;
            }
        }
        this.addressStack.push(contract.address.toString());
        resolve?.();
    }
    handleStep(step, resolve) {
        if (!this.trace) {
            throw new Error("[hardhat-tracer]: trace is undefined in handleStep");
        }
        if (this.awaitedItems.length) {
            this.awaitedItems = this.awaitedItems.filter((awaitedItems) => awaitedItems.next > 0);
            for (const awaitedItem of this.awaitedItems) {
                awaitedItem.next--;
                if (awaitedItem.next === 0) {
                    const item = awaitedItem.parse(step, this.addressStack[this.addressStack.length - 1]);
                    this.trace.insertItem(item);
                }
            }
        }
        if (this.tracerEnv.enableAllOpcodes ||
            this.tracerEnv.opcodes.get(step.opcode.name)) {
            const result = (0, opcodes_1.parse)(step, this.addressStack[this.addressStack.length - 1]);
            if (result) {
                if ((0, item_1.isItem)(result)) {
                    this.trace.insertItem(result);
                }
                else {
                    this.awaitedItems.push(result);
                }
            }
        }
        this.previousOpcode = step.opcode.name;
        resolve?.();
    }
    handleAfterMessage(evmResult, resolve) {
        if (!this.trace) {
            throw new Error("[hardhat-tracer]: trace is undefined in handleAfterMessage");
        }
        if (evmResult.execResult.selfdestruct) {
            const selfdestructs = Object.entries(evmResult.execResult.selfdestruct);
            for (const [address, beneficiary] of selfdestructs) {
                this.trace.insertItem({
                    opcode: "SELFDESTRUCT",
                    params: {
                        beneficiary: (0, hex_1.hexPrefix)(beneficiary.toString("hex")),
                    },
                });
            }
        }
        if (evmResult?.execResult.exceptionError &&
            evmResult.execResult.exceptionError.error !== "revert") {
            this.trace.insertItem({
                opcode: "EXCEPTION",
                params: {
                    error: evmResult.execResult.exceptionError.error,
                    type: evmResult.execResult.exceptionError.errorType,
                },
            });
        }
        this.trace.returnCurrentCall("0x" + evmResult.execResult.returnValue.toString("hex"), Number(evmResult?.execResult.executionGasUsed), evmResult?.execResult.exceptionError);
        this.addressStack.pop();
        resolve?.();
    }
    handleAfterTx(_tx, resolve) {
        if (this.tracerEnv.enabled) {
            if (!this.trace) {
                throw new Error("[hardhat-tracer]: trace is undefined in handleAfterTx");
            }
            // store the trace for later use (printing or outputting)
            this.previousTraces.push(this.trace);
        }
        // clear the trace
        this.trace = undefined;
        this.previousOpcode = undefined;
        this.awaitedItems = [];
        this.addressStack = [];
        resolve?.();
    }
}
exports.TraceRecorder = TraceRecorder;
//# sourceMappingURL=trace-recorder.js.map