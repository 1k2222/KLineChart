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
exports.isRgba = isRgba;
exports.isHsla = isHsla;
exports.isTransparent = isTransparent;
exports.rgbToHex = rgbToHex;
exports.hexToRgb = hexToRgb;
var typeChecks_1 = require("./typeChecks");
var rgbaRegExp = /^[rR][gG][Bb][Aa]\(([\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?)[\s]*,){3}[\s]*(1|1.0|0|0.[0-9])[\s]*\){1}$/;
function isRgba(color) {
    return rgbaRegExp.test(color);
}
function isHsla(color) {
    return (/^[hH][Ss][Ll][Aa]\(([\s]*(360｜3[0-5][0-9]|[012]?[0-9][0-9]?)[\s]*,)([\s]*((100|[0-9][0-9]?)%|0)[\s]*,){2}([\s]*(1|1.0|0|0.[0-9])[\s]*)\)$/).test(color);
}
function isTransparent(color) {
    return color === 'transparent' ||
        color === 'none' ||
        /^[rR][gG][Bb][Aa]\(([\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?)[\s]*,){3}[\s]*0[\s]*\)$/.test(color) ||
        /^[hH][Ss][Ll][Aa]\(([\s]*(360｜3[0-5][0-9]|[012]?[0-9][0-9]?)[\s]*,)([\s]*((100|[0-9][0-9]?)%|0)[\s]*,){2}([\s]*0[\s]*)\)$/.test(color);
}
function rgbToHex(rgb) {
    if (!isRgba(rgb)) {
        return rgb;
    }
    var match = rgbaRegExp.exec(rgb);
    if (!(0, typeChecks_1.isValid)(match)) {
        throw new Error('Invalid RGB string format');
    }
    var r = parseInt(match[1], 10).toString(16);
    var g = parseInt(match[2], 10).toString(16);
    var b = parseInt(match[3], 10).toString(16);
    return "#".concat(r.length === 1 ? "0".concat(r) : r).concat(g.length === 1 ? "0".concat(r) : r).concat(b.length === 1 ? "0".concat(r) : r);
}
function hexToRgb(hex, alpha) {
    var h = hex.replace(/^#/, '');
    var i = parseInt(h, 16);
    var r = (i >> 16) & 255;
    var g = (i >> 8) & 255;
    var b = i & 255;
    return "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(alpha !== null && alpha !== void 0 ? alpha : 1, ")");
}
//# sourceMappingURL=color.js.map