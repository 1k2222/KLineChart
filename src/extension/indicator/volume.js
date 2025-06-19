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
var format_1 = require("../../common/utils/format");
var typeChecks_1 = require("../../common/utils/typeChecks");
function getVolumeFigure() {
    return {
        key: 'volume',
        title: 'VOLUME: ',
        type: 'bar',
        baseValue: 0,
        styles: function (_a) {
            var data = _a.data, indicator = _a.indicator, defaultStyles = _a.defaultStyles;
            var current = data.current;
            var color = (0, format_1.formatValue)(indicator.styles, 'bars[0].noChangeColor', (defaultStyles.bars)[0].noChangeColor);
            if ((0, typeChecks_1.isValid)(current)) {
                if (current.close > current.open) {
                    color = (0, format_1.formatValue)(indicator.styles, 'bars[0].upColor', (defaultStyles.bars)[0].upColor);
                }
                else if (current.close < current.open) {
                    color = (0, format_1.formatValue)(indicator.styles, 'bars[0].downColor', (defaultStyles.bars)[0].downColor);
                }
            }
            return { color: color };
        }
    };
}
var volume = {
    name: 'VOL',
    shortName: 'VOL',
    series: 'volume',
    calcParams: [5, 10, 20],
    shouldFormatBigNumber: true,
    precision: 0,
    minValue: 0,
    figures: [
        { key: 'ma1', title: 'MA5: ', type: 'line' },
        { key: 'ma2', title: 'MA10: ', type: 'line' },
        { key: 'ma3', title: 'MA20: ', type: 'line' },
        getVolumeFigure()
    ],
    regenerateFigures: function (params) {
        var figures = params.map(function (p, i) { return ({ key: "ma".concat(i + 1), title: "MA".concat(p, ": "), type: 'line' }); });
        figures.push(getVolumeFigure());
        return figures;
    },
    calc: function (dataList, indicator) {
        var params = indicator.calcParams, figures = indicator.figures;
        var volSums = [];
        return dataList.map(function (kLineData, i) {
            var _a;
            var volume = (_a = kLineData.volume) !== null && _a !== void 0 ? _a : 0;
            var vol = { volume: volume, open: kLineData.open, close: kLineData.close };
            params.forEach(function (p, index) {
                var _a, _b;
                volSums[index] = ((_a = volSums[index]) !== null && _a !== void 0 ? _a : 0) + volume;
                if (i >= p - 1) {
                    vol[figures[index].key] = volSums[index] / p;
                    volSums[index] -= ((_b = dataList[i - (p - 1)].volume) !== null && _b !== void 0 ? _b : 0);
                }
            });
            return vol;
        });
    }
};
exports.default = volume;
//# sourceMappingURL=volume.js.map