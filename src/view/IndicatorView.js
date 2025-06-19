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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var format_1 = require("../common/utils/format");
var typeChecks_1 = require("../common/utils/typeChecks");
var Indicator_1 = require("../component/Indicator");
var CandleBarView_1 = __importDefault(require("./CandleBarView"));
var IndicatorView = /** @class */ (function (_super) {
    __extends(IndicatorView, _super);
    function IndicatorView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IndicatorView.prototype.getCandleBarOptions = function () {
        var e_1, _a;
        var pane = this.getWidget().getPane();
        var yAxis = pane.getAxisComponent();
        if (!yAxis.isInCandle()) {
            var chartStore = pane.getChart().getChartStore();
            var indicators = chartStore.getIndicatorsByPaneId(pane.getId());
            try {
                for (var indicators_1 = __values(indicators), indicators_1_1 = indicators_1.next(); !indicators_1_1.done; indicators_1_1 = indicators_1.next()) {
                    var indicator = indicators_1_1.value;
                    if (indicator.shouldOhlc && indicator.visible) {
                        var indicatorStyles = indicator.styles;
                        var defaultStyles = chartStore.getStyles().indicator;
                        var compareRule = (0, format_1.formatValue)(indicatorStyles, 'ohlc.compareRule', defaultStyles.ohlc.compareRule);
                        var upColor = (0, format_1.formatValue)(indicatorStyles, 'ohlc.upColor', defaultStyles.ohlc.upColor);
                        var downColor = (0, format_1.formatValue)(indicatorStyles, 'ohlc.downColor', defaultStyles.ohlc.downColor);
                        var noChangeColor = (0, format_1.formatValue)(indicatorStyles, 'ohlc.noChangeColor', defaultStyles.ohlc.noChangeColor);
                        return {
                            type: 'ohlc',
                            styles: {
                                compareRule: compareRule,
                                upColor: upColor,
                                downColor: downColor,
                                noChangeColor: noChangeColor,
                                upBorderColor: upColor,
                                downBorderColor: downColor,
                                noChangeBorderColor: noChangeColor,
                                upWickColor: upColor,
                                downWickColor: downColor,
                                noChangeWickColor: noChangeColor
                            }
                        };
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (indicators_1_1 && !indicators_1_1.done && (_a = indicators_1.return)) _a.call(indicators_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        return null;
    };
    IndicatorView.prototype.drawImp = function (ctx) {
        var _this = this;
        _super.prototype.drawImp.call(this, ctx);
        var widget = this.getWidget();
        var pane = widget.getPane();
        var chart = pane.getChart();
        var bounding = widget.getBounding();
        var xAxis = chart.getXAxisPane().getAxisComponent();
        var yAxis = pane.getAxisComponent();
        var chartStore = chart.getChartStore();
        var indicators = chartStore.getIndicatorsByPaneId(pane.getId());
        var defaultStyles = chartStore.getStyles().indicator;
        ctx.save();
        indicators.forEach(function (indicator) {
            if (indicator.visible) {
                if (indicator.zLevel < 0) {
                    ctx.globalCompositeOperation = 'destination-over';
                }
                else {
                    ctx.globalCompositeOperation = 'source-over';
                }
                var isCover = false;
                if (indicator.draw !== null) {
                    ctx.save();
                    isCover = indicator.draw({
                        ctx: ctx,
                        chart: chart,
                        indicator: indicator,
                        bounding: bounding,
                        xAxis: xAxis,
                        yAxis: yAxis
                    });
                    ctx.restore();
                }
                if (!isCover) {
                    var result_1 = indicator.result;
                    var lines_1 = [];
                    _this.eachChildren(function (data, barSpace) {
                        var _a, _b, _c;
                        var halfGapBar = barSpace.halfGapBar;
                        var dataIndex = data.dataIndex, x = data.x;
                        var prevX = xAxis.convertToPixel(dataIndex - 1);
                        var nextX = xAxis.convertToPixel(dataIndex + 1);
                        var prevData = (_a = result_1[dataIndex - 1]) !== null && _a !== void 0 ? _a : null;
                        var currentData = (_b = result_1[dataIndex]) !== null && _b !== void 0 ? _b : null;
                        var nextData = (_c = result_1[dataIndex + 1]) !== null && _c !== void 0 ? _c : null;
                        var prevCoordinate = { x: prevX };
                        var currentCoordinate = { x: x };
                        var nextCoordinate = { x: nextX };
                        indicator.figures.forEach(function (_a) {
                            var key = _a.key;
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- ignore
                            var prevValue = prevData === null || prevData === void 0 ? void 0 : prevData[key];
                            if ((0, typeChecks_1.isNumber)(prevValue)) {
                                prevCoordinate[key] = yAxis.convertToPixel(prevValue);
                            }
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- ignore
                            var currentValue = currentData === null || currentData === void 0 ? void 0 : currentData[key];
                            if ((0, typeChecks_1.isNumber)(currentValue)) {
                                currentCoordinate[key] = yAxis.convertToPixel(currentValue);
                            }
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- ignore
                            var nextValue = nextData === null || nextData === void 0 ? void 0 : nextData[key];
                            if ((0, typeChecks_1.isNumber)(nextValue)) {
                                nextCoordinate[key] = yAxis.convertToPixel(nextValue);
                            }
                        });
                        (0, Indicator_1.eachFigures)(indicator, dataIndex, defaultStyles, function (figure, figureStyles, figureIndex) {
                            var _a, _b, _c;
                            if ((0, typeChecks_1.isValid)(currentData === null || currentData === void 0 ? void 0 : currentData[figure.key])) {
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- ignore
                                var valueY = currentCoordinate[figure.key];
                                var attrs = (_a = figure.attrs) === null || _a === void 0 ? void 0 : _a.call(figure, {
                                    data: { prev: prevData, current: currentData, next: nextData },
                                    coordinate: { prev: prevCoordinate, current: currentCoordinate, next: nextCoordinate },
                                    bounding: bounding,
                                    barSpace: barSpace,
                                    xAxis: xAxis,
                                    yAxis: yAxis
                                });
                                if (!(0, typeChecks_1.isValid)(attrs)) {
                                    switch (figure.type) {
                                        case 'circle': {
                                            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- ignore
                                            attrs = { x: x, y: valueY, r: Math.max(1, halfGapBar) };
                                            break;
                                        }
                                        case 'rect':
                                        case 'bar': {
                                            var baseValue = (_b = figure.baseValue) !== null && _b !== void 0 ? _b : yAxis.getRange().from;
                                            var baseValueY = yAxis.convertToPixel(baseValue);
                                            var height = Math.abs(baseValueY - valueY);
                                            if (baseValue !== (currentData === null || currentData === void 0 ? void 0 : currentData[figure.key])) {
                                                height = Math.max(1, height);
                                            }
                                            var y = 0;
                                            if (valueY > baseValueY) {
                                                y = baseValueY;
                                            }
                                            else {
                                                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- ignore
                                                y = valueY;
                                            }
                                            attrs = {
                                                x: x - halfGapBar,
                                                y: y,
                                                width: Math.max(1, halfGapBar * 2),
                                                height: height
                                            };
                                            break;
                                        }
                                        case 'line': {
                                            if (!(0, typeChecks_1.isValid)(lines_1[figureIndex])) {
                                                lines_1[figureIndex] = [];
                                            }
                                            if ((0, typeChecks_1.isNumber)(currentCoordinate[figure.key]) && (0, typeChecks_1.isNumber)(nextCoordinate[figure.key])) {
                                                lines_1[figureIndex].push({
                                                    coordinates: [
                                                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- ignore
                                                        { x: currentCoordinate.x, y: currentCoordinate[figure.key] },
                                                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- ignore
                                                        { x: nextCoordinate.x, y: nextCoordinate[figure.key] }
                                                    ],
                                                    styles: figureStyles
                                                });
                                            }
                                            break;
                                        }
                                        default: {
                                            break;
                                        }
                                    }
                                }
                                var type = figure.type;
                                if ((0, typeChecks_1.isValid)(attrs) && type !== 'line') {
                                    (_c = _this.createFigure({
                                        name: type === 'bar' ? 'rect' : type,
                                        attrs: attrs,
                                        styles: figureStyles
                                    })) === null || _c === void 0 ? void 0 : _c.draw(ctx);
                                }
                            }
                        });
                    });
                    // merge line and render
                    lines_1.forEach(function (items) {
                        var _a, _b, _c, _d;
                        if (items.length > 1) {
                            var mergeLines = [
                                {
                                    coordinates: [items[0].coordinates[0], items[0].coordinates[1]],
                                    styles: items[0].styles
                                }
                            ];
                            for (var i = 1; i < items.length; i++) {
                                var lastMergeLine = mergeLines[mergeLines.length - 1];
                                var current = items[i];
                                var lastMergeLineLastCoordinate = lastMergeLine.coordinates[lastMergeLine.coordinates.length - 1];
                                if (lastMergeLineLastCoordinate.x === current.coordinates[0].x &&
                                    lastMergeLineLastCoordinate.y === current.coordinates[0].y &&
                                    lastMergeLine.styles.style === current.styles.style &&
                                    lastMergeLine.styles.color === current.styles.color &&
                                    lastMergeLine.styles.size === current.styles.size &&
                                    lastMergeLine.styles.smooth === current.styles.smooth &&
                                    ((_a = lastMergeLine.styles.dashedValue) === null || _a === void 0 ? void 0 : _a[0]) === ((_b = current.styles.dashedValue) === null || _b === void 0 ? void 0 : _b[0]) &&
                                    ((_c = lastMergeLine.styles.dashedValue) === null || _c === void 0 ? void 0 : _c[1]) === ((_d = current.styles.dashedValue) === null || _d === void 0 ? void 0 : _d[1])) {
                                    lastMergeLine.coordinates.push(current.coordinates[1]);
                                }
                                else {
                                    mergeLines.push({
                                        coordinates: [current.coordinates[0], current.coordinates[1]],
                                        styles: current.styles
                                    });
                                }
                            }
                            mergeLines.forEach(function (_a) {
                                var _b;
                                var coordinates = _a.coordinates, styles = _a.styles;
                                (_b = _this.createFigure({
                                    name: 'line',
                                    attrs: { coordinates: coordinates },
                                    styles: styles
                                })) === null || _b === void 0 ? void 0 : _b.draw(ctx);
                            });
                        }
                    });
                }
            }
        });
        ctx.restore();
    };
    return IndicatorView;
}(CandleBarView_1.default));
exports.default = IndicatorView;
//# sourceMappingURL=IndicatorView.js.map