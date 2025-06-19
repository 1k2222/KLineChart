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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.getTextRect = getTextRect;
exports.checkCoordinateOnText = checkCoordinateOnText;
exports.drawText = drawText;
var canvas_1 = require("../../common/utils/canvas");
var rect_1 = require("./rect");
function getTextRect(attrs, styles) {
    var _a = styles.size, size = _a === void 0 ? 12 : _a, _b = styles.paddingLeft, paddingLeft = _b === void 0 ? 0 : _b, _c = styles.paddingTop, paddingTop = _c === void 0 ? 0 : _c, _d = styles.paddingRight, paddingRight = _d === void 0 ? 0 : _d, _e = styles.paddingBottom, paddingBottom = _e === void 0 ? 0 : _e, _f = styles.weight, weight = _f === void 0 ? 'normal' : _f, family = styles.family;
    var x = attrs.x, y = attrs.y, text = attrs.text, _g = attrs.align, align = _g === void 0 ? 'left' : _g, _h = attrs.baseline, baseline = _h === void 0 ? 'top' : _h, w = attrs.width, h = attrs.height;
    var width = w !== null && w !== void 0 ? w : (paddingLeft + (0, canvas_1.calcTextWidth)(text, size, weight, family) + paddingRight);
    var height = h !== null && h !== void 0 ? h : (paddingTop + size + paddingBottom);
    var startX = 0;
    switch (align) {
        case 'left':
        case 'start': {
            startX = x;
            break;
        }
        case 'right':
        case 'end': {
            startX = x - width;
            break;
        }
        default: {
            startX = x - width / 2;
            break;
        }
    }
    var startY = 0;
    switch (baseline) {
        case 'top':
        case 'hanging': {
            startY = y;
            break;
        }
        case 'bottom':
        case 'ideographic':
        case 'alphabetic': {
            startY = y - height;
            break;
        }
        default: {
            startY = y - height / 2;
            break;
        }
    }
    return { x: startX, y: startY, width: width, height: height };
}
function checkCoordinateOnText(coordinate, attrs, styles) {
    var e_1, _a;
    var texts = [];
    texts = texts.concat(attrs);
    try {
        for (var texts_1 = __values(texts), texts_1_1 = texts_1.next(); !texts_1_1.done; texts_1_1 = texts_1.next()) {
            var text_1 = texts_1_1.value;
            var _b = getTextRect(text_1, styles), x = _b.x, y = _b.y, width = _b.width, height = _b.height;
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
            if (texts_1_1 && !texts_1_1.done && (_a = texts_1.return)) _a.call(texts_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return false;
}
function drawText(ctx, attrs, styles) {
    var texts = [];
    texts = texts.concat(attrs);
    var _a = styles.color, color = _a === void 0 ? 'currentColor' : _a, _b = styles.size, size = _b === void 0 ? 12 : _b, family = styles.family, weight = styles.weight, _c = styles.paddingLeft, paddingLeft = _c === void 0 ? 0 : _c, _d = styles.paddingTop, paddingTop = _d === void 0 ? 0 : _d, _e = styles.paddingRight, paddingRight = _e === void 0 ? 0 : _e;
    var rects = texts.map(function (text) { return getTextRect(text, styles); });
    (0, rect_1.drawRect)(ctx, rects, __assign(__assign({}, styles), { color: styles.backgroundColor }));
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = (0, canvas_1.createFont)(size, weight, family);
    ctx.fillStyle = color;
    texts.forEach(function (text, index) {
        var rect = rects[index];
        ctx.fillText(text.text, rect.x + paddingLeft, rect.y + paddingTop, rect.width - paddingLeft - paddingRight);
    });
}
var text = {
    name: 'text',
    checkEventOn: checkCoordinateOnText,
    draw: function (ctx, attrs, styles) {
        drawText(ctx, attrs, styles);
    }
};
exports.default = text;
//# sourceMappingURL=text.js.map