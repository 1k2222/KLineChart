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
 * RSI
 * RSI = SUM(MAX(CLOSE - REF(CLOSE,1),0),N) / SUM(ABS(CLOSE - REF(CLOSE,1)),N) × 100
 */
var relativeStrengthIndex = {
    name: 'RSI',
    shortName: 'RSI',
    calcParams: [6, 12, 24],
    figures: [
        { key: 'rsi1', title: 'RSI1: ', type: 'line' },
        { key: 'rsi2', title: 'RSI2: ', type: 'line' },
        { key: 'rsi3', title: 'RSI3: ', type: 'line' }
    ],
    regenerateFigures: function (params) { return params.map(function (_, index) {
        var num = index + 1;
        return { key: "rsi".concat(num), title: "RSI".concat(num, ": "), type: 'line' };
    }); },
    calc: function (dataList, indicator) {
        var params = indicator.calcParams, figures = indicator.figures;
        var sumCloseAs = [];
        var sumCloseBs = [];
        return dataList.map(function (kLineData, i) {
            var _a;
            var rsi = {};
            var prevClose = ((_a = dataList[i - 1]) !== null && _a !== void 0 ? _a : kLineData).close;
            var tmp = kLineData.close - prevClose;
            params.forEach(function (p, index) {
                var _a, _b, _c;
                if (tmp > 0) {
                    sumCloseAs[index] = ((_a = sumCloseAs[index]) !== null && _a !== void 0 ? _a : 0) + tmp;
                }
                else {
                    sumCloseBs[index] = ((_b = sumCloseBs[index]) !== null && _b !== void 0 ? _b : 0) + Math.abs(tmp);
                }
                if (i >= p - 1) {
                    if (sumCloseBs[index] !== 0) {
                        rsi[figures[index].key] = 100 - (100.0 / (1 + sumCloseAs[index] / sumCloseBs[index]));
                    }
                    else {
                        rsi[figures[index].key] = 0;
                    }
                    var agoData = dataList[i - (p - 1)];
                    var agoPreData = (_c = dataList[i - p]) !== null && _c !== void 0 ? _c : agoData;
                    var agoTmp = agoData.close - agoPreData.close;
                    if (agoTmp > 0) {
                        sumCloseAs[index] -= agoTmp;
                    }
                    else {
                        sumCloseBs[index] -= Math.abs(agoTmp);
                    }
                }
            });
            return rsi;
        });
    }
};
exports.default = relativeStrengthIndex;
//# sourceMappingURL=relativeStrengthIndex.js.map