"use strict";
/**
 *       ___           ___                   ___           ___           ___           ___           ___           ___           ___
 *      /\__\         /\__\      ___        /\__\         /\  \         /\  \         /\__\         /\  \         /\  \         /\  \
 *     /:/  /        /:/  /     /\  \      /::|  |       /::\  \       /::\  \       /:/  /        /::\  \       /::\  \        \:\  \
 *    /:/__/        /:/  /      \:\  \    /:|:|  |      /:/\:\  \     /:/\:\  \     /:/__/        /:/\:\  \     /:/\:\  \        \:\  \
 *   /::\__\____   /:/  /       /::\__\  /:/|:|  |__   /::\~\:\  \   /:/  \:\  \   /::\  \ ___   /::\~\:\  \   /::\~\:\  \       /::\  \
 *  /:/\:::::\__\ /:/__/     __/:/\/__/ /:/ |:| /\__\ /:/\:\ \:\__\ /:/__/ \:\__\ /:/\:\  /\__\ /:/\:\ \:\__\ /:/\:\ \:\__\     /:/\:\__\
 *  \/_|:|~~|~    \:\  \    /\/:/  /    \/__|:|/:/  / \:\~\:\ \/__/ \:\  \  \/__/ \/__\:\/:/  / \/__\:\/:/  / \/_|::\/:/  /    /:/  \/__/
 *     |:|  |      \:\  \   \::/__/         |:/:/  /   \:\ \:\__\    \:\  \            \::/  /       \::/  /     |:|::/  /    /:/  /
 *     |:|  |       \:\  \   \:\__\         |::/  /     \:\ \/__/     \:\  \           /:/  /        /:/  /      |:|\/__/     \/__/
 *     |:|  |        \:\__\   \/__/         /:/  /       \:\__\        \:\__\         /:/  /        /:/  /       |:|  |
 *      \|__|         \/__/                 \/__/         \/__/         \/__/         \/__/         \/__/         \|__|
 *
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.utils = exports.registerYAxis = exports.registerXAxis = exports.registerStyles = exports.getSupportedLocales = exports.registerLocale = exports.getOverlayClass = exports.getSupportedOverlays = exports.registerOverlay = exports.getSupportedIndicators = exports.registerIndicator = exports.getFigureClass = exports.getSupportedFigures = exports.registerFigure = void 0;
exports.version = version;
exports.init = init;
exports.dispose = dispose;
var logger_1 = require("./common/utils/logger");
var typeChecks_1 = require("./common/utils/typeChecks");
var format_1 = require("./common/utils/format");
var canvas_1 = require("./common/utils/canvas");
var Chart_1 = __importDefault(require("./Chart"));
var arc_1 = require("./extension/figure/arc");
var circle_1 = require("./extension/figure/circle");
var line_1 = require("./extension/figure/line");
var polygon_1 = require("./extension/figure/polygon");
var rect_1 = require("./extension/figure/rect");
var text_1 = require("./extension/figure/text");
var index_1 = require("./extension/figure/index");
Object.defineProperty(exports, "registerFigure", { enumerable: true, get: function () { return index_1.registerFigure; } });
Object.defineProperty(exports, "getSupportedFigures", { enumerable: true, get: function () { return index_1.getSupportedFigures; } });
Object.defineProperty(exports, "getFigureClass", { enumerable: true, get: function () { return index_1.getFigureClass; } });
var index_2 = require("./extension/indicator/index");
Object.defineProperty(exports, "registerIndicator", { enumerable: true, get: function () { return index_2.registerIndicator; } });
Object.defineProperty(exports, "getSupportedIndicators", { enumerable: true, get: function () { return index_2.getSupportedIndicators; } });
var index_3 = require("./extension/i18n/index");
Object.defineProperty(exports, "registerLocale", { enumerable: true, get: function () { return index_3.registerLocale; } });
Object.defineProperty(exports, "getSupportedLocales", { enumerable: true, get: function () { return index_3.getSupportedLocales; } });
var index_4 = require("./extension/overlay/index");
Object.defineProperty(exports, "registerOverlay", { enumerable: true, get: function () { return index_4.registerOverlay; } });
Object.defineProperty(exports, "getOverlayClass", { enumerable: true, get: function () { return index_4.getOverlayClass; } });
Object.defineProperty(exports, "getSupportedOverlays", { enumerable: true, get: function () { return index_4.getSupportedOverlays; } });
var index_5 = require("./extension/styles/index");
Object.defineProperty(exports, "registerStyles", { enumerable: true, get: function () { return index_5.registerStyles; } });
var x_axis_1 = require("./extension/x-axis");
Object.defineProperty(exports, "registerXAxis", { enumerable: true, get: function () { return x_axis_1.registerXAxis; } });
var y_axis_1 = require("./extension/y-axis");
Object.defineProperty(exports, "registerYAxis", { enumerable: true, get: function () { return y_axis_1.registerYAxis; } });
var charts = new Map();
var chartBaseId = 1;
/**
 * Chart version
 * @return {string}
 */
function version() {
    return '__VERSION__';
}
/**
 * Init chart instance
 * @param ds
 * @param options
 * @returns {Chart}
 */
function init(ds, options) {
    (0, logger_1.logTag)();
    var dom = null;
    if ((0, typeChecks_1.isString)(ds)) {
        dom = document.getElementById(ds);
    }
    else {
        dom = ds;
    }
    if (dom === null) {
        (0, logger_1.logError)('', '', 'The chart cannot be initialized correctly. Please check the parameters. The chart container cannot be null and child elements need to be added!!!');
        return null;
    }
    var chart = charts.get(dom.id);
    if ((0, typeChecks_1.isValid)(chart)) {
        (0, logger_1.logWarn)('', '', 'The chart has been initialized on the dom！！！');
        return chart;
    }
    var id = "k_line_chart_".concat(chartBaseId++);
    chart = new Chart_1.default(dom, options);
    chart.id = id;
    dom.setAttribute('k-line-chart-id', id);
    charts.set(id, chart);
    return chart;
}
/**
 * Destroy chart instance
 * @param dcs
 */
function dispose(dcs) {
    var _a, _b;
    var id = null;
    if (dcs instanceof Chart_1.default) {
        id = dcs.id;
    }
    else {
        var dom = null;
        if ((0, typeChecks_1.isString)(dcs)) {
            dom = document.getElementById(dcs);
        }
        else {
            dom = dcs;
        }
        id = (_a = dom === null || dom === void 0 ? void 0 : dom.getAttribute('k-line-chart-id')) !== null && _a !== void 0 ? _a : null;
    }
    if (id !== null) {
        (_b = charts.get(id)) === null || _b === void 0 ? void 0 : _b.destroy();
        charts.delete(id);
    }
}
var utils = {
    clone: typeChecks_1.clone,
    merge: typeChecks_1.merge,
    isString: typeChecks_1.isString,
    isNumber: typeChecks_1.isNumber,
    isValid: typeChecks_1.isValid,
    isObject: typeChecks_1.isObject,
    isArray: typeChecks_1.isArray,
    isFunction: typeChecks_1.isFunction,
    isBoolean: typeChecks_1.isBoolean,
    formatValue: format_1.formatValue,
    formatPrecision: format_1.formatPrecision,
    formatBigNumber: format_1.formatBigNumber,
    formatDate: format_1.formatTimestampByTemplate,
    formatThousands: format_1.formatThousands,
    formatFoldDecimal: format_1.formatFoldDecimal,
    calcTextWidth: canvas_1.calcTextWidth,
    getLinearSlopeIntercept: line_1.getLinearSlopeIntercept,
    getLinearYFromSlopeIntercept: line_1.getLinearYFromSlopeIntercept,
    getLinearYFromCoordinates: line_1.getLinearYFromCoordinates,
    checkCoordinateOnArc: arc_1.checkCoordinateOnArc,
    checkCoordinateOnCircle: circle_1.checkCoordinateOnCircle,
    checkCoordinateOnLine: line_1.checkCoordinateOnLine,
    checkCoordinateOnPolygon: polygon_1.checkCoordinateOnPolygon,
    checkCoordinateOnRect: rect_1.checkCoordinateOnRect,
    checkCoordinateOnText: text_1.checkCoordinateOnText
};
exports.utils = utils;
//# sourceMappingURL=index.js.map