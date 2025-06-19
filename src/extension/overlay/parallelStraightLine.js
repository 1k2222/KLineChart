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
exports.getParallelLines = getParallelLines;
var line_1 = require("../figure/line");
/**
 * 获取平行线
 * @param coordinates
 * @param bounding
 * @param extendParallelLineCount
 * @returns {Array}
 */
function getParallelLines(coordinates, bounding, extendParallelLineCount) {
    var count = extendParallelLineCount !== null && extendParallelLineCount !== void 0 ? extendParallelLineCount : 0;
    var lines = [];
    if (coordinates.length > 1) {
        if (coordinates[0].x === coordinates[1].x) {
            var startY = 0;
            var endY = bounding.height;
            lines.push({ coordinates: [{ x: coordinates[0].x, y: startY }, { x: coordinates[0].x, y: endY }] });
            if (coordinates.length > 2) {
                lines.push({ coordinates: [{ x: coordinates[2].x, y: startY }, { x: coordinates[2].x, y: endY }] });
                var distance = coordinates[0].x - coordinates[2].x;
                for (var i = 0; i < count; i++) {
                    var d = distance * (i + 1);
                    lines.push({ coordinates: [{ x: coordinates[0].x + d, y: startY }, { x: coordinates[0].x + d, y: endY }] });
                }
            }
        }
        else {
            var startX = 0;
            var endX = bounding.width;
            var kb = (0, line_1.getLinearSlopeIntercept)(coordinates[0], coordinates[1]);
            var k = kb[0];
            var b = kb[1];
            lines.push({ coordinates: [{ x: startX, y: startX * k + b }, { x: endX, y: endX * k + b }] });
            if (coordinates.length > 2) {
                var b1 = coordinates[2].y - k * coordinates[2].x;
                lines.push({ coordinates: [{ x: startX, y: startX * k + b1 }, { x: endX, y: endX * k + b1 }] });
                var distance = b - b1;
                for (var i = 0; i < count; i++) {
                    var b2 = b + distance * (i + 1);
                    lines.push({ coordinates: [{ x: startX, y: startX * k + b2 }, { x: endX, y: endX * k + b2 }] });
                }
            }
        }
    }
    return lines;
}
var parallelStraightLine = {
    name: 'parallelStraightLine',
    totalStep: 4,
    needDefaultPointFigure: true,
    needDefaultXAxisFigure: true,
    needDefaultYAxisFigure: true,
    createPointFigures: function (_a) {
        var coordinates = _a.coordinates, bounding = _a.bounding;
        return [
            {
                type: 'line',
                attrs: getParallelLines(coordinates, bounding)
            }
        ];
    }
};
exports.default = parallelStraightLine;
//# sourceMappingURL=parallelStraightLine.js.map