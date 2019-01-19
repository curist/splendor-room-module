"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
function getActor(db, i) {
    const player = db.get(['game', 'players', i]);
    const actorName = player.actor;
    if (actorName == 'human') {
        return 'human';
    }
    const winGameScore = db.get(['game-settings', 'win-game-score']);
    const playerCount = db.get(['game-settings', 'player-actors']).length;
    // name = 'ai:somename'
    const aiName = actorName.split(':')[1];
    const AI = index_1.default[aiName];
    if (!AI) {
        return actorName;
    }
    const store = db.select('actor-stores', i);
    const ai = new AI(store, i, playerCount, winGameScore);
    ai.isAI = true;
    return ai;
}
exports.getActor = getActor;
//# sourceMappingURL=actors.js.map