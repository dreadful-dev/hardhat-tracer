"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyCliArgsToTracer = exports.addCliParams = exports.registerTask = void 0;
const config_1 = require("hardhat/config");
const wrapper_1 = require("../wrapper");
const check_opcodes_1 = require("./check-opcodes");
function registerTask(taskName) {
    return addCliParams((0, config_1.task)(taskName, `Run hardhat: ${taskName}`)).setAction(async (args, hre, runSuper) => {
        applyCliArgsToTracer(args, hre);
        (0, wrapper_1.wrapHardhatProvider)(hre);
        return runSuper(args);
    });
}
exports.registerTask = registerTask;
function addCliParams(_task) {
    return (_task
        // verbosity flags
        .addFlag("v", "set verbosity to 1, prints calls for only failed txs")
        .addFlag("vv", "set verbosity to 2, prints calls and storage for only failed txs")
        .addFlag("vvv", "set verbosity to 3, prints calls for all txs")
        .addFlag("vvvv", "set verbosity to 4, prints calls and storage for all txs")
        .addFlag("gascost", "display gas cost")
        .addFlag("disabletracer", "do not enable tracer at the start (for inline enabling tracer)")
        .addFlag("nocompile", "do not compile")
        // params
        .addOptionalParam("opcodes", "specify more opcodes to include in trace")
        .addOptionalParam("print", "specify print mode: console or json")
        // alias
        .addFlag("traceError", "enable tracer with verbosity 1")
        .addFlag("fulltraceError", "enable tracer with verbosity 2")
        .addFlag("fullTraceError", "enable tracer with verbosity 2")
        .addFlag("trace", "enable tracer with verbosity 3")
        .addFlag("fulltrace", "enable tracer with verbosity 4")
        .addFlag("fullTrace", "enable tracer with verbosity 4"));
}
exports.addCliParams = addCliParams;
function applyCliArgsToTracer(args, hre) {
    // enabled by default
    hre.tracer.enabled = true;
    // for not enabling tracer from the start
    if (args.disabletracer) {
        hre.tracer.enabled = false;
    }
    // always active opcodes
    const opcodesToActivate = ["RETURN", "REVERT"];
    const logOpcodes = ["LOG0", "LOG1", "LOG2", "LOG3", "LOG4"];
    const storageOpcodes = ["SLOAD", "SSTORE"];
    // setting verbosity
    if (args.vvvv || args.fulltrace || args.fullTrace) {
        hre.tracer.verbosity = 4;
        opcodesToActivate.push(...logOpcodes, ...storageOpcodes);
    }
    else if (args.vvv || args.trace) {
        hre.tracer.verbosity = 3;
        opcodesToActivate.push(...logOpcodes);
    }
    else if (args.vv || args.fulltraceError || args.fullTraceError) {
        hre.tracer.verbosity = 2;
        opcodesToActivate.push(...logOpcodes, ...storageOpcodes);
    }
    else if (args.v || args.traceError) {
        opcodesToActivate.push(...logOpcodes);
        hre.tracer.verbosity = 1;
    }
    for (const opcode of opcodesToActivate) {
        hre.tracer.opcodes.set(opcode, true);
    }
    if (args.opcodes) {
        // hre.tracer.opcodes = [hre.tracer.opcodes, ...args.opcodes.split(",")];
        for (const opcode of args.opcodes.split(",")) {
            hre.tracer.opcodes.set(opcode, true);
        }
        // if recorder was already created, then check opcodes, else it will be checked later
        if (hre.tracer.recorder !== undefined) {
            (0, check_opcodes_1.checkIfOpcodesAreValid)(hre.tracer.opcodes, hre.tracer.recorder.vm);
        }
    }
    if (args.gascost) {
        hre.tracer.gasCost = true;
    }
    if (args.print) {
        hre.tracer.printMode = args.print;
    }
}
exports.applyCliArgsToTracer = applyCliArgsToTracer;
//# sourceMappingURL=task-helpers.js.map