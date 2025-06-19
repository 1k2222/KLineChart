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
exports.getPixelRatio = getPixelRatio;
exports.createFont = createFont;
exports.calcTextWidth = calcTextWidth;
var typeChecks_1 = require("./typeChecks");
var measureCtx = null;
/**
 * Get pixel ratio
 * @param canvas
 * @returns {number}
 */
function getPixelRatio(canvas) {
    var _a, _b;
    return (_b = (_a = canvas.ownerDocument.defaultView) === null || _a === void 0 ? void 0 : _a.devicePixelRatio) !== null && _b !== void 0 ? _b : 1;
}
function createFont(size, weight, family) {
    return "".concat(weight !== null && weight !== void 0 ? weight : 'normal', " ").concat(size !== null && size !== void 0 ? size : 12, "px ").concat(family !== null && family !== void 0 ? family : 'Helvetica Neue');
}
/**
 * Measure the width of text
 * @param text
 * @returns {number}
 */
function calcTextWidth(text, size, weight, family) {
    if (!(0, typeChecks_1.isValid)(measureCtx)) {
        var canvas = document.createElement('canvas');
        var pixelRatio = getPixelRatio(canvas);
        measureCtx = canvas.getContext('2d');
        measureCtx.scale(pixelRatio, pixelRatio);
    }
    measureCtx.font = createFont(size, weight, family);
    return Math.round(measureCtx.measureText(text).width);
}
//# sourceMappingURL=canvas.js.map