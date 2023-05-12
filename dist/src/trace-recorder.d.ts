/// <reference types="node" />
import { EVMResult, InterpreterStep, Message } from "@nomicfoundation/ethereumjs-evm";
import { TypedTransaction } from "@nomicfoundation/ethereumjs-tx";
import { Address } from "@nomicfoundation/ethereumjs-util";
import { AfterTxEvent, VM } from "@nomicfoundation/ethereumjs-vm";
import { TransactionTrace } from "./transaction-trace";
import { AwaitedItem, TracerEnv } from "./types";
interface NewContractEvent {
    address: Address;
    code: Buffer;
}
export declare class TraceRecorder {
    vm: VM;
    previousTraces: TransactionTrace[];
    trace: TransactionTrace | undefined;
    previousOpcode: string | undefined;
    tracerEnv: TracerEnv;
    awaitedItems: Array<AwaitedItem<any>>;
    addressStack: string[];
    constructor(vm: VM, tracerEnv: TracerEnv);
    handleBeforeTx(tx: TypedTransaction, resolve: ((result?: any) => void) | undefined): void;
    handleBeforeMessage(message: Message, resolve: ((result?: any) => void) | undefined): void;
    handleNewContract(contract: NewContractEvent, resolve: ((result?: any) => void) | undefined): void;
    handleStep(step: InterpreterStep, resolve: ((result?: any) => void) | undefined): void;
    handleAfterMessage(evmResult: EVMResult, resolve: ((result?: any) => void) | undefined): void;
    handleAfterTx(_tx: AfterTxEvent, resolve: ((result?: any) => void) | undefined): void;
}
export {};
//# sourceMappingURL=trace-recorder.d.ts.map