[![Build Status](https://travis-ci.org/mgechev/ngresizable.svg?branch=master)](https://travis-ci.org/mgechev/ngresizable)

# Angular Resizable

Simple, tree-shakable, AoT, Universal and Web Worker friendly resizable component for Angular (2 and beyond).

# How to use?

```
$ npm i ngresizable --save
```

# API

## Outputs

  - `resizeStart: EventEmitter<IResizeEvent>` - Resize start event.
  - `resizing: EventEmitter<IResizeEvent>` - Resizing event.
  - `resizeEnd: EventEmitter<IResizeEvent>` - Resize end event.

## Inputs

  - `width` - Width of the element number.
  - `height: number` - Height of the element.
  - `x: number` - x coordinate of the element.
  - `y: number` - y coordinate of the element.
  - `maxWidth: number` - Maximum width. Default `Infinity`.
  - `minWidth: number` - Minimum width. Default `0`.
  - `maxHeight: number` - Maximum height. Default `Infinity`.
  - `minHeight: number` - Minimum height. Default `0`.
  - `disableResize: boolean = false` - Disable the resize.
  - `directions: string[]` - An array which contains the resize directions. Default `['bottom', 'right']`.
  - `grid: ISize` - Resize in a grid. Default `{ width: 1, height: 1 }`.
  - `bound: IRectangle` - Bound the resize.
  - `ratio: number` - Resize ratio.

# Integration

Should work out of the box with webpack, respectively angular-cli. All you need to do is to include `NgResizableModule`:

```ts
import { NgResizableModule } from 'ngresizable';

@NgModule({
  imports: [NgResizableModule],
  ...
})
class AppModule {}
```

## Angular Seed

```ts
// tools/config/project.ts

...
// Add packages (e.g. ngresizable)
let additionalPackages: ExtendPackages[] = [{
  name: 'ngresizable',
  path: 'node_modules/ngresizable/ngresizable.bundle.js'
}];

this.addPackagesBundles(additionalPackages);
...
```

# License

MIT

