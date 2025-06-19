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
var GridView_1 = __importDefault(require("../view/GridView"));
var IndicatorView_1 = __importDefault(require("../view/IndicatorView"));
var CrosshairLineView_1 = __importDefault(require("../view/CrosshairLineView"));
var IndicatorTooltipView_1 = __importDefault(require("../view/IndicatorTooltipView"));
var OverlayView_1 = __importDefault(require("../view/OverlayView"));
var IndicatorWidget = /** @class */ (function (_super) {
    __extends(IndicatorWidget, _super);
    function IndicatorWidget(rootContainer, pane) {
        var _this = _super.call(this, rootContainer, pane) || this;
        _this._gridView = new GridView_1.default(_this);
        _this._indicatorView = new IndicatorView_1.default(_this);
        _this._crosshairLineView = new CrosshairLineView_1.default(_this);
        _this._tooltipView = _this.createTooltipView();
        _this._overlayView = new OverlayView_1.default(_this);
        _this.addChild(_this._tooltipView);
        _this.addChild(_this._overlayView);
        return _this;
    }
    IndicatorWidget.prototype.getName = function () {
        return types_1.WidgetNameConstants.MAIN;
    };
    IndicatorWidget.prototype.updateMain = function (ctx) {
        if (this.getPane().getOptions().state !== 'minimize') {
            this.updateMainContent(ctx);
            this._indicatorView.draw(ctx);
            this._gridView.draw(ctx);
        }
    };
    IndicatorWidget.prototype.createTooltipView = function () {
        return new IndicatorTooltipView_1.default(this);
    };
    IndicatorWidget.prototype.updateMainContent = function (_ctx) {
        // to do it
    };
    IndicatorWidget.prototype.updateOverlayContent = function (_ctx) {
        // to do it
    };
    IndicatorWidget.prototype.updateOverlay = function (ctx) {
        if (this.getPane().getOptions().state !== 'minimize') {
            this._overlayView.draw(ctx);
            this._crosshairLineView.draw(ctx);
            this.updateOverlayContent(ctx);
        }
        this._tooltipView.draw(ctx);
    };
    return IndicatorWidget;
}(DrawWidget_1.default));
exports.default = IndicatorWidget;
//# sourceMappingURL=IndicatorWidget.js.map