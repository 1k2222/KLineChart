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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eachFigures = eachFigures;
var typeChecks_1 = require("../common/utils/typeChecks");
var format_1 = require("../common/utils/format");
function eachFigures(indicator, dataIndex, defaultStyles, eachFigureCallback) {
    var result = indicator.result;
    var figures = indicator.figures;
    var styles = indicator.styles;
    var circleStyles = (0, format_1.formatValue)(styles, 'circles', defaultStyles.circles);
    var circleStyleCount = circleStyles.length;
    var barStyles = (0, format_1.formatValue)(styles, 'bars', defaultStyles.bars);
    var barStyleCount = barStyles.length;
    var lineStyles = (0, format_1.formatValue)(styles, 'lines', defaultStyles.lines);
    var lineStyleCount = lineStyles.length;
    var circleCount = 0;
    var barCount = 0;
    var lineCount = 0;
    // eslint-disable-next-line @typescript-eslint/init-declarations  -- ignore
    var defaultFigureStyles;
    var figureIndex = 0;
    figures.forEach(function (figure) {
        var _a;
        switch (figure.type) {
            case 'circle': {
                figureIndex = circleCount;
                var styles_1 = circleStyles[circleCount % circleStyleCount];
                defaultFigureStyles = __assign(__assign({}, styles_1), { color: styles_1.noChangeColor });
                circleCount++;
                break;
            }
            case 'bar': {
                figureIndex = barCount;
                var styles_2 = barStyles[barCount % barStyleCount];
                defaultFigureStyles = __assign(__assign({}, styles_2), { color: styles_2.noChangeColor });
                barCount++;
                break;
            }
            case 'line': {
                figureIndex = lineCount;
                defaultFigureStyles = lineStyles[lineCount % lineStyleCount];
                lineCount++;
                break;
            }
            default: {
                break;
            }
        }
        if ((0, typeChecks_1.isValid)(figure.type)) {
            var ss = (_a = figure.styles) === null || _a === void 0 ? void 0 : _a.call(figure, {
                data: {
                    prev: result[dataIndex - 1],
                    current: result[dataIndex],
                    next: result[dataIndex + 1]
                },
                indicator: indicator,
                defaultStyles: defaultStyles
            });
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- ignore
            eachFigureCallback(figure, __assign(__assign({}, defaultFigureStyles), ss), figureIndex);
        }
    });
}
var IndicatorImp = /** @class */ (function () {
    function IndicatorImp(indicator) {
        this.precision = 4;
        this.calcParams = [];
        this.shouldOhlc = false;
        this.shouldFormatBigNumber = false;
        this.visible = true;
        this.zLevel = 0;
        this.series = 'normal';
        this.figures = [];
        this.minValue = null;
        this.maxValue = null;
        this.styles = null;
        this.shouldUpdate = function (prev, current) {
            var calc = JSON.stringify(prev.calcParams) !== JSON.stringify(current.calcParams) ||
                prev.figures !== current.figures ||
                prev.calc !== current.calc;
            var draw = calc ||
                prev.shortName !== current.shortName ||
                prev.series !== current.series ||
                prev.minValue !== current.minValue ||
                prev.maxValue !== current.maxValue ||
                prev.precision !== current.precision ||
                prev.shouldOhlc !== current.shouldOhlc ||
                prev.shouldFormatBigNumber !== current.shouldFormatBigNumber ||
                prev.visible !== current.visible ||
                prev.zLevel !== current.zLevel ||
                prev.extendData !== current.extendData ||
                prev.regenerateFigures !== current.regenerateFigures ||
                prev.createTooltipDataSource !== current.createTooltipDataSource ||
                prev.draw !== current.draw;
            return { calc: calc, draw: draw };
        };
        this.calc = function () { return []; };
        this.regenerateFigures = null;
        this.createTooltipDataSource = null;
        this.draw = null;
        this.onDataStateChange = null;
        this.result = [];
        this._lockSeriesPrecision = false;
        this.override(indicator);
        this._lockSeriesPrecision = false;
    }
    IndicatorImp.prototype.override = function (indicator) {
        var _a, _b;
        var _c = this, result = _c.result, currentOthers = __rest(_c, ["result"]);
        this._prevIndicator = __assign(__assign({}, (0, typeChecks_1.clone)(currentOthers)), { result: result });
        var id = indicator.id, name = indicator.name, shortName = indicator.shortName, precision = indicator.precision, styles = indicator.styles, figures = indicator.figures, calcParams = indicator.calcParams, others = __rest(indicator, ["id", "name", "shortName", "precision", "styles", "figures", "calcParams"]);
        if (!(0, typeChecks_1.isString)(this.id) && (0, typeChecks_1.isString)(id)) {
            this.id = id;
        }
        if (!(0, typeChecks_1.isString)(this.name)) {
            this.name = name !== null && name !== void 0 ? name : '';
        }
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition  -- ignore
        this.shortName = (_a = shortName !== null && shortName !== void 0 ? shortName : this.shortName) !== null && _a !== void 0 ? _a : this.name;
        if ((0, typeChecks_1.isNumber)(precision)) {
            this.precision = precision;
            this._lockSeriesPrecision = true;
        }
        if ((0, typeChecks_1.isValid)(styles)) {
            (_b = this.styles) !== null && _b !== void 0 ? _b : (this.styles = {});
            (0, typeChecks_1.merge)(this.styles, styles);
        }
        (0, typeChecks_1.merge)(this, others);
        if ((0, typeChecks_1.isValid)(calcParams)) {
            this.calcParams = calcParams;
            if ((0, typeChecks_1.isFunction)(this.regenerateFigures)) {
                this.figures = this.regenerateFigures(this.calcParams);
            }
        }
        this.figures = figures !== null && figures !== void 0 ? figures : this.figures;
    };
    IndicatorImp.prototype.setSeriesPrecision = function (precision) {
        if (!this._lockSeriesPrecision) {
            this.precision = precision;
        }
    };
    IndicatorImp.prototype.shouldUpdateImp = function () {
        var sort = this._prevIndicator.zLevel !== this.zLevel;
        var result = this.shouldUpdate(this._prevIndicator, this);
        if ((0, typeChecks_1.isBoolean)(result)) {
            return { calc: result, draw: result, sort: sort };
        }
        return __assign(__assign({}, result), { sort: sort });
    };
    IndicatorImp.prototype.calcImp = function (dataList) {
        return __awaiter(this, void 0, void 0, function () {
            var result, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.calc(dataList, this)];
                    case 1:
                        result = _a.sent();
                        this.result = result;
                        return [2 /*return*/, true];
                    case 2:
                        e_1 = _a.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    IndicatorImp.extend = function (template) {
        var Custom = /** @class */ (function (_super) {
            __extends(Custom, _super);
            function Custom() {
                return _super.call(this, template) || this;
            }
            return Custom;
        }(IndicatorImp));
        return Custom;
    };
    return IndicatorImp;
}());
exports.default = IndicatorImp;
//# sourceMappingURL=Indicator.js.map