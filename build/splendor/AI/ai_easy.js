"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const underscore_1 = __importDefault(require("underscore"));
const helpers_1 = require("./helpers");
const colors = [
    'white', 'blue', 'green', 'red', 'black'
];
function countResources(resources) {
    return Object.keys(resources).reduce((total, k) => {
        return total + resources[k];
    }, 0);
}
function getAffordableCards(player, cards) {
    return cards.filter(helpers_1.hasEnoughResourceForCard.bind(null, player));
}
function cardCost(player, card) {
    let shortOf = 0;
    let cost = 0;
    colors.forEach(color => {
        var short = card[color]
            - player.resources[color]
            - player.bonus[color];
        cost += Math.max(0, card[color] - player.bonus[color]);
        if (short > 0) {
            shortOf += short;
        }
    });
    return shortOf * 2 + cost;
}
function calcAllBonus(cards) {
    const allBonus = cards.reduce((bonus, card) => {
        colors.forEach(color => {
            bonus[color] += card[color] * (4 - card.rank);
        });
        return bonus;
    }, {
        white: 0,
        blue: 0,
        green: 0,
        red: 0,
        black: 0,
    });
    return allBonus;
}
function cp(player, card) {
    const w1 = 1.5 * (15 - player.score) / 15;
    const w2 = player.score / 15;
    const weight = w1 * (1 / (1 + cardCost(player, card))) +
        w2 * card.points;
    return weight;
}
function getBestCard(player, cards) {
    const sortedCards = cards.sort((cardA, cardB) => {
        return cp(player, cardB) - cp(player, cardA);
    });
    return sortedCards[0];
}
class Easy {
    constructor(store, playerIndex, playerCount, winGameScore) {
        this.store = store;
        this.playerIndex = playerIndex;
        this.playerCount = playerCount;
        this.winGameScore = winGameScore;
    }
    turn(state) {
        // actions, either one of:
        // 1. buy a card
        // 2. hold a card
        // 3. take resources
        const { player } = state;
        const allCards = state.cards.concat(player.reservedCards);
        const affordableCards = getAffordableCards(player, allCards);
        // 2. try to buy a card
        const card = getBestCard(player, affordableCards);
        if (card) {
            return {
                action: 'buy',
                card: card,
            };
        }
        const allBonus = calcAllBonus(allCards);
        const resCount = countResources(player.resources);
        const goalCard = getBestCard(player, allCards) || {};
        // 1. take resources
        if (resCount <= 7) {
            const availableColors = colors.filter(color => {
                return state.resources[color] > 0;
            });
            const pickColors = availableColors.sort((colorA, colorB) => {
                const value_b = (goalCard[colorB] + 1) * (allBonus[colorB] / 10 + 1);
                const value_a = (goalCard[colorA] + 1) * (allBonus[colorA] / 10 + 1);
                return value_b - value_a;
            }).slice(0, 3);
            return {
                action: 'resource',
                resources: helpers_1.zipResources(pickColors),
            };
        }
        // 3. hold a card
        return {
            action: 'hold',
            card: underscore_1.default.shuffle(state.cards)[0],
        };
    }
    dropResources(state, resources) {
        return helpers_1.zipResources(underscore_1.default.shuffle(helpers_1.flattenResources(resources)).slice(0, 10));
    }
    pickNoble(state, nobles) {
        return nobles[0];
    }
}
exports.default = Easy;
//# sourceMappingURL=ai_easy.js.map