import { ISize, IPoint, IOptions } from './ngresizable.store';
export declare const resizeRight: (nextWidth: number, options: IOptions, currentElementPosition: IPoint) => {
    nextWidth: number;
    nextLeft: number;
};
export declare const resizeBottom: (nextHeight: number, options: IOptions, currentElementPosition: IPoint) => {
    nextHeight: number;
    nextTop: number;
};
export declare const resizeTop: (nextHeight: number, currentPos: IPoint, currentSize: ISize, options: IOptions) => {
    nextHeight: number;
    nextTop: number;
};
export declare const resizeLeft: (nextWidth: number, currentPos: IPoint, currentSize: ISize, options: IOptions) => {
    nextWidth: number;
    nextLeft: number;
};
export declare const manageRatio: ({nextWidth, nextHeight, nextTop, nextLeft}: {
    nextWidth: number;
    nextHeight: number;
    nextTop: number;
    nextLeft: number;
}, options: IOptions, currentPos: IPoint, currentSize: ISize, direction: string, currentElementPosition: IPoint) => {
    nextWidth: number;
    nextHeight: number;
    nextTop: number;
    nextLeft: number;
};
