"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareBytecode = void 0;
function compareBytecode(artifactBytecode, contractBytecode) {
    if (artifactBytecode.length <= 2 || contractBytecode.length <= 2) {
        return 0;
    }
    if (typeof artifactBytecode === "string") {
        artifactBytecode = artifactBytecode
            .replace(/\_\_\$/g, "000")
            .replace(/\$\_\_/g, "000");
    }
    let matchedBytes = 0;
    for (let i = 0; i < artifactBytecode.length; i++) {
        if (artifactBytecode[i] === contractBytecode[i]) {
            matchedBytes++;
        }
    }
    if (isNaN(matchedBytes / artifactBytecode.length)) {
        console.log(matchedBytes, artifactBytecode.length);
    }
    return matchedBytes / artifactBytecode.length;
}
exports.compareBytecode = compareBytecode;
//# sourceMappingURL=compare-bytecode.js.map