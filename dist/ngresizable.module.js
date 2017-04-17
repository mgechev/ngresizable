"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var ngresizable_component_1 = require("./ngresizable.component");
var NgResizableModule = (function () {
    function NgResizableModule() {
    }
    return NgResizableModule;
}());
NgResizableModule.decorators = [
    { type: core_1.NgModule, args: [{
                imports: [common_1.CommonModule],
                declarations: [ngresizable_component_1.NgResizableComponent],
                exports: [ngresizable_component_1.NgResizableComponent]
            },] },
];
/** @nocollapse */
NgResizableModule.ctorParameters = function () { return []; };
exports.NgResizableModule = NgResizableModule;
//# sourceMappingURL=ngresizable.module.js.map