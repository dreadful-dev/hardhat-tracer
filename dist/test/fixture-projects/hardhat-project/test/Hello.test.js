"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const ethers_1 = require("ethers");
const utils_1 = require("ethers/lib/utils");
const hardhat_1 = __importStar(require("hardhat"));
// process.env.DEBUG = "*";
describe("Hello", () => {
    const wallet = ethers_1.Wallet.createRandom().connect(hardhat_1.default.ethers.provider);
    before(async () => {
        const signers = await hardhat_1.default.ethers.getSigners();
        await signers[0].sendTransaction({
            to: wallet.address,
            value: (0, utils_1.parseEther)("100"),
        });
    });
    it("should run a test", async () => {
        hardhat_1.default.tracer.enabled = false;
        // const HelloFactory = await hre.ethers.getContractFactory("Hello", {
        //   libraries: {
        //     Lib: "0x0000000000000000000000000000000000000001",
        //   },
        // });
        // const hello = await HelloFactory.deploy();
        const hello = await hardhat_1.default.ethers.getContractAt("Hello", "0x0000000000000000000000000000001234567890", wallet);
        // const tx = HelloFactory.getDeployTransaction();
        // const signers = await hre.ethers.getSigners();
        // await signers[0].estimateGas({ ...tx });
        hardhat_1.default.tracer.enabled = true;
        console.log("========> hello.hi2()");
        await hello.hi2([
            { id: 1, id2: 1 },
            { id: 2, id2: 1 },
        ]);
    });
    it("should ignore next", async () => {
        console.log("========> hello.kick()");
        const hello = await hardhat_1.default.ethers.getContractAt("Hello", "0x0000000000000000000000000000001234567890", wallet);
        // hre.tracer.ignoreNext = true;
        try {
            await hello.kick();
        }
        catch { }
        const estimated = await hello.estimateGas.kick2();
        await hello.kick2({
            gasLimit: estimated,
        });
    });
    it("should run a test and check for message call", async () => {
        hardhat_1.default.tracer.enabled = false;
        // const HelloFactory = await hre.ethers.getContractFactory("Hello", {
        //   libraries: {
        //     Lib: "0x0000000000000000000000000000000000000001",
        //   },
        // });
        // const hello = await HelloFactory.deploy();
        const contract = await hardhat_1.default.ethers.getContractAt("Hello", "0x0000000000000000000000000000001234567890", wallet);
        // const tx = HelloFactory.getDeployTransaction();
        // const signers = await hre.ethers.getSigners();
        // await signers[0].estimateGas({ ...tx });
        hardhat_1.default.tracer.enabled = true;
        console.log("========> hello.hit()");
        await contract.hit({
            name: "hello",
            age: 23,
            props: { id: 12, name: "yello", age: 99 },
        }, 1234, { value: (0, utils_1.parseEther)("1") });
        (0, chai_1.expect)(hardhat_1.default.tracer.lastTrace()).to.have.messageCall(await contract.populateTransaction.getData(), {
            returnData: hardhat_1.ethers.utils.defaultAbiCoder.encode(["uint"], ["1234"]),
            from: contract.address,
        });
    });
    it("should do a delegate call under static call", async () => {
        const contract = await hardhat_1.default.ethers.getContractAt("Hello", "0x0000000000000000000000000000001234567890", wallet);
        hardhat_1.default.tracer.printNext = true;
        await contract.firstCall();
    });
    it("opcodes", async () => {
        const contract = await hardhat_1.default.ethers.getContractAt("Hello", "0x0000000000000000000000000000001234567890", wallet);
        hardhat_1.default.tracer.printNext = true;
        await contract.playWithOpcodes();
    });
});
//# sourceMappingURL=Hello.test.js.map