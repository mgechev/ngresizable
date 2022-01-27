import {
  Component,
  ElementRef,
  Renderer2,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  HostListener
} from '@angular/core';

import {
  Store,
  IPoint,
  IOptions,
  ISize,
  IResizeState,
  IResizeEvent,
  IRectangle,
  defaultBound,
  IUndefinedSize,
  IUndefinedPoint
} from './ngresizable.store';
import { resizeReducer } from './ngresizable.reducer';
import { MOUSE_DOWN, RESIZE_STOP, RESIZE } from './ngresizable.actions';

@Component({
  selector: '[ngResizable]',
  providers: [Store],
  template: `
    <ng-content></ng-content>
    <div *ngFor="let dir of directions"
      class="ngr-grabber" [ngClass]="'ngr-' + dir"
      (mousedown)="onMouseDown($event, dir)"
      (touchstart)="onMouseDown($event, dir)">
    </div>
  `,
  styleUrls: ['ngresizable.component.css'],
})
export class NgResizableComponent implements OnInit, OnChanges {

  // Resize start event.
  @Output() resizeStart = new EventEmitter<IResizeEvent>();
  // Resizing event.
  @Output() resizing = new EventEmitter<IResizeEvent>();
  // Resize end event.
  @Output() resizeEnd = new EventEmitter<IResizeEvent>();

  // Width of the element.
  @Input() width: number|undefined;
  // Height of the element.
  @Input() height: number|undefined;
  // x coordinate of the element.
  @Input() x: number|undefined;
  // y coordinate of the element.
  @Input() y: number|undefined;
  // Maximum width.
  @Input() maxWidth = Infinity;
  // Minimum width.
  @Input() minWidth = 0;
  // Maximum height.
  @Input() maxHeight = Infinity;
  // Minimum height.
  @Input() minHeight = 0;
  // Disable the resize.
  @Input() disableResize: boolean = false; // eslint-disable-line @typescript-eslint/no-inferrable-types
  // An array which contains the resize directions.
  @Input() directions: string[] = ['bottom', 'right'];
  // Resize in a grid.
  @Input() grid: ISize = { width: 1, height: 1 };
  // Bound the resize.
  @Input() bound: IRectangle = defaultBound;
  // Resize ratio.
  @Input() ratio: number = 0; // eslint-disable-line @typescript-eslint/no-inferrable-types

  private removeMouseMoveListener:() => void = () => {}; /* eslint-disable-line @typescript-eslint/no-empty-function */
  private removeTouchMoveListener:() => void = () => {}; /* eslint-disable-line @typescript-eslint/no-empty-function */

  constructor(private _el: ElementRef, private _store: Store, private _renderer: Renderer2) {
  }

  ngOnInit() {
    this._renderer.addClass(this._el.nativeElement, 'ngresizable');
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
    this.removeMouseMoveListener = this._renderer.listen('document', 'mousemove', (mouseEvent) => this.onMouseMove(mouseEvent));
    this.removeTouchMoveListener = this._renderer.listen('document', 'touchmove', (mouseEvent) => this.onMouseMove(mouseEvent));

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

  @HostListener('document: mouseup')
  @HostListener('document: touchend')
  onMouseUp(e: any) {
    this.removeMouseMoveListener();
    this.removeTouchMoveListener();
    this.emitAction(RESIZE_STOP, { x: 0, y: 0 }, { x: 0, y: 0 });
    this.emitEvent(this.resizeEnd);
  }

  private emitAction(action: string, mousePosition: IPoint, startPosition?: IPoint, startSize?: ISize, startDirection?: string) {
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

  private setSize(size: ISize | IUndefinedSize, pos: IPoint|IUndefinedPoint) {
    if (size.width) {
      this.width = size.width;
      this._renderer.setStyle(this._el.nativeElement, 'width', this.width.toString() + 'px');
    }
    if (size.height) {
      this.height = size.height;
      this._renderer.setStyle(this._el.nativeElement, 'height', this.height.toString() + 'px');
    }
    if (pos.x) {
      this.x = pos.x;
      this._renderer.setStyle(this._el.nativeElement, 'left', this.x.toString() + 'px');
    }
    if (pos.x) {
      this.y = pos.y;
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      this._renderer.setStyle(this._el.nativeElement, 'top', this.y + 'px');
    }
  }
}
