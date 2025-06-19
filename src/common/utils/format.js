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
exports.formatValue = formatValue;
exports.formatTimestampToDateTime = formatTimestampToDateTime;
exports.formatTimestampByTemplate = formatTimestampByTemplate;
exports.formatPrecision = formatPrecision;
exports.formatBigNumber = formatBigNumber;
exports.formatThousands = formatThousands;
exports.formatFoldDecimal = formatFoldDecimal;
exports.formatTemplateString = formatTemplateString;
var typeChecks_1 = require("./typeChecks");
var reEscapeChar = /\\(\\)?/g;
var rePropName = RegExp('[^.[\\]]+' + '|' +
    '\\[(?:' +
    '([^"\'][^[]*)' + '|' +
    '(["\'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2' +
    ')\\]' + '|' +
    '(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))', 'g');
function formatValue(data, key, defaultValue) {
    if ((0, typeChecks_1.isValid)(data)) {
        var path_1 = [];
        key.replace(rePropName, function (subString) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var k = subString;
            if ((0, typeChecks_1.isValid)(args[1])) {
                k = args[2].replace(reEscapeChar, '$1');
            }
            else if ((0, typeChecks_1.isValid)(args[0])) {
                k = args[0].trim();
            }
            path_1.push(k);
            return '';
        });
        var value = data;
        var index = 0;
        var length_1 = path_1.length;
        while ((0, typeChecks_1.isValid)(value) && index < length_1) {
            value = value === null || value === void 0 ? void 0 : value[path_1[index++]];
        }
        return (0, typeChecks_1.isValid)(value) ? value : (defaultValue !== null && defaultValue !== void 0 ? defaultValue : '--');
    }
    return defaultValue !== null && defaultValue !== void 0 ? defaultValue : '--';
}
function formatTimestampToDateTime(dateTimeFormat, timestamp) {
    var date = {};
    dateTimeFormat.formatToParts(new Date(timestamp)).forEach(function (_a) {
        var type = _a.type, value = _a.value;
        switch (type) {
            case 'year': {
                date.YYYY = value;
                break;
            }
            case 'month': {
                date.MM = value;
                break;
            }
            case 'day': {
                date.DD = value;
                break;
            }
            case 'hour': {
                date.HH = value === '24' ? '00' : value;
                break;
            }
            case 'minute': {
                date.mm = value;
                break;
            }
            case 'second': {
                date.ss = value;
                break;
            }
            default: {
                break;
            }
        }
    });
    return date;
}
function formatTimestampByTemplate(dateTimeFormat, timestamp, template) {
    var date = formatTimestampToDateTime(dateTimeFormat, timestamp);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- ignore
    return template.replace(/YYYY|MM|DD|HH|mm|ss/g, function (key) { return date[key]; });
}
function formatPrecision(value, precision) {
    var v = +value;
    if ((0, typeChecks_1.isNumber)(v)) {
        return v.toFixed(precision !== null && precision !== void 0 ? precision : 2);
    }
    return "".concat(value);
}
function formatBigNumber(value) {
    var v = +value;
    if ((0, typeChecks_1.isNumber)(v)) {
        if (v > 1000000000) {
            return "".concat(+((v / 1000000000).toFixed(3)), "B");
        }
        if (v > 1000000) {
            return "".concat(+((v / 1000000).toFixed(3)), "M");
        }
        if (v > 1000) {
            return "".concat(+((v / 1000).toFixed(3)), "K");
        }
    }
    return "".concat(value);
}
function formatThousands(value, sign) {
    var vl = "".concat(value);
    if (sign.length === 0) {
        return vl;
    }
    if (vl.includes('.')) {
        var arr = vl.split('.');
        return "".concat(arr[0].replace(/(\d)(?=(\d{3})+$)/g, function ($1) { return "".concat($1).concat(sign); }), ".").concat(arr[1]);
    }
    return vl.replace(/(\d)(?=(\d{3})+$)/g, function ($1) { return "".concat($1).concat(sign); });
}
function formatFoldDecimal(value, threshold) {
    var vl = "".concat(value);
    var reg = new RegExp('\\.0{' + threshold + ',}[1-9][0-9]*$');
    if (reg.test(vl)) {
        var result = vl.split('.');
        var lastIndex = result.length - 1;
        var v = result[lastIndex];
        var match = /0*/.exec(v);
        if ((0, typeChecks_1.isValid)(match)) {
            var count = match[0].length;
            result[lastIndex] = v.replace(/0*/, "0{".concat(count, "}"));
            return result.join('.');
        }
    }
    return vl;
}
function formatTemplateString(template, params) {
    return template.replace(/\{(\w+)\}/g, function (_, key) {
        var value = params[key];
        if ((0, typeChecks_1.isValid)(value)) {
            return value;
        }
        return "{".concat(key, "}");
    });
}
//# sourceMappingURL=format.js.map