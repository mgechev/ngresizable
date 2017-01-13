"use strict";
var ngresizable_actions_1 = require("./ngresizable.actions");
var ngresizable_utils_1 = require("./ngresizable.utils");
// DANGER
// Mutates the state instead of creating
// a new one. This is not a traditional
// reducer and respectivly not a pure
// implementation of the redux pattern.
// This separation aims better testability,
// separation of concerns, less dependencies
// and higher performance.
exports.resizeReducer = function (currentState, action, mousePosition, startPosition, options, initialSize, initialResizeDir) {
    if (options.disabled) {
        return currentState;
    }
    var startPos = currentState.startPosition;
    var startSize = currentState.startSize;
    var currentSize = currentState.currentSize;
    var currentPos = currentState.currentPosition;
    switch (action) {
        case ngresizable_actions_1.MOUSE_DOWN:
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
        case ngresizable_actions_1.RESIZE:
            if (!currentState.isResizing) {
                return currentState;
            }
            var nextWidth = currentSize.width;
            var nextHeight = currentSize.height;
            var nextLeft = currentPos.x;
            var nextTop = currentPos.y;
            if (/right/.test(currentState.direction)) {
                nextWidth = ngresizable_utils_1.resizeRight(mousePosition.x - startPos.x + startSize.width, options, currentState.currentPosition).nextWidth;
            }
            if (/bottom/.test(currentState.direction)) {
                nextHeight = ngresizable_utils_1.resizeBottom(mousePosition.y - startPos.y + startSize.height, options, currentState.currentPosition).nextHeight;
            }
            if (/top/.test(currentState.direction)) {
                var data = ngresizable_utils_1.resizeTop(startPos.y - mousePosition.y + startSize.height, currentPos, currentSize, options);
                nextTop = data.nextTop;
                nextHeight = data.nextHeight;
            }
            if (/left/.test(currentState.direction)) {
                var data = ngresizable_utils_1.resizeLeft(startPos.x - mousePosition.x + startSize.width, currentPos, currentSize, options);
                nextLeft = data.nextLeft;
                nextWidth = data.nextWidth;
            }
            if (options.ratio) {
                var fixedSize = ngresizable_utils_1.manageRatio({ nextTop: nextTop, nextWidth: nextWidth, nextHeight: nextHeight, nextLeft: nextLeft }, options, currentPos, currentSize, currentState.direction, currentState.currentPosition);
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
        case ngresizable_actions_1.RESIZE_STOP:
            currentState.isResizing = false;
            startSize.width = currentSize.width;
            startSize.height = currentSize.height;
            break;
    }
    return currentState;
};
//# sourceMappingURL=ngresizable.reducer.js.map