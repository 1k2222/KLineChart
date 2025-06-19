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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var typeChecks_1 = require("../common/utils/typeChecks");
var number_1 = require("../common/utils/number");
var canvas_1 = require("../common/utils/canvas");
var format_1 = require("../common/utils/format");
var Axis_1 = __importDefault(require("./Axis"));
var types_1 = require("../pane/types");
var TICK_COUNT = 8;
var YAxisImp = /** @class */ (function (_super) {
    __extends(YAxisImp, _super);
    function YAxisImp(parent, yAxis) {
        var _this = _super.call(this, parent) || this;
        _this.reverse = false;
        _this.inside = false;
        _this.position = 'right';
        _this.gap = {
            top: 0.2,
            bottom: 0.1
        };
        _this.createRange = function (params) { return params.defaultRange; };
        _this.minSpan = function (precision) { return (0, number_1.index10)(-precision); };
        _this.valueToRealValue = function (value) { return value; };
        _this.realValueToDisplayValue = function (value) { return value; };
        _this.displayValueToRealValue = function (value) { return value; };
        _this.realValueToValue = function (value) { return value; };
        _this.displayValueToText = function (value, precision) { return (0, format_1.formatPrecision)(value, precision); };
        _this.override(yAxis);
        return _this;
    }
    YAxisImp.prototype.override = function (yAxis) {
        var name = yAxis.name, gap = yAxis.gap, others = __rest(yAxis, ["name", "gap"]);
        if (!(0, typeChecks_1.isString)(this.name)) {
            this.name = name;
        }
        (0, typeChecks_1.merge)(this.gap, gap);
        (0, typeChecks_1.merge)(this, others);
    };
    YAxisImp.prototype.createRangeImp = function () {
        var _a, _b;
        var parent = this.getParent();
        var chart = parent.getChart();
        var chartStore = chart.getChartStore();
        var paneId = parent.getId();
        var min = Number.MAX_SAFE_INTEGER;
        var max = Number.MIN_SAFE_INTEGER;
        var shouldOhlc = false;
        var specifyMin = Number.MAX_SAFE_INTEGER;
        var specifyMax = Number.MIN_SAFE_INTEGER;
        var indicatorPrecision = Number.MAX_SAFE_INTEGER;
        var indicators = chartStore.getIndicatorsByPaneId(paneId);
        indicators.forEach(function (indicator) {
            shouldOhlc || (shouldOhlc = indicator.shouldOhlc);
            indicatorPrecision = Math.min(indicatorPrecision, indicator.precision);
            if ((0, typeChecks_1.isNumber)(indicator.minValue)) {
                specifyMin = Math.min(specifyMin, indicator.minValue);
            }
            if ((0, typeChecks_1.isNumber)(indicator.maxValue)) {
                specifyMax = Math.max(specifyMax, indicator.maxValue);
            }
        });
        var precision = 4;
        var inCandle = this.isInCandle();
        if (inCandle) {
            var pricePrecision = (_b = (_a = chartStore.getSymbol()) === null || _a === void 0 ? void 0 : _a.pricePrecision) !== null && _b !== void 0 ? _b : 2;
            if (indicatorPrecision !== Number.MAX_SAFE_INTEGER) {
                precision = Math.min(indicatorPrecision, pricePrecision);
            }
            else {
                precision = pricePrecision;
            }
        }
        else {
            if (indicatorPrecision !== Number.MAX_SAFE_INTEGER) {
                precision = indicatorPrecision;
            }
        }
        var visibleRangeDataList = chartStore.getVisibleRangeDataList();
        var candleStyles = chart.getStyles().candle;
        var isArea = candleStyles.type === 'area';
        var areaValueKey = candleStyles.area.value;
        var shouldCompareHighLow = (inCandle && !isArea) || (!inCandle && shouldOhlc);
        visibleRangeDataList.forEach(function (visibleData) {
            var dataIndex = visibleData.dataIndex;
            var data = visibleData.data.current;
            if ((0, typeChecks_1.isValid)(data)) {
                if (shouldCompareHighLow) {
                    min = Math.min(min, data.low);
                    max = Math.max(max, data.high);
                }
                if (inCandle && isArea) {
                    var value = data[areaValueKey];
                    if ((0, typeChecks_1.isNumber)(value)) {
                        min = Math.min(min, value);
                        max = Math.max(max, value);
                    }
                }
            }
            indicators.forEach(function (_a) {
                var _b;
                var result = _a.result, figures = _a.figures;
                var data = (_b = result[dataIndex]) !== null && _b !== void 0 ? _b : {};
                figures.forEach(function (figure) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- ignore
                    var value = data[figure.key];
                    if ((0, typeChecks_1.isNumber)(value)) {
                        min = Math.min(min, value);
                        max = Math.max(max, value);
                    }
                });
            });
        });
        if (min !== Number.MAX_SAFE_INTEGER && max !== Number.MIN_SAFE_INTEGER) {
            min = Math.min(specifyMin, min);
            max = Math.max(specifyMax, max);
        }
        else {
            min = 0;
            max = 10;
        }
        var defaultDiff = max - min;
        var defaultRange = {
            from: min,
            to: max,
            range: defaultDiff,
            realFrom: min,
            realTo: max,
            realRange: defaultDiff,
            displayFrom: min,
            displayTo: max,
            displayRange: defaultDiff
        };
        var range = this.createRange({
            chart: chart,
            paneId: paneId,
            defaultRange: defaultRange
        });
        var realFrom = range.realFrom;
        var realTo = range.realTo;
        var realRange = range.realRange;
        var minSpan = this.minSpan(precision);
        if (realFrom === realTo || realRange < minSpan) {
            var minCheck = specifyMin === realFrom;
            var maxCheck = specifyMax === realTo;
            var halfTickCount = TICK_COUNT / 2;
            realFrom = minCheck ? realFrom : (maxCheck ? realFrom - TICK_COUNT * minSpan : realFrom - halfTickCount * minSpan);
            realTo = maxCheck ? realTo : (minCheck ? realTo + TICK_COUNT * minSpan : realTo + halfTickCount * minSpan);
        }
        var height = this.getBounding().height;
        var _c = this.gap, top = _c.top, bottom = _c.bottom;
        var topRate = top;
        if (topRate >= 1) {
            topRate = topRate / height;
        }
        var bottomRate = bottom;
        if (bottomRate >= 1) {
            bottomRate = bottomRate / height;
        }
        realRange = realTo - realFrom;
        realFrom = realFrom - realRange * bottomRate;
        realTo = realTo + realRange * topRate;
        var from = this.realValueToValue(realFrom, { range: range });
        var to = this.realValueToValue(realTo, { range: range });
        var displayFrom = this.realValueToDisplayValue(realFrom, { range: range });
        var displayTo = this.realValueToDisplayValue(realTo, { range: range });
        return {
            from: from,
            to: to,
            range: to - from,
            realFrom: realFrom,
            realTo: realTo,
            realRange: realTo - realFrom,
            displayFrom: displayFrom,
            displayTo: displayTo,
            displayRange: displayTo - displayFrom
        };
    };
    /**
     * 是否是蜡烛图轴
     * @return {boolean}
     */
    YAxisImp.prototype.isInCandle = function () {
        return this.getParent().getId() === types_1.PaneIdConstants.CANDLE;
    };
    /**
     * 是否从y轴0开始
     * @return {boolean}
     */
    YAxisImp.prototype.isFromZero = function () {
        return ((this.position === 'left' && this.inside) ||
            (this.position === 'right' && !this.inside));
    };
    YAxisImp.prototype.createTicksImp = function () {
        var _this = this;
        var _a, _b, _c, _d;
        var range = this.getRange();
        var displayFrom = range.displayFrom, displayTo = range.displayTo, displayRange = range.displayRange;
        var ticks = [];
        if (displayRange >= 0) {
            var interval = (0, number_1.nice)(displayRange / TICK_COUNT);
            var precision_1 = (0, number_1.getPrecision)(interval);
            var first = (0, number_1.round)(Math.ceil(displayFrom / interval) * interval, precision_1);
            var last = (0, number_1.round)(Math.floor(displayTo / interval) * interval, precision_1);
            var n = 0;
            var f = first;
            if (interval !== 0) {
                while (f <= last) {
                    var v = f.toFixed(precision_1);
                    ticks[n] = { text: v, coord: 0, value: v };
                    ++n;
                    f += interval;
                }
            }
        }
        var pane = this.getParent();
        var height = (_b = (_a = pane.getYAxisWidget()) === null || _a === void 0 ? void 0 : _a.getBounding().height) !== null && _b !== void 0 ? _b : 0;
        var chartStore = pane.getChart().getChartStore();
        var optimalTicks = [];
        var indicators = chartStore.getIndicatorsByPaneId(pane.getId());
        var styles = chartStore.getStyles();
        var precision = 0;
        var shouldFormatBigNumber = false;
        if (this.isInCandle()) {
            precision = (_d = (_c = chartStore.getSymbol()) === null || _c === void 0 ? void 0 : _c.pricePrecision) !== null && _d !== void 0 ? _d : 2;
        }
        else {
            indicators.forEach(function (indicator) {
                precision = Math.max(precision, indicator.precision);
                shouldFormatBigNumber || (shouldFormatBigNumber = indicator.shouldFormatBigNumber);
            });
        }
        var formatter = chartStore.getInnerFormatter();
        var thousandsSeparator = chartStore.getThousandsSeparator();
        var decimalFold = chartStore.getDecimalFold();
        var textHeight = styles.xAxis.tickText.size;
        var validY = NaN;
        ticks.forEach(function (_a) {
            var value = _a.value;
            var v = _this.displayValueToText(+value, precision);
            var y = _this.convertToPixel(_this.realValueToValue(_this.displayValueToRealValue(+value, { range: range }), { range: range }));
            if (shouldFormatBigNumber) {
                v = formatter.formatBigNumber(value);
            }
            v = decimalFold.format(thousandsSeparator.format(v));
            var validYNumber = (0, typeChecks_1.isNumber)(validY);
            if (y > textHeight &&
                y < height - textHeight &&
                ((validYNumber && (Math.abs(validY - y) > textHeight * 2)) || !validYNumber)) {
                optimalTicks.push({ text: v, coord: y, value: value });
                validY = y;
            }
        });
        if ((0, typeChecks_1.isFunction)(this.createTicks)) {
            return this.createTicks({
                range: this.getRange(),
                bounding: this.getBounding(),
                defaultTicks: optimalTicks
            });
        }
        return optimalTicks;
    };
    YAxisImp.prototype.getAutoSize = function () {
        var _a, _b;
        var pane = this.getParent();
        var chart = pane.getChart();
        var chartStore = chart.getChartStore();
        var styles = chartStore.getStyles();
        var yAxisStyles = styles.yAxis;
        var width = yAxisStyles.size;
        if (width !== 'auto') {
            return width;
        }
        var yAxisWidth = 0;
        if (yAxisStyles.show) {
            if (yAxisStyles.axisLine.show) {
                yAxisWidth += yAxisStyles.axisLine.size;
            }
            if (yAxisStyles.tickLine.show) {
                yAxisWidth += yAxisStyles.tickLine.length;
            }
            if (yAxisStyles.tickText.show) {
                var textWidth_1 = 0;
                this.getTicks().forEach(function (tick) {
                    textWidth_1 = Math.max(textWidth_1, (0, canvas_1.calcTextWidth)(tick.text, yAxisStyles.tickText.size, yAxisStyles.tickText.weight, yAxisStyles.tickText.family));
                });
                yAxisWidth += (yAxisStyles.tickText.marginStart + yAxisStyles.tickText.marginEnd + textWidth_1);
            }
        }
        var priceMarkStyles = styles.candle.priceMark;
        var lastPriceMarkTextVisible = priceMarkStyles.show && priceMarkStyles.last.show && priceMarkStyles.last.text.show;
        var lastPriceTextWidth = 0;
        var crosshairStyles = styles.crosshair;
        var crosshairHorizontalTextVisible = crosshairStyles.show && crosshairStyles.horizontal.show && crosshairStyles.horizontal.text.show;
        var crosshairHorizontalTextWidth = 0;
        if (lastPriceMarkTextVisible || crosshairHorizontalTextVisible) {
            var pricePrecision = (_b = (_a = chartStore.getSymbol()) === null || _a === void 0 ? void 0 : _a.pricePrecision) !== null && _b !== void 0 ? _b : 2;
            var max = this.getRange().displayTo;
            if (lastPriceMarkTextVisible) {
                var dataList = chartStore.getDataList();
                var data_1 = dataList[dataList.length - 1];
                if ((0, typeChecks_1.isValid)(data_1)) {
                    var _c = priceMarkStyles.last.text, paddingLeft = _c.paddingLeft, paddingRight = _c.paddingRight, size = _c.size, family = _c.family, weight = _c.weight;
                    lastPriceTextWidth = paddingLeft + (0, canvas_1.calcTextWidth)((0, format_1.formatPrecision)(data_1.close, pricePrecision), size, weight, family) + paddingRight;
                    var formatExtendText_1 = chartStore.getInnerFormatter().formatExtendText;
                    priceMarkStyles.last.extendTexts.forEach(function (item, index) {
                        var text = formatExtendText_1({ type: 'last_price', data: data_1, index: index });
                        if (text.length > 0 && item.show) {
                            lastPriceTextWidth = Math.max(lastPriceTextWidth, item.paddingLeft + (0, canvas_1.calcTextWidth)(text, item.size, item.weight, item.family) + item.paddingRight);
                        }
                    });
                }
            }
            if (crosshairHorizontalTextVisible) {
                var indicators = chartStore.getIndicatorsByPaneId(pane.getId());
                var indicatorPrecision_1 = 0;
                var shouldFormatBigNumber_1 = false;
                indicators.forEach(function (indicator) {
                    indicatorPrecision_1 = Math.max(indicator.precision, indicatorPrecision_1);
                    shouldFormatBigNumber_1 || (shouldFormatBigNumber_1 = indicator.shouldFormatBigNumber);
                });
                var precision = 2;
                if (this.isInCandle()) {
                    var lastValueMarkStyles = styles.indicator.lastValueMark;
                    if (lastValueMarkStyles.show && lastValueMarkStyles.text.show) {
                        precision = Math.max(indicatorPrecision_1, pricePrecision);
                    }
                    else {
                        precision = pricePrecision;
                    }
                }
                else {
                    precision = indicatorPrecision_1;
                }
                var valueText = (0, format_1.formatPrecision)(max, precision);
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- ignore
                if (shouldFormatBigNumber_1) {
                    valueText = chartStore.getInnerFormatter().formatBigNumber(valueText);
                }
                valueText = chartStore.getDecimalFold().format(valueText);
                crosshairHorizontalTextWidth += (crosshairStyles.horizontal.text.paddingLeft +
                    crosshairStyles.horizontal.text.paddingRight +
                    crosshairStyles.horizontal.text.borderSize * 2 +
                    (0, canvas_1.calcTextWidth)(valueText, crosshairStyles.horizontal.text.size, crosshairStyles.horizontal.text.weight, crosshairStyles.horizontal.text.family));
            }
        }
        return Math.max(yAxisWidth, lastPriceTextWidth, crosshairHorizontalTextWidth);
    };
    YAxisImp.prototype.getBounding = function () {
        return this.getParent().getYAxisWidget().getBounding();
    };
    YAxisImp.prototype.convertFromPixel = function (pixel) {
        var height = this.getBounding().height;
        var range = this.getRange();
        var realFrom = range.realFrom, realRange = range.realRange;
        var rate = this.reverse ? pixel / height : 1 - pixel / height;
        var realValue = rate * realRange + realFrom;
        return this.realValueToValue(realValue, { range: range });
    };
    YAxisImp.prototype.convertToPixel = function (value) {
        var _a, _b;
        var range = this.getRange();
        var realValue = this.valueToRealValue(value, { range: range });
        var height = (_b = (_a = this.getParent().getYAxisWidget()) === null || _a === void 0 ? void 0 : _a.getBounding().height) !== null && _b !== void 0 ? _b : 0;
        var realFrom = range.realFrom, realRange = range.realRange;
        var rate = (realValue - realFrom) / realRange;
        return this.reverse ? Math.round(rate * height) : Math.round((1 - rate) * height);
    };
    YAxisImp.prototype.convertToNicePixel = function (value) {
        var _a, _b;
        var height = (_b = (_a = this.getParent().getYAxisWidget()) === null || _a === void 0 ? void 0 : _a.getBounding().height) !== null && _b !== void 0 ? _b : 0;
        var pixel = this.convertToPixel(value);
        return Math.round(Math.max(height * 0.05, Math.min(pixel, height * 0.98)));
    };
    YAxisImp.extend = function (template) {
        var Custom = /** @class */ (function (_super) {
            __extends(Custom, _super);
            function Custom(parent) {
                return _super.call(this, parent, template) || this;
            }
            return Custom;
        }(YAxisImp));
        return Custom;
    };
    return YAxisImp;
}(Axis_1.default));
exports.default = YAxisImp;
//# sourceMappingURL=YAxis.js.map