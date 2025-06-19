"use strict";
/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("./types");
var DrawWidget_1 = __importDefault(require("./DrawWidget"));
var XAxisView_1 = __importDefault(require("../view/XAxisView"));
var OverlayXAxisView_1 = __importDefault(require("../view/OverlayXAxisView"));
var CrosshairVerticalLabelView_1 = __importDefault(require("../view/CrosshairVerticalLabelView"));
var XAxisWidget = /** @class */ (function (_super) {
    __extends(XAxisWidget, _super);
    function XAxisWidget(rootContainer, pane) {
        var _this = _super.call(this, rootContainer, pane) || this;
        _this._xAxisView = new XAxisView_1.default(_this);
        _this._overlayXAxisView = new OverlayXAxisView_1.default(_this);
        _this._crosshairVerticalLabelView = new CrosshairVerticalLabelView_1.default(_this);
        _this.setCursor('ew-resize');
        _this.addChild(_this._overlayXAxisView);
        return _this;
    }
    XAxisWidget.prototype.getName = function () {
        return types_1.WidgetNameConstants.X_AXIS;
    };
    XAxisWidget.prototype.updateMain = function (ctx) {
        this._xAxisView.draw(ctx);
    };
    XAxisWidget.prototype.updateOverlay = function (ctx) {
        this._overlayXAxisView.draw(ctx);
        this._crosshairVerticalLabelView.draw(ctx);
    };
    return XAxisWidget;
}(DrawWidget_1.default));
exports.default = XAxisWidget;
//# sourceMappingURL=XAxisWidget.js.map