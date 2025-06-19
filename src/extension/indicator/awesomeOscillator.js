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
var awesomeOscillator = {
    name: 'AO',
    shortName: 'AO',
    calcParams: [5, 34],
    figures: [{
            key: 'ao',
            title: 'AO: ',
            type: 'bar',
            baseValue: 0,
            styles: function (_a) {
                var _b, _c;
                var data = _a.data, indicator = _a.indicator, defaultStyles = _a.defaultStyles;
                var prev = data.prev, current = data.current;
                var prevAo = (_b = prev === null || prev === void 0 ? void 0 : prev.ao) !== null && _b !== void 0 ? _b : Number.MIN_SAFE_INTEGER;
                var currentAo = (_c = current === null || current === void 0 ? void 0 : current.ao) !== null && _c !== void 0 ? _c : Number.MIN_SAFE_INTEGER;
                var color = '';
                if (currentAo > prevAo) {
                    color = (0, format_1.formatValue)(indicator.styles, 'bars[0].upColor', (defaultStyles.bars)[0].upColor);
                }
                else {
                    color = (0, format_1.formatValue)(indicator.styles, 'bars[0].downColor', (defaultStyles.bars)[0].downColor);
                }
                var style = currentAo > prevAo ? 'stroke' : 'fill';
                return { color: color, style: style, borderColor: color };
            }
        }],
    calc: function (dataList, indicator) {
        var params = indicator.calcParams;
        var maxPeriod = Math.max(params[0], params[1]);
        var shortSum = 0;
        var longSum = 0;
        var short = 0;
        var long = 0;
        return dataList.map(function (kLineData, i) {
            var ao = {};
            var middle = (kLineData.low + kLineData.high) / 2;
            shortSum += middle;
            longSum += middle;
            if (i >= params[0] - 1) {
                short = shortSum / params[0];
                var agoKLineData = dataList[i - (params[0] - 1)];
                shortSum -= ((agoKLineData.low + agoKLineData.high) / 2);
            }
            if (i >= params[1] - 1) {
                long = longSum / params[1];
                var agoKLineData = dataList[i - (params[1] - 1)];
                longSum -= ((agoKLineData.low + agoKLineData.high) / 2);
            }
            if (i >= maxPeriod - 1) {
                ao.ao = short - long;
            }
            return ao;
        });
    }
};
exports.default = awesomeOscillator;
//# sourceMappingURL=awesomeOscillator.js.map