"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = __importDefault(require("hardhat"));
const wrapper_1 = require("../../../../src/wrapper");
(0, wrapper_1.wrapHardhatProvider)(hardhat_1.default);
hardhat_1.default.tracer.enabled = true;
hardhat_1.default.tracer.verbosity = 3;
async function main() {
    const Lib = await hardhat_1.default.ethers.deployContract("Lib");
    const Hello = await hardhat_1.default.ethers.deployContract("Hello", {
        libraries: {
            Lib: Lib.address,
        },
    });
    try {
        await Hello.hi2([{ id: 123, id2: 456 }]);
    }
    catch {
        console.log(hardhat_1.default.tracer.lastTrace()?.top?.params.exception);
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
}
main().catch(console.error);
//# sourceMappingURL=deploy.js.map