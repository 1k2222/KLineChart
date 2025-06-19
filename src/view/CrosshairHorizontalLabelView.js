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
var CrosshairHorizontalLabelView = /** @class */ (function (_super) {
    __extends(CrosshairHorizontalLabelView, _super);
    function CrosshairHorizontalLabelView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CrosshairHorizontalLabelView.prototype.drawImp = function (ctx) {
        var _a;
        var widget = this.getWidget();
        var pane = widget.getPane();
        var chartStore = widget.getPane().getChart().getChartStore();
        var crosshair = chartStore.getCrosshair();
        if ((0, typeChecks_1.isString)(crosshair.paneId) && this.compare(crosshair, pane.getId())) {
            var styles = chartStore.getStyles().crosshair;
            if (styles.show) {
                var directionStyles = this.getDirectionStyles(styles);
                var textStyles = directionStyles.text;
                if (directionStyles.show && textStyles.show) {
                    var bounding = widget.getBounding();
                    var axis = pane.getAxisComponent();
                    var text = this.getText(crosshair, chartStore, axis);
                    ctx.font = (0, canvas_1.createFont)(textStyles.size, textStyles.weight, textStyles.family);
                    (_a = this.createFigure({
                        name: 'text',
                        attrs: this.getTextAttrs(text, ctx.measureText(text).width, crosshair, bounding, axis, textStyles),
                        styles: textStyles
                    })) === null || _a === void 0 ? void 0 : _a.draw(ctx);
                }
            }
        }
    };
    CrosshairHorizontalLabelView.prototype.compare = function (crosshair, paneId) {
        return crosshair.paneId === paneId;
    };
    CrosshairHorizontalLabelView.prototype.getDirectionStyles = function (styles) {
        return styles.horizontal;
    };
    CrosshairHorizontalLabelView.prototype.getText = function (crosshair, chartStore, axis) {
        var _a, _b;
        var yAxis = axis;
        var value = axis.convertFromPixel(crosshair.y);
        var precision = 0;
        var shouldFormatBigNumber = false;
        if (yAxis.isInCandle()) {
            precision = (_b = (_a = chartStore.getSymbol()) === null || _a === void 0 ? void 0 : _a.pricePrecision) !== null && _b !== void 0 ? _b : 2;
        }
        else {
            var indicators = chartStore.getIndicatorsByPaneId(crosshair.paneId);
            indicators.forEach(function (indicator) {
                precision = Math.max(indicator.precision, precision);
                shouldFormatBigNumber || (shouldFormatBigNumber = indicator.shouldFormatBigNumber);
            });
        }
        var yAxisRange = yAxis.getRange();
        var text = yAxis.displayValueToText(yAxis.realValueToDisplayValue(yAxis.valueToRealValue(value, { range: yAxisRange }), { range: yAxisRange }), precision);
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- ignore
        if (shouldFormatBigNumber) {
            text = chartStore.getInnerFormatter().formatBigNumber(text);
        }
        return chartStore.getDecimalFold().format(chartStore.getThousandsSeparator().format(text));
    };
    CrosshairHorizontalLabelView.prototype.getTextAttrs = function (text, _textWidth, crosshair, bounding, axis, _styles) {
        var yAxis = axis;
        var x = 0;
        var textAlign = 'left';
        if (yAxis.isFromZero()) {
            x = 0;
            textAlign = 'left';
        }
        else {
            x = bounding.width;
            textAlign = 'right';
        }
        return { x: x, y: crosshair.y, text: text, align: textAlign, baseline: 'middle' };
    };
    return CrosshairHorizontalLabelView;
}(View_1.default));
exports.default = CrosshairHorizontalLabelView;
//# sourceMappingURL=CrosshairHorizontalLabelView.js.map