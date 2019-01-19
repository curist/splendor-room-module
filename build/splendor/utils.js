"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function shuffle(array, random = Math.random) {
    let arr = array.slice(0);
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
exports.shuffle = shuffle;
//# sourceMappingURL=utils.js.map