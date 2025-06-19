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
exports.checkCoordinateOnRect = checkCoordinateOnRect;
exports.drawRect = drawRect;
var color_1 = require("../../common/utils/color");
var typeChecks_1 = require("../../common/utils/typeChecks");
var Figure_1 = require("../../component/Figure");
function checkCoordinateOnRect(coordinate, attrs) {
    var e_1, _a;
    var rects = [];
    rects = rects.concat(attrs);
    try {
        for (var rects_1 = __values(rects), rects_1_1 = rects_1.next(); !rects_1_1.done; rects_1_1 = rects_1.next()) {
            var rect_1 = rects_1_1.value;
            var x = rect_1.x;
            var width = rect_1.width;
            if (width < Figure_1.DEVIATION * 2) {
                x -= Figure_1.DEVIATION;
                width = Figure_1.DEVIATION * 2;
            }
            var y = rect_1.y;
            var height = rect_1.height;
            if (height < Figure_1.DEVIATION * 2) {
                y -= Figure_1.DEVIATION;
                height = Figure_1.DEVIATION * 2;
            }
            if (coordinate.x >= x &&
                coordinate.x <= x + width &&
                coordinate.y >= y &&
                coordinate.y <= y + height) {
                return true;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (rects_1_1 && !rects_1_1.done && (_a = rects_1.return)) _a.call(rects_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return false;
}
function drawRect(ctx, attrs, styles) {
    var _a;
    var rects = [];
    rects = rects.concat(attrs);
    var _b = styles.style, style = _b === void 0 ? 'fill' : _b, _c = styles.color, color = _c === void 0 ? 'transparent' : _c, _d = styles.borderSize, borderSize = _d === void 0 ? 1 : _d, _e = styles.borderColor, borderColor = _e === void 0 ? 'transparent' : _e, _f = styles.borderStyle, borderStyle = _f === void 0 ? 'solid' : _f, _g = styles.borderRadius, r = _g === void 0 ? 0 : _g, _h = styles.borderDashedValue, borderDashedValue = _h === void 0 ? [2, 2] : _h;
    // eslint-disable-next-line @typescript-eslint/unbound-method, @typescript-eslint/no-unnecessary-condition -- ignore
    var draw = (_a = ctx.roundRect) !== null && _a !== void 0 ? _a : ctx.rect;
    var solid = (style === 'fill' || styles.style === 'stroke_fill') && (!(0, typeChecks_1.isString)(color) || !(0, color_1.isTransparent)(color));
    if (solid) {
        ctx.fillStyle = color;
        rects.forEach(function (_a) {
            var x = _a.x, y = _a.y, w = _a.width, h = _a.height;
            ctx.beginPath();
            draw.call(ctx, x, y, w, h, r);
            ctx.closePath();
            ctx.fill();
        });
    }
    if ((style === 'stroke' || styles.style === 'stroke_fill') && borderSize > 0 && !(0, color_1.isTransparent)(borderColor)) {
        ctx.strokeStyle = borderColor;
        ctx.fillStyle = borderColor;
        ctx.lineWidth = borderSize;
        if (borderStyle === 'dashed') {
            ctx.setLineDash(borderDashedValue);
        }
        else {
            ctx.setLineDash([]);
        }
        var correction_1 = borderSize % 2 === 1 ? 0.5 : 0;
        var doubleCorrection_1 = Math.round(correction_1 * 2);
        rects.forEach(function (_a) {
            var x = _a.x, y = _a.y, w = _a.width, h = _a.height;
            if (w > borderSize * 2 && h > borderSize * 2) {
                ctx.beginPath();
                draw.call(ctx, x + correction_1, y + correction_1, w - doubleCorrection_1, h - doubleCorrection_1, r);
                ctx.closePath();
                ctx.stroke();
            }
            else {
                if (!solid) {
                    ctx.fillRect(x, y, w, h);
                }
            }
        });
    }
}
var rect = {
    name: 'rect',
    checkEventOn: checkCoordinateOnRect,
    draw: function (ctx, attrs, styles) {
        drawRect(ctx, attrs, styles);
    }
};
exports.default = rect;
//# sourceMappingURL=rect.js.map