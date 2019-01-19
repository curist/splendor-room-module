"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
function canBuyCard(player, card) {
    let shortOf = 0;
    types_1.colors.forEach(color => {
        var short = card[color]
            - player.resources[color]
            - player.bonus[color];
        if (short > 0) {
            shortOf += short;
        }
    });
    return shortOf <= player.resources.gold;
}
exports.canBuyCard = canBuyCard;
function canHoldCard(player, card) {
    // XXX maybe also check if player is holding > 3 cards
    return card.status == 'board';
}
exports.canHoldCard = canHoldCard;
function canTakeResources(resources, takingResources) {
    let sum = 0;
    let took2sameColor = false;
    // should not be able to take gold
    if (takingResources.gold > 0) {
        return false;
    }
    for (let i = 0; i < types_1.colors.length; i++) {
        let color = types_1.colors[i];
        if (takingResources[color] > resources[color]) {
            return false;
        }
        if (takingResources[color] >= 2) {
            took2sameColor = true;
        }
        sum += (takingResources[color] || 0);
    }
    if (sum > 3) {
        return false;
    }
    if (took2sameColor && sum !== 2) {
        return false;
    }
    return true;
}
exports.canTakeResources = canTakeResources;
function shouldDropResources(player) {
    const resourcesCount = Object.keys(player.resources).map(color => {
        return player.resources[color];
    }).reduce((sum, count) => {
        return sum + count;
    });
    return resourcesCount > 10;
}
exports.shouldDropResources = shouldDropResources;
function canDropResources(player, resources) {
    for (let color in resources) {
        if (resources[color] > player[color]) {
            return false;
        }
    }
    return true;
}
exports.canDropResources = canDropResources;
function canTakeNoble(player, noble) {
    const passedResources = types_1.colors.filter(color => {
        return player.bonus[color] >= noble[color];
    });
    // should all pass
    return passedResources.length == 5;
}
exports.canTakeNoble = canTakeNoble;
function checkIdentical(origObj, obj) {
    for (let k in origObj) {
        if (origObj[k] !== obj[k]) {
            return false;
        }
    }
    return true;
}
function checkValidCard(state, card) {
    const { cards } = state;
    const allCards = cards.concat(state.player.reservedCards);
    const found = allCards.find(cardo => {
        return cardo.key == card.key;
    });
    if (!found || !checkIdentical(found, card)) {
        throw new Error(`invalid card: ${JSON.stringify(card)}`);
    }
}
function checkValidNoble(state, noble) {
    const { nobles } = state;
    const found = nobles.find(nobleo => {
        return nobleo.key == noble.key;
    });
    if (!found || !checkIdentical(found, noble)) {
        throw new Error(`invalid noble: ${JSON.stringify(noble)}`);
    }
}
function validateObject(type, state, obj) {
    const validators = {
        card: checkValidCard,
        noble: checkValidNoble,
    };
    validators[type](state, obj);
}
function validateAction(state, player, resources, action) {
    const actor = `${player.key}:${player.actor}`;
    const actionName = action.action;
    if (actionName == 'gameaction/acquire-card') {
        const { card } = action;
        validateObject('card', state, card);
        if (!canBuyCard(player, card)) {
            throw new Error(`${actor} can't afford card: ${card.key}`);
        }
    }
    else if (actionName == 'gameaction/reserve-card') {
        const { card } = action;
        validateObject('card', state, card);
        if (!canHoldCard(player, card)) {
            throw new Error(`${actor} can't hold target card: ${card.key}`);
        }
    }
    else if (actionName == 'gameaction/take-resources') {
        const takingResources = action.resources;
        if (!canTakeResources(resources, takingResources)) {
            throw new Error(`${actor} trying to take ${JSON.stringify(takingResources)}`);
        }
    }
    else if (actionName == 'gameaction/drop-resources') {
        const droppingResources = action.resources;
        if (!canDropResources(player, droppingResources)) {
            throw new Error(`${actor} trying to drop ${JSON.stringify(droppingResources)}`);
        }
    }
    else if (actionName == 'gameaction/pick-noble') {
        const { noble } = action;
        validateObject('noble', state, noble);
        if (!canTakeNoble(player, noble)) {
            throw new Error(`${actor} can't take noble: ${noble.key}`);
        }
    }
    else {
        throw new Error(`Unknown action by ${actor}: ${actionName}`);
    }
}
exports.validateAction = validateAction;
//# sourceMappingURL=validates.js.map