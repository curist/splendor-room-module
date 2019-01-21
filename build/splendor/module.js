"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baobab_1 = __importDefault(require("baobab"));
const broker_1 = __importDefault(require("./broker"));
require("./actions/index");
const room_module_types_1 = require("room-module-types");
const types_1 = require("./types");
const dependencies = [room_module_types_1.RoomModuleType.Players];
const defaultState = {};
const reducer = (state, action, { userId, ownerId, context: { players: { players, playerIdMapping } } }) => {
    const db = new baobab_1.default(state, { immutable: false });
    broker_1.default.transit(db, action.type, action);
    return db.get();
};
function isReducerAction(s) {
    return types_1.actionStrings[s] === 1;
}
const validate = (state, action, { userId, ownerId, context: { players: { players, playerIdMapping } } }) => {
    const validActionType = isReducerAction(action.type);
    if (!validActionType) {
        return new Error(`Invalid action type: ${action.type}`);
    }
    const actionType = action.type;
    const playerIndex = playerIdMapping[userId];
    const db = new baobab_1.default(state);
    const currentPlayerIndex = db.get(['game', 'current-player']);
    switch (actionType) {
        case 'game/init': {
            if (userId !== ownerId) {
                return new Error('Only owner can init a game');
            }
            else if (currentPlayerIndex !== undefined) {
                return new Error('Game already started');
            }
            else {
                return null;
            }
        }
        case 'game/exit': {
            if (db.get(['game', 'show-summary'])) {
                return null;
            }
        }
    }
    if (playerIndex !== currentPlayerIndex) {
        return new Error(`Current active player is ${currentPlayerIndex}`);
    }
    return null;
};
const transformState = (state, { userId }) => {
    if (!state || !state.game || !state.game.deck1) {
        return state;
    }
    state.game.deck1 = state.game.deck1.length;
    state.game.deck2 = state.game.deck2.length;
    state.game.deck3 = state.game.deck3.length;
    return state;
};
const roomModule = {
    defaultState,
    dependencies,
    reducer,
    validate,
    transformState,
};
exports.default = roomModule;
//# sourceMappingURL=module.js.map