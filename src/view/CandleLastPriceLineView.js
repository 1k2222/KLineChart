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
var typeChecks_1 = require("../common/utils/typeChecks");
var View_1 = __importDefault(require("./View"));
var CandleLastPriceView = /** @class */ (function (_super) {
    __extends(CandleLastPriceView, _super);
    function CandleLastPriceView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CandleLastPriceView.prototype.drawImp = function (ctx) {
        var _a, _b, _c;
        var widget = this.getWidget();
        var pane = widget.getPane();
        var bounding = widget.getBounding();
        var chartStore = pane.getChart().getChartStore();
        var priceMarkStyles = chartStore.getStyles().candle.priceMark;
        var lastPriceMarkStyles = priceMarkStyles.last;
        var lastPriceMarkLineStyles = lastPriceMarkStyles.line;
        if (priceMarkStyles.show && lastPriceMarkStyles.show && lastPriceMarkLineStyles.show) {
            var yAxis = pane.getAxisComponent();
            var dataList = chartStore.getDataList();
            var data = dataList[dataList.length - 1];
            if ((0, typeChecks_1.isValid)(data)) {
                var close_1 = data.close, open_1 = data.open;
                var comparePrice = lastPriceMarkStyles.compareRule === 'current_open' ? open_1 : ((_b = (_a = dataList[dataList.length - 2]) === null || _a === void 0 ? void 0 : _a.close) !== null && _b !== void 0 ? _b : close_1);
                var priceY = yAxis.convertToNicePixel(close_1);
                var color = '';
                if (close_1 > comparePrice) {
                    color = lastPriceMarkStyles.upColor;
                }
                else if (close_1 < comparePrice) {
                    color = lastPriceMarkStyles.downColor;
                }
                else {
                    color = lastPriceMarkStyles.noChangeColor;
                }
                (_c = this.createFigure({
                    name: 'line',
                    attrs: {
                        coordinates: [
                            { x: 0, y: priceY },
                            { x: bounding.width, y: priceY }
                        ]
                    },
                    styles: {
                        style: lastPriceMarkLineStyles.style,
                        color: color,
                        size: lastPriceMarkLineStyles.size,
                        dashedValue: lastPriceMarkLineStyles.dashedValue
                    }
                })) === null || _c === void 0 ? void 0 : _c.draw(ctx);
            }
        }
    };
    return CandleLastPriceView;
}(View_1.default));
exports.default = CandleLastPriceView;
//# sourceMappingURL=CandleLastPriceLineView.js.map