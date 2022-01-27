import { IResizeState, ISize, IPoint, IOptions } from './ngresizable.store';
import { RESIZE, RESIZE_STOP, MOUSE_DOWN } from './ngresizable.actions';
import { manageRatio, resizeTop, resizeLeft, resizeBottom, resizeRight } from './ngresizable.utils';

// DANGER
// Mutates the state instead of creating
// a new one. This is not a traditional
// reducer and respectivly not a pure
// implementation of the redux pattern.
// This separation aims better testability,
// separation of concerns, less dependencies
// and higher performance.
export const resizeReducer = (
    currentState: IResizeState,
    action: string,
    mousePosition: IPoint,
    startPosition: IPoint,
    options: IOptions,
    initialSize?: ISize,
    initialResizeDir?: string): IResizeState => {
  if (options.disabled) {
    return currentState;
  }
  const startPos = currentState.startPosition;
  const startSize = currentState.startSize;
  const currentSize = currentState.currentSize;
  const currentPos = currentState.currentPosition;
  switch (action) {
    case MOUSE_DOWN:
    if (!initialResizeDir) {
      throw new Error('Direction not provided');
    }
    if (!initialSize) {
      throw new Error('Initial size not provided');
    }
    currentState.direction = initialResizeDir;
    currentState.isResizing = true;
    startPos.x = mousePosition.x;
    startPos.y = mousePosition.y;
    currentPos.x = startPosition.x;
    currentPos.y = startPosition.y;
    currentSize.width = initialSize.width;
    currentSize.height = initialSize.height;
    startSize.width = initialSize.width;
    startSize.height = initialSize.height;
    break;
    case RESIZE:
    if (!currentState.isResizing) {
      return currentState;
    }
    
    let nextWidth = currentSize.width; // eslint-disable-line no-case-declarations
    let nextHeight = currentSize.height; // eslint-disable-line no-case-declarations
    let nextLeft = currentPos.x; // eslint-disable-line no-case-declarations
    let nextTop = currentPos.y; // eslint-disable-line no-case-declarations

    if (/right/.test(currentState.direction)) {
      nextWidth = resizeRight(mousePosition.x - startPos.x + startSize.width, options, currentState.currentPosition).nextWidth;
    }
    if (/bottom/.test(currentState.direction)) {
      nextHeight = resizeBottom(mousePosition.y - startPos.y + startSize.height, options, currentState.currentPosition).nextHeight;
    }
    if (/top/.test(currentState.direction)) {
      let data = resizeTop(startPos.y - mousePosition.y + startSize.height, currentPos, currentSize, options);
      nextTop = data.nextTop;
      nextHeight = data.nextHeight;

    }
    if (/left/.test(currentState.direction)) {
      let data = resizeLeft(startPos.x - mousePosition.x + startSize.width, currentPos, currentSize, options);
      nextLeft = data.nextLeft;
      nextWidth = data.nextWidth;

    }
    if (options.ratio) {
      let fixedSize = manageRatio({ nextTop, nextWidth, nextHeight, nextLeft },
        options, currentPos, currentSize, currentState.direction, currentState.currentPosition);
      nextLeft = fixedSize.nextLeft;
      nextTop = fixedSize.nextTop;
      nextWidth = fixedSize.nextWidth;
      nextHeight = fixedSize.nextHeight;
    }
    currentPos.x = Math.round(nextLeft / options.grid.width) * options.grid.width;
    currentPos.y = Math.round(nextTop / options.grid.height) * options.grid.height;
    currentSize.width = Math.round(nextWidth / options.grid.width) * options.grid.width;
    currentSize.height = Math.round(nextHeight / options.grid.height) * options.grid.height;
    break;
    case RESIZE_STOP:
    currentState.isResizing = false;
    startSize.width = currentSize.width;
    startSize.height = currentSize.height;
    break;
  }
  return currentState;
};

