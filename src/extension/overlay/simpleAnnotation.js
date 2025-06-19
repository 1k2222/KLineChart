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
var typeChecks_1 = require("../../common/utils/typeChecks");
var simpleAnnotation = {
    name: 'simpleAnnotation',
    totalStep: 2,
    styles: {
        line: { style: 'dashed' }
    },
    createPointFigures: function (_a) {
        var _b;
        var overlay = _a.overlay, coordinates = _a.coordinates;
        var text = '';
        if ((0, typeChecks_1.isValid)(overlay.extendData)) {
            if (!(0, typeChecks_1.isFunction)(overlay.extendData)) {
                text = ((_b = overlay.extendData) !== null && _b !== void 0 ? _b : '');
            }
            else {
                text = (overlay.extendData(overlay));
            }
        }
        var startX = coordinates[0].x;
        var startY = coordinates[0].y - 6;
        var lineEndY = startY - 50;
        var arrowEndY = lineEndY - 5;
        return [
            {
                type: 'line',
                attrs: { coordinates: [{ x: startX, y: startY }, { x: startX, y: lineEndY }] },
                ignoreEvent: true
            },
            {
                type: 'polygon',
                attrs: { coordinates: [{ x: startX, y: lineEndY }, { x: startX - 4, y: arrowEndY }, { x: startX + 4, y: arrowEndY }] },
                ignoreEvent: true
            },
            {
                type: 'text',
                attrs: { x: startX, y: arrowEndY, text: text, align: 'center', baseline: 'bottom' },
                ignoreEvent: true
            }
        ];
    }
};
exports.default = simpleAnnotation;
//# sourceMappingURL=simpleAnnotation.js.map