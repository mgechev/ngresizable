"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var DemoComponent = (function () {
    function DemoComponent() {
    }
    return DemoComponent;
}());
DemoComponent = __decorate([
    core_1.Component({
        selector: 'app',
        template: "\n    <div class=\"demo simple\" ngResizable [minWidth]=\"20\" [minHeight]=\"20\">\n      Simple demo\n    </div> \n    <div class=\"demo grid\" ngResizable [minWidth]=\"20\" [minHeight]=\"20\" [grid]=\"{ width: 15, height: 15 }\">\n      Grid\n    </div> \n    <div class=\"demo ratio\" ngResizable [ratio]=\"1\" [minWidth]=\"20\" [minHeight]=\"20\">\n      Fixed ratio\n    </div> \n    <div class=\"demo directions\" ngResizable [directions]=\"['bottom', 'top', 'left', 'right', 'top-left', 'bottom-left', 'top-right', 'bottom-right']\" [minWidth]=\"20\" [minHeight]=\"20\">\n      Resize directions\n    </div> \n    <div class=\"demo dots\" ngResizable [directions]=\"['bottom', 'top', 'left', 'right', 'top-left', 'bottom-left', 'top-right', 'bottom-right']\" [minWidth]=\"20\" [minHeight]=\"20\">\n      Resize handles\n    </div>\n  "
    }),
    __metadata("design:paramtypes", [])
], DemoComponent);
exports.DemoComponent = DemoComponent;
//# sourceMappingURL=demo.component.js.map