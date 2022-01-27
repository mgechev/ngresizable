# Angular Resizable

Simple, tree-shakable, AoT, Universal and Web Worker friendly resizable component for Angular (12 and beyond).

(Earlier versions are available).

Supports the following values of the `position` CSS property:

- `absolute`.
- `relative`.

# Forked from

https://github.com/mgechev/ngresizable


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


# This fork

Version 1.0.1:  original package
Version 2.0.2:  Upgrade ngresizable from Angular 4 to Angular 12, and change it to only listen for mousemove while dragging
Version 2.0.3:  rename from ngresizable back to ngresizable


# How to add to your application

copy the tarball file from dist/ngresizable/ to an appropriate subfolder of your application.
Then install using npm as normal.
e.g. npm install .\mysubfolder\ngresizable-2.0.0.tgz


# How to update the code and create a new tarball

Increment version number in projects/ngresizable/src/package.json.
Update as necessary.
Use ng test and ng lint to check it works.  (There may be existing lint warnings, which you can ignore.)
Build it:  ng build  
Navigate to dist folder and create a new tarball:
  cd dist/ngresizable
	npm pack
Commit the updates, including dist folder and tarball


# License

MIT

