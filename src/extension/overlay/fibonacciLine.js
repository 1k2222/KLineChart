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
Object.defineProperty(exports, "__esModule", { value: true });
var typeChecks_1 = require("../../common/utils/typeChecks");
var fibonacciLine = {
    name: 'fibonacciLine',
    totalStep: 3,
    needDefaultPointFigure: true,
    needDefaultXAxisFigure: true,
    needDefaultYAxisFigure: true,
    createPointFigures: function (_a) {
        var _b, _c, _d;
        var chart = _a.chart, coordinates = _a.coordinates, bounding = _a.bounding, overlay = _a.overlay, yAxis = _a.yAxis;
        var points = overlay.points;
        if (coordinates.length > 0) {
            var precision_1 = 0;
            if ((_b = yAxis === null || yAxis === void 0 ? void 0 : yAxis.isInCandle()) !== null && _b !== void 0 ? _b : true) {
                precision_1 = (_d = (_c = chart.getSymbol()) === null || _c === void 0 ? void 0 : _c.pricePrecision) !== null && _d !== void 0 ? _d : 2;
            }
            else {
                var indicators = chart.getIndicators({ paneId: overlay.paneId });
                indicators.forEach(function (indicator) {
                    precision_1 = Math.max(precision_1, indicator.precision);
                });
            }
            var lines_1 = [];
            var texts_1 = [];
            var startX_1 = 0;
            var endX_1 = bounding.width;
            if (coordinates.length > 1 && (0, typeChecks_1.isNumber)(points[0].value) && (0, typeChecks_1.isNumber)(points[1].value)) {
                var percents = [1, 0.786, 0.618, 0.5, 0.382, 0.236, 0];
                var yDif_1 = coordinates[0].y - coordinates[1].y;
                var valueDif_1 = points[0].value - points[1].value;
                percents.forEach(function (percent) {
                    var _a;
                    var y = coordinates[1].y + yDif_1 * percent;
                    var value = chart.getDecimalFold().format(chart.getThousandsSeparator().format((((_a = points[1].value) !== null && _a !== void 0 ? _a : 0) + valueDif_1 * percent).toFixed(precision_1)));
                    lines_1.push({ coordinates: [{ x: startX_1, y: y }, { x: endX_1, y: y }] });
                    texts_1.push({
                        x: startX_1,
                        y: y,
                        text: "".concat(value, " (").concat((percent * 100).toFixed(1), "%)"),
                        baseline: 'bottom'
                    });
                });
            }
            return [
                {
                    type: 'line',
                    attrs: lines_1
                }, {
                    type: 'text',
                    isCheckEvent: false,
                    attrs: texts_1
                }
            ];
        }
        return [];
    }
};
exports.default = fibonacciLine;
//# sourceMappingURL=fibonacciLine.js.map