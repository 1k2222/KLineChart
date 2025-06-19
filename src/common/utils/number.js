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
exports.binarySearchNearest = binarySearchNearest;
exports.nice = nice;
exports.round = round;
exports.getPrecision = getPrecision;
exports.getMaxMin = getMaxMin;
exports.log10 = log10;
exports.index10 = index10;
/**
 * Binary search for the nearest result
 * @param dataList
 * @param valueKey
 * @param targetValue
 * @return {number}
 */
function binarySearchNearest(dataList, valueKey, targetValue) {
    var left = 0;
    var right = 0;
    for (right = dataList.length - 1; left !== right;) {
        var midIndex = Math.floor((right + left) / 2);
        var mid = right - left;
        var midValue = dataList[midIndex][valueKey];
        if (targetValue === dataList[left][valueKey]) {
            return left;
        }
        if (targetValue === dataList[right][valueKey]) {
            return right;
        }
        if (targetValue === midValue) {
            return midIndex;
        }
        if (targetValue > midValue) {
            left = midIndex;
        }
        else {
            right = midIndex;
        }
        if (mid <= 2) {
            break;
        }
    }
    return left;
}
/**
 * 优化数字
 * @param value
 * @return {number|number}
 */
function nice(value) {
    var exponent = Math.floor(log10(value));
    var exp10 = index10(exponent);
    var f = value / exp10; // 1 <= f < 10
    var nf = 0;
    if (f < 1.5) {
        nf = 1;
    }
    else if (f < 2.5) {
        nf = 2;
    }
    else if (f < 3.5) {
        nf = 3;
    }
    else if (f < 4.5) {
        nf = 4;
    }
    else if (f < 5.5) {
        nf = 5;
    }
    else if (f < 6.5) {
        nf = 6;
    }
    else {
        nf = 8;
    }
    value = nf * exp10;
    return +value.toFixed(Math.abs(exponent));
}
/**
 * Round
 * @param value
 * @param precision
 * @return {number}
 */
function round(value, precision) {
    precision = Math.max(0, precision !== null && precision !== void 0 ? precision : 0);
    var pow = Math.pow(10, precision);
    return Math.round(value * pow) / pow;
}
/**
 * Get precision
 * @param value
 * @return {number|number}
 */
function getPrecision(value) {
    var str = value.toString();
    var eIndex = str.indexOf('e');
    if (eIndex > 0) {
        var precision = +str.slice(eIndex + 1);
        return precision < 0 ? -precision : 0;
    }
    var dotIndex = str.indexOf('.');
    return dotIndex < 0 ? 0 : str.length - 1 - dotIndex;
}
function getMaxMin(dataList, maxKey, minKey) {
    var _a, _b;
    var maxMin = [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];
    var dataLength = dataList.length;
    var index = 0;
    while (index < dataLength) {
        var data = dataList[index];
        maxMin[0] = Math.max(((_a = data[maxKey]) !== null && _a !== void 0 ? _a : Number.MIN_SAFE_INTEGER), maxMin[0]);
        maxMin[1] = Math.min(((_b = data[minKey]) !== null && _b !== void 0 ? _b : Number.MAX_SAFE_INTEGER), maxMin[1]);
        ++index;
    }
    return maxMin;
}
/**
 * log10
 * @param value
 * @return {number}
 */
function log10(value) {
    if (value === 0) {
        return 0;
    }
    return Math.log10(value);
}
/**
 * index 10
 * @param value
 * @return {number}
 */
function index10(value) {
    return Math.pow(10, value);
}
//# sourceMappingURL=number.js.map