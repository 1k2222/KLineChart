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
var View_1 = __importDefault(require("./View"));
var format_1 = require("../common/utils/format");
var CandleHighLowPriceView = /** @class */ (function (_super) {
    __extends(CandleHighLowPriceView, _super);
    function CandleHighLowPriceView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CandleHighLowPriceView.prototype.drawImp = function (ctx) {
        var _a, _b;
        var widget = this.getWidget();
        var pane = widget.getPane();
        var chartStore = pane.getChart().getChartStore();
        var priceMarkStyles = chartStore.getStyles().candle.priceMark;
        var highPriceMarkStyles = priceMarkStyles.high;
        var lowPriceMarkStyles = priceMarkStyles.low;
        if (priceMarkStyles.show && (highPriceMarkStyles.show || lowPriceMarkStyles.show)) {
            var highestLowestPrice = chartStore.getVisibleRangeHighLowPrice();
            var precision = (_b = (_a = chartStore.getSymbol()) === null || _a === void 0 ? void 0 : _a.pricePrecision) !== null && _b !== void 0 ? _b : 2;
            var yAxis = pane.getAxisComponent();
            var _c = highestLowestPrice[0], high = _c.price, highX = _c.x;
            var _d = highestLowestPrice[1], low = _d.price, lowX = _d.x;
            var highY = yAxis.convertToPixel(high);
            var lowY = yAxis.convertToPixel(low);
            var decimalFold = chartStore.getDecimalFold();
            var thousandsSeparator = chartStore.getThousandsSeparator();
            if (highPriceMarkStyles.show && high !== Number.MIN_SAFE_INTEGER) {
                this._drawMark(ctx, decimalFold.format(thousandsSeparator.format((0, format_1.formatPrecision)(high, precision))), { x: highX, y: highY }, highY < lowY ? [-2, -5] : [2, 5], highPriceMarkStyles);
            }
            if (lowPriceMarkStyles.show && low !== Number.MAX_SAFE_INTEGER) {
                this._drawMark(ctx, decimalFold.format(thousandsSeparator.format((0, format_1.formatPrecision)(low, precision))), { x: lowX, y: lowY }, highY < lowY ? [2, 5] : [-2, -5], lowPriceMarkStyles);
            }
        }
    };
    CandleHighLowPriceView.prototype._drawMark = function (ctx, text, coordinate, offsets, styles) {
        var _a, _b, _c;
        var startX = coordinate.x;
        var startY = coordinate.y + offsets[0];
        (_a = this.createFigure({
            name: 'line',
            attrs: {
                coordinates: [
                    { x: startX - 2, y: startY + offsets[0] },
                    { x: startX, y: startY },
                    { x: startX + 2, y: startY + offsets[0] }
                ]
            },
            styles: { color: styles.color }
        })) === null || _a === void 0 ? void 0 : _a.draw(ctx);
        var lineEndX = 0;
        var textStartX = 0;
        var textAlign = 'left';
        var width = this.getWidget().getBounding().width;
        if (startX > width / 2) {
            lineEndX = startX - 5;
            textStartX = lineEndX - styles.textOffset;
            textAlign = 'right';
        }
        else {
            lineEndX = startX + 5;
            textAlign = 'left';
            textStartX = lineEndX + styles.textOffset;
        }
        var y = startY + offsets[1];
        (_b = this.createFigure({
            name: 'line',
            attrs: {
                coordinates: [
                    { x: startX, y: startY },
                    { x: startX, y: y },
                    { x: lineEndX, y: y }
                ]
            },
            styles: { color: styles.color }
        })) === null || _b === void 0 ? void 0 : _b.draw(ctx);
        (_c = this.createFigure({
            name: 'text',
            attrs: {
                x: textStartX,
                y: y,
                text: text,
                align: textAlign,
                baseline: 'middle'
            },
            styles: {
                color: styles.color,
                size: styles.textSize,
                family: styles.textFamily,
                weight: styles.textWeight
            }
        })) === null || _c === void 0 ? void 0 : _c.draw(ctx);
    };
    return CandleHighLowPriceView;
}(View_1.default));
exports.default = CandleHighLowPriceView;
//# sourceMappingURL=CandleHighLowPriceView.js.map