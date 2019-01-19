import { Card } from './types';
export declare function canBuyCard(player: any, card: any): boolean;
export declare function canHoldCard(player: any, card: Card): boolean;
export declare function canTakeResources(resources: any, takingResources: any): boolean;
export declare function shouldDropResources(player: any): boolean;
export declare function canDropResources(player: any, resources: any): boolean;
export declare function canTakeNoble(player: any, noble: any): boolean;
export declare function validateAction(state: any, player: any, resources: any, action: any): void;
