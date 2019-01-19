"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const broker_1 = require("../broker");
const underscore_1 = require("underscore");
const utils_1 = require("../utils");
const seedrandom_1 = require("seedrandom");
// import { initActors } from '../AI/actors';
const game_setting_1 = require("../data/game-setting");
const types_1 = require("../types");
const cards_1 = require("../data/cards");
const nobles_1 = require("../data/nobles");
const nobles = nobles_1.default.map((noble, i) => {
    return Object.assign({ key: i }, noble);
});
const groupedCards = underscore_1.default(cards_1.default.map((card, i) => {
    return Object.assign({ key: i, status: types_1.CardStatus.deck }, card);
})).groupBy(card => card.rank);
function changeCardStatus(status) {
    return function (card) {
        return Object.assign({}, card, { status });
    };
}
broker_1.default.on('game/init', (db, action) => {
    db.set('game-states', []);
    const { players: playerActors, winGameScore, mode, rounds, seed, fast, observer } = action;
    const playerCount = playerActors.length;
    db.set('game-settings', {
        'player-actors': playerActors,
        'win-game-score': winGameScore,
        'tournament-rounds': rounds,
        'random-seed': seed,
        'fast-mode': fast,
        'observer-mode': observer,
    });
    let randomSeed = seed;
    if (mode == 'tournament') {
        if (!db.get(['tournament', 'currentRound'])) {
            db.set('tournament', {
                rounds,
                currentRound: 0,
                wins: playerActors.map(player => {
                    return 0;
                }),
                turns: [],
                winners: [],
            });
        }
        const currentRound = db.get(['tournament', 'currentRound']);
        db.set(['tournament', 'currentRound'], currentRound + 1);
        // init random seed, only when tournament just begin
        randomSeed = (`${seed}-${currentRound + 1}`);
    }
    const rng = seedrandom_1.default(randomSeed);
    const { 1: rank1cards, 2: rank2cards, 3: rank3cards, } = groupedCards;
    const rank1deck = utils_1.shuffle(rank1cards, rng);
    const rank2deck = utils_1.shuffle(rank2cards, rng);
    const rank3deck = utils_1.shuffle(rank3cards, rng);
    const resources = Object.assign({
        gold: 5,
    }, types_1.colors.reduce((res, color) => {
        res[color] = game_setting_1.default[playerCount].resource;
        return res;
    }, {}));
    const players = playerActors.map((actor, i) => {
        return {
            key: i,
            actor: actor,
            bonus: {
                white: 0,
                blue: 0,
                green: 0,
                red: 0,
                black: 0,
            },
            resources: {
                white: 0,
                blue: 0,
                green: 0,
                red: 0,
                black: 0,
                gold: 0,
            },
            score: 0,
            reservedCards: [],
        };
    });
    db.set('game', {
        mode: mode,
        turn: 1,
        'current-player': 0,
        'win-game-score': winGameScore,
        cards1: underscore_1.default(rank1deck).take(4).map(changeCardStatus(types_1.CardStatus.board)),
        cards2: underscore_1.default(rank2deck).take(4).map(changeCardStatus(types_1.CardStatus.board)),
        cards3: underscore_1.default(rank3deck).take(4).map(changeCardStatus(types_1.CardStatus.board)),
        deck1: underscore_1.default(rank1deck).drop(4),
        deck2: underscore_1.default(rank2deck).drop(4),
        deck3: underscore_1.default(rank3deck).drop(4),
        nobles: utils_1.shuffle(nobles, rng).slice(0, game_setting_1.default[playerCount].nobles),
        resources,
        players,
    });
    db.set(['actor-stores'], [{}, {}, {}, {}]);
    // initActors(playerActors);
    broker_1.default.transit(db, 'gameevent/turn');
});
broker_1.default.on('game/undo', db => {
    const states = db.get('game-states');
    if (states.length > 0) {
        db.set('game', states[states.length - 1]);
        db.pop('game-states');
    }
});
broker_1.default.on('game/exit', db => {
    db.unset(['game']);
    db.unset(['tournament']);
});
//# sourceMappingURL=game.js.map