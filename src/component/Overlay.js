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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OVERLAY_FIGURE_KEY_PREFIX = exports.OVERLAY_ID_PREFIX = void 0;
exports.checkOverlayFigureEvent = checkOverlayFigureEvent;
var typeChecks_1 = require("../common/utils/typeChecks");
function checkOverlayFigureEvent(targetEventType, figure) {
    var _a;
    var ignoreEvent = (_a = figure === null || figure === void 0 ? void 0 : figure.ignoreEvent) !== null && _a !== void 0 ? _a : false;
    if ((0, typeChecks_1.isBoolean)(ignoreEvent)) {
        return !ignoreEvent;
    }
    return !ignoreEvent.includes(targetEventType);
}
var OVERLAY_DRAW_STEP_START = 1;
var OVERLAY_DRAW_STEP_FINISHED = -1;
exports.OVERLAY_ID_PREFIX = 'overlay_';
exports.OVERLAY_FIGURE_KEY_PREFIX = 'overlay_figure_';
var OverlayImp = /** @class */ (function () {
    function OverlayImp(overlay) {
        this.groupId = '';
        this.totalStep = 1;
        this.currentStep = OVERLAY_DRAW_STEP_START;
        this.lock = false;
        this.visible = true;
        this.zLevel = 0;
        this.needDefaultPointFigure = false;
        this.needDefaultXAxisFigure = false;
        this.needDefaultYAxisFigure = false;
        this.mode = 'normal';
        this.modeSensitivity = 8;
        this.points = [];
        this.styles = null;
        this.createPointFigures = null;
        this.createXAxisFigures = null;
        this.createYAxisFigures = null;
        this.performEventPressedMove = null;
        this.performEventMoveForDrawing = null;
        this.onDrawStart = null;
        this.onDrawing = null;
        this.onDrawEnd = null;
        this.onClick = null;
        this.onDoubleClick = null;
        this.onRightClick = null;
        this.onPressedMoveStart = null;
        this.onPressedMoving = null;
        this.onPressedMoveEnd = null;
        this.onMouseMove = null;
        this.onMouseEnter = null;
        this.onMouseLeave = null;
        this.onRemoved = null;
        this.onSelected = null;
        this.onDeselected = null;
        this._prevZLevel = 0;
        this._prevPressedPoint = null;
        this._prevPressedPoints = [];
        this.override(overlay);
    }
    OverlayImp.prototype.override = function (overlay) {
        var _a, _b;
        this._prevOverlay = (0, typeChecks_1.clone)(this);
        var id = overlay.id, name = overlay.name, _ = overlay.currentStep, points = overlay.points, styles = overlay.styles, others = __rest(overlay, ["id", "name", "currentStep", "points", "styles"]);
        (0, typeChecks_1.merge)(this, others);
        if (!(0, typeChecks_1.isString)(this.name)) {
            this.name = name !== null && name !== void 0 ? name : '';
        }
        if (!(0, typeChecks_1.isString)(this.id) && (0, typeChecks_1.isString)(id)) {
            this.id = id;
        }
        if ((0, typeChecks_1.isValid)(styles)) {
            (_a = this.styles) !== null && _a !== void 0 ? _a : (this.styles = {});
            (0, typeChecks_1.merge)(this.styles, styles);
        }
        if ((0, typeChecks_1.isArray)(points) && points.length > 0) {
            var repeatTotalStep = 0;
            this.points = __spreadArray([], __read(points), false);
            if (points.length >= this.totalStep - 1) {
                this.currentStep = OVERLAY_DRAW_STEP_FINISHED;
                repeatTotalStep = this.totalStep - 1;
            }
            else {
                this.currentStep = points.length + 1;
                repeatTotalStep = points.length;
            }
            // Prevent wrong drawing due to wrong points
            if ((0, typeChecks_1.isFunction)(this.performEventMoveForDrawing)) {
                for (var i = 0; i < repeatTotalStep; i++) {
                    this.performEventMoveForDrawing({
                        currentStep: i + 2,
                        mode: this.mode,
                        points: this.points,
                        performPointIndex: i,
                        performPoint: this.points[i]
                    });
                }
            }
            if (this.currentStep === OVERLAY_DRAW_STEP_FINISHED) {
                (_b = this.performEventPressedMove) === null || _b === void 0 ? void 0 : _b.call(this, {
                    currentStep: this.currentStep,
                    mode: this.mode,
                    points: this.points,
                    performPointIndex: this.points.length - 1,
                    performPoint: this.points[this.points.length - 1]
                });
            }
        }
    };
    OverlayImp.prototype.getPrevZLevel = function () { return this._prevZLevel; };
    OverlayImp.prototype.setPrevZLevel = function (zLevel) { this._prevZLevel = zLevel; };
    OverlayImp.prototype.shouldUpdate = function () {
        var sort = this._prevOverlay.zLevel !== this.zLevel;
        var draw = sort ||
            JSON.stringify(this._prevOverlay.points) !== JSON.stringify(this.points) ||
            this._prevOverlay.visible !== this.visible ||
            this._prevOverlay.extendData !== this.extendData ||
            this._prevOverlay.styles !== this.styles;
        return { sort: sort, draw: draw };
    };
    OverlayImp.prototype.nextStep = function () {
        if (this.currentStep === this.totalStep - 1) {
            this.currentStep = OVERLAY_DRAW_STEP_FINISHED;
        }
        else {
            this.currentStep++;
        }
    };
    OverlayImp.prototype.forceComplete = function () {
        this.currentStep = OVERLAY_DRAW_STEP_FINISHED;
    };
    OverlayImp.prototype.isDrawing = function () {
        return this.currentStep !== OVERLAY_DRAW_STEP_FINISHED;
    };
    OverlayImp.prototype.isStart = function () {
        return this.currentStep === OVERLAY_DRAW_STEP_START;
    };
    OverlayImp.prototype.eventMoveForDrawing = function (point) {
        var _a;
        var pointIndex = this.currentStep - 1;
        var newPoint = {};
        if ((0, typeChecks_1.isNumber)(point.timestamp)) {
            newPoint.timestamp = point.timestamp;
        }
        if ((0, typeChecks_1.isNumber)(point.dataIndex)) {
            newPoint.dataIndex = point.dataIndex;
        }
        if ((0, typeChecks_1.isNumber)(point.value)) {
            newPoint.value = point.value;
        }
        this.points[pointIndex] = newPoint;
        (_a = this.performEventMoveForDrawing) === null || _a === void 0 ? void 0 : _a.call(this, {
            currentStep: this.currentStep,
            mode: this.mode,
            points: this.points,
            performPointIndex: pointIndex,
            performPoint: newPoint
        });
    };
    OverlayImp.prototype.eventPressedPointMove = function (point, pointIndex) {
        var _a;
        this.points[pointIndex].timestamp = point.timestamp;
        if ((0, typeChecks_1.isNumber)(point.value)) {
            this.points[pointIndex].value = point.value;
        }
        (_a = this.performEventPressedMove) === null || _a === void 0 ? void 0 : _a.call(this, {
            currentStep: this.currentStep,
            points: this.points,
            mode: this.mode,
            performPointIndex: pointIndex,
            performPoint: this.points[pointIndex]
        });
    };
    OverlayImp.prototype.startPressedMove = function (point) {
        this._prevPressedPoint = __assign({}, point);
        this._prevPressedPoints = (0, typeChecks_1.clone)(this.points);
    };
    OverlayImp.prototype.eventPressedOtherMove = function (point, chartStore) {
        if (this._prevPressedPoint !== null) {
            var difDataIndex_1 = null;
            if ((0, typeChecks_1.isNumber)(point.dataIndex) && (0, typeChecks_1.isNumber)(this._prevPressedPoint.dataIndex)) {
                difDataIndex_1 = point.dataIndex - this._prevPressedPoint.dataIndex;
            }
            var difValue_1 = null;
            if ((0, typeChecks_1.isNumber)(point.value) && (0, typeChecks_1.isNumber)(this._prevPressedPoint.value)) {
                difValue_1 = point.value - this._prevPressedPoint.value;
            }
            this.points = this._prevPressedPoints.map(function (p) {
                var _a;
                if ((0, typeChecks_1.isNumber)(p.timestamp)) {
                    p.dataIndex = chartStore.timestampToDataIndex(p.timestamp);
                }
                var newPoint = __assign({}, p);
                if ((0, typeChecks_1.isNumber)(difDataIndex_1) && (0, typeChecks_1.isNumber)(p.dataIndex)) {
                    newPoint.dataIndex = p.dataIndex + difDataIndex_1;
                    newPoint.timestamp = (_a = chartStore.dataIndexToTimestamp(newPoint.dataIndex)) !== null && _a !== void 0 ? _a : undefined;
                }
                if ((0, typeChecks_1.isNumber)(difValue_1) && (0, typeChecks_1.isNumber)(p.value)) {
                    newPoint.value = p.value + difValue_1;
                }
                return newPoint;
            });
        }
    };
    OverlayImp.extend = function (template) {
        var Custom = /** @class */ (function (_super) {
            __extends(Custom, _super);
            function Custom() {
                return _super.call(this, template) || this;
            }
            return Custom;
        }(OverlayImp));
        return Custom;
    };
    return OverlayImp;
}());
exports.default = OverlayImp;
//# sourceMappingURL=Overlay.js.map