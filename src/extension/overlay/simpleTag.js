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
var simpleTag = {
    name: 'simpleTag',
    totalStep: 2,
    styles: {
        line: { style: 'dashed' }
    },
    createPointFigures: function (_a) {
        var bounding = _a.bounding, coordinates = _a.coordinates;
        return ({
            type: 'line',
            attrs: {
                coordinates: [
                    { x: 0, y: coordinates[0].y },
                    { x: bounding.width, y: coordinates[0].y }
                ]
            },
            ignoreEvent: true
        });
    },
    createYAxisFigures: function (_a) {
        var _b, _c, _d, _e;
        var chart = _a.chart, overlay = _a.overlay, coordinates = _a.coordinates, bounding = _a.bounding, yAxis = _a.yAxis;
        var isFromZero = (_b = yAxis === null || yAxis === void 0 ? void 0 : yAxis.isFromZero()) !== null && _b !== void 0 ? _b : false;
        var textAlign = 'left';
        var x = 0;
        if (isFromZero) {
            textAlign = 'left';
            x = 0;
        }
        else {
            textAlign = 'right';
            x = bounding.width;
        }
        var text = '';
        if ((0, typeChecks_1.isValid)(overlay.extendData)) {
            if (!(0, typeChecks_1.isFunction)(overlay.extendData)) {
                text = ((_c = overlay.extendData) !== null && _c !== void 0 ? _c : '');
            }
            else {
                text = overlay.extendData(overlay);
            }
        }
        if (!(0, typeChecks_1.isValid)(text) && (0, typeChecks_1.isNumber)(overlay.points[0].value)) {
            text = (0, format_1.formatPrecision)(overlay.points[0].value, (_e = (_d = chart.getSymbol()) === null || _d === void 0 ? void 0 : _d.pricePrecision) !== null && _e !== void 0 ? _e : 2);
        }
        return { type: 'text', attrs: { x: x, y: coordinates[0].y, text: text, align: textAlign, baseline: 'middle' } };
    }
};
exports.default = simpleTag;
//# sourceMappingURL=simpleTag.js.map