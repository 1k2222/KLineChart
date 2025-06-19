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
var format_1 = require("../common/utils/format");
var typeChecks_1 = require("../common/utils/typeChecks");
var canvas_1 = require("../common/utils/canvas");
var Indicator_1 = require("../component/Indicator");
var View_1 = __importDefault(require("./View"));
var IndicatorTooltipView = /** @class */ (function (_super) {
    __extends(IndicatorTooltipView, _super);
    function IndicatorTooltipView(widget) {
        var _this = _super.call(this, widget) || this;
        _this._activeFeatureInfo = null;
        _this._featureClickEvent = function (type, featureInfo) { return function () {
            var pane = _this.getWidget().getPane();
            pane.getChart().getChartStore().executeAction(type, featureInfo);
            return true;
        }; };
        _this._featureMouseMoveEvent = function (featureInfo) { return function () {
            _this._activeFeatureInfo = featureInfo;
            return true;
        }; };
        _this.registerEvent('mouseMoveEvent', function (_) {
            _this._activeFeatureInfo = null;
            return false;
        });
        return _this;
    }
    IndicatorTooltipView.prototype.drawImp = function (ctx) {
        var widget = this.getWidget();
        var pane = widget.getPane();
        var chartStore = pane.getChart().getChartStore();
        var crosshair = chartStore.getCrosshair();
        if ((0, typeChecks_1.isValid)(crosshair.kLineData)) {
            var bounding = widget.getBounding();
            var _a = chartStore.getStyles().indicator.tooltip, offsetLeft = _a.offsetLeft, offsetTop = _a.offsetTop, offsetRight = _a.offsetRight;
            this.drawIndicatorTooltip(ctx, offsetLeft, offsetTop, bounding.width - offsetRight);
        }
    };
    IndicatorTooltipView.prototype.drawIndicatorTooltip = function (ctx, left, top, maxWidth) {
        var _this = this;
        var pane = this.getWidget().getPane();
        var chartStore = pane.getChart().getChartStore();
        var styles = chartStore.getStyles().indicator;
        var tooltipStyles = styles.tooltip;
        if (this.isDrawTooltip(chartStore.getCrosshair(), tooltipStyles)) {
            var indicators = chartStore.getIndicatorsByPaneId(pane.getId());
            var tooltipTitleStyles_1 = tooltipStyles.title;
            var tooltipLegendStyles_1 = tooltipStyles.legend;
            indicators.forEach(function (indicator) {
                var prevRowHeight = 0;
                var coordinate = { x: left, y: top };
                var _a = _this.getIndicatorTooltipData(indicator), name = _a.name, calcParamsText = _a.calcParamsText, legends = _a.legends, featuresStyles = _a.features;
                var nameValid = name.length > 0;
                var legendValid = legends.length > 0;
                if (nameValid || legendValid) {
                    var features = _this.classifyTooltipFeatures(featuresStyles);
                    prevRowHeight = _this.drawStandardTooltipFeatures(ctx, features[0], coordinate, indicator, left, prevRowHeight, maxWidth);
                    if (nameValid) {
                        var text = name;
                        if (calcParamsText.length > 0) {
                            text = "".concat(text).concat(calcParamsText);
                        }
                        var color = tooltipTitleStyles_1.color;
                        prevRowHeight = _this.drawStandardTooltipLegends(ctx, [
                            {
                                title: { text: '', color: color },
                                value: { text: text, color: color }
                            }
                        ], coordinate, left, prevRowHeight, maxWidth, tooltipTitleStyles_1);
                    }
                    prevRowHeight = _this.drawStandardTooltipFeatures(ctx, features[1], coordinate, indicator, left, prevRowHeight, maxWidth);
                    if (legendValid) {
                        prevRowHeight = _this.drawStandardTooltipLegends(ctx, legends, coordinate, left, prevRowHeight, maxWidth, tooltipLegendStyles_1);
                    }
                    // draw right features
                    prevRowHeight = _this.drawStandardTooltipFeatures(ctx, features[2], coordinate, indicator, left, prevRowHeight, maxWidth);
                    top = coordinate.y + prevRowHeight;
                }
            });
        }
        return top;
    };
    IndicatorTooltipView.prototype.drawStandardTooltipFeatures = function (ctx, features, coordinate, indicator, left, prevRowHeight, maxWidth) {
        var _this = this;
        if (features.length > 0) {
            var width_1 = 0;
            var height_1 = 0;
            features.forEach(function (feature) {
                var _a = feature.marginLeft, marginLeft = _a === void 0 ? 0 : _a, _b = feature.marginTop, marginTop = _b === void 0 ? 0 : _b, _c = feature.marginRight, marginRight = _c === void 0 ? 0 : _c, _d = feature.marginBottom, marginBottom = _d === void 0 ? 0 : _d, _e = feature.paddingLeft, paddingLeft = _e === void 0 ? 0 : _e, _f = feature.paddingTop, paddingTop = _f === void 0 ? 0 : _f, _g = feature.paddingRight, paddingRight = _g === void 0 ? 0 : _g, _h = feature.paddingBottom, paddingBottom = _h === void 0 ? 0 : _h, _j = feature.size, size = _j === void 0 ? 0 : _j, type = feature.type, content = feature.content;
                var contentWidth = 0;
                if (type === 'icon_font') {
                    var iconFont = content;
                    ctx.font = (0, canvas_1.createFont)(size, 'normal', iconFont.family);
                    contentWidth = ctx.measureText(iconFont.code).width;
                }
                else {
                    contentWidth = size;
                }
                width_1 += (marginLeft + paddingLeft + contentWidth + paddingRight + marginRight);
                height_1 = Math.max(height_1, marginTop + paddingTop + size + paddingBottom + marginBottom);
            });
            if (coordinate.x + width_1 > maxWidth) {
                coordinate.x = left;
                coordinate.y += prevRowHeight;
                prevRowHeight = height_1;
            }
            else {
                prevRowHeight = Math.max(prevRowHeight, height_1);
            }
            var pane = this.getWidget().getPane();
            var paneId_1 = pane.getId();
            features.forEach(function (feature) {
                var _a, _b, _c, _d, _e;
                var _f = feature.marginLeft, marginLeft = _f === void 0 ? 0 : _f, _g = feature.marginTop, marginTop = _g === void 0 ? 0 : _g, _h = feature.marginRight, marginRight = _h === void 0 ? 0 : _h, _j = feature.paddingLeft, paddingLeft = _j === void 0 ? 0 : _j, _k = feature.paddingTop, paddingTop = _k === void 0 ? 0 : _k, _l = feature.paddingRight, paddingRight = _l === void 0 ? 0 : _l, _m = feature.paddingBottom, paddingBottom = _m === void 0 ? 0 : _m, backgroundColor = feature.backgroundColor, activeBackgroundColor = feature.activeBackgroundColor, borderRadius = feature.borderRadius, _o = feature.size, size = _o === void 0 ? 0 : _o, color = feature.color, activeColor = feature.activeColor, type = feature.type, content = feature.content;
                var finalColor = color;
                var finalBackgroundColor = backgroundColor;
                if (((_a = _this._activeFeatureInfo) === null || _a === void 0 ? void 0 : _a.paneId) === paneId_1 &&
                    ((_b = _this._activeFeatureInfo.indicator) === null || _b === void 0 ? void 0 : _b.id) === (indicator === null || indicator === void 0 ? void 0 : indicator.id) &&
                    _this._activeFeatureInfo.feature.id === feature.id) {
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- ignore
                    finalColor = activeColor !== null && activeColor !== void 0 ? activeColor : color;
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- ignore
                    finalBackgroundColor = activeBackgroundColor !== null && activeBackgroundColor !== void 0 ? activeBackgroundColor : backgroundColor;
                }
                var actionType = 'onCandleTooltipFeatureClick';
                var featureInfo = {
                    paneId: paneId_1,
                    feature: feature
                };
                if ((0, typeChecks_1.isValid)(indicator)) {
                    actionType = 'onIndicatorTooltipFeatureClick';
                    featureInfo.indicator = indicator;
                }
                var eventHandler = {
                    mouseClickEvent: _this._featureClickEvent(actionType, featureInfo),
                    mouseMoveEvent: _this._featureMouseMoveEvent(featureInfo)
                };
                var contentWidth = 0;
                if (type === 'icon_font') {
                    var iconFont = content;
                    (_c = _this.createFigure({
                        name: 'text',
                        attrs: { text: iconFont.code, x: coordinate.x + marginLeft, y: coordinate.y + marginTop },
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
                    }, eventHandler)) === null || _c === void 0 ? void 0 : _c.draw(ctx);
                    contentWidth = ctx.measureText(iconFont.code).width;
                }
                else {
                    (_d = _this.createFigure({
                        name: 'rect',
                        attrs: { x: coordinate.x + marginLeft, y: coordinate.y + marginTop, width: size, height: size },
                        styles: {
                            paddingLeft: paddingLeft,
                            paddingTop: paddingTop,
                            paddingRight: paddingRight,
                            paddingBottom: paddingBottom,
                            color: finalBackgroundColor
                        }
                    }, eventHandler)) === null || _d === void 0 ? void 0 : _d.draw(ctx);
                    var path = content;
                    (_e = _this.createFigure({
                        name: 'path',
                        attrs: { path: path.path, x: coordinate.x + marginLeft + paddingLeft, y: coordinate.y + marginTop + paddingTop, width: size, height: size },
                        styles: {
                            style: path.style,
                            lineWidth: path.lineWidth,
                            color: finalColor
                        }
                    })) === null || _e === void 0 ? void 0 : _e.draw(ctx);
                    contentWidth = size;
                }
                coordinate.x += (marginLeft + paddingLeft + contentWidth + paddingRight + marginRight);
            });
        }
        return prevRowHeight;
    };
    IndicatorTooltipView.prototype.drawStandardTooltipLegends = function (ctx, legends, coordinate, left, prevRowHeight, maxWidth, styles) {
        var _this = this;
        if (legends.length > 0) {
            var marginLeft_1 = styles.marginLeft, marginTop_1 = styles.marginTop, marginRight_1 = styles.marginRight, marginBottom_1 = styles.marginBottom, size_1 = styles.size, family_1 = styles.family, weight_1 = styles.weight;
            ctx.font = (0, canvas_1.createFont)(size_1, weight_1, family_1);
            legends.forEach(function (data) {
                var _a, _b;
                var title = data.title;
                var value = data.value;
                var titleTextWidth = ctx.measureText(title.text).width;
                var valueTextWidth = ctx.measureText(value.text).width;
                var totalTextWidth = titleTextWidth + valueTextWidth;
                var h = marginTop_1 + size_1 + marginBottom_1;
                if (coordinate.x + marginLeft_1 + totalTextWidth + marginRight_1 > maxWidth) {
                    coordinate.x = left;
                    coordinate.y += prevRowHeight;
                    prevRowHeight = h;
                }
                else {
                    prevRowHeight = Math.max(prevRowHeight, h);
                }
                if (title.text.length > 0) {
                    (_a = _this.createFigure({
                        name: 'text',
                        attrs: { x: coordinate.x + marginLeft_1, y: coordinate.y + marginTop_1, text: title.text },
                        styles: { color: title.color, size: size_1, family: family_1, weight: weight_1 }
                    })) === null || _a === void 0 ? void 0 : _a.draw(ctx);
                }
                (_b = _this.createFigure({
                    name: 'text',
                    attrs: { x: coordinate.x + marginLeft_1 + titleTextWidth, y: coordinate.y + marginTop_1, text: value.text },
                    styles: { color: value.color, size: size_1, family: family_1, weight: weight_1 }
                })) === null || _b === void 0 ? void 0 : _b.draw(ctx);
                coordinate.x += (marginLeft_1 + totalTextWidth + marginRight_1);
            });
        }
        return prevRowHeight;
    };
    IndicatorTooltipView.prototype.isDrawTooltip = function (crosshair, styles) {
        var showRule = styles.showRule;
        return showRule === 'always' ||
            (showRule === 'follow_cross' && (0, typeChecks_1.isString)(crosshair.paneId));
    };
    IndicatorTooltipView.prototype.getIndicatorTooltipData = function (indicator) {
        var _a, _b;
        var chartStore = this.getWidget().getPane().getChart().getChartStore();
        var styles = chartStore.getStyles().indicator;
        var tooltipStyles = styles.tooltip;
        var tooltipTitleStyles = tooltipStyles.title;
        var name = '';
        var calcParamsText = '';
        if (tooltipTitleStyles.show) {
            if (tooltipTitleStyles.showName) {
                name = indicator.shortName;
            }
            if (tooltipTitleStyles.showParams) {
                var calcParams = indicator.calcParams;
                if (calcParams.length > 0) {
                    calcParamsText = "(".concat(calcParams.join(','), ")");
                }
            }
        }
        var tooltipData = { name: name, calcParamsText: calcParamsText, legends: [], features: tooltipStyles.features };
        var dataIndex = chartStore.getCrosshair().dataIndex;
        var result = indicator.result;
        var formatter = chartStore.getInnerFormatter();
        var decimalFold = chartStore.getDecimalFold();
        var thousandsSeparator = chartStore.getThousandsSeparator();
        var legends = [];
        if (indicator.visible) {
            var data_1 = (_b = (_a = result[dataIndex]) !== null && _a !== void 0 ? _a : result[dataIndex - 1]) !== null && _b !== void 0 ? _b : {};
            var defaultValue_1 = tooltipStyles.legend.defaultValue;
            (0, Indicator_1.eachFigures)(indicator, dataIndex, styles, function (figure, figureStyles) {
                if ((0, typeChecks_1.isString)(figure.title)) {
                    var color = figureStyles.color;
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment  -- ignore
                    var value = data_1[figure.key];
                    if ((0, typeChecks_1.isNumber)(value)) {
                        value = (0, format_1.formatPrecision)(value, indicator.precision);
                        if (indicator.shouldFormatBigNumber) {
                            value = formatter.formatBigNumber(value);
                        }
                        value = decimalFold.format(thousandsSeparator.format(value));
                    }
                    legends.push({ title: { text: figure.title, color: color }, value: { text: (value !== null && value !== void 0 ? value : defaultValue_1), color: color } });
                }
            });
            tooltipData.legends = legends;
        }
        if ((0, typeChecks_1.isFunction)(indicator.createTooltipDataSource)) {
            var widget = this.getWidget();
            var pane = widget.getPane();
            var chart = pane.getChart();
            var _c = indicator.createTooltipDataSource({
                chart: chart,
                indicator: indicator,
                crosshair: chartStore.getCrosshair(),
                bounding: widget.getBounding(),
                xAxis: pane.getChart().getXAxisPane().getAxisComponent(),
                yAxis: pane.getAxisComponent()
            }), customName = _c.name, customCalcParamsText = _c.calcParamsText, customLegends = _c.legends, customFeatures = _c.features;
            if (tooltipTitleStyles.show) {
                if ((0, typeChecks_1.isString)(customName) && tooltipTitleStyles.showName) {
                    tooltipData.name = customName;
                }
                if ((0, typeChecks_1.isString)(customCalcParamsText) && tooltipTitleStyles.showParams) {
                    tooltipData.calcParamsText = customCalcParamsText;
                }
            }
            if ((0, typeChecks_1.isValid)(customFeatures)) {
                tooltipData.features = customFeatures;
            }
            if ((0, typeChecks_1.isValid)(customLegends) && indicator.visible) {
                var optimizedLegends_1 = [];
                var color_1 = styles.tooltip.legend.color;
                customLegends.forEach(function (data) {
                    var title = { text: '', color: color_1 };
                    if ((0, typeChecks_1.isObject)(data.title)) {
                        title = data.title;
                    }
                    else {
                        title.text = data.title;
                    }
                    var value = { text: '', color: color_1 };
                    if ((0, typeChecks_1.isObject)(data.value)) {
                        value = data.value;
                    }
                    else {
                        value.text = data.value;
                    }
                    if ((0, typeChecks_1.isNumber)(Number(value.text))) {
                        value.text = decimalFold.format(thousandsSeparator.format(value.text));
                    }
                    optimizedLegends_1.push({ title: title, value: value });
                });
                tooltipData.legends = optimizedLegends_1;
            }
        }
        return tooltipData;
    };
    IndicatorTooltipView.prototype.classifyTooltipFeatures = function (features) {
        var leftFeatures = [];
        var middleFeatures = [];
        var rightFeatures = [];
        features.forEach(function (feature) {
            switch (feature.position) {
                case 'left': {
                    leftFeatures.push(feature);
                    break;
                }
                case 'middle': {
                    middleFeatures.push(feature);
                    break;
                }
                case 'right': {
                    rightFeatures.push(feature);
                    break;
                }
            }
        });
        return [leftFeatures, middleFeatures, rightFeatures];
    };
    return IndicatorTooltipView;
}(View_1.default));
exports.default = IndicatorTooltipView;
//# sourceMappingURL=IndicatorTooltipView.js.map