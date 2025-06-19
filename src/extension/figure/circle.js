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
exports.checkCoordinateOnCircle = checkCoordinateOnCircle;
exports.drawCircle = drawCircle;
var typeChecks_1 = require("../../common/utils/typeChecks");
var color_1 = require("../../common/utils/color");
function checkCoordinateOnCircle(coordinate, attrs) {
    var e_1, _a;
    var circles = [];
    circles = circles.concat(attrs);
    try {
        for (var circles_1 = __values(circles), circles_1_1 = circles_1.next(); !circles_1_1.done; circles_1_1 = circles_1.next()) {
            var circle_1 = circles_1_1.value;
            var x = circle_1.x, y = circle_1.y, r = circle_1.r;
            var difX = coordinate.x - x;
            var difY = coordinate.y - y;
            if (!(difX * difX + difY * difY > r * r)) {
                return true;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (circles_1_1 && !circles_1_1.done && (_a = circles_1.return)) _a.call(circles_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return false;
}
function drawCircle(ctx, attrs, styles) {
    var circles = [];
    circles = circles.concat(attrs);
    var _a = styles.style, style = _a === void 0 ? 'fill' : _a, _b = styles.color, color = _b === void 0 ? 'currentColor' : _b, _c = styles.borderSize, borderSize = _c === void 0 ? 1 : _c, _d = styles.borderColor, borderColor = _d === void 0 ? 'currentColor' : _d, _e = styles.borderStyle, borderStyle = _e === void 0 ? 'solid' : _e, _f = styles.borderDashedValue, borderDashedValue = _f === void 0 ? [2, 2] : _f;
    var solid = (style === 'fill' || styles.style === 'stroke_fill') && (!(0, typeChecks_1.isString)(color) || !(0, color_1.isTransparent)(color));
    if (solid) {
        ctx.fillStyle = color;
        circles.forEach(function (_a) {
            var x = _a.x, y = _a.y, r = _a.r;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        });
    }
    if ((style === 'stroke' || styles.style === 'stroke_fill') && borderSize > 0 && !(0, color_1.isTransparent)(borderColor)) {
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = borderSize;
        if (borderStyle === 'dashed') {
            ctx.setLineDash(borderDashedValue);
        }
        else {
            ctx.setLineDash([]);
        }
        circles.forEach(function (_a) {
            var x = _a.x, y = _a.y, r = _a.r;
            if (!solid || r > borderSize) {
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.closePath();
                ctx.stroke();
            }
        });
    }
}
var circle = {
    name: 'circle',
    checkEventOn: checkCoordinateOnCircle,
    draw: function (ctx, attrs, styles) {
        drawCircle(ctx, attrs, styles);
    }
};
exports.default = circle;
//# sourceMappingURL=circle.js.map