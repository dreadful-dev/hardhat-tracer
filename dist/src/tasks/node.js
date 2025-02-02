"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task_names_1 = require("hardhat/builtin-tasks/task-names");
const config_1 = require("hardhat/config");
const utils_1 = require("../utils");
const wrapper_1 = require("../wrapper");
(0, utils_1.addCliParams)((0, config_1.task)(task_names_1.TASK_NODE, "Run hardhat node")).setAction(async (args, hre, runSuper) => {
    (0, utils_1.applyCliArgsToTracer)(args, hre);
    (0, wrapper_1.wrapHardhatProvider)(hre);
    return runSuper(args);
});
//# sourceMappingURL=node.js.map