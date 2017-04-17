var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ElementRef, Renderer2, Input, Output, EventEmitter } from '@angular/core';
import { Store, defaultBound } from './ngresizable.store';
import { resizeReducer } from './ngresizable.reducer';
import { MOUSE_DOWN, RESIZE_STOP, RESIZE } from './ngresizable.actions';
var NgResizableComponent = (function () {
    function NgResizableComponent(_el, _store, _renderer) {
        this._el = _el;
        this._store = _store;
        this._renderer = _renderer;
        // Resize start event.
        this.resizeStart = new EventEmitter();
        // Resizing event.
        this.resizing = new EventEmitter();
        // Resize end event.
        this.resizeEnd = new EventEmitter();
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
__decorate([
    Output(),
    __metadata("design:type", Object)
], NgResizableComponent.prototype, "resizeStart", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], NgResizableComponent.prototype, "resizing", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], NgResizableComponent.prototype, "resizeEnd", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], NgResizableComponent.prototype, "width", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], NgResizableComponent.prototype, "height", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], NgResizableComponent.prototype, "x", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], NgResizableComponent.prototype, "y", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], NgResizableComponent.prototype, "maxWidth", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], NgResizableComponent.prototype, "minWidth", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], NgResizableComponent.prototype, "maxHeight", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], NgResizableComponent.prototype, "minHeight", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], NgResizableComponent.prototype, "disableResize", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], NgResizableComponent.prototype, "directions", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], NgResizableComponent.prototype, "grid", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], NgResizableComponent.prototype, "bound", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], NgResizableComponent.prototype, "ratio", void 0);
NgResizableComponent = __decorate([
    Component({
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
    __metadata("design:paramtypes", [ElementRef, Store, Renderer2])
], NgResizableComponent);
export { NgResizableComponent };
//# sourceMappingURL=ngresizable.component.js.map