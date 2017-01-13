import { Component } from '@angular/core';

@Component({
  selector: 'app',
  template: `
    <div class="demo simple" ngResizable [minWidth]="20" [minHeight]="20">
      Simple demo
    </div> 
    <div class="demo grid" ngResizable [minWidth]="20" [minHeight]="20" [grid]="{ width: 15, height: 15 }">
      Grid
    </div> 
    <div class="demo ratio" ngResizable [ratio]="1" [minWidth]="20" [minHeight]="20">
      Fixed ratio
    </div> 
    <div class="demo directions" ngResizable [directions]="['bottom', 'top', 'left', 'right', 'top-left', 'bottom-left', 'top-right', 'bottom-right']" [minWidth]="20" [minHeight]="20">
      Resize directions
    </div> 
    <div class="demo dots" ngResizable [directions]="['bottom', 'top', 'left', 'right', 'top-left', 'bottom-left', 'top-right', 'bottom-right']" [minWidth]="20" [minHeight]="20">
      Resize handles
    </div>
  `
})
export class DemoComponent {}

