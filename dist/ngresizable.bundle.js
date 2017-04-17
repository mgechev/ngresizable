(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common'], factory) :
	(factory((global.ngresizable = global.ngresizable || {}),global._angular_core,global._angular_common));
}(this, (function (exports,_angular_core,_angular_common) { 'use strict';

var defaultBound = {
    x: -Infinity,
    y: -Infinity,
    width: Infinity,
    height: Infinity
};
var Store = (function () {
    function Store() {
        this.state = {
            currentSize: { width: 0, height: 0 },
            startSize: { width: 0, height: 0 },
            currentPosition: { x: 0, y: 0 },
            startPosition: { x: 0, y: 0 },
            isResizing: false,
            direction: null
        };
        this.reducers = [];
    }
    Store.prototype.addReducer = function (reducer) {
        this.reducers.push(reducer);
    };
    Store.prototype.emitAction = function (action) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        this.state = this.reducers.reduce(function (p, c) {
            return c.apply(null, [p, action].concat(params));
        }, this.state);
    };
    return Store;
}());

var RESIZE = 'resize-resize';
var MOUSE_DOWN = 'resize-mouse-down';
var RESIZE_STOP = 'resize-stop';

var resizeRight = function (nextWidth, options, currentElementPosition) {
    if (nextWidth <= options.minSize.width)
        nextWidth = options.minSize.width;
    if (nextWidth >= options.maxSize.width)
        nextWidth = options.maxSize.width;
    if (nextWidth + currentElementPosition.x >= options.bound.x + options.bound.width)
        nextWidth -= (nextWidth + currentElementPosition.x) - (options.bound.x + options.bound.width);
    return { nextWidth: nextWidth, nextLeft: currentElementPosition.x };
};
var resizeBottom = function (nextHeight, options, currentElementPosition) {
    if (nextHeight <= options.minSize.height)
        nextHeight = options.minSize.height;
    if (nextHeight >= options.maxSize.height)
        nextHeight = options.maxSize.height;
    if (nextHeight + currentElementPosition.y >= options.bound.y + options.bound.height)
        nextHeight -= (nextHeight + currentElementPosition.y) - (options.bound.y + options.bound.height);
    return { nextHeight: nextHeight, nextTop: currentElementPosition.y };
};
var resizeTop = function (nextHeight, currentPos, currentSize, options) {
    var nextTop = currentPos.y + (currentSize.height - nextHeight);
    // Lower priorty compared to all others
    if (nextHeight <= options.minSize.height) {
        nextTop -= options.minSize.height - nextHeight;
        nextHeight = options.minSize.height;
    }
    if (nextHeight >= options.maxSize.height) {
        nextTop += nextHeight - options.maxSize.height;
        nextHeight = options.maxSize.height;
    }
    if (nextTop <= options.bound.y) {
        nextHeight -= (options.bound.y - nextTop);
        nextTop = options.bound.y;
    }
    return { nextHeight: nextHeight, nextTop: nextTop };
};
var resizeLeft = function (nextWidth, currentPos, currentSize, options) {
    var nextLeft = currentPos.x + (currentSize.width - nextWidth);
    // Lower priorty compared to all others
    if (nextWidth <= options.minSize.width) {
        nextLeft -= options.minSize.width - nextWidth;
        nextWidth = options.minSize.width;
    }
    if (nextWidth >= options.maxSize.width) {
        nextLeft += nextWidth - options.maxSize.width;
        nextWidth = options.maxSize.width;
    }
    if (nextLeft <= options.bound.x) {
        nextWidth -= (options.bound.x - nextLeft);
        nextLeft = options.bound.x;
    }
    return { nextWidth: nextWidth, nextLeft: nextLeft };
};
var manageRatio = function (_a, options, currentPos, currentSize, direction, currentElementPosition) {
    var nextWidth = _a.nextWidth, nextHeight = _a.nextHeight, nextTop = _a.nextTop, nextLeft = _a.nextLeft;
    var data;
    var bound = options.bound;
    bound.x = parseInt(bound.x.toFixed());
    bound.y = parseInt(bound.y.toFixed());
    bound.width = parseInt(bound.width.toFixed());
    bound.height = parseInt(bound.height.toFixed());
    switch (direction) {
        case 'left':
            nextHeight = resizeBottom(options.ratio * nextWidth, options, currentElementPosition).nextHeight;
            nextLeft += nextWidth - (nextHeight / options.ratio);
            nextWidth = nextHeight / options.ratio;
            break;
        case 'right':
            nextHeight = resizeBottom(options.ratio * nextWidth, options, currentElementPosition).nextHeight;
            nextWidth = nextHeight / options.ratio;
            break;
        case 'top':
            nextWidth = resizeRight(nextHeight / options.ratio, options, currentElementPosition).nextWidth;
            nextTop += nextHeight - (nextWidth * options.ratio);
            nextHeight = options.ratio * nextWidth;
            break;
        case 'bottom':
        case 'bottom-right':
            nextWidth = resizeRight(nextHeight / options.ratio, options, currentElementPosition).nextWidth;
            nextHeight = options.ratio * nextWidth;
            break;
        case 'top-left':
            data = resizeLeft(nextHeight / options.ratio, currentPos, currentSize, options);
            nextWidth = data.nextWidth;
            nextLeft = data.nextLeft;
            if (nextWidth < nextHeight / options.ratio) {
                nextTop += nextHeight - (nextWidth * options.ratio);
                nextHeight = nextWidth * options.ratio;
            }
            break;
        case 'bottom-left':
            data = resizeLeft(nextHeight / options.ratio, currentPos, currentSize, options);
            nextWidth = data.nextWidth;
            nextLeft = data.nextLeft;
            if (nextWidth < nextHeight / options.ratio) {
                nextHeight = nextWidth * options.ratio;
            }
            break;
        case 'top-right':
            data = resizeRight(nextHeight / options.ratio, options, currentElementPosition);
            nextWidth = data.nextWidth;
            if (nextWidth < nextHeight / options.ratio) {
                nextTop += nextHeight - (nextWidth * options.ratio);
                nextHeight = nextWidth * options.ratio;
            }
            break;
    }
    return { nextWidth: nextWidth, nextHeight: nextHeight, nextTop: nextTop, nextLeft: nextLeft };
};

// DANGER
// Mutates the state instead of creating
// a new one. This is not a traditional
// reducer and respectivly not a pure
// implementation of the redux pattern.
// This separation aims better testability,
// separation of concerns, less dependencies
// and higher performance.
var resizeReducer = function (currentState, action, mousePosition, startPosition, options, initialSize, initialResizeDir) {
    if (options.disabled) {
        return currentState;
    }
    var startPos = currentState.startPosition;
    var startSize = currentState.startSize;
    var currentSize = currentState.currentSize;
    var currentPos = currentState.currentPosition;
    switch (action) {
        case MOUSE_DOWN:
            if (!initialResizeDir) {
                throw new Error('Direction not provided');
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
            var nextWidth = currentSize.width;
            var nextHeight = currentSize.height;
            var nextLeft = currentPos.x;
            var nextTop = currentPos.y;
            if (/right/.test(currentState.direction)) {
                nextWidth = resizeRight(mousePosition.x - startPos.x + startSize.width, options, currentState.currentPosition).nextWidth;
            }
            if (/bottom/.test(currentState.direction)) {
                nextHeight = resizeBottom(mousePosition.y - startPos.y + startSize.height, options, currentState.currentPosition).nextHeight;
            }
            if (/top/.test(currentState.direction)) {
                var data = resizeTop(startPos.y - mousePosition.y + startSize.height, currentPos, currentSize, options);
                nextTop = data.nextTop;
                nextHeight = data.nextHeight;
            }
            if (/left/.test(currentState.direction)) {
                var data = resizeLeft(startPos.x - mousePosition.x + startSize.width, currentPos, currentSize, options);
                nextLeft = data.nextLeft;
                nextWidth = data.nextWidth;
            }
            if (options.ratio) {
                var fixedSize = manageRatio({ nextTop: nextTop, nextWidth: nextWidth, nextHeight: nextHeight, nextLeft: nextLeft }, options, currentPos, currentSize, currentState.direction, currentState.currentPosition);
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

var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NgResizableComponent = (function () {
    function NgResizableComponent(_el, _store, _renderer) {
        this._el = _el;
        this._store = _store;
        this._renderer = _renderer;
        // Resize start event.
        this.resizeStart = new _angular_core.EventEmitter();
        // Resizing event.
        this.resizing = new _angular_core.EventEmitter();
        // Resize end event.
        this.resizeEnd = new _angular_core.EventEmitter();
        // Maximum width.
        this.maxWidth = Infinity;
        // Minimum width.
        this.minWidth = 0;
        // Maximum height.
        this.maxHeight = Infinity;
        // Minimum height.
        this.minHeight = 0;
        // Disable the resize.
        this.disableResize = false;
        // An array which contains the resize directions.
        this.directions = ['bottom', 'right'];
        // Resize in a grid.
        this.grid = { width: 1, height: 1 };
        // Bound the resize.
        this.bound = null;
        // Resize ratio.
        this.ratio = null;
    }
    NgResizableComponent.prototype.ngOnInit = function () {
        this._renderer.addClass(this._el.nativeElement, 'ngresizable');
        this._store.addReducer(resizeReducer);
        this.setSize({ width: this.width, height: this.height }, { x: this.x, y: this.y });
    };
    NgResizableComponent.prototype.ngOnChanges = function (c) {
        this.setSize({ width: this.width, height: this.height }, { x: this.x, y: this.y });
    };
    NgResizableComponent.prototype.onMouseMove = function (e) {
        e.preventDefault();
        if (e.touches) {
            e = e.touches[0];
        }
        if (this._state.isResizing) {
            this.emitAction(RESIZE, {
                x: e.clientX,
                y: e.clientY
            });
            var csize = this._state.currentSize;
            var cpos = this._state.currentPosition;
            this.setSize(csize, cpos);
            this.emitEvent(this.resizing);
        }
    };
    NgResizableComponent.prototype.onMouseDown = function (e, dir) {
        if (e.touches) {
            e = e.touches[0];
        }
        this.emitAction(MOUSE_DOWN, {
            x: e.clientX,
            y: e.clientY
        }, {
            x: this._el.nativeElement.offsetLeft,
            y: this._el.nativeElement.offsetTop
        }, {
            width: this._el.nativeElement.offsetWidth,
            height: this._el.nativeElement.offsetHeight
        }, dir);
        this.emitEvent(this.resizeStart);
    };
    NgResizableComponent.prototype.onMouseUp = function (e) {
        this.emitAction(RESIZE_STOP, { x: 0, y: 0 }, { x: 0, y: 0 });
        this.emitEvent(this.resizeEnd);
    };
    NgResizableComponent.prototype.emitAction = function (action, mousePosition, startPosition, startSize, startDirection) {
        var options = {
            minSize: { width: this.minWidth, height: this.minHeight },
            maxSize: { width: this.maxWidth, height: this.maxHeight },
            grid: this.grid,
            ratio: this.ratio,
            disabled: this.disableResize,
            directions: this.directions,
            bound: this.bound || defaultBound
        };
        this._store.emitAction(action, mousePosition, startPosition, options, startSize, startDirection);
    };
    NgResizableComponent.prototype.emitEvent = function (output) {
        output.next({
            position: this._state.currentPosition,
            size: this._state.currentSize,
            direction: this._state.direction
        });
    };
    Object.defineProperty(NgResizableComponent.prototype, "_state", {
        get: function () {
            return this._store.state;
        },
        enumerable: true,
        configurable: true
    });
    NgResizableComponent.prototype.setSize = function (size, pos) {
        this.width = size.width;
        this.height = size.height;
        this.x = pos.x;
        this.y = pos.y;
        this._renderer.setStyle(this._el.nativeElement, 'width', this.width + 'px');
        this._renderer.setStyle(this._el.nativeElement, 'height', this.height + 'px');
        this._renderer.setStyle(this._el.nativeElement, 'left', this.x + 'px');
        this._renderer.setStyle(this._el.nativeElement, 'top', this.y + 'px');
    };
    return NgResizableComponent;
}());
__decorate$1([
    _angular_core.Output(),
    __metadata("design:type", Object)
], NgResizableComponent.prototype, "resizeStart", void 0);
__decorate$1([
    _angular_core.Output(),
    __metadata("design:type", Object)
], NgResizableComponent.prototype, "resizing", void 0);
__decorate$1([
    _angular_core.Output(),
    __metadata("design:type", Object)
], NgResizableComponent.prototype, "resizeEnd", void 0);
__decorate$1([
    _angular_core.Input(),
    __metadata("design:type", Number)
], NgResizableComponent.prototype, "width", void 0);
__decorate$1([
    _angular_core.Input(),
    __metadata("design:type", Number)
], NgResizableComponent.prototype, "height", void 0);
__decorate$1([
    _angular_core.Input(),
    __metadata("design:type", Number)
], NgResizableComponent.prototype, "x", void 0);
__decorate$1([
    _angular_core.Input(),
    __metadata("design:type", Number)
], NgResizableComponent.prototype, "y", void 0);
__decorate$1([
    _angular_core.Input(),
    __metadata("design:type", Object)
], NgResizableComponent.prototype, "maxWidth", void 0);
__decorate$1([
    _angular_core.Input(),
    __metadata("design:type", Object)
], NgResizableComponent.prototype, "minWidth", void 0);
__decorate$1([
    _angular_core.Input(),
    __metadata("design:type", Object)
], NgResizableComponent.prototype, "maxHeight", void 0);
__decorate$1([
    _angular_core.Input(),
    __metadata("design:type", Object)
], NgResizableComponent.prototype, "minHeight", void 0);
__decorate$1([
    _angular_core.Input(),
    __metadata("design:type", Boolean)
], NgResizableComponent.prototype, "disableResize", void 0);
__decorate$1([
    _angular_core.Input(),
    __metadata("design:type", Array)
], NgResizableComponent.prototype, "directions", void 0);
__decorate$1([
    _angular_core.Input(),
    __metadata("design:type", Object)
], NgResizableComponent.prototype, "grid", void 0);
__decorate$1([
    _angular_core.Input(),
    __metadata("design:type", Object)
], NgResizableComponent.prototype, "bound", void 0);
__decorate$1([
    _angular_core.Input(),
    __metadata("design:type", Number)
], NgResizableComponent.prototype, "ratio", void 0);
NgResizableComponent = __decorate$1([
    _angular_core.Component({
        // tslint:disable-next-line
        selector: '[ngResizable]',
        providers: [Store],
        template: "\n    <ng-content></ng-content>\n    <div *ngFor=\"let dir of directions\"\n      class=\"ngr-grabber\" [ngClass]=\"'ngr-' + dir\"\n      (mousedown)=\"onMouseDown($event, dir)\"\n      (touchstart)=\"onMouseDown($event, dir)\">\n    </div>\n  ",
        styles: [".ngr-grabber {\n  position: absolute;\n}\n\n.ngr-grabber.ngr-top, .ngr-grabber.ngr-bottom {\n  cursor: ns-resize;\n  width: 100%;\n  height: 14px;\n}\n\n.ngr-grabber.ngr-left, .ngr-grabber.ngr-right {\n  cursor: ew-resize;\n  width: 14px;\n  height: 100%;\n}\n\n.ngr-grabber.ngr-top::after, .ngr-grabber.ngr-bottom::after,\n.ngr-grabber.ngr-left::after, .ngr-grabber.ngr-right::after,\n.ngr-grabber.ngr-top::before, .ngr-grabber.ngr-bottom::before,\n.ngr-grabber.ngr-left::before, .ngr-grabber.ngr-right::before {\n  content: \"\";\n  position: absolute;\n  z-index: 1;\n}\n\n.ngr-grabber.ngr-top::before, .ngr-grabber.ngr-bottom::before,\n.ngr-grabber.ngr-left::before, .ngr-grabber.ngr-right::before {\n  border-radius: 7px;\n  width: 7px;\n  height: 7px;\n}\n\n.ngr-grabber.ngr-top::after, .ngr-grabber.ngr-bottom::after {\n  width: 100%;\n  height: 2px;\n  top: 50%;\n  left: 0;\n}\n\n.ngr-grabber.ngr-left::after, .ngr-grabber.ngr-right::after {\n  width: 2px;\n  height: 100%;\n  left: 50%;\n}\n\n.ngr-grabber.ngr-top::before, .ngr-grabber.ngr-bottom::before {\n  left: 50%;\n  top: 4px;\n  transform: translateX(-50%);\n}\n\n.ngr-grabber.ngr-left::before, .ngr-grabber.ngr-right::before {\n  top: 50%;\n  left: 4px;\n  transform: translateY(-50%);\n}\n\n.ngr-grabber.ngr-top,\n.ngr-grabber.ngr-bottom {\n  left: 0;\n}\n\n.ngr-grabber.ngr-top {\n  top: -7px;\n}\n\n.ngr-grabber.ngr-bottom {\n  bottom: -7px;\n}\n\n.ngr-grabber.ngr-left,\n.ngr-grabber.ngr-right {\n  top: 0;\n}\n\n.ngr-grabber.ngr-left {\n  left: -7px;\n}\n\n.ngr-grabber.ngr-right {\n  right: -7px;\n}\n\n.ngr-grabber.ngr-top-left, .ngr-grabber.ngr-top-right,\n.ngr-grabber.ngr-bottom-left, .ngr-grabber.ngr-bottom-right {\n  position: absolute;\n  width: 12px;\n  height: 12px;\n  border-radius: 4px;\n  z-index: 1;\n}\n\n.ngr-grabber.ngr-top-left {\n  cursor: nwse-resize;\n  top: -5px;\n  left: -5px;\n}\n\n.ngr-grabber.ngr-top-right {\n  cursor: nesw-resize;\n  top: -5px;\n  right: -5px;\n}\n\n.ngr-grabber.ngr-bottom-left {\n  cursor: nesw-resize;\n  bottom: -5px;\n  left: -5px;\n}\n\n.ngr-grabber.ngr-bottom-right {\n  cursor: nwse-resize;\n  bottom: -5px;\n  right: -5px;\n}\n"],
        // tslint:disable-next-line
        host: {
            '(document: mouseup)': 'onMouseUp($event)',
            '(document: touchend)': 'onMouseUp($event)',
            '(document: mousemove)': 'onMouseMove($event)',
            '(document: touchmove)': 'onMouseMove($event)'
        }
    }),
    __metadata("design:paramtypes", [_angular_core.ElementRef, Store, _angular_core.Renderer2])
], NgResizableComponent);

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.NgResizableModule = (function () {
    function NgResizableModule() {
    }
    return NgResizableModule;
}());
exports.NgResizableModule = __decorate([
    _angular_core.NgModule({
        imports: [_angular_common.CommonModule],
        declarations: [NgResizableComponent],
        exports: [NgResizableComponent]
    })
], exports.NgResizableModule);

Object.defineProperty(exports, '__esModule', { value: true });

})));
