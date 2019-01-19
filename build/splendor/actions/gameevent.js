"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const broker_1 = __importDefault(require("../broker"));
const validates_1 = require("../validates");
const actors_1 = require("../AI/actors");
const helpers_1 = require("./helpers");
// THIS FILE IS TO PROVIDER AN INTERFACE TO INTERACT WITH AI
const debug = require('debug')('app/actions/gameevent');
broker_1.default.on('gameevent/turn', (db, action) => {
    const resources = db.get(['game', 'resources']);
    const playerIndex = db.get(['game', 'current-player']);
    const player = db.get(['game', 'players', playerIndex]);
    const actor = actors_1.getActors()[playerIndex];
    if (!actor.isAI) {
        return;
    }
    const gameState = helpers_1.composeGameState(db);
    const turnAction = actor.turn(gameState);
    // turnAction can be [buy, hold, resource]
    // debug(turnAction);
    let gameAction;
    switch (turnAction.action) {
        case 'buy':
            gameAction = {
                action: 'gameaction/acquire-card',
                card: turnAction.card,
            };
            break;
        case 'hold':
            gameAction = {
                action: 'gameaction/reserve-card',
                card: turnAction.card,
            };
            break;
        case 'resource':
            gameAction = {
                action: 'gameaction/take-resources',
                resources: turnAction.resources,
            };
            break;
        default:
            debug(`unknown turn action: ${turnAction.action}`);
            throw new Error(`Unknown turn action by ${player.actor}: ${turnAction.action}`);
    }
    validates_1.validateAction(gameState, player, resources, gameAction);
    broker_1.default.exec(db, gameAction);
});
broker_1.default.on('gameevent/drop-resource', (db, action) => {
    const resources = db.get(['game', 'resources']);
    const playerIndex = db.get(['game', 'current-player']);
    const player = db.get(['game', 'players', playerIndex]);
    if (player.actor == 'human') {
        return;
    }
    const actor = actors_1.getActors()[playerIndex];
    const gameState = helpers_1.composeGameState(db);
    const droppingResources = actor.dropResources(gameState, player.resources);
    let gameAction = {
        action: 'gameaction/drop-resources',
        resources: droppingResources,
    };
    validates_1.validateAction(gameState, player, resources, gameAction);
    broker_1.default.exec(db, gameAction);
});
broker_1.default.on('gameevent/pick-noble', (db, action) => {
    const resources = db.get(['game', 'resources']);
    const { nobles } = action;
    const playerIndex = db.get(['game', 'current-player']);
    const player = db.get(['game', 'players', playerIndex]);
    if (player.actor == 'human') {
        return;
    }
    const actor = actors_1.getActors()[playerIndex];
    const gameState = helpers_1.composeGameState(db);
    const noble = actor.pickNoble(gameState, nobles);
    let gameAction = {
        action: 'gameaction/pick-noble',
        noble: noble,
    };
    validates_1.validateAction(gameState, player, resources, gameAction);
    broker_1.default.exec(db, gameAction);
});
//# sourceMappingURL=gameevent.js.map