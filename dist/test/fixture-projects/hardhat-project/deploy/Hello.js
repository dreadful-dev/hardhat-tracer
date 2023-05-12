"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const func = async function (hre) {
    const { deployments: { deploy, get }, getNamedAccounts, } = hre;
    const { deployer } = await getNamedAccounts();
    const Lib = await get("Lib");
    await deploy("Hello", {
        from: deployer,
        log: true,
        libraries: {
            Lib: Lib.address,
        },
    });
};
exports.default = func;
func.tags = ["Hello"];
func.dependencies = ["Lib"];
//# sourceMappingURL=Hello.js.map