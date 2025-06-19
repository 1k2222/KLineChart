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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var typeChecks_1 = require("../common/utils/typeChecks");
var canvas_1 = require("../common/utils/canvas");
var View_1 = __importDefault(require("./View"));
var CandleLastPriceLabelView = /** @class */ (function (_super) {
    __extends(CandleLastPriceLabelView, _super);
    function CandleLastPriceLabelView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CandleLastPriceLabelView.prototype.drawImp = function (ctx) {
        var _this = this;
        var _a, _b, _c, _d;
        var widget = this.getWidget();
        var pane = widget.getPane();
        var bounding = widget.getBounding();
        var chartStore = pane.getChart().getChartStore();
        var priceMarkStyles = chartStore.getStyles().candle.priceMark;
        var lastPriceMarkStyles = priceMarkStyles.last;
        var lastPriceMarkTextStyles = lastPriceMarkStyles.text;
        if (priceMarkStyles.show && lastPriceMarkStyles.show && lastPriceMarkTextStyles.show) {
            var precision = (_b = (_a = chartStore.getSymbol()) === null || _a === void 0 ? void 0 : _a.pricePrecision) !== null && _b !== void 0 ? _b : 2;
            var yAxis = pane.getAxisComponent();
            var dataList = chartStore.getDataList();
            var data_1 = dataList[dataList.length - 1];
            if ((0, typeChecks_1.isValid)(data_1)) {
                var close_1 = data_1.close, open_1 = data_1.open;
                var comparePrice = lastPriceMarkStyles.compareRule === 'current_open' ? open_1 : ((_d = (_c = dataList[dataList.length - 2]) === null || _c === void 0 ? void 0 : _c.close) !== null && _d !== void 0 ? _d : close_1);
                var priceY = yAxis.convertToNicePixel(close_1);
                var backgroundColor_1 = '';
                if (close_1 > comparePrice) {
                    backgroundColor_1 = lastPriceMarkStyles.upColor;
                }
                else if (close_1 < comparePrice) {
                    backgroundColor_1 = lastPriceMarkStyles.downColor;
                }
                else {
                    backgroundColor_1 = lastPriceMarkStyles.noChangeColor;
                }
                var x_1 = 0;
                var textAlgin_1 = 'left';
                if (yAxis.isFromZero()) {
                    x_1 = 0;
                    textAlgin_1 = 'left';
                }
                else {
                    x_1 = bounding.width;
                    textAlgin_1 = 'right';
                }
                var textFigures_1 = [];
                var yAxisRange = yAxis.getRange();
                var priceText = yAxis.displayValueToText(yAxis.realValueToDisplayValue(yAxis.valueToRealValue(close_1, { range: yAxisRange }), { range: yAxisRange }), precision);
                priceText = chartStore.getDecimalFold().format(chartStore.getThousandsSeparator().format(priceText));
                var paddingLeft = lastPriceMarkTextStyles.paddingLeft, paddingRight = lastPriceMarkTextStyles.paddingRight, paddingTop = lastPriceMarkTextStyles.paddingTop, paddingBottom = lastPriceMarkTextStyles.paddingBottom, size = lastPriceMarkTextStyles.size, family = lastPriceMarkTextStyles.family, weight = lastPriceMarkTextStyles.weight;
                var textWidth_1 = paddingLeft + (0, canvas_1.calcTextWidth)(priceText, size, weight, family) + paddingRight;
                var priceTextHeight = paddingTop + size + paddingBottom;
                textFigures_1.push({
                    name: 'text',
                    attrs: {
                        x: x_1,
                        y: priceY,
                        width: textWidth_1,
                        height: priceTextHeight,
                        text: priceText,
                        align: textAlgin_1,
                        baseline: 'middle'
                    },
                    styles: __assign(__assign({}, lastPriceMarkTextStyles), { backgroundColor: backgroundColor_1 })
                });
                var formatExtendText_1 = chartStore.getInnerFormatter().formatExtendText;
                var priceTextHalfHeight = size / 2;
                var aboveY_1 = priceY - priceTextHalfHeight - paddingTop;
                var belowY_1 = priceY + priceTextHalfHeight + paddingBottom;
                lastPriceMarkStyles.extendTexts.forEach(function (item, index) {
                    var text = formatExtendText_1({ type: 'last_price', data: data_1, index: index });
                    if (text.length > 0 && item.show) {
                        var textHalfHeight = item.size / 2;
                        var textY = 0;
                        if (item.position === 'above_price') {
                            aboveY_1 -= (item.paddingBottom + textHalfHeight);
                            textY = aboveY_1;
                            aboveY_1 -= (textHalfHeight + item.paddingTop);
                        }
                        else {
                            belowY_1 += (item.paddingTop + textHalfHeight);
                            textY = belowY_1;
                            belowY_1 += (textHalfHeight + item.paddingBottom);
                        }
                        textWidth_1 = Math.max(textWidth_1, item.paddingLeft + (0, canvas_1.calcTextWidth)(text, item.size, item.weight, item.family) + item.paddingRight);
                        textFigures_1.push({
                            name: 'text',
                            attrs: {
                                x: x_1,
                                y: textY,
                                width: textWidth_1,
                                height: item.paddingTop + item.size + item.paddingBottom,
                                text: text,
                                align: textAlgin_1,
                                baseline: 'middle'
                            },
                            styles: __assign(__assign({}, item), { backgroundColor: backgroundColor_1 })
                        });
                    }
                });
                textFigures_1.forEach(function (figure) {
                    var _a;
                    figure.attrs.width = textWidth_1;
                    (_a = _this.createFigure(figure)) === null || _a === void 0 ? void 0 : _a.draw(ctx);
                });
            }
        }
    };
    return CandleLastPriceLabelView;
}(View_1.default));
exports.default = CandleLastPriceLabelView;
//# sourceMappingURL=CandleLastPriceLabelView.js.map