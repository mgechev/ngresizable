"use strict";
exports.resizeRight = function (nextWidth, options, currentElementPosition) {
    if (nextWidth <= options.minSize.width)
        nextWidth = options.minSize.width;
    if (nextWidth >= options.maxSize.width)
        nextWidth = options.maxSize.width;
    if (nextWidth + currentElementPosition.x >= options.bound.x + options.bound.width)
        nextWidth -= (nextWidth + currentElementPosition.x) - (options.bound.x + options.bound.width);
    return { nextWidth: nextWidth, nextLeft: currentElementPosition.x };
};
exports.resizeBottom = function (nextHeight, options, currentElementPosition) {
    if (nextHeight <= options.minSize.height)
        nextHeight = options.minSize.height;
    if (nextHeight >= options.maxSize.height)
        nextHeight = options.maxSize.height;
    if (nextHeight + currentElementPosition.y >= options.bound.y + options.bound.height)
        nextHeight -= (nextHeight + currentElementPosition.y) - (options.bound.y + options.bound.height);
    return { nextHeight: nextHeight, nextTop: currentElementPosition.y };
};
exports.resizeTop = function (nextHeight, currentPos, currentSize, options) {
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
exports.resizeLeft = function (nextWidth, currentPos, currentSize, options) {
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
exports.manageRatio = function (_a, options, currentPos, currentSize, direction, currentElementPosition) {
    var nextWidth = _a.nextWidth, nextHeight = _a.nextHeight, nextTop = _a.nextTop, nextLeft = _a.nextLeft;
    var data;
    var bound = options.bound;
    bound.x = parseInt(bound.x.toFixed());
    bound.y = parseInt(bound.y.toFixed());
    bound.width = parseInt(bound.width.toFixed());
    bound.height = parseInt(bound.height.toFixed());
    switch (direction) {
        case 'left':
            nextHeight = exports.resizeBottom(options.ratio * nextWidth, options, currentElementPosition).nextHeight;
            nextLeft += nextWidth - (nextHeight / options.ratio);
            nextWidth = nextHeight / options.ratio;
            break;
        case 'right':
            nextHeight = exports.resizeBottom(options.ratio * nextWidth, options, currentElementPosition).nextHeight;
            nextWidth = nextHeight / options.ratio;
            break;
        case 'top':
            nextWidth = exports.resizeRight(nextHeight / options.ratio, options, currentElementPosition).nextWidth;
            nextTop += nextHeight - (nextWidth * options.ratio);
            nextHeight = options.ratio * nextWidth;
            break;
        case 'bottom':
        case 'bottom-right':
            nextWidth = exports.resizeRight(nextHeight / options.ratio, options, currentElementPosition).nextWidth;
            nextHeight = options.ratio * nextWidth;
            break;
        case 'top-left':
            data = exports.resizeLeft(nextHeight / options.ratio, currentPos, currentSize, options);
            nextWidth = data.nextWidth;
            nextLeft = data.nextLeft;
            if (nextWidth < nextHeight / options.ratio) {
                nextTop += nextHeight - (nextWidth * options.ratio);
                nextHeight = nextWidth * options.ratio;
            }
            break;
        case 'bottom-left':
            data = exports.resizeLeft(nextHeight / options.ratio, currentPos, currentSize, options);
            nextWidth = data.nextWidth;
            nextLeft = data.nextLeft;
            if (nextWidth < nextHeight / options.ratio) {
                nextHeight = nextWidth * options.ratio;
            }
            break;
        case 'top-right':
            data = exports.resizeRight(nextHeight / options.ratio, options, currentElementPosition);
            nextWidth = data.nextWidth;
            if (nextWidth < nextHeight / options.ratio) {
                nextTop += nextHeight - (nextWidth * options.ratio);
                nextHeight = nextWidth * options.ratio;
            }
            break;
    }
    return { nextWidth: nextWidth, nextHeight: nextHeight, nextTop: nextTop, nextLeft: nextLeft };
};
//# sourceMappingURL=ngresizable.utils.js.map