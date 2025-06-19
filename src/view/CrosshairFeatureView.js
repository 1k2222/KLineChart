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
var canvas_1 = require("../common/utils/canvas");
var View_1 = __importDefault(require("./View"));
var CrosshairFeatureView = /** @class */ (function (_super) {
    __extends(CrosshairFeatureView, _super);
    function CrosshairFeatureView(widget) {
        var _this = _super.call(this, widget) || this;
        _this._activeFeatureInfo = null;
        _this._featureClickEvent = function (featureInfo) { return function () {
            var pane = _this.getWidget().getPane();
            pane.getChart().getChartStore().executeAction('onCrosshairFeatureClick', featureInfo);
            return true;
        }; };
        _this._featureMouseMoveEvent = function (featureInfo) { return function () {
            _this._activeFeatureInfo = featureInfo;
            _this.getWidget().setForceCursor('pointer');
            return true;
        }; };
        _this.registerEvent('mouseMoveEvent', function (_) {
            _this._activeFeatureInfo = null;
            _this.getWidget().setForceCursor(null);
            return false;
        });
        return _this;
    }
    CrosshairFeatureView.prototype.drawImp = function (ctx) {
        var _this = this;
        var _a, _b;
        var widget = this.getWidget();
        var pane = widget.getPane();
        var chartStore = widget.getPane().getChart().getChartStore();
        var crosshair = chartStore.getCrosshair();
        var weight = this.getWidget();
        var yAxis = weight.getPane().getAxisComponent();
        if ((0, typeChecks_1.isString)(crosshair.paneId) && crosshair.paneId === pane.getId() && yAxis.isInCandle()) {
            var styles = chartStore.getStyles().crosshair;
            var features = styles.horizontal.features;
            if (styles.show && styles.horizontal.show && features.length > 0) {
                var isRight_1 = yAxis.position === 'right';
                var bounding = weight.getBounding();
                var yAxisTextWidth = 0;
                var horizontalTextStyles = styles.horizontal.text;
                if (yAxis.inside && horizontalTextStyles.show) {
                    var value = yAxis.convertFromPixel(crosshair.y);
                    var range = yAxis.getRange();
                    var text = yAxis.displayValueToText(yAxis.realValueToDisplayValue(yAxis.valueToRealValue(value, { range: range }), { range: range }), (_b = (_a = chartStore.getSymbol()) === null || _a === void 0 ? void 0 : _a.pricePrecision) !== null && _b !== void 0 ? _b : 2);
                    text = chartStore.getDecimalFold().format(chartStore.getThousandsSeparator().format(text));
                    yAxisTextWidth = horizontalTextStyles.paddingLeft +
                        (0, canvas_1.calcTextWidth)(text, horizontalTextStyles.size, horizontalTextStyles.weight, horizontalTextStyles.family) +
                        horizontalTextStyles.paddingRight;
                }
                var x_1 = yAxisTextWidth;
                if (isRight_1) {
                    x_1 = bounding.width - yAxisTextWidth;
                }
                var y_1 = crosshair.y;
                features.forEach(function (feature) {
                    var _a, _b, _c, _d;
                    var _e = feature.marginLeft, marginLeft = _e === void 0 ? 0 : _e, _f = feature.marginTop, marginTop = _f === void 0 ? 0 : _f, _g = feature.marginRight, marginRight = _g === void 0 ? 0 : _g, _h = feature.paddingLeft, paddingLeft = _h === void 0 ? 0 : _h, _j = feature.paddingTop, paddingTop = _j === void 0 ? 0 : _j, _k = feature.paddingRight, paddingRight = _k === void 0 ? 0 : _k, _l = feature.paddingBottom, paddingBottom = _l === void 0 ? 0 : _l, color = feature.color, activeColor = feature.activeColor, backgroundColor = feature.backgroundColor, activeBackgroundColor = feature.activeBackgroundColor, borderRadius = feature.borderRadius, _m = feature.size, size = _m === void 0 ? 0 : _m, type = feature.type, content = feature.content;
                    var width = size;
                    if (type === 'icon_font') {
                        var iconFont = content;
                        width = paddingLeft + (0, canvas_1.calcTextWidth)(iconFont.code, size, 'normal', iconFont.family) + paddingRight;
                    }
                    if (isRight_1) {
                        x_1 -= (width + marginRight);
                    }
                    else {
                        x_1 += marginLeft;
                    }
                    var finalColor = color;
                    var finalBackgroundColor = backgroundColor;
                    if (((_a = _this._activeFeatureInfo) === null || _a === void 0 ? void 0 : _a.feature.id) === feature.id) {
                        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- ignore
                        finalColor = activeColor !== null && activeColor !== void 0 ? activeColor : color;
                        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- ignore
                        finalBackgroundColor = activeBackgroundColor !== null && activeBackgroundColor !== void 0 ? activeBackgroundColor : backgroundColor;
                    }
                    var eventHandler = {
                        mouseClickEvent: _this._featureClickEvent({ crosshair: crosshair, feature: feature }),
                        mouseMoveEvent: _this._featureMouseMoveEvent({ crosshair: crosshair, feature: feature })
                    };
                    if (type === 'icon_font') {
                        var iconFont = content;
                        (_b = _this.createFigure({
                            name: 'text',
                            attrs: {
                                text: iconFont.code,
                                x: x_1,
                                y: y_1 + marginTop,
                                baseline: 'middle'
                            },
                            styles: {
                                paddingLeft: paddingLeft,
                                paddingTop: paddingTop,
                                paddingRight: paddingRight,
                                paddingBottom: paddingBottom,
                                borderRadius: borderRadius,
                                size: size,
                                family: iconFont.family,
                                color: finalColor,
                                backgroundColor: finalBackgroundColor
                            }
                        }, eventHandler)) === null || _b === void 0 ? void 0 : _b.draw(ctx);
                    }
                    else {
                        (_c = _this.createFigure({
                            name: 'rect',
                            attrs: { x: x_1, y: y_1 + marginTop - size / 2, width: size, height: size },
                            styles: {
                                paddingLeft: paddingLeft,
                                paddingTop: paddingTop,
                                paddingRight: paddingRight,
                                paddingBottom: paddingBottom,
                                color: finalBackgroundColor
                            }
                        }, eventHandler)) === null || _c === void 0 ? void 0 : _c.draw(ctx);
                        var path = content;
                        (_d = _this.createFigure({
                            name: 'path',
                            attrs: { path: path.path, x: x_1, y: y_1 + marginTop + paddingTop - size / 2, width: size, height: size },
                            styles: {
                                style: path.style,
                                lineWidth: path.lineWidth,
                                color: finalColor
                            }
                        })) === null || _d === void 0 ? void 0 : _d.draw(ctx);
                    }
                    if (isRight_1) {
                        x_1 -= marginLeft;
                    }
                    else {
                        x_1 += (width + marginRight);
                    }
                });
            }
        }
    };
    return CrosshairFeatureView;
}(View_1.default));
exports.default = CrosshairFeatureView;
//# sourceMappingURL=CrosshairFeatureView.js.map