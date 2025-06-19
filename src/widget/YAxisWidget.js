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
var YAxisView_1 = __importDefault(require("../view/YAxisView"));
var CandleLastPriceLabelView_1 = __importDefault(require("../view/CandleLastPriceLabelView"));
var IndicatorLastValueView_1 = __importDefault(require("../view/IndicatorLastValueView"));
var OverlayYAxisView_1 = __importDefault(require("../view/OverlayYAxisView"));
var CrosshairHorizontalLabelView_1 = __importDefault(require("../view/CrosshairHorizontalLabelView"));
var YAxisWidget = /** @class */ (function (_super) {
    __extends(YAxisWidget, _super);
    function YAxisWidget(rootContainer, pane) {
        var _this = _super.call(this, rootContainer, pane) || this;
        _this._yAxisView = new YAxisView_1.default(_this);
        _this._candleLastPriceLabelView = new CandleLastPriceLabelView_1.default(_this);
        _this._indicatorLastValueView = new IndicatorLastValueView_1.default(_this);
        _this._overlayYAxisView = new OverlayYAxisView_1.default(_this);
        _this._crosshairHorizontalLabelView = new CrosshairHorizontalLabelView_1.default(_this);
        _this.setCursor('ns-resize');
        _this.addChild(_this._overlayYAxisView);
        return _this;
    }
    YAxisWidget.prototype.getName = function () {
        return types_1.WidgetNameConstants.Y_AXIS;
    };
    YAxisWidget.prototype.updateMain = function (ctx) {
        var minimize = this.getPane().getOptions().state === 'minimize';
        this._yAxisView.draw(ctx, minimize);
        if (!minimize) {
            if (this.getPane().getAxisComponent().isInCandle()) {
                this._candleLastPriceLabelView.draw(ctx);
            }
            this._indicatorLastValueView.draw(ctx);
        }
    };
    YAxisWidget.prototype.updateOverlay = function (ctx) {
        if (this.getPane().getOptions().state !== 'minimize') {
            this._overlayYAxisView.draw(ctx);
            this._crosshairHorizontalLabelView.draw(ctx);
        }
    };
    return YAxisWidget;
}(DrawWidget_1.default));
exports.default = YAxisWidget;
//# sourceMappingURL=YAxisWidget.js.map