"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("hardhat/config");
require("hardhat/types/config");
require("hardhat/types/runtime");
const decoder_1 = require("../decoder");
const trace_recorder_1 = require("../trace-recorder");
const utils_1 = require("../utils");
(0, config_1.extendEnvironment)((hre) => {
    // copy reference of config.tracer to tracer
    // TODO take this properly, env can contain things that config does not need to.
    hre.tracer = hre.config.tracer;
    hre.tracer.decoder = new decoder_1.Decoder(hre.artifacts, hre.tracer._internal.cache);
    // @ts-ignore
    global.tracerEnv = hre.tracer;
    // @ts-ignore
    global.hreArtifacts = hre.artifacts;
    // wait for VM to be initialized
    (0, utils_1.getVM)(hre)
        .then(async (vm) => {
        hre.tracer.recorder = new trace_recorder_1.TraceRecorder(vm, hre.tracer);
        if (hre.tracer.stateOverrides) {
            try {
                await (0, utils_1.applyStateOverrides)(hre.tracer.stateOverrides, vm, hre.artifacts);
            }
            catch { }
        }
    })
        .catch(() => {
        // if for some reason we can't get the vm, disable hardhat-tracer
        hre.tracer.enabled = false;
    });
});
//# sourceMappingURL=hre.js.map