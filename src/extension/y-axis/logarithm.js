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
var logarithm = {
    name: 'logarithm',
    minSpan: function (precision) { return 0.05 * (0, number_1.index10)(-precision); },
    valueToRealValue: function (value) { return value < 0 ? -(0, number_1.log10)(Math.abs(value)) : (0, number_1.log10)(value); },
    realValueToDisplayValue: function (value) { return value < 0 ? -(0, number_1.index10)(Math.abs(value)) : (0, number_1.index10)(value); },
    displayValueToRealValue: function (value) { return value < 0 ? -(0, number_1.log10)(Math.abs(value)) : (0, number_1.log10)(value); },
    realValueToValue: function (value) { return value < 0 ? -(0, number_1.index10)(Math.abs(value)) : (0, number_1.index10)(value); },
    createRange: function (_a) {
        var defaultRange = _a.defaultRange;
        var from = defaultRange.from, to = defaultRange.to, range = defaultRange.range;
        var realFrom = from < 0 ? -(0, number_1.log10)(Math.abs(from)) : (0, number_1.log10)(from);
        var realTo = to < 0 ? -(0, number_1.log10)(Math.abs(to)) : (0, number_1.log10)(to);
        return {
            from: from,
            to: to,
            range: range,
            realFrom: realFrom,
            realTo: realTo,
            realRange: realTo - realFrom,
            displayFrom: from,
            displayTo: to,
            displayRange: range
        };
    }
};
exports.default = logarithm;
//# sourceMappingURL=logarithm.js.map