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
var IndicatorWidget_1 = __importDefault(require("./IndicatorWidget"));
var CandleBarView_1 = __importDefault(require("../view/CandleBarView"));
var CandleAreaView_1 = __importDefault(require("../view/CandleAreaView"));
var CandleHighLowPriceView_1 = __importDefault(require("../view/CandleHighLowPriceView"));
var CandleLastPriceLineView_1 = __importDefault(require("../view/CandleLastPriceLineView"));
var CandleTooltipView_1 = __importDefault(require("../view/CandleTooltipView"));
var CrosshairFeatureView_1 = __importDefault(require("../view/CrosshairFeatureView"));
var CandleWidget = /** @class */ (function (_super) {
    __extends(CandleWidget, _super);
    function CandleWidget(rootContainer, pane) {
        var _this = _super.call(this, rootContainer, pane) || this;
        _this._candleBarView = new CandleBarView_1.default(_this);
        _this._candleAreaView = new CandleAreaView_1.default(_this);
        _this._candleHighLowPriceView = new CandleHighLowPriceView_1.default(_this);
        _this._candleLastPriceLineView = new CandleLastPriceLineView_1.default(_this);
        _this._crosshairFeatureView = new CrosshairFeatureView_1.default(_this);
        _this.addChild(_this._candleBarView);
        _this.addChild(_this._crosshairFeatureView);
        return _this;
    }
    CandleWidget.prototype.updateMainContent = function (ctx) {
        var candleStyles = this.getPane().getChart().getStyles().candle;
        if (candleStyles.type !== 'area') {
            this._candleBarView.draw(ctx);
            this._candleHighLowPriceView.draw(ctx);
            this._candleAreaView.stopAnimation();
        }
        else {
            this._candleAreaView.draw(ctx);
        }
        this._candleLastPriceLineView.draw(ctx);
    };
    CandleWidget.prototype.updateOverlayContent = function (ctx) {
        this._crosshairFeatureView.draw(ctx);
    };
    CandleWidget.prototype.createTooltipView = function () {
        return new CandleTooltipView_1.default(this);
    };
    return CandleWidget;
}(IndicatorWidget_1.default));
exports.default = CandleWidget;
//# sourceMappingURL=CandleWidget.js.map