export declare function getActor(db: any, i: any): any;
export interface Actor {
    turn(state: any): object;
    dropResources(state: any, resources: any): object;
    pickNoble(state: any, noble: any): object;
}
