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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var typeChecks_1 = require("../common/utils/typeChecks");
var Pane_1 = __importDefault(require("./Pane"));
var types_1 = require("./types");
var dom_1 = require("../common/utils/dom");
var canvas_1 = require("../common/utils/canvas");
var YAxis_1 = __importDefault(require("../component/YAxis"));
var DrawPane = /** @class */ (function (_super) {
    __extends(DrawPane, _super);
    function DrawPane(chart, id, options) {
        var _this = _super.call(this, chart, id) || this;
        _this._yAxisWidget = null;
        _this._options = {
            id: '',
            minHeight: types_1.PANE_MIN_HEIGHT,
            dragEnabled: true,
            order: 0,
            height: types_1.PANE_DEFAULT_HEIGHT,
            state: 'normal',
            axis: { name: 'normal', scrollZoomEnabled: true }
        };
        var container = _this.getContainer();
        _this._mainWidget = _this.createMainWidget(container);
        _this._yAxisWidget = _this.createYAxisWidget(container);
        _this.setOptions(options);
        return _this;
    }
    DrawPane.prototype.setOptions = function (options) {
        var _a, _b, _c, _d, _e;
        var paneId = this.getId();
        if (paneId === types_1.PaneIdConstants.CANDLE || paneId === types_1.PaneIdConstants.X_AXIS) {
            var axisName = (_a = options.axis) === null || _a === void 0 ? void 0 : _a.name;
            if (!(0, typeChecks_1.isValid)(this._axis) ||
                ((0, typeChecks_1.isValid)(axisName) && this._options.axis.name !== axisName)) {
                this._axis = this.createAxisComponent(axisName !== null && axisName !== void 0 ? axisName : 'normal');
            }
        }
        else {
            if (!(0, typeChecks_1.isValid)(this._axis)) {
                this._axis = this.createAxisComponent('normal');
            }
        }
        if (this._axis instanceof YAxis_1.default) {
            this._axis.setAutoCalcTickFlag(true);
        }
        (0, typeChecks_1.merge)(this._options, options);
        this._axis.override(__assign(__assign({}, this._options.axis), { name: (_c = (_b = options.axis) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : 'normal' }));
        var container = null;
        var cursor = 'default';
        if (this.getId() === types_1.PaneIdConstants.X_AXIS) {
            container = this.getMainWidget().getContainer();
            cursor = 'ew-resize';
        }
        else {
            container = this.getYAxisWidget().getContainer();
            cursor = 'ns-resize';
        }
        if ((_e = (_d = options.axis) === null || _d === void 0 ? void 0 : _d.scrollZoomEnabled) !== null && _e !== void 0 ? _e : true) {
            container.style.cursor = cursor;
        }
        else {
            container.style.cursor = 'default';
        }
        return this;
    };
    DrawPane.prototype.getOptions = function () { return this._options; };
    DrawPane.prototype.getAxisComponent = function () {
        return this._axis;
    };
    DrawPane.prototype.setBounding = function (rootBounding, mainBounding, leftYAxisBounding, rightYAxisBounding) {
        var _a, _b, _c, _d;
        (0, typeChecks_1.merge)(this.getBounding(), rootBounding);
        var contentBounding = {};
        if ((0, typeChecks_1.isValid)(rootBounding.height)) {
            contentBounding.height = rootBounding.height;
        }
        if ((0, typeChecks_1.isValid)(rootBounding.top)) {
            contentBounding.top = rootBounding.top;
        }
        this._mainWidget.setBounding(contentBounding);
        var mainBoundingValid = (0, typeChecks_1.isValid)(mainBounding);
        if (mainBoundingValid) {
            this._mainWidget.setBounding(mainBounding);
        }
        if ((0, typeChecks_1.isValid)(this._yAxisWidget)) {
            this._yAxisWidget.setBounding(contentBounding);
            var yAxis = this._axis;
            if (yAxis.position === 'left') {
                if ((0, typeChecks_1.isValid)(leftYAxisBounding)) {
                    this._yAxisWidget.setBounding(__assign(__assign({}, leftYAxisBounding), { left: 0 }));
                }
            }
            else {
                if ((0, typeChecks_1.isValid)(rightYAxisBounding)) {
                    this._yAxisWidget.setBounding(rightYAxisBounding);
                    if (mainBoundingValid) {
                        this._yAxisWidget.setBounding({
                            left: ((_a = mainBounding.left) !== null && _a !== void 0 ? _a : 0) +
                                ((_b = mainBounding.width) !== null && _b !== void 0 ? _b : 0) +
                                ((_c = mainBounding.right) !== null && _c !== void 0 ? _c : 0) -
                                ((_d = rightYAxisBounding.width) !== null && _d !== void 0 ? _d : 0)
                        });
                    }
                }
            }
        }
        return this;
    };
    DrawPane.prototype.getMainWidget = function () { return this._mainWidget; };
    DrawPane.prototype.getYAxisWidget = function () { return this._yAxisWidget; };
    DrawPane.prototype.updateImp = function (level) {
        var _a;
        this._mainWidget.update(level);
        (_a = this._yAxisWidget) === null || _a === void 0 ? void 0 : _a.update(level);
    };
    DrawPane.prototype.destroy = function () {
        var _a;
        this._mainWidget.destroy();
        (_a = this._yAxisWidget) === null || _a === void 0 ? void 0 : _a.destroy();
    };
    DrawPane.prototype.getImage = function (includeOverlay) {
        var _a = this.getBounding(), width = _a.width, height = _a.height;
        var canvas = (0, dom_1.createDom)('canvas', {
            width: "".concat(width, "px"),
            height: "".concat(height, "px"),
            boxSizing: 'border-box'
        });
        var ctx = canvas.getContext('2d');
        var pixelRatio = (0, canvas_1.getPixelRatio)(canvas);
        canvas.width = width * pixelRatio;
        canvas.height = height * pixelRatio;
        ctx.scale(pixelRatio, pixelRatio);
        var mainBounding = this._mainWidget.getBounding();
        ctx.drawImage(this._mainWidget.getImage(includeOverlay), mainBounding.left, 0, mainBounding.width, mainBounding.height);
        if (this._yAxisWidget !== null) {
            var yAxisBounding = this._yAxisWidget.getBounding();
            ctx.drawImage(this._yAxisWidget.getImage(includeOverlay), yAxisBounding.left, 0, yAxisBounding.width, yAxisBounding.height);
        }
        return canvas;
    };
    DrawPane.prototype.createYAxisWidget = function (_container) { return null; };
    return DrawPane;
}(Pane_1.default));
exports.default = DrawPane;
//# sourceMappingURL=DrawPane.js.map