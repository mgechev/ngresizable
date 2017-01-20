import {
  Component,
  ElementRef,
  Renderer,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges
} from '@angular/core';

import {
  Store,
  IPoint,
  IOptions,
  ISize,
  IResizeState,
  IResizeEvent,
  IRectangle,
  defaultBound
} from './ngresizable.store';
import { resizeReducer } from './ngresizable.reducer';
import { MOUSE_DOWN, RESIZE_STOP, RESIZE } from './ngresizable.actions';

@Component({
  // tslint:disable-next-line
  selector: '[ngResizable]',
  providers: [Store],
  moduleId: module.id,
  template: `
    <ng-content></ng-content>
    <div *ngFor="let dir of directions"
      class="ngr-grabber" [ngClass]="'ngr-' + dir"
      (mousedown)="onMouseDown($event, dir)"
      (touchstart)="onMouseDown($event, dir)">
    </div>
  `,
  styles: [`.ngr-grabber {
  position: absolute;
}

.ngr-grabber.ngr-top, .ngr-grabber.ngr-bottom {
  cursor: ns-resize;
  width: 100%;
  height: 14px;
}

.ngr-grabber.ngr-left, .ngr-grabber.ngr-right {
  cursor: ew-resize;
  width: 14px;
  height: 100%;
}

.ngr-grabber.ngr-top::after, .ngr-grabber.ngr-bottom::after,
.ngr-grabber.ngr-left::after, .ngr-grabber.ngr-right::after,
.ngr-grabber.ngr-top::before, .ngr-grabber.ngr-bottom::before,
.ngr-grabber.ngr-left::before, .ngr-grabber.ngr-right::before {
  content: "";
  position: absolute;
  z-index: 1;
}

.ngr-grabber.ngr-top::before, .ngr-grabber.ngr-bottom::before,
.ngr-grabber.ngr-left::before, .ngr-grabber.ngr-right::before {
  border-radius: 7px;
  width: 7px;
  height: 7px;
}

.ngr-grabber.ngr-top::after, .ngr-grabber.ngr-bottom::after {
  width: 100%;
  height: 2px;
  top: 50%;
  left: 0;
}

.ngr-grabber.ngr-left::after, .ngr-grabber.ngr-right::after {
  width: 2px;
  height: 100%;
  left: 50%;
}

.ngr-grabber.ngr-top::before, .ngr-grabber.ngr-bottom::before {
  left: 50%;
  top: 4px;
  transform: translateX(-50%);
}

.ngr-grabber.ngr-left::before, .ngr-grabber.ngr-right::before {
  top: 50%;
  left: 4px;
  transform: translateY(-50%);
}

.ngr-grabber.ngr-top,
.ngr-grabber.ngr-bottom {
  left: 0;
}

.ngr-grabber.ngr-top {
  top: -7px;
}

.ngr-grabber.ngr-bottom {
  bottom: -7px;
}

.ngr-grabber.ngr-left,
.ngr-grabber.ngr-right {
  top: 0;
}

.ngr-grabber.ngr-left {
  left: -7px;
}

.ngr-grabber.ngr-right {
  right: -7px;
}

.ngr-grabber.ngr-top-left, .ngr-grabber.ngr-top-right,
.ngr-grabber.ngr-bottom-left, .ngr-grabber.ngr-bottom-right {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 4px;
  z-index: 1;
}

.ngr-grabber.ngr-top-left {
  cursor: nwse-resize;
  top: -5px;
  left: -5px;
}

.ngr-grabber.ngr-top-right {
  cursor: nesw-resize;
  top: -5px;
  right: -5px;
}

.ngr-grabber.ngr-bottom-left {
  cursor: nesw-resize;
  bottom: -5px;
  left: -5px;
}

.ngr-grabber.ngr-bottom-right {
  cursor: nwse-resize;
  bottom: -5px;
  right: -5px;
}
`],
  // tslint:disable-next-line
  host: {
    '(document: mouseup)': 'onMouseUp($event)',
    '(document: touchend)': 'onMouseUp($event)',
    '(document: mousemove)': 'onMouseMove($event)',
    '(document: touchmove)': 'onMouseMove($event)'
  }
})
export class NgResizableComponent implements OnInit, OnChanges {

  // Resize start event.
  @Output() resizeStart = new EventEmitter<IResizeEvent>();
  // Resizing event.
  @Output() resizing = new EventEmitter<IResizeEvent>();
  // Resize end event.
  @Output() resizeEnd = new EventEmitter<IResizeEvent>();

  // Width of the element.
  @Input() width: number;
  // Height of the element.
  @Input() height: number;
  // x coordinate of the element.
  @Input() x: number;
  // y coordinate of the element.
  @Input() y: number;
  // Maximum width.
  @Input() maxWidth = Infinity;
  // Minimum width.
  @Input() minWidth = 0;
  // Maximum height.
  @Input() maxHeight = Infinity;
  // Minimum height.
  @Input() minHeight = 0;
  // Disable the resize.
  @Input() disableResize: boolean = false;
  // An array which contains the resize directions.
  @Input() directions: string[] = ['bottom', 'right'];
  // Resize in a grid.
  @Input() grid: ISize = { width: 1, height: 1 };
  // Bound the resize.
  @Input() bound: IRectangle = null;
  // Resize ratio.
  @Input() ratio: number = null;

  constructor(private _el: ElementRef, private _store: Store, private _renderer: Renderer) {}

  ngOnInit() {
    this._renderer.setElementClass(this._el.nativeElement, 'ngresizable', true);
    this._store.addReducer(resizeReducer);
    this.setSize(
      { width: this.width, height: this.height },
      { x: this.x, y: this.y }
    );
  }

  ngOnChanges(c: any) {
    this.setSize(
      { width: this.width, height: this.height },
      { x: this.x, y: this.y }
    );
  }

  onMouseMove(e: any) {
    e.preventDefault();
    if (e.touches) {
      e = e.touches[0];
    }
    if (this._state.isResizing) {
      this.emitAction(RESIZE, {
        x: e.clientX,
        y: e.clientY
      });
      const csize = this._state.currentSize;
      const cpos = this._state.currentPosition;
      this.setSize(csize, cpos);
      this.emitEvent(this.resizing);
    }
  }

  onMouseDown(e: any, dir: any) {
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
  }

  onMouseUp(e: any) {
    this.emitAction(RESIZE_STOP, { x: 0, y: 0 }, { x: 0, y: 0 });
    this.emitEvent(this.resizeEnd);
  }

  private emitAction(action: String, mousePosition: IPoint, startPosition?: IPoint, startSize?: ISize, startDirection?: string) {
    const options: IOptions = {
      minSize: { width: this.minWidth, height: this.minHeight },
      maxSize: { width: this.maxWidth, height: this.maxHeight },
      grid: this.grid,
      ratio: this.ratio,
      disabled: this.disableResize,
      directions: this.directions,
      bound: this.bound || defaultBound
    };
    this._store.emitAction(action, mousePosition, startPosition, options, startSize, startDirection);
  }

  private emitEvent(output: EventEmitter<IResizeEvent>) {
    output.next({
      position: this._state.currentPosition,
      size: this._state.currentSize,
      direction: this._state.direction
    });
  }

  private get _state(): IResizeState {
    return this._store.state;
  }

  private setSize(size: ISize, pos: IPoint) {
    this.width = size.width;
    this.height = size.height;
    this.x = pos.x;
    this.y = pos.y;
    this._renderer.setElementStyle(this._el.nativeElement, 'width', this.width + 'px');
    this._renderer.setElementStyle(this._el.nativeElement, 'height', this.height + 'px');
    this._renderer.setElementStyle(this._el.nativeElement, 'left', this.x + 'px');
    this._renderer.setElementStyle(this._el.nativeElement, 'top', this.y + 'px');
  }
}
