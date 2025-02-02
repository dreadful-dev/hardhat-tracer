"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeColor = exports.colorWarning = exports.colorIndexed = exports.colorNameTag = exports.colorSstore = exports.colorSload = exports.colorExtra = exports.colorValue = exports.colorKey = exports.colorConsole = exports.colorError = exports.colorEvent = exports.colorFunctioFail = exports.colorFunctionSuccess = exports.colorContract = exports.colorLabel = void 0;
const chalk_1 = __importDefault(require("chalk"));
const colorLabel = (...text) => chalk_1.default.italic(chalk_1.default.yellowBright(...text));
exports.colorLabel = colorLabel;
exports.colorContract = chalk_1.default.cyan;
exports.colorFunctionSuccess = chalk_1.default.green;
exports.colorFunctioFail = chalk_1.default.red;
exports.colorEvent = chalk_1.default.yellow;
exports.colorError = chalk_1.default.red;
exports.colorConsole = chalk_1.default.blue;
exports.colorKey = chalk_1.default.magenta;
exports.colorValue = chalk_1.default.whiteBright;
exports.colorExtra = chalk_1.default.gray;
exports.colorSload = chalk_1.default.blueBright;
exports.colorSstore = chalk_1.default.redBright;
exports.colorNameTag = chalk_1.default.italic;
exports.colorIndexed = chalk_1.default.italic;
exports.colorWarning = chalk_1.default.yellow;
function removeColor(str) {
    return str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, "");
}
exports.removeColor = removeColor;
//# sourceMappingURL=colors.js.map