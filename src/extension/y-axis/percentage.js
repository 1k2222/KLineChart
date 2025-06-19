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
var percentage = {
    name: 'percentage',
    minSpan: function () { return Math.pow(10, -2); },
    displayValueToText: function (value) { return "".concat((0, format_1.formatPrecision)(value, 2), "%"); },
    valueToRealValue: function (value, _a) {
        var range = _a.range;
        return (value - range.from) / range.range * range.realRange + range.realFrom;
    },
    realValueToValue: function (value, _a) {
        var range = _a.range;
        return (value - range.realFrom) / range.realRange * range.range + range.from;
    },
    createRange: function (_a) {
        var chart = _a.chart, defaultRange = _a.defaultRange;
        var kLineDataList = chart.getDataList();
        var visibleRange = chart.getVisibleRange();
        var kLineData = kLineDataList[visibleRange.from];
        if ((0, typeChecks_1.isValid)(kLineData)) {
            var from = defaultRange.from, to = defaultRange.to, range = defaultRange.range;
            var realFrom = (defaultRange.from - kLineData.close) / kLineData.close * 100;
            var realTo = (defaultRange.to - kLineData.close) / kLineData.close * 100;
            var realRange = realTo - realFrom;
            return {
                from: from,
                to: to,
                range: range,
                realFrom: realFrom,
                realTo: realTo,
                realRange: realRange,
                displayFrom: realFrom,
                displayTo: realTo,
                displayRange: realRange
            };
        }
        return defaultRange;
    }
};
exports.default = percentage;
//# sourceMappingURL=percentage.js.map