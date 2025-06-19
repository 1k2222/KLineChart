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
var Indicator_1 = require("../component/Indicator");
var View_1 = __importDefault(require("./View"));
var IndicatorLastValueView = /** @class */ (function (_super) {
    __extends(IndicatorLastValueView, _super);
    function IndicatorLastValueView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IndicatorLastValueView.prototype.drawImp = function (ctx) {
        var _this = this;
        var widget = this.getWidget();
        var pane = widget.getPane();
        var bounding = widget.getBounding();
        var chartStore = pane.getChart().getChartStore();
        var defaultStyles = chartStore.getStyles().indicator;
        var lastValueMarkStyles = defaultStyles.lastValueMark;
        var lastValueMarkTextStyles = lastValueMarkStyles.text;
        if (lastValueMarkStyles.show) {
            var yAxis_1 = pane.getAxisComponent();
            var yAxisRange_1 = yAxis_1.getRange();
            var dataList = chartStore.getDataList();
            var dataIndex_1 = dataList.length - 1;
            var indicators = chartStore.getIndicatorsByPaneId(pane.getId());
            var formatter_1 = chartStore.getInnerFormatter();
            var decimalFold_1 = chartStore.getDecimalFold();
            var thousandsSeparator_1 = chartStore.getThousandsSeparator();
            indicators.forEach(function (indicator) {
                var _a, _b;
                var result = indicator.result;
                var data = (_b = (_a = result[dataIndex_1]) !== null && _a !== void 0 ? _a : result[dataIndex_1 - 1]) !== null && _b !== void 0 ? _b : {};
                if ((0, typeChecks_1.isValid)(data) && indicator.visible) {
                    var precision_1 = indicator.precision;
                    (0, Indicator_1.eachFigures)(indicator, dataIndex_1, defaultStyles, function (figure, figureStyles) {
                        var _a;
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- ignore
                        var value = data[figure.key];
                        if ((0, typeChecks_1.isNumber)(value)) {
                            var y = yAxis_1.convertToNicePixel(value);
                            var text = yAxis_1.displayValueToText(yAxis_1.realValueToDisplayValue(yAxis_1.valueToRealValue(value, { range: yAxisRange_1 }), { range: yAxisRange_1 }), precision_1);
                            if (indicator.shouldFormatBigNumber) {
                                text = formatter_1.formatBigNumber(text);
                            }
                            text = decimalFold_1.format(thousandsSeparator_1.format(text));
                            var x = 0;
                            var textAlign = 'left';
                            if (yAxis_1.isFromZero()) {
                                x = 0;
                                textAlign = 'left';
                            }
                            else {
                                x = bounding.width;
                                textAlign = 'right';
                            }
                            (_a = _this.createFigure({
                                name: 'text',
                                attrs: {
                                    x: x,
                                    y: y,
                                    text: text,
                                    align: textAlign,
                                    baseline: 'middle'
                                },
                                styles: __assign(__assign({}, lastValueMarkTextStyles), { backgroundColor: figureStyles.color })
                            })) === null || _a === void 0 ? void 0 : _a.draw(ctx);
                        }
                    });
                }
            });
        }
    };
    return IndicatorLastValueView;
}(View_1.default));
exports.default = IndicatorLastValueView;
//# sourceMappingURL=IndicatorLastValueView.js.map