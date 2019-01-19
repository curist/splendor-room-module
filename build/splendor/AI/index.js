"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ai_dumb_1 = __importDefault(require("./ai_dumb"));
const ai_easy_1 = __importDefault(require("./ai_easy"));
const ai_normal_1 = __importDefault(require("./ai_normal"));
exports.default = {
    dumb: ai_dumb_1.default,
    easy: ai_easy_1.default,
    normal: ai_normal_1.default,
};
//# sourceMappingURL=index.js.map