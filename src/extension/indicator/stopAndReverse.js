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
var stopAndReverse = {
    name: 'SAR',
    shortName: 'SAR',
    series: 'price',
    calcParams: [2, 2, 20],
    precision: 2,
    shouldOhlc: true,
    figures: [
        {
            key: 'sar',
            title: 'SAR: ',
            type: 'circle',
            styles: function (_a) {
                var _b, _c, _d;
                var data = _a.data, indicator = _a.indicator, defaultStyles = _a.defaultStyles;
                var current = data.current;
                var sar = (_b = current === null || current === void 0 ? void 0 : current.sar) !== null && _b !== void 0 ? _b : Number.MIN_SAFE_INTEGER;
                var halfHL = (((_c = current === null || current === void 0 ? void 0 : current.high) !== null && _c !== void 0 ? _c : 0) + ((_d = current === null || current === void 0 ? void 0 : current.low) !== null && _d !== void 0 ? _d : 0)) / 2;
                var color = sar < halfHL
                    ? (0, format_1.formatValue)(indicator.styles, 'circles[0].upColor', (defaultStyles.circles)[0].upColor)
                    : (0, format_1.formatValue)(indicator.styles, 'circles[0].downColor', (defaultStyles.circles)[0].downColor);
                return { color: color };
            }
        }
    ],
    calc: function (dataList, indicator) {
        var params = indicator.calcParams;
        var startAf = params[0] / 100;
        var step = params[1] / 100;
        var maxAf = params[2] / 100;
        // 加速因子
        var af = startAf;
        // 极值
        var ep = -100;
        // 判断是上涨还是下跌  false：下跌
        var isIncreasing = false;
        var sar = 0;
        return dataList.map(function (kLineData, i) {
            // 上一个周期的sar
            var preSar = sar;
            var high = kLineData.high;
            var low = kLineData.low;
            if (isIncreasing) {
                // 上涨
                if (ep === -100 || ep < high) {
                    // 重新初始化值
                    ep = high;
                    af = Math.min(af + step, maxAf);
                }
                sar = preSar + af * (ep - preSar);
                var lowMin = Math.min(dataList[Math.max(1, i) - 1].low, low);
                if (sar > kLineData.low) {
                    sar = ep;
                    // 重新初始化值
                    af = startAf;
                    ep = -100;
                    isIncreasing = !isIncreasing;
                }
                else if (sar > lowMin) {
                    sar = lowMin;
                }
            }
            else {
                if (ep === -100 || ep > low) {
                    // 重新初始化值
                    ep = low;
                    af = Math.min(af + step, maxAf);
                }
                sar = preSar + af * (ep - preSar);
                var highMax = Math.max(dataList[Math.max(1, i) - 1].high, high);
                if (sar < kLineData.high) {
                    sar = ep;
                    // 重新初始化值
                    af = 0;
                    ep = -100;
                    isIncreasing = !isIncreasing;
                }
                else if (sar < highMax) {
                    sar = highMax;
                }
            }
            return { high: high, low: low, sar: sar };
        });
    }
};
exports.default = stopAndReverse;
//# sourceMappingURL=stopAndReverse.js.map