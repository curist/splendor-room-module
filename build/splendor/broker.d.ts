declare const B: {
    on: (eventName: any, handler: any) => void;
    transit: (db: any, eventName: string, action?: object) => any;
    exec: (db: any, action: any) => void;
    getActionNames: () => string[];
};
export default B;
