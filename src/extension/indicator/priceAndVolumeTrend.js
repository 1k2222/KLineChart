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
 * 价量趋势指标
 * 公式:
 * X = (CLOSE - REF(CLOSE, 1)) / REF(CLOSE, 1) * VOLUME
 * PVT = SUM(X)
 *
 */
var priceAndVolumeTrend = {
    name: 'PVT',
    shortName: 'PVT',
    figures: [
        { key: 'pvt', title: 'PVT: ', type: 'line' }
    ],
    calc: function (dataList) {
        var sum = 0;
        return dataList.map(function (kLineData, i) {
            var _a, _b;
            var pvt = {};
            var close = kLineData.close;
            var volume = (_a = kLineData.volume) !== null && _a !== void 0 ? _a : 1;
            var prevClose = ((_b = dataList[i - 1]) !== null && _b !== void 0 ? _b : kLineData).close;
            var x = 0;
            var total = prevClose * volume;
            if (total !== 0) {
                x = (close - prevClose) / total;
            }
            sum += x;
            pvt.pvt = sum;
            return pvt;
        });
    }
};
exports.default = priceAndVolumeTrend;
//# sourceMappingURL=priceAndVolumeTrend.js.map