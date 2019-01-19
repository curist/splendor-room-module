"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baobab_1 = require("baobab");
const broker_1 = require("./broker");
require("./actions/index");
const room_module_types_1 = require("room-module-types");
const dependencies = [room_module_types_1.RoomModuleType.Players];
const defaultState = {};
const reducer = (state, action, { userId }) => {
    const db = new baobab_1.default(state, { immutable: false });
    broker_1.default.transit(db, action.type, action);
    db.set('game-states', []);
    return db.get();
};
const transformState = (state, { userId }) => {
    state.game.deck1 = state.game.deck1.length;
    state.game.deck2 = state.game.deck2.length;
    state.game.deck3 = state.game.deck3.length;
    delete state.game['game-states'];
    return state;
};
const roomModule = {
    defaultState,
    dependencies,
    reducer,
    transformState,
};
exports.default = roomModule;
//# sourceMappingURL=module.js.map