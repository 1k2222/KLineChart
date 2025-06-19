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
 * mtm
 * 公式 MTM（N日）=C－CN
 */
var momentum = {
    name: 'MTM',
    shortName: 'MTM',
    calcParams: [12, 6],
    figures: [
        { key: 'mtm', title: 'MTM: ', type: 'line' },
        { key: 'maMtm', title: 'MAMTM: ', type: 'line' }
    ],
    calc: function (dataList, indicator) {
        var params = indicator.calcParams;
        var mtmSum = 0;
        var result = [];
        dataList.forEach(function (kLineData, i) {
            var _a;
            var mtm = {};
            if (i >= params[0]) {
                var close_1 = kLineData.close;
                var agoClose = dataList[i - params[0]].close;
                mtm.mtm = close_1 - agoClose;
                mtmSum += mtm.mtm;
                if (i >= params[0] + params[1] - 1) {
                    mtm.maMtm = mtmSum / params[1];
                    mtmSum -= ((_a = result[i - (params[1] - 1)].mtm) !== null && _a !== void 0 ? _a : 0);
                }
            }
            result.push(mtm);
        });
        return result;
    }
};
exports.default = momentum;
//# sourceMappingURL=momentum.js.map