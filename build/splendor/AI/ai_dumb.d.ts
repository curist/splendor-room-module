import { Actor } from './actors';
export default class Dumb implements Actor {
    store: any;
    playerIndex: number;
    playerCount: number;
    winGameScore: number;
    constructor(store: any, playerIndex: number, playerCount: number, winGameScore: number);
    turn(state: any): {
        action: string;
        card: any;
        resources?: undefined;
    } | {
        action: string;
        resources: any;
        card?: undefined;
    };
    dropResources(state: any, resources: any): any;
    pickNoble(state: any, nobles: any): any;
}
