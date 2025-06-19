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
var priceLine = {
    name: 'priceLine',
    totalStep: 2,
    needDefaultPointFigure: true,
    needDefaultXAxisFigure: true,
    needDefaultYAxisFigure: true,
    createPointFigures: function (_a) {
        var _b, _c, _d;
        var chart = _a.chart, coordinates = _a.coordinates, bounding = _a.bounding, overlay = _a.overlay, yAxis = _a.yAxis;
        var precision = 0;
        if ((_b = yAxis === null || yAxis === void 0 ? void 0 : yAxis.isInCandle()) !== null && _b !== void 0 ? _b : true) {
            precision = (_d = (_c = chart.getSymbol()) === null || _c === void 0 ? void 0 : _c.pricePrecision) !== null && _d !== void 0 ? _d : 2;
        }
        else {
            var indicators = chart.getIndicators({ paneId: overlay.paneId });
            indicators.forEach(function (indicator) {
                precision = Math.max(precision, indicator.precision);
            });
        }
        var _e = (overlay.points)[0].value, value = _e === void 0 ? 0 : _e;
        return [
            {
                type: 'line',
                attrs: { coordinates: [coordinates[0], { x: bounding.width, y: coordinates[0].y }] }
            },
            {
                type: 'text',
                ignoreEvent: true,
                attrs: {
                    x: coordinates[0].x,
                    y: coordinates[0].y,
                    text: chart.getDecimalFold().format(chart.getThousandsSeparator().format(value.toFixed(precision))),
                    baseline: 'bottom'
                }
            }
        ];
    }
};
exports.default = priceLine;
//# sourceMappingURL=priceLine.js.map