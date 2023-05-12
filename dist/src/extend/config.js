"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("hardhat/config");
const cache_1 = require("../cache");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
(0, config_1.extendConfig)((config, userConfig) => {
    // config.tracer = getTracerEnvFromUserInput(userConfig.tracer);
    const opcodes = new Map();
    // always active opcodes
    const opcodesToActivate = [];
    if (userConfig.tracer?.opcodes) {
        if (!Array.isArray(userConfig.tracer.opcodes)) {
            throw new Error("[hardhat-tracer]: tracer.opcodes in hardhat user config should be array");
        }
        opcodesToActivate.push(...userConfig.tracer.opcodes);
    }
    for (const opcode of opcodesToActivate) {
        opcodes.set(opcode, true);
    }
    const cache = new cache_1.TracerCache();
    cache.setCachePath(config.paths.cache);
    cache.load();
    config.tracer = {
        enabled: userConfig.tracer?.enabled ?? false,
        ignoreNext: false,
        printNext: false,
        verbosity: userConfig.tracer?.defaultVerbosity ?? constants_1.DEFAULT_VERBOSITY,
        showAddresses: userConfig.tracer?.showAddresses ?? true,
        gasCost: userConfig.tracer?.gasCost ?? false,
        enableAllOpcodes: userConfig.tracer?.enableAllOpcodes ?? false,
        opcodes,
        nameTags: userConfig.tracer?.nameTags ?? {},
        printMode: "console",
        _internal: {
            printNameTagTip: undefined,
            cache,
        },
        lastTrace() {
            if (this.recorder) {
                return this.recorder.previousTraces[this.recorder.previousTraces.length - 1];
            }
        },
        stateOverrides: userConfig.tracer?.stateOverrides,
    };
    if (userConfig?.tracer?.tasks) {
        if (!Array.isArray(userConfig?.tracer?.tasks)) {
            throw new Error("[hardhat-tracer]: tracer.tasks in hardhat user config should be array");
        }
        for (const taskName of userConfig?.tracer?.tasks) {
            if (typeof taskName !== "string") {
                throw new Error("[hardhat-tracer]: tracer.tasks in hardhat user config should be array of strings");
            }
            (0, utils_1.registerTask)(taskName);
        }
    }
});
//# sourceMappingURL=config.js.map