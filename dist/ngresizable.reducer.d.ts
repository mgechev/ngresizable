import { IResizeState, ISize, IPoint, IOptions } from './ngresizable.store';
export declare const resizeReducer: (currentState: IResizeState, action: string, mousePosition: IPoint, startPosition: IPoint, options: IOptions, initialSize?: ISize, initialResizeDir?: string) => IResizeState;
