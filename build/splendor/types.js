"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Color;
(function (Color) {
    Color["white"] = "white";
    Color["blue"] = "blue";
    Color["green"] = "green";
    Color["red"] = "redi";
    Color["black"] = "black";
})(Color = exports.Color || (exports.Color = {}));
exports.colors = Object.keys(Color);
var CardStatus;
(function (CardStatus) {
    CardStatus["deck"] = "deck";
    CardStatus["empty"] = "empty";
    CardStatus["hold"] = "hold";
    CardStatus["board"] = "board";
})(CardStatus = exports.CardStatus || (exports.CardStatus = {}));
exports.actionStrings = {
    'game/init': 1,
    'game/exit': 1,
    'gameaction/pick-card': 1,
    'gameaction/take-resource': 1,
    'gameaction/take-resources': 1,
    'gameaction/hold-a-rank-card': 1,
    'gameaction/blind-hold': 1,
    'gameaction/acquire-card': 1,
    'gameaction/reserve-card': 1,
    'gameaction/cancel': 1,
    'gameaction/drop-resources': 1,
    'gameaction/pick-noble': 1,
    'gameevent/turn': 1,
    'gameevent/drop-resource': 1,
    'gameevent/pick-noble': 1,
};
//# sourceMappingURL=types.js.map