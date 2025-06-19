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
var number_1 = require("../../common/utils/number");
/**
 * WR
 * 公式 WR(N) = 100 * [ C - HIGH(N) ] / [ HIGH(N)-LOW(N) ]
 */
var williamsR = {
    name: 'WR',
    shortName: 'WR',
    calcParams: [6, 10, 14],
    figures: [
        { key: 'wr1', title: 'WR1: ', type: 'line' },
        { key: 'wr2', title: 'WR2: ', type: 'line' },
        { key: 'wr3', title: 'WR3: ', type: 'line' }
    ],
    regenerateFigures: function (params) { return params.map(function (_, i) { return ({ key: "wr".concat(i + 1), title: "WR".concat(i + 1, ": "), type: 'line' }); }); },
    calc: function (dataList, indicator) {
        var params = indicator.calcParams, figures = indicator.figures;
        return dataList.map(function (kLineData, i) {
            var wr = {};
            var close = kLineData.close;
            params.forEach(function (param, index) {
                var p = param - 1;
                if (i >= p) {
                    var hln = (0, number_1.getMaxMin)(dataList.slice(i - p, i + 1), 'high', 'low');
                    var hn = hln[0];
                    var ln = hln[1];
                    var hnSubLn = hn - ln;
                    wr[figures[index].key] = hnSubLn === 0 ? 0 : (close - hn) / hnSubLn * 100;
                }
            });
            return wr;
        });
    }
};
exports.default = williamsR;
//# sourceMappingURL=williamsR.js.map