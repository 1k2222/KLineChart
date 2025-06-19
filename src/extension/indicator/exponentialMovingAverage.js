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
/**
 * EMA 指数移动平均
 */
var exponentialMovingAverage = {
    name: 'EMA',
    shortName: 'EMA',
    series: 'price',
    calcParams: [6, 12, 20],
    precision: 2,
    shouldOhlc: true,
    figures: [
        { key: 'ema1', title: 'EMA6: ', type: 'line' },
        { key: 'ema2', title: 'EMA12: ', type: 'line' },
        { key: 'ema3', title: 'EMA20: ', type: 'line' }
    ],
    regenerateFigures: function (params) { return params.map(function (p, i) { return ({ key: "ema".concat(i + 1), title: "EMA".concat(p, ": "), type: 'line' }); }); },
    calc: function (dataList, indicator) {
        var params = indicator.calcParams, figures = indicator.figures;
        var closeSum = 0;
        var emaValues = [];
        return dataList.map(function (kLineData, i) {
            var ema = {};
            var close = kLineData.close;
            closeSum += close;
            params.forEach(function (p, index) {
                if (i >= p - 1) {
                    if (i > p - 1) {
                        emaValues[index] = (2 * close + (p - 1) * emaValues[index]) / (p + 1);
                    }
                    else {
                        emaValues[index] = closeSum / p;
                    }
                    ema[figures[index].key] = emaValues[index];
                }
            });
            return ema;
        });
    }
};
exports.default = exponentialMovingAverage;
//# sourceMappingURL=exponentialMovingAverage.js.map