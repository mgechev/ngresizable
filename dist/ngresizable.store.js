"use strict";
;
exports.defaultGrid = {
    width: 1,
    height: 1
};
exports.defaultBound = {
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
exports.Store = Store;
//# sourceMappingURL=ngresizable.store.js.map