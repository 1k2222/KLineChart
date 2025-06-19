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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var typeChecks_1 = require("../common/utils/typeChecks");
var ChildrenView_1 = __importDefault(require("./ChildrenView"));
var types_1 = require("../pane/types");
var CandleBarView = /** @class */ (function (_super) {
    __extends(CandleBarView, _super);
    function CandleBarView() {
        var _this = _super.apply(this, __spreadArray([], __read(arguments), false)) || this;
        _this._boundCandleBarClickEvent = function (data) { return function () {
            _this.getWidget().getPane().getChart().getChartStore().executeAction('onCandleBarClick', data);
            return false;
        }; };
        return _this;
    }
    CandleBarView.prototype.drawImp = function (ctx) {
        var _this = this;
        var pane = this.getWidget().getPane();
        var isMain = pane.getId() === types_1.PaneIdConstants.CANDLE;
        var chartStore = pane.getChart().getChartStore();
        var candleBarOptions = this.getCandleBarOptions();
        if (candleBarOptions !== null) {
            var type_1 = candleBarOptions.type, styles_1 = candleBarOptions.styles, fadedStyles_1 = candleBarOptions.fadedStyles;
            var ohlcSize_1 = 0;
            var halfOhlcSize_1 = 0;
            if (candleBarOptions.type === 'ohlc') {
                var gapBar = chartStore.getBarSpace().gapBar;
                ohlcSize_1 = Math.min(Math.max(Math.round(gapBar * 0.2), 1), 8);
                if (ohlcSize_1 > 2 && ohlcSize_1 % 2 === 1) {
                    ohlcSize_1--;
                }
                halfOhlcSize_1 = Math.floor(ohlcSize_1 / 2);
            }
            var yAxis_1 = pane.getAxisComponent();
            this.eachChildren(function (visibleData, barSpace) {
                var _a;
                var x = visibleData.x, _b = visibleData.data, current = _b.current, prev = _b.prev;
                if ((0, typeChecks_1.isValid)(current)) {
                    var open_1 = current.open, high = current.high, low = current.low, close_1 = current.close, faded = current.faded;
                    var comparePrice = styles_1.compareRule === 'current_open' ? open_1 : ((_a = prev === null || prev === void 0 ? void 0 : prev.close) !== null && _a !== void 0 ? _a : close_1);
                    var colors = [];
                    var currentStyle = (undefined !== faded && undefined !== fadedStyles_1) ? fadedStyles_1 : styles_1;
                    if (close_1 > comparePrice) {
                        colors[0] = currentStyle.upColor;
                        colors[1] = currentStyle.upBorderColor;
                        colors[2] = currentStyle.upWickColor;
                    }
                    else if (close_1 < comparePrice) {
                        colors[0] = currentStyle.downColor;
                        colors[1] = currentStyle.downBorderColor;
                        colors[2] = currentStyle.downWickColor;
                    }
                    else {
                        colors[0] = currentStyle.noChangeColor;
                        colors[1] = currentStyle.noChangeBorderColor;
                        colors[2] = currentStyle.noChangeWickColor;
                    }
                    var openY = yAxis_1.convertToPixel(open_1);
                    var closeY = yAxis_1.convertToPixel(close_1);
                    var priceY = [
                        openY, closeY,
                        yAxis_1.convertToPixel(high),
                        yAxis_1.convertToPixel(low)
                    ];
                    priceY.sort(function (a, b) { return a - b; });
                    var correction = barSpace.gapBar % 2 === 0 ? 1 : 0;
                    var rects = [];
                    switch (type_1) {
                        case 'candle_solid': {
                            rects = _this._createSolidBar(x, priceY, barSpace, colors, correction);
                            break;
                        }
                        case 'candle_stroke': {
                            rects = _this._createStrokeBar(x, priceY, barSpace, colors, correction);
                            break;
                        }
                        case 'candle_up_stroke': {
                            if (close_1 > open_1) {
                                rects = _this._createStrokeBar(x, priceY, barSpace, colors, correction);
                            }
                            else {
                                rects = _this._createSolidBar(x, priceY, barSpace, colors, correction);
                            }
                            break;
                        }
                        case 'candle_down_stroke': {
                            if (open_1 > close_1) {
                                rects = _this._createStrokeBar(x, priceY, barSpace, colors, correction);
                            }
                            else {
                                rects = _this._createSolidBar(x, priceY, barSpace, colors, correction);
                            }
                            break;
                        }
                        case 'ohlc': {
                            rects = [
                                {
                                    name: 'rect',
                                    attrs: [
                                        {
                                            x: x - halfOhlcSize_1,
                                            y: priceY[0],
                                            width: ohlcSize_1,
                                            height: priceY[3] - priceY[0]
                                        },
                                        {
                                            x: x - barSpace.halfGapBar,
                                            y: openY + ohlcSize_1 > priceY[3] ? priceY[3] - ohlcSize_1 : openY,
                                            width: barSpace.halfGapBar - halfOhlcSize_1,
                                            height: ohlcSize_1
                                        },
                                        {
                                            x: x + halfOhlcSize_1,
                                            y: closeY + ohlcSize_1 > priceY[3] ? priceY[3] - ohlcSize_1 : closeY,
                                            width: barSpace.halfGapBar - halfOhlcSize_1,
                                            height: ohlcSize_1
                                        }
                                    ],
                                    styles: { color: colors[0] }
                                }
                            ];
                            break;
                        }
                    }
                    rects.forEach(function (rect) {
                        var _a;
                        var handler = null;
                        if (isMain) {
                            handler = {
                                mouseClickEvent: _this._boundCandleBarClickEvent(visibleData)
                            };
                        }
                        (_a = _this.createFigure(rect, handler !== null && handler !== void 0 ? handler : undefined)) === null || _a === void 0 ? void 0 : _a.draw(ctx);
                    });
                }
            });
        }
    };
    CandleBarView.prototype.getCandleBarOptions = function () {
        var candleStyles = this.getWidget().getPane().getChart().getStyles().candle;
        return {
            type: candleStyles.type,
            styles: candleStyles.bar,
            fadedStyles: candleStyles.fadedBar
        };
    };
    CandleBarView.prototype._createSolidBar = function (x, priceY, barSpace, colors, correction) {
        return [
            {
                name: 'rect',
                attrs: {
                    x: x,
                    y: priceY[0],
                    width: 1,
                    height: priceY[3] - priceY[0]
                },
                styles: { color: colors[2] }
            },
            {
                name: 'rect',
                attrs: {
                    x: x - barSpace.halfGapBar,
                    y: priceY[1],
                    width: barSpace.gapBar + correction,
                    height: Math.max(1, priceY[2] - priceY[1])
                },
                styles: {
                    style: 'stroke_fill',
                    color: colors[0],
                    borderColor: colors[1]
                }
            }
        ];
    };
    CandleBarView.prototype._createStrokeBar = function (x, priceY, barSpace, colors, correction) {
        return [
            {
                name: 'rect',
                attrs: [
                    {
                        x: x,
                        y: priceY[0],
                        width: 1,
                        height: priceY[1] - priceY[0]
                    },
                    {
                        x: x,
                        y: priceY[2],
                        width: 1,
                        height: priceY[3] - priceY[2]
                    }
                ],
                styles: { color: colors[2] }
            },
            {
                name: 'rect',
                attrs: {
                    x: x - barSpace.halfGapBar,
                    y: priceY[1],
                    width: barSpace.gapBar + correction,
                    height: Math.max(1, priceY[2] - priceY[1])
                },
                styles: {
                    style: 'stroke',
                    borderColor: colors[1]
                }
            }
        ];
    };
    return CandleBarView;
}(ChildrenView_1.default));
exports.default = CandleBarView;
//# sourceMappingURL=CandleBarView.js.map