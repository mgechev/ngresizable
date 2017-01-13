import { expect } from 'chai';

import { resizeReducer } from '../lib/ngresizable.reducer';
import { defaultGrid, defaultBound, Store, IResizeState, IOptions } from '../lib/ngresizable.store';
import * as actions from '../lib/ngresizable.actions';

describe('ngresizable', () => {

  let defaultState: IResizeState;
  let defaultOptions: IOptions;

  beforeEach(() => {
    defaultState = new Store().state;
    defaultOptions = {
      minSize: { width: 0, height: 0 },
      maxSize: { width: Infinity, height: Infinity },
      grid: defaultGrid,
      directions: ['right', 'bottom', 'top', 'left', 'bottom-left', 'top-left', 'bottom-right', 'top-right'],
      disabled: false,
      bound: defaultBound,
      ratio: null
    };
  });

  describe('mousedown event handling', () => {

    it('should throw when no direction is provided', () => {
      expect(() => {
        resizeReducer(defaultState, actions.MOUSE_DOWN, { x: 1, y: 1 }, { x: 1, y: 1 }, defaultOptions, { width: 0, height: 0 }, null);
      }).to.throw();
    });

    it('should initialize state on mousedown', () => {
      resizeReducer(defaultState, actions.MOUSE_DOWN, { x: 1, y: 1 }, { x: 2, y: 2 }, defaultOptions, { width: 0, height: 0 }, 'left');
      expect(defaultState.direction).to.eq('left');
      expect(defaultState.isResizing).to.eq(true);
      expect(defaultState.startSize.width).to.eq(0);
      expect(defaultState.startSize.height).to.eq(0);
      expect(defaultState.startPosition.x).to.eq(1);
      expect(defaultState.startPosition.y).to.eq(1);
      expect(defaultState.currentPosition.x).to.eq(2);
      expect(defaultState.currentPosition.y).to.eq(2);
    });

  });

  describe('resize event handling', () => {

    it('should return the current state if not resizing', () => {
      const result = resizeReducer(
        defaultState,
        actions.RESIZE,
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        defaultOptions,
        { width: 0, height: 0 },
        'left'
      );
      expect(result).to.eq(defaultState);
    });

    describe('actual resizing', () => {

      it('should resize in right', () => {
        resizeReducer(defaultState, actions.MOUSE_DOWN, { x: 1, y: 1 }, { x: 1, y: 1 }, defaultOptions, { width: 0, height: 0 }, 'right');
        let state = resizeReducer(defaultState,
          actions.RESIZE,
          { x: 2, y: 1 },
          { x: 1, y: 1 },
          defaultOptions,
          { width: 0, height: 0 },
          'bottom-right'
        );
        expect(state.currentSize.width).to.eq(1);

        resizeReducer(defaultState, actions.MOUSE_DOWN, { x: 1, y: 1 }, { x: 1, y: 1 }, defaultOptions, { width: 0, height: 0 }, 'right');
        state = resizeReducer(defaultState,
          actions.RESIZE,
          { x: 2, y: 1 },
          { x: 1, y: 1 },
          defaultOptions,
          { width: 0, height: 0 },
          'right'
        );
        expect(state.currentSize.width).to.eq(1);
      });

      it('should resize in left', () => {
        resizeReducer(defaultState, actions.MOUSE_DOWN, { x: 1, y: 1 }, { x: 1, y: 1 }, defaultOptions, { width: 2, height: 2 }, 'right');
        let state = resizeReducer(defaultState,
          actions.RESIZE,
          { x: 0, y: 1 },
          { x: 1, y: 1 },
          defaultOptions,
          { width: 0, height: 0 },
          'bottom-left'
        );
        expect(state.currentSize.width).to.eq(1);

        resizeReducer(defaultState, actions.MOUSE_DOWN, { x: 1, y: 1 }, { x: 1, y: 1 }, defaultOptions, { width: 2, height: 2 }, 'right');
        state = resizeReducer(defaultState,
          actions.RESIZE,
          { x: 0, y: 1 },
          { x: 1, y: 1 },
          defaultOptions,
          { width: 0, height: 0 },
          'left'
        );
        expect(state.currentSize.width).to.eq(1);
      });

      it('should resize in top', () => {
        resizeReducer(defaultState, actions.MOUSE_DOWN, { x: 1, y: 1 }, { x: 1, y: 1 }, defaultOptions, { width: 0, height: 0 }, 'top');
        let state = resizeReducer(defaultState,
          actions.RESIZE,
          { x: 1, y: 0 },
          { x: 1, y: 1 },
          defaultOptions
        );
        expect(state.currentSize.height).to.eq(1);
        expect(state.currentPosition.y).to.eq(0);

        resizeReducer(
          defaultState,
          actions.MOUSE_DOWN,
          { x: 1, y: 1 },
          { x: 1, y: 1 },
          defaultOptions,
          { width: 0, height: 0 },
          'top-left'
        );
        state = resizeReducer(defaultState,
          actions.RESIZE,
          { x: 1, y: 0 },
          { x: 1, y: 1 },
          defaultOptions
        );
        expect(state.currentSize.height).to.eq(1);
        expect(state.currentPosition.y).to.eq(0);
      });

      it('should resize in bottom', () => {
        resizeReducer(defaultState, actions.MOUSE_DOWN, { x: 1, y: 1 }, { x: 1, y: 1 }, defaultOptions, { width: 0, height: 0 }, 'bottom');
        let state = resizeReducer(defaultState,
          actions.RESIZE,
          { x: 1, y: 2 },
          { x: 1, y: 1 },
          defaultOptions
        );
        expect(state.currentSize.height).to.eq(1);
        expect(state.currentPosition.y).to.eq(1);

        resizeReducer(
          defaultState,
          actions.MOUSE_DOWN,
          { x: 1, y: 1 },
          { x: 1, y: 1 },
          defaultOptions,
          { width: 0, height: 0 },
          'bottom-left'
        );
        state = resizeReducer(defaultState,
          actions.RESIZE,
          { x: 1, y: 2 },
          { x: 1, y: 1 },
          defaultOptions
        );
        expect(state.currentSize.height).to.eq(1);
      });

      it('should resize in top-left', () => {
        resizeReducer(
          defaultState,
          actions.MOUSE_DOWN,
          { x: 1, y: 1 },
          { x: 1, y: 1 },
          defaultOptions,
          { width: 0, height: 0 },
          'top-left'
        );
        let state = resizeReducer(defaultState,
          actions.RESIZE,
          { x: 0, y: 0 },
          { x: 1, y: 1 },
          defaultOptions
        );
        expect(state.currentSize.height).to.eq(1);
        expect(state.currentSize.width).to.eq(1);
        expect(state.currentPosition.y).to.eq(0);
        expect(state.currentPosition.x).to.eq(0);
      });

      it('should resize in top-right', () => {
        resizeReducer(
          defaultState,
          actions.MOUSE_DOWN,
          { x: 1, y: 1 },
          { x: 1, y: 1 },
          defaultOptions,
          { width: 0, height: 0 },
          'top-right'
        );
        let state = resizeReducer(defaultState,
          actions.RESIZE,
          { x: 2, y: 0 },
          { x: 1, y: 1 },
          defaultOptions
        );
        expect(state.currentSize.height).to.eq(1);
        expect(state.currentSize.width).to.eq(1);
        expect(state.currentPosition.y).to.eq(0);
        expect(state.currentPosition.x).to.eq(1);
      });

      it('should resize in bottom-right', () => {
        resizeReducer(
          defaultState,
          actions.MOUSE_DOWN,
          { x: 1, y: 1 },
          { x: 1, y: 1 },
          defaultOptions,
          { width: 0, height: 0 },
          'bottom-right'
        );
        let state = resizeReducer(defaultState,
          actions.RESIZE,
          { x: 2, y: 2 },
          { x: 1, y: 1 },
          defaultOptions
        );
        expect(state.currentSize.height).to.eq(1);
        expect(state.currentSize.width).to.eq(1);
        expect(state.currentPosition.x).to.eq(1);
        expect(state.currentPosition.y).to.eq(1);
      });

      it('should resize in bottom-left', () => {
        resizeReducer(
          defaultState,
          actions.MOUSE_DOWN,
          { x: 1, y: 1 },
          { x: 1, y: 1 },
          defaultOptions,
          { width: 0, height: 0 },
          'bottom-left'
        );
        let state = resizeReducer(defaultState,
          actions.RESIZE,
          { x: 0, y: 2 },
          { x: 1, y: 1 },
          defaultOptions
        );
        expect(state.currentSize.height).to.eq(1);
        expect(state.currentSize.width).to.eq(1);
        expect(state.currentPosition.x).to.eq(0);
        expect(state.currentPosition.y).to.eq(1);
      });

    });

  });

  describe('grid', () => {

      it('should use grid height setting', () => {
        defaultOptions.grid = { width: 5, height: 5 };
        resizeReducer(
          defaultState,
          actions.MOUSE_DOWN,
          { x: 1, y: 1 },
          { x: 1, y: 1 },
          defaultOptions,
          { width: 0, height: 0 },
          'bottom-left'
        );
        let state = resizeReducer(defaultState,
          actions.RESIZE,
          { x: 1, y: 6 },
          { x: 1, y: 1 },
          defaultOptions
        );
        expect(state.currentSize.height).to.eq(5);

        state = resizeReducer(defaultState,
          actions.RESIZE,
          { x: 1, y: 2 },
          { x: 1, y: 1 },
          defaultOptions
        );
        expect(state.currentSize.height).to.eq(0);

        state = resizeReducer(defaultState,
          actions.RESIZE,
          { x: 1, y: 11 },
          { x: 1, y: 1 },
          defaultOptions
        );
        expect(state.currentSize.height).to.eq(10);
      });

      it('should use grid width setting', () => {
        defaultOptions.grid = { width: 5, height: 5 };
        resizeReducer(
          defaultState,
          actions.MOUSE_DOWN,
          { x: 1, y: 1 },
          { x: 1, y: 1 },
          defaultOptions,
          { width: 0, height: 0 },
          'right'
        );
        let state = resizeReducer(defaultState,
          actions.RESIZE,
          { x: 6, y: 1 },
          { x: 1, y: 1 },
          defaultOptions
        );
        expect(state.currentSize.width).to.eq(5);

        state = resizeReducer(defaultState,
          actions.RESIZE,
          { x: 2, y: 1 },
          { x: 1, y: 1 },
          defaultOptions
        );
        expect(state.currentSize.width).to.eq(0);

        state = resizeReducer(defaultState,
          actions.RESIZE,
          { x: 11, y: 1 },
          { x: 1, y: 1 },
          defaultOptions
        );
        expect(state.currentSize.width).to.eq(10);
      });

  });

  describe('min and max size', () => {

    describe('max size', () => {

      it('should respect maxWidth', () => {
        defaultOptions.maxSize = { width: 50, height: Infinity };
        resizeReducer(
          defaultState,
          actions.MOUSE_DOWN,
          { x: 1, y: 1 },
          { x: 1, y: 1 },
          defaultOptions,
          { width: 0, height: 0 },
          'right'
        );
        let state = resizeReducer(defaultState,
          actions.RESIZE,
          { x: 60, y: 1 },
          { x: 1, y: 1 },
          defaultOptions
        );
        expect(state.currentSize.width).to.eq(50);
        state = resizeReducer(defaultState,
          actions.RESIZE,
          { x: 1, y: 1 },
          { x: 1, y: 1 },
          defaultOptions
        );
        expect(state.currentSize.width).to.eq(0);
      });

      it('should respect maxHeight', () => {
        defaultOptions.maxSize = { width: Infinity, height: 50 };
        resizeReducer(
          defaultState,
          actions.MOUSE_DOWN,
          { x: 1, y: 1 },
          { x: 1, y: 1 },
          defaultOptions,
          { width: 0, height: 0 },
          'bottom'
        );
        let state = resizeReducer(defaultState,
          actions.RESIZE,
          { x: 1, y: 60 },
          { x: 1, y: 1 },
          defaultOptions
        );
        expect(state.currentSize.height).to.eq(50);
        state = resizeReducer(defaultState,
          actions.RESIZE,
          { x: 1, y: 1 },
          { x: 1, y: 1 },
          defaultOptions
        );
        expect(state.currentSize.height).to.eq(0);
      });

      it('should respect both maxWidth & maxHeight', () => {
        defaultOptions.maxSize = { width: 30, height: 50 };
        resizeReducer(
          defaultState,
          actions.MOUSE_DOWN,
          { x: 1, y: 1 },
          { x: 1, y: 1 },
          defaultOptions,
          { width: 0, height: 0 },
          'bottom-right'
        );
        let state = resizeReducer(defaultState,
          actions.RESIZE,
          { x: 80, y: 60 },
          { x: 1, y: 1 },
          defaultOptions
        );
        expect(state.currentSize.height).to.eq(50);
        expect(state.currentSize.width).to.eq(30);
        state = resizeReducer(defaultState,
          actions.RESIZE,
          { x: 1, y: 1 },
          { x: 1, y: 1 },
          defaultOptions
        );
        expect(state.currentSize.height).to.eq(0);
        expect(state.currentSize.width).to.eq(0);
      });
    });

    describe('min size', () => {

      it('should respect minWidth', () => {
        defaultOptions.minSize = { width: 50, height: 0 };
        resizeReducer(
          defaultState,
          actions.MOUSE_DOWN,
          { x: 1, y: 1 },
          { x: 1, y: 1 },
          defaultOptions,
          { width: 0, height: 0 },
          'right'
        );
        let state = resizeReducer(defaultState,
          actions.RESIZE,
          { x: 20, y: 1 },
          { x: 1, y: 1 },
          defaultOptions
        );
        expect(state.currentSize.width).to.eq(50);
        state = resizeReducer(defaultState,
          actions.RESIZE,
          { x: 1, y: 1 },
          { x: 1, y: 1 },
          defaultOptions
        );
        expect(state.currentSize.width).to.eq(50);
      });

      it('should respect minHeight', () => {
        defaultOptions.minSize = { width: 0, height: 50 };
        resizeReducer(
          defaultState,
          actions.MOUSE_DOWN,
          { x: 0, y: 0 },
          { x: 1, y: 1 },
          defaultOptions,
          { width: 0, height: 0 },
          'bottom'
        );
        let state = resizeReducer(defaultState,
          actions.RESIZE,
          { x: 1, y: 60 },
          { x: 1, y: 1 },
          defaultOptions
        );
        expect(state.currentSize.height).to.eq(60);
        state = resizeReducer(defaultState,
          actions.RESIZE,
          { x: 1, y: 1 },
          { x: 1, y: 1 },
          defaultOptions
        );
        expect(state.currentSize.height).to.eq(50);
      });

      it('should respect both minWidth & minHeight', () => {
        defaultOptions.minSize = { width: 30, height: 50 };
        resizeReducer(
          defaultState,
          actions.MOUSE_DOWN,
          { x: 0, y: 0 },
          { x: 1, y: 1 },
          defaultOptions,
          { width: 0, height: 0 },
          'bottom-right'
        );
        let state = resizeReducer(defaultState,
          actions.RESIZE,
          { x: 80, y: 60 },
          { x: 1, y: 1 },
          defaultOptions
        );
        expect(state.currentSize.height).to.eq(60);
        expect(state.currentSize.width).to.eq(80);
        state = resizeReducer(defaultState,
          actions.RESIZE,
          { x: 1, y: 1 },
          { x: 1, y: 1 },
          defaultOptions
        );
        expect(state.currentSize.height).to.eq(50);
        expect(state.currentSize.width).to.eq(30);
      });
    });
  });

  describe('ratio', () => {
    it('should respect fixed ratio', () => {
      defaultOptions.ratio = 1;
      resizeReducer(
        defaultState,
        actions.MOUSE_DOWN,
        { x: 0, y: 0 },
        { x: 1, y: 1 },
        defaultOptions,
        { width: 0, height: 0 },
        'bottom-right'
      );
      let state = resizeReducer(defaultState,
        actions.RESIZE,
        { x: 80, y: 60 },
        { x: 1, y: 1 },
        defaultOptions
      );
      expect(state.currentSize.height).to.eq(60);
      expect(state.currentSize.width).to.eq(60);
    });
  });

  describe('bound', () => {

    it('should respect set boundaries', () => {
      defaultOptions.bound = {
        width: 10,
        height: 15,
        x: 1,
        y: 1
      };
      resizeReducer(
        defaultState,
        actions.MOUSE_DOWN,
        { x: 0, y: 0 },
        { x: 1, y: 1 },
        defaultOptions,
        { width: 0, height: 0 },
        'bottom-right'
      );
      let state = resizeReducer(defaultState,
        actions.RESIZE,
        { x: 80, y: 60 },
        { x: 1, y: 1 },
        defaultOptions
      );
      expect(state.currentSize.height).to.eq(15);
      expect(state.currentSize.width).to.eq(10);

      state = resizeReducer(defaultState,
        actions.RESIZE,
        { x: 4, y: 5 },
        { x: 1, y: 1 },
        defaultOptions
      );
      expect(state.currentSize.height).to.eq(5);
      expect(state.currentSize.width).to.eq(4);
    });

  });

});

