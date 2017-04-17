export interface IPoint {
    x: number;
    y: number;
}
export interface ISize {
    width: number;
    height: number;
}
export interface IRectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface IResizeEvent {
    size: ISize;
    position: IPoint;
    direction: string;
}
export interface IResizeState {
    currentSize: ISize;
    startSize: ISize;
    currentPosition: IPoint;
    startPosition: IPoint;
    direction: string;
    isResizing: boolean;
}
export interface IOptions {
    minSize: ISize;
    maxSize: ISize;
    grid: ISize;
    directions: string[];
    disabled: boolean;
    bound: IRectangle;
    ratio: number;
}
export declare const defaultGrid: ISize;
export declare const defaultBound: IRectangle;
export declare class Store {
    state: IResizeState;
    private reducers;
    addReducer(reducer: any): void;
    emitAction(action: any, ...params: any[]): void;
}
