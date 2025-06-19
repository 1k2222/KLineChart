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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCoordinateOnArc = checkCoordinateOnArc;
exports.drawArc = drawArc;
var Coordinate_1 = require("../../common/Coordinate");
var Figure_1 = require("../../component/Figure");
function checkCoordinateOnArc(coordinate, attrs) {
    var e_1, _a;
    var arcs = [];
    arcs = arcs.concat(attrs);
    try {
        for (var arcs_1 = __values(arcs), arcs_1_1 = arcs_1.next(); !arcs_1_1.done; arcs_1_1 = arcs_1.next()) {
            var arc_1 = arcs_1_1.value;
            if (Math.abs((0, Coordinate_1.getDistance)(coordinate, arc_1) - arc_1.r) < Figure_1.DEVIATION) {
                var r = arc_1.r, startAngle = arc_1.startAngle, endAngle = arc_1.endAngle;
                var startCoordinateX = r * Math.cos(startAngle) + arc_1.x;
                var startCoordinateY = r * Math.sin(startAngle) + arc_1.y;
                var endCoordinateX = r * Math.cos(endAngle) + arc_1.x;
                var endCoordinateY = r * Math.sin(endAngle) + arc_1.y;
                if (coordinate.x <= Math.max(startCoordinateX, endCoordinateX) + Figure_1.DEVIATION &&
                    coordinate.x >= Math.min(startCoordinateX, endCoordinateX) - Figure_1.DEVIATION &&
                    coordinate.y <= Math.max(startCoordinateY, endCoordinateY) + Figure_1.DEVIATION &&
                    coordinate.y >= Math.min(startCoordinateY, endCoordinateY) - Figure_1.DEVIATION) {
                    return true;
                }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (arcs_1_1 && !arcs_1_1.done && (_a = arcs_1.return)) _a.call(arcs_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return false;
}
function drawArc(ctx, attrs, styles) {
    var arcs = [];
    arcs = arcs.concat(attrs);
    var _a = styles.style, style = _a === void 0 ? 'solid' : _a, _b = styles.size, size = _b === void 0 ? 1 : _b, _c = styles.color, color = _c === void 0 ? 'currentColor' : _c, _d = styles.dashedValue, dashedValue = _d === void 0 ? [2, 2] : _d;
    ctx.lineWidth = size;
    ctx.strokeStyle = color;
    if (style === 'dashed') {
        ctx.setLineDash(dashedValue);
    }
    else {
        ctx.setLineDash([]);
    }
    arcs.forEach(function (_a) {
        var x = _a.x, y = _a.y, r = _a.r, startAngle = _a.startAngle, endAngle = _a.endAngle;
        ctx.beginPath();
        ctx.arc(x, y, r, startAngle, endAngle);
        ctx.stroke();
        ctx.closePath();
    });
}
var arc = {
    name: 'arc',
    checkEventOn: checkCoordinateOnArc,
    draw: function (ctx, attrs, styles) {
        drawArc(ctx, attrs, styles);
    }
};
exports.default = arc;
//# sourceMappingURL=arc.js.map