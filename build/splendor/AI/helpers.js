"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const underscore_1 = __importDefault(require("underscore"));
const validates_1 = require("../validates");
exports.colors = [
    'white', 'blue', 'green', 'red', 'black'
];
function hasEnoughResourceForCard(player, card) {
    let shortOf = 0;
    exports.colors.forEach(color => {
        var short = card[color]
            - player.resources[color]
            - player.bonus[color];
        if (short > 0) {
            shortOf += short;
        }
    });
    return shortOf <= player.resources.gold;
}
exports.hasEnoughResourceForCard = hasEnoughResourceForCard;
function identity(obj) {
    return obj;
}
function flattenResources(resources) {
    return Object.keys(resources).reduce((flattenResources, key) => {
        return flattenResources.concat(underscore_1.default.times(resources[key], identity.bind(null, key)));
    }, []);
}
exports.flattenResources = flattenResources;
function zipResources(resources) {
    return resources.reduce((obj, res) => {
        obj[res] = obj[res] || 0;
        obj[res] += 1;
        return obj;
    }, {});
}
exports.zipResources = zipResources;
function playerBoughtCard(player, card) {
    if (!validates_1.canBuyCard(player, card)) {
        return player;
    }
    const bonus = Object.assign({}, player.bonus, {
        [card.provides]: player.bonus[card.provides] + 1
    });
    let resources = Object.assign({}, player.resources);
    exports.colors.forEach(color => {
        const pay = Math.max(card[color] - player.bonus[color], 0);
        const short = player.resources[color] - pay;
        if (short < 0) {
            resources[color] = 0;
            resources.gold += short;
        }
        else {
            resources[color] -= pay;
        }
    });
    return Object.assign({}, player, {
        bonus,
        resources,
    });
}
exports.playerBoughtCard = playerBoughtCard;
//# sourceMappingURL=helpers.js.map