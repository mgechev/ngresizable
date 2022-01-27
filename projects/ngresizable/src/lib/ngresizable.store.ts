export interface IPoint {
  x: number;
  y: number;
}
export interface IUndefinedPoint {
  x: number|undefined;
  y: number|undefined;
}

export interface ISize {
  width: number;
  height: number;
}

export interface IUndefinedSize {
  width: number|undefined;
  height: number|undefined;
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

export const defaultGrid: ISize = {
  width: 1,
  height: 1
};

export const defaultBound: IRectangle = {
  x: -Infinity,
  y: -Infinity,
  width: Infinity,
  height: Infinity
};

export class Store {
  state: IResizeState = {
    currentSize: { width: 0, height: 0 },
    startSize: { width: 0, height: 0 },
    currentPosition: { x: 0, y: 0 },
    startPosition: { x: 0, y: 0 },
    isResizing: false,
    direction: ''
  };

  private reducers: any[] = [];

  addReducer(reducer: any) {
    this.reducers.push(reducer);
  }

  emitAction(action: any, ...params: any[]) {
    this.state = this.reducers.reduce((p: IResizeState, c: any) => {
      // eslint-disable-next-line prefer-spread
      return c.apply(null, [p, action].concat(params));
    }, this.state);
  }
}

