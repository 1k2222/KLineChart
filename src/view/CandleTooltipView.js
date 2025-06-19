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
var format_1 = require("../common/utils/format");
var canvas_1 = require("../common/utils/canvas");
var typeChecks_1 = require("../common/utils/typeChecks");
var Period_1 = require("../common/Period");
var types_1 = require("../pane/types");
var IndicatorTooltipView_1 = __importDefault(require("./IndicatorTooltipView"));
var index_1 = require("../extension/i18n/index");
var CandleTooltipView = /** @class */ (function (_super) {
    __extends(CandleTooltipView, _super);
    function CandleTooltipView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CandleTooltipView.prototype.drawImp = function (ctx) {
        var widget = this.getWidget();
        var chartStore = widget.getPane().getChart().getChartStore();
        var crosshair = chartStore.getCrosshair();
        if ((0, typeChecks_1.isValid)(crosshair.kLineData)) {
            var bounding = widget.getBounding();
            var styles = chartStore.getStyles();
            var candleStyles = styles.candle;
            var indicatorStyles = styles.indicator;
            if (candleStyles.tooltip.showType === 'rect' &&
                indicatorStyles.tooltip.showType === 'rect') {
                var isDrawCandleTooltip = this.isDrawTooltip(crosshair, candleStyles.tooltip);
                var isDrawIndicatorTooltip = this.isDrawTooltip(crosshair, indicatorStyles.tooltip);
                this._drawRectTooltip(ctx, isDrawCandleTooltip, isDrawIndicatorTooltip, candleStyles.tooltip.offsetTop);
            }
            else if (candleStyles.tooltip.showType === 'standard' &&
                indicatorStyles.tooltip.showType === 'standard') {
                var _a = candleStyles.tooltip, offsetLeft = _a.offsetLeft, offsetTop = _a.offsetTop, offsetRight = _a.offsetRight;
                var maxWidth = bounding.width - offsetRight;
                var top_1 = this._drawCandleStandardTooltip(ctx, offsetLeft, offsetTop, maxWidth);
                this.drawIndicatorTooltip(ctx, offsetLeft, top_1, maxWidth);
            }
            else if (candleStyles.tooltip.showType === 'rect' &&
                indicatorStyles.tooltip.showType === 'standard') {
                var _b = candleStyles.tooltip, offsetLeft = _b.offsetLeft, offsetTop = _b.offsetTop, offsetRight = _b.offsetRight;
                var maxWidth = bounding.width - offsetRight;
                var top_2 = this.drawIndicatorTooltip(ctx, offsetLeft, offsetTop, maxWidth);
                var isDrawCandleTooltip = this.isDrawTooltip(crosshair, candleStyles.tooltip);
                this._drawRectTooltip(ctx, isDrawCandleTooltip, false, top_2);
            }
            else {
                var _c = candleStyles.tooltip, offsetLeft = _c.offsetLeft, offsetTop = _c.offsetTop, offsetRight = _c.offsetRight;
                var maxWidth = bounding.width - offsetRight;
                var top_3 = this._drawCandleStandardTooltip(ctx, offsetLeft, offsetTop, maxWidth);
                var isDrawIndicatorTooltip = this.isDrawTooltip(crosshair, indicatorStyles.tooltip);
                this._drawRectTooltip(ctx, false, isDrawIndicatorTooltip, top_3);
            }
        }
    };
    CandleTooltipView.prototype._drawCandleStandardTooltip = function (ctx, left, top, maxWidth) {
        var _a;
        var chartStore = this.getWidget().getPane().getChart().getChartStore();
        var styles = chartStore.getStyles().candle;
        var tooltipStyles = styles.tooltip;
        var tooltipLegendStyles = tooltipStyles.legend;
        var prevRowHeight = 0;
        var coordinate = { x: left, y: top };
        var crosshair = chartStore.getCrosshair();
        if (this.isDrawTooltip(crosshair, tooltipStyles)) {
            var tooltipTitleStyles = tooltipStyles.title;
            if (tooltipTitleStyles.show) {
                var _b = (_a = chartStore.getPeriod()) !== null && _a !== void 0 ? _a : {}, _c = _b.type, type = _c === void 0 ? '' : _c, _d = _b.span, span = _d === void 0 ? '' : _d;
                var text = (0, format_1.formatTemplateString)(tooltipTitleStyles.template, __assign(__assign({}, chartStore.getSymbol()), { period: "".concat(span).concat((0, index_1.i18n)(type, chartStore.getLocale())) }));
                var color = tooltipTitleStyles.color;
                var height = this.drawStandardTooltipLegends(ctx, [
                    {
                        title: { text: '', color: color },
                        value: { text: text, color: color }
                    }
                ], { x: left, y: top }, left, 0, maxWidth, tooltipTitleStyles);
                coordinate.y = coordinate.y + height;
            }
            var legends = this._getCandleTooltipLegends();
            var features = this.classifyTooltipFeatures(tooltipStyles.features);
            prevRowHeight = this.drawStandardTooltipFeatures(ctx, features[0], coordinate, null, left, prevRowHeight, maxWidth);
            prevRowHeight = this.drawStandardTooltipFeatures(ctx, features[1], coordinate, null, left, prevRowHeight, maxWidth);
            if (legends.length > 0) {
                prevRowHeight = this.drawStandardTooltipLegends(ctx, legends, coordinate, left, prevRowHeight, maxWidth, tooltipLegendStyles);
            }
            prevRowHeight = this.drawStandardTooltipFeatures(ctx, features[2], coordinate, null, left, prevRowHeight, maxWidth);
        }
        return coordinate.y + prevRowHeight;
    };
    CandleTooltipView.prototype._drawRectTooltip = function (ctx, isDrawCandleTooltip, isDrawIndicatorTooltip, top) {
        var _this = this;
        var _a, _b;
        var widget = this.getWidget();
        var pane = widget.getPane();
        var chartStore = pane.getChart().getChartStore();
        var styles = chartStore.getStyles();
        var candleStyles = styles.candle;
        var indicatorStyles = styles.indicator;
        var candleTooltipStyles = candleStyles.tooltip;
        var indicatorTooltipStyles = indicatorStyles.tooltip;
        if (isDrawCandleTooltip || isDrawIndicatorTooltip) {
            var candleLegends = this._getCandleTooltipLegends();
            var offsetLeft = candleTooltipStyles.offsetLeft, offsetTop = candleTooltipStyles.offsetTop, offsetRight = candleTooltipStyles.offsetRight, offsetBottom = candleTooltipStyles.offsetBottom;
            var _c = candleTooltipStyles.legend, baseLegendMarginLeft_1 = _c.marginLeft, baseLegendMarginRight_1 = _c.marginRight, baseLegendMarginTop_1 = _c.marginTop, baseLegendMarginBottom_1 = _c.marginBottom, baseLegendSize_1 = _c.size, baseLegendWeight_1 = _c.weight, baseLegendFamily_1 = _c.family;
            var _d = candleTooltipStyles.rect, rectPosition = _d.position, rectPaddingLeft = _d.paddingLeft, rectPaddingRight_1 = _d.paddingRight, rectPaddingTop = _d.paddingTop, rectPaddingBottom = _d.paddingBottom, rectOffsetLeft = _d.offsetLeft, rectOffsetRight = _d.offsetRight, rectOffsetTop = _d.offsetTop, rectOffsetBottom = _d.offsetBottom, rectBorderSize_1 = _d.borderSize, rectBorderRadius = _d.borderRadius, rectBorderColor = _d.borderColor, rectBackgroundColor = _d.color;
            var maxTextWidth_1 = 0;
            var rectWidth_1 = 0;
            var rectHeight_1 = 0;
            if (isDrawCandleTooltip) {
                ctx.font = (0, canvas_1.createFont)(baseLegendSize_1, baseLegendWeight_1, baseLegendFamily_1);
                candleLegends.forEach(function (data) {
                    var title = data.title;
                    var value = data.value;
                    var text = "".concat(title.text).concat(value.text);
                    var labelWidth = ctx.measureText(text).width + baseLegendMarginLeft_1 + baseLegendMarginRight_1;
                    maxTextWidth_1 = Math.max(maxTextWidth_1, labelWidth);
                });
                rectHeight_1 += ((baseLegendMarginBottom_1 + baseLegendMarginTop_1 + baseLegendSize_1) * candleLegends.length);
            }
            var _e = indicatorTooltipStyles.legend, indicatorLegendMarginLeft_1 = _e.marginLeft, indicatorLegendMarginRight_1 = _e.marginRight, indicatorLegendMarginTop_1 = _e.marginTop, indicatorLegendMarginBottom_1 = _e.marginBottom, indicatorLegendSize_1 = _e.size, indicatorLegendWeight_1 = _e.weight, indicatorLegendFamily_1 = _e.family;
            var indicatorLegendsArray_1 = [];
            if (isDrawIndicatorTooltip) {
                var indicators = chartStore.getIndicatorsByPaneId(pane.getId());
                ctx.font = (0, canvas_1.createFont)(indicatorLegendSize_1, indicatorLegendWeight_1, indicatorLegendFamily_1);
                indicators.forEach(function (indicator) {
                    var tooltipDataLegends = _this.getIndicatorTooltipData(indicator).legends;
                    indicatorLegendsArray_1.push(tooltipDataLegends);
                    tooltipDataLegends.forEach(function (data) {
                        var title = data.title;
                        var value = data.value;
                        var text = "".concat(title.text).concat(value.text);
                        var textWidth = ctx.measureText(text).width + indicatorLegendMarginLeft_1 + indicatorLegendMarginRight_1;
                        maxTextWidth_1 = Math.max(maxTextWidth_1, textWidth);
                        rectHeight_1 += (indicatorLegendMarginTop_1 + indicatorLegendMarginBottom_1 + indicatorLegendSize_1);
                    });
                });
            }
            rectWidth_1 += maxTextWidth_1;
            if (rectWidth_1 !== 0 && rectHeight_1 !== 0) {
                var crosshair = chartStore.getCrosshair();
                var bounding = widget.getBounding();
                var yAxisBounding = pane.getYAxisWidget().getBounding();
                rectWidth_1 += (rectBorderSize_1 * 2 + rectPaddingLeft + rectPaddingRight_1);
                rectHeight_1 += (rectBorderSize_1 * 2 + rectPaddingTop + rectPaddingBottom);
                var centerX = bounding.width / 2;
                var isPointer = rectPosition === 'pointer' && crosshair.paneId === types_1.PaneIdConstants.CANDLE;
                var isLeft = ((_a = crosshair.realX) !== null && _a !== void 0 ? _a : 0) > centerX;
                var rectX_1 = 0;
                if (isPointer) {
                    var realX = crosshair.realX;
                    if (isLeft) {
                        rectX_1 = realX - rectOffsetRight - rectWidth_1;
                    }
                    else {
                        rectX_1 = realX + rectOffsetLeft;
                    }
                }
                else {
                    var yAxis = this.getWidget().getPane().getAxisComponent();
                    if (isLeft) {
                        rectX_1 = rectOffsetLeft + offsetLeft;
                        if (yAxis.inside && yAxis.position === 'left') {
                            rectX_1 += yAxisBounding.width;
                        }
                    }
                    else {
                        rectX_1 = bounding.width - rectOffsetRight - rectWidth_1 - offsetRight;
                        if (yAxis.inside && yAxis.position === 'right') {
                            rectX_1 -= yAxisBounding.width;
                        }
                    }
                }
                var rectY = top + rectOffsetTop;
                if (isPointer) {
                    var y = crosshair.y;
                    rectY = y - rectHeight_1 / 2;
                    if (rectY + rectHeight_1 > bounding.height - rectOffsetBottom - offsetBottom) {
                        rectY = bounding.height - rectOffsetBottom - rectHeight_1 - offsetBottom;
                    }
                    if (rectY < top + rectOffsetTop) {
                        rectY = top + rectOffsetTop + offsetTop;
                    }
                }
                (_b = this.createFigure({
                    name: 'rect',
                    attrs: {
                        x: rectX_1,
                        y: rectY,
                        width: rectWidth_1,
                        height: rectHeight_1
                    },
                    styles: {
                        style: 'stroke_fill',
                        color: rectBackgroundColor,
                        borderColor: rectBorderColor,
                        borderSize: rectBorderSize_1,
                        borderRadius: rectBorderRadius
                    }
                })) === null || _b === void 0 ? void 0 : _b.draw(ctx);
                var candleTextX_1 = rectX_1 + rectBorderSize_1 + rectPaddingLeft + baseLegendMarginLeft_1;
                var textY_1 = rectY + rectBorderSize_1 + rectPaddingTop;
                if (isDrawCandleTooltip) {
                    // render candle texts
                    candleLegends.forEach(function (data) {
                        var _a, _b;
                        textY_1 += baseLegendMarginTop_1;
                        var title = data.title;
                        (_a = _this.createFigure({
                            name: 'text',
                            attrs: {
                                x: candleTextX_1,
                                y: textY_1,
                                text: title.text
                            },
                            styles: {
                                color: title.color,
                                size: baseLegendSize_1,
                                family: baseLegendFamily_1,
                                weight: baseLegendWeight_1
                            }
                        })) === null || _a === void 0 ? void 0 : _a.draw(ctx);
                        var value = data.value;
                        (_b = _this.createFigure({
                            name: 'text',
                            attrs: {
                                x: rectX_1 + rectWidth_1 - rectBorderSize_1 - baseLegendMarginRight_1 - rectPaddingRight_1,
                                y: textY_1,
                                text: value.text,
                                align: 'right'
                            },
                            styles: {
                                color: value.color,
                                size: baseLegendSize_1,
                                family: baseLegendFamily_1,
                                weight: baseLegendWeight_1
                            }
                        })) === null || _b === void 0 ? void 0 : _b.draw(ctx);
                        textY_1 += (baseLegendSize_1 + baseLegendMarginBottom_1);
                    });
                }
                if (isDrawIndicatorTooltip) {
                    // render indicator legends
                    var indicatorTextX_1 = rectX_1 + rectBorderSize_1 + rectPaddingLeft + indicatorLegendMarginLeft_1;
                    indicatorLegendsArray_1.forEach(function (legends) {
                        legends.forEach(function (data) {
                            var _a, _b;
                            textY_1 += indicatorLegendMarginTop_1;
                            var title = data.title;
                            var value = data.value;
                            (_a = _this.createFigure({
                                name: 'text',
                                attrs: {
                                    x: indicatorTextX_1,
                                    y: textY_1,
                                    text: title.text
                                },
                                styles: {
                                    color: title.color,
                                    size: indicatorLegendSize_1,
                                    family: indicatorLegendFamily_1,
                                    weight: indicatorLegendWeight_1
                                }
                            })) === null || _a === void 0 ? void 0 : _a.draw(ctx);
                            (_b = _this.createFigure({
                                name: 'text',
                                attrs: {
                                    x: rectX_1 + rectWidth_1 - rectBorderSize_1 - indicatorLegendMarginRight_1 - rectPaddingRight_1,
                                    y: textY_1,
                                    text: value.text,
                                    align: 'right'
                                },
                                styles: {
                                    color: value.color,
                                    size: indicatorLegendSize_1,
                                    family: indicatorLegendFamily_1,
                                    weight: indicatorLegendWeight_1
                                }
                            })) === null || _b === void 0 ? void 0 : _b.draw(ctx);
                            textY_1 += (indicatorLegendSize_1 + indicatorLegendMarginBottom_1);
                        });
                    });
                }
            }
        }
    };
    CandleTooltipView.prototype._getCandleTooltipLegends = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        var chartStore = this.getWidget().getPane().getChart().getChartStore();
        var styles = chartStore.getStyles().candle;
        var dataList = chartStore.getDataList();
        var formatter = chartStore.getInnerFormatter();
        var decimalFold = chartStore.getDecimalFold();
        var thousandsSeparator = chartStore.getThousandsSeparator();
        var locale = chartStore.getLocale();
        var _j = (_a = chartStore.getSymbol()) !== null && _a !== void 0 ? _a : {}, _k = _j.pricePrecision, pricePrecision = _k === void 0 ? 2 : _k, _l = _j.volumePrecision, volumePrecision = _l === void 0 ? 0 : _l;
        var period = chartStore.getPeriod();
        var dataIndex = (_b = chartStore.getCrosshair().dataIndex) !== null && _b !== void 0 ? _b : 0;
        var tooltipStyles = styles.tooltip;
        var _m = tooltipStyles.legend, textColor = _m.color, defaultValue = _m.defaultValue, custom = _m.custom;
        var prev = (_c = dataList[dataIndex - 1]) !== null && _c !== void 0 ? _c : null;
        var current = dataList[dataIndex];
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- ignore
        var prevClose = (_d = prev === null || prev === void 0 ? void 0 : prev.close) !== null && _d !== void 0 ? _d : current.close;
        var changeValue = current.close - prevClose;
        var mapping = __assign(__assign({}, current), { time: formatter.formatDate(current.timestamp, Period_1.PeriodTypeCrosshairTooltipFormat[(_e = period === null || period === void 0 ? void 0 : period.type) !== null && _e !== void 0 ? _e : 'day'], 'tooltip'), open: decimalFold.format(thousandsSeparator.format((0, format_1.formatPrecision)(current.open, pricePrecision))), high: decimalFold.format(thousandsSeparator.format((0, format_1.formatPrecision)(current.high, pricePrecision))), low: decimalFold.format(thousandsSeparator.format((0, format_1.formatPrecision)(current.low, pricePrecision))), close: decimalFold.format(thousandsSeparator.format((0, format_1.formatPrecision)(current.close, pricePrecision))), volume: decimalFold.format(thousandsSeparator.format(formatter.formatBigNumber((0, format_1.formatPrecision)((_f = current.volume) !== null && _f !== void 0 ? _f : defaultValue, volumePrecision)))), turnover: decimalFold.format(thousandsSeparator.format((0, format_1.formatPrecision)((_g = current.turnover) !== null && _g !== void 0 ? _g : defaultValue, pricePrecision))), change: prevClose === 0 ? defaultValue : "".concat(thousandsSeparator.format((0, format_1.formatPrecision)(changeValue / prevClose * 100)), "%") });
        var legends = ((0, typeChecks_1.isFunction)(custom)
            ? custom({ prev: prev, current: current, next: (_h = dataList[dataIndex + 1]) !== null && _h !== void 0 ? _h : null }, styles)
            : custom);
        return legends.map(function (_a) {
            var title = _a.title, value = _a.value;
            var t = { text: '', color: textColor };
            if ((0, typeChecks_1.isObject)(title)) {
                t = __assign({}, title);
            }
            else {
                t.text = title;
            }
            t.text = (0, index_1.i18n)(t.text, locale);
            var v = { text: defaultValue, color: textColor };
            if ((0, typeChecks_1.isObject)(value)) {
                v = __assign({}, value);
            }
            else {
                v.text = value;
            }
            if ((0, typeChecks_1.isValid)(/{change}/.exec(v.text))) {
                v.color = changeValue === 0 ? styles.priceMark.last.noChangeColor : (changeValue > 0 ? styles.priceMark.last.upColor : styles.priceMark.last.downColor);
            }
            v.text = (0, format_1.formatTemplateString)(v.text, mapping);
            return { title: t, value: v };
        });
    };
    return CandleTooltipView;
}(IndicatorTooltipView_1.default));
exports.default = CandleTooltipView;
//# sourceMappingURL=CandleTooltipView.js.map