export declare enum Color {
    white = "white",
    blue = "blue",
    green = "green",
    red = "redi",
    black = "black"
}
export declare const colors: string[];
export declare enum CardStatus {
    deck = "deck",
    empty = "empty",
    hold = "hold",
    board = "board"
}
declare type Colors = keyof typeof Color;
declare type ColorCounts = {
    [color in Colors]: number;
};
export interface Noble extends ColorCounts {
    key: number;
    points: number;
}
interface ResourceCounts extends ColorCounts {
    gold: number;
}
export interface Card extends ColorCounts {
    key: number;
    status: CardStatus;
    rank: number;
    points: number;
    provides: Color;
    total_cost: number;
}
export interface Player {
    key: number;
    actor: string;
    bonus: ColorCounts;
    resources: ResourceCounts;
    score: number;
    reservedCards: Card[];
}
export declare const actionStrings: {
    'game/init': number;
    'game/exit': number;
    'gameaction/pick-card': number;
    'gameaction/take-resource': number;
    'gameaction/take-resources': number;
    'gameaction/hold-a-rank-card': number;
    'gameaction/blind-hold': number;
    'gameaction/acquire-card': number;
    'gameaction/reserve-card': number;
    'gameaction/cancel': number;
    'gameaction/drop-resources': number;
    'gameaction/pick-noble': number;
    'gameevent/turn': number;
    'gameevent/drop-resource': number;
    'gameevent/pick-noble': number;
};
export declare type Action = keyof typeof actionStrings;
export {};
