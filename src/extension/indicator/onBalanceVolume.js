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
 * OBV
 * OBV = REF(OBV) + sign * V
 */
var onBalanceVolume = {
    name: 'OBV',
    shortName: 'OBV',
    calcParams: [30],
    figures: [
        { key: 'obv', title: 'OBV: ', type: 'line' },
        { key: 'maObv', title: 'MAOBV: ', type: 'line' }
    ],
    calc: function (dataList, indicator) {
        var params = indicator.calcParams;
        var obvSum = 0;
        var oldObv = 0;
        var result = [];
        dataList.forEach(function (kLineData, i) {
            var _a, _b, _c, _d;
            var prevKLineData = (_a = dataList[i - 1]) !== null && _a !== void 0 ? _a : kLineData;
            if (kLineData.close < prevKLineData.close) {
                oldObv -= ((_b = kLineData.volume) !== null && _b !== void 0 ? _b : 0);
            }
            else if (kLineData.close > prevKLineData.close) {
                oldObv += ((_c = kLineData.volume) !== null && _c !== void 0 ? _c : 0);
            }
            var obv = { obv: oldObv };
            obvSum += oldObv;
            if (i >= params[0] - 1) {
                obv.maObv = obvSum / params[0];
                obvSum -= ((_d = result[i - (params[0] - 1)].obv) !== null && _d !== void 0 ? _d : 0);
            }
            result.push(obv);
        });
        return result;
    }
};
exports.default = onBalanceVolume;
//# sourceMappingURL=onBalanceVolume.js.map