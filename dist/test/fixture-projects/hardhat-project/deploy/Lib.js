"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const func = async function (hre) {
    const { deployments: { deploy }, getNamedAccounts, } = hre;
    const { deployer } = await getNamedAccounts();
    await deploy("Lib", {
        from: deployer,
        log: true,
    });
};
exports.default = func;
func.tags = ["Lib"];
//# sourceMappingURL=Lib.js.map