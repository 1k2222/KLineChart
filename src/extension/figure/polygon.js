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
exports.checkCoordinateOnPolygon = checkCoordinateOnPolygon;
exports.drawPolygon = drawPolygon;
var typeChecks_1 = require("../../common/utils/typeChecks");
var color_1 = require("../../common/utils/color");
function checkCoordinateOnPolygon(coordinate, attrs) {
    var e_1, _a;
    var polygons = [];
    polygons = polygons.concat(attrs);
    try {
        for (var polygons_1 = __values(polygons), polygons_1_1 = polygons_1.next(); !polygons_1_1.done; polygons_1_1 = polygons_1.next()) {
            var polygon_1 = polygons_1_1.value;
            var on = false;
            var coordinates = polygon_1.coordinates;
            for (var i = 0, j = coordinates.length - 1; i < coordinates.length; j = i++) {
                if ((coordinates[i].y > coordinate.y) !== (coordinates[j].y > coordinate.y) &&
                    (coordinate.x < (coordinates[j].x - coordinates[i].x) * (coordinate.y - coordinates[i].y) / (coordinates[j].y - coordinates[i].y) + coordinates[i].x)) {
                    on = !on;
                }
            }
            if (on) {
                return true;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (polygons_1_1 && !polygons_1_1.done && (_a = polygons_1.return)) _a.call(polygons_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return false;
}
function drawPolygon(ctx, attrs, styles) {
    var polygons = [];
    polygons = polygons.concat(attrs);
    var _a = styles.style, style = _a === void 0 ? 'fill' : _a, _b = styles.color, color = _b === void 0 ? 'currentColor' : _b, _c = styles.borderSize, borderSize = _c === void 0 ? 1 : _c, _d = styles.borderColor, borderColor = _d === void 0 ? 'currentColor' : _d, _e = styles.borderStyle, borderStyle = _e === void 0 ? 'solid' : _e, _f = styles.borderDashedValue, borderDashedValue = _f === void 0 ? [2, 2] : _f;
    if ((style === 'fill' || styles.style === 'stroke_fill') &&
        (!(0, typeChecks_1.isString)(color) || !(0, color_1.isTransparent)(color))) {
        ctx.fillStyle = color;
        polygons.forEach(function (_a) {
            var coordinates = _a.coordinates;
            ctx.beginPath();
            ctx.moveTo(coordinates[0].x, coordinates[0].y);
            for (var i = 1; i < coordinates.length; i++) {
                ctx.lineTo(coordinates[i].x, coordinates[i].y);
            }
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
        polygons.forEach(function (_a) {
            var coordinates = _a.coordinates;
            ctx.beginPath();
            ctx.moveTo(coordinates[0].x, coordinates[0].y);
            for (var i = 1; i < coordinates.length; i++) {
                ctx.lineTo(coordinates[i].x, coordinates[i].y);
            }
            ctx.closePath();
            ctx.stroke();
        });
    }
}
var polygon = {
    name: 'polygon',
    checkEventOn: checkCoordinateOnPolygon,
    draw: function (ctx, attrs, styles) {
        drawPolygon(ctx, attrs, styles);
    }
};
exports.default = polygon;
//# sourceMappingURL=polygon.js.map