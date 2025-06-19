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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
var SyntheticEvent_1 = __importStar(require("./common/SyntheticEvent"));
var compatible_1 = require("./common/utils/compatible");
var typeChecks_1 = require("./common/utils/typeChecks");
var types_1 = require("./pane/types");
var types_2 = require("./widget/types");
var Event = /** @class */ (function () {
    function Event(container, chart) {
        var _this = this;
        // 惯性滚动开始时间
        this._flingStartTime = new Date().getTime();
        // 惯性滚动定时器
        this._flingScrollRequestId = null;
        // 开始滚动时坐标点
        this._startScrollCoordinate = null;
        // 开始触摸时坐标
        this._touchCoordinate = null;
        // 是否是取消了十字光标
        this._touchCancelCrosshair = false;
        // 是否缩放过
        this._touchZoomed = false;
        // 用来记录捏合缩放的尺寸
        this._pinchScale = 1;
        this._mouseDownWidget = null;
        this._prevYAxisRange = null;
        this._xAxisStartScaleCoordinate = null;
        this._xAxisStartScaleDistance = 0;
        this._xAxisScale = 1;
        this._yAxisStartScaleDistance = 0;
        this._mouseMoveTriggerWidgetInfo = { pane: null, widget: null };
        this._boundKeyBoardDownEvent = function (event) {
            if (event.shiftKey) {
                switch (event.code) {
                    case 'Equal': {
                        _this._chart.getChartStore().zoom(0.5);
                        break;
                    }
                    case 'Minus': {
                        _this._chart.getChartStore().zoom(-0.5);
                        break;
                    }
                    case 'ArrowLeft': {
                        var store = _this._chart.getChartStore();
                        store.startScroll();
                        store.scroll(-3 * store.getBarSpace().bar);
                        break;
                    }
                    case 'ArrowRight': {
                        var store = _this._chart.getChartStore();
                        store.startScroll();
                        store.scroll(3 * store.getBarSpace().bar);
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        };
        this._container = container;
        this._chart = chart;
        this._event = new SyntheticEvent_1.default(container, this, {
            treatVertDragAsPageScroll: function () { return false; },
            treatHorzDragAsPageScroll: function () { return false; }
        });
        container.addEventListener('keydown', this._boundKeyBoardDownEvent);
    }
    Event.prototype.pinchStartEvent = function () {
        this._touchZoomed = true;
        this._pinchScale = 1;
        return true;
    };
    Event.prototype.pinchEvent = function (e, scale) {
        var _a = this._findWidgetByEvent(e), pane = _a.pane, widget = _a.widget;
        if ((pane === null || pane === void 0 ? void 0 : pane.getId()) !== types_1.PaneIdConstants.X_AXIS && (widget === null || widget === void 0 ? void 0 : widget.getName()) === types_2.WidgetNameConstants.MAIN) {
            var event_1 = this._makeWidgetEvent(e, widget);
            var zoomScale = (scale - this._pinchScale) * 5;
            this._pinchScale = scale;
            this._chart.getChartStore().zoom(zoomScale, { x: event_1.x, y: event_1.y });
            return true;
        }
        return false;
    };
    Event.prototype.mouseWheelHortEvent = function (_, distance) {
        var store = this._chart.getChartStore();
        store.startScroll();
        store.scroll(distance);
        return true;
    };
    Event.prototype.mouseWheelVertEvent = function (e, scale) {
        var widget = this._findWidgetByEvent(e).widget;
        var event = this._makeWidgetEvent(e, widget);
        var name = widget === null || widget === void 0 ? void 0 : widget.getName();
        if (name === types_2.WidgetNameConstants.MAIN) {
            this._chart.getChartStore().zoom(scale, { x: event.x, y: event.y });
            return true;
        }
        return false;
    };
    Event.prototype.mouseDownEvent = function (e) {
        var _a = this._findWidgetByEvent(e), pane = _a.pane, widget = _a.widget;
        this._mouseDownWidget = widget;
        if (widget !== null) {
            var event_2 = this._makeWidgetEvent(e, widget);
            var name_1 = widget.getName();
            switch (name_1) {
                case types_2.WidgetNameConstants.SEPARATOR: {
                    return widget.dispatchEvent('mouseDownEvent', event_2);
                }
                case types_2.WidgetNameConstants.MAIN: {
                    var yAxis = pane.getAxisComponent();
                    if (!yAxis.getAutoCalcTickFlag()) {
                        var range = yAxis.getRange();
                        this._prevYAxisRange = __assign({}, range);
                    }
                    this._startScrollCoordinate = { x: event_2.x, y: event_2.y };
                    this._chart.getChartStore().startScroll();
                    return widget.dispatchEvent('mouseDownEvent', event_2);
                }
                case types_2.WidgetNameConstants.X_AXIS: {
                    return this._processXAxisScrollStartEvent(widget, event_2);
                }
                case types_2.WidgetNameConstants.Y_AXIS: {
                    return this._processYAxisScaleStartEvent(widget, event_2);
                }
            }
        }
        return false;
    };
    Event.prototype.mouseMoveEvent = function (e) {
        var _a, _b, _c;
        var _d = this._findWidgetByEvent(e), pane = _d.pane, widget = _d.widget;
        var event = this._makeWidgetEvent(e, widget);
        if (((_a = this._mouseMoveTriggerWidgetInfo.pane) === null || _a === void 0 ? void 0 : _a.getId()) !== (pane === null || pane === void 0 ? void 0 : pane.getId()) ||
            ((_b = this._mouseMoveTriggerWidgetInfo.widget) === null || _b === void 0 ? void 0 : _b.getName()) !== (widget === null || widget === void 0 ? void 0 : widget.getName())) {
            widget === null || widget === void 0 ? void 0 : widget.dispatchEvent('mouseEnterEvent', event);
            (_c = this._mouseMoveTriggerWidgetInfo.widget) === null || _c === void 0 ? void 0 : _c.dispatchEvent('mouseLeaveEvent', event);
            this._mouseMoveTriggerWidgetInfo = { pane: pane, widget: widget };
        }
        if (widget !== null) {
            var name_2 = widget.getName();
            switch (name_2) {
                case types_2.WidgetNameConstants.MAIN: {
                    var consumed = widget.dispatchEvent('mouseMoveEvent', event);
                    var crosshair = { x: event.x, y: event.y, paneId: pane === null || pane === void 0 ? void 0 : pane.getId() };
                    if (consumed) {
                        if (widget.getForceCursor() !== 'pointer') {
                            crosshair = undefined;
                        }
                        widget.setCursor('pointer');
                    }
                    else {
                        widget.setCursor('crosshair');
                    }
                    this._chart.getChartStore().setCrosshair(crosshair);
                    return consumed;
                }
                case types_2.WidgetNameConstants.SEPARATOR:
                case types_2.WidgetNameConstants.X_AXIS:
                case types_2.WidgetNameConstants.Y_AXIS: {
                    var consumed = widget.dispatchEvent('mouseMoveEvent', event);
                    this._chart.getChartStore().setCrosshair();
                    return consumed;
                }
            }
        }
        return false;
    };
    Event.prototype.pressedMouseMoveEvent = function (e) {
        var _a, _b;
        if (this._mouseDownWidget !== null && this._mouseDownWidget.getName() === types_2.WidgetNameConstants.SEPARATOR) {
            return this._mouseDownWidget.dispatchEvent('pressedMouseMoveEvent', e);
        }
        var _c = this._findWidgetByEvent(e), pane = _c.pane, widget = _c.widget;
        if (widget !== null &&
            ((_a = this._mouseDownWidget) === null || _a === void 0 ? void 0 : _a.getPane().getId()) === (pane === null || pane === void 0 ? void 0 : pane.getId()) &&
            ((_b = this._mouseDownWidget) === null || _b === void 0 ? void 0 : _b.getName()) === widget.getName()) {
            var event_3 = this._makeWidgetEvent(e, widget);
            var name_3 = widget.getName();
            switch (name_3) {
                case types_2.WidgetNameConstants.MAIN: {
                    // eslint-disable-next-line @typescript-eslint/init-declarations -- ignore
                    var crosshair = void 0;
                    var consumed = widget.dispatchEvent('pressedMouseMoveEvent', event_3);
                    if (!consumed) {
                        this._processMainScrollingEvent(widget, event_3);
                    }
                    if (!consumed || widget.getForceCursor() === 'pointer') {
                        crosshair = { x: event_3.x, y: event_3.y, paneId: pane === null || pane === void 0 ? void 0 : pane.getId() };
                    }
                    this._chart.getChartStore().setCrosshair(crosshair, { forceInvalidate: true });
                    return consumed;
                }
                case types_2.WidgetNameConstants.X_AXIS: {
                    return this._processXAxisScrollingEvent(widget, event_3);
                }
                case types_2.WidgetNameConstants.Y_AXIS: {
                    return this._processYAxisScalingEvent(widget, event_3);
                }
            }
        }
        return false;
    };
    Event.prototype.mouseUpEvent = function (e) {
        var widget = this._findWidgetByEvent(e).widget;
        var consumed = false;
        if (widget !== null) {
            var event_4 = this._makeWidgetEvent(e, widget);
            var name_4 = widget.getName();
            switch (name_4) {
                case types_2.WidgetNameConstants.MAIN:
                case types_2.WidgetNameConstants.SEPARATOR:
                case types_2.WidgetNameConstants.X_AXIS:
                case types_2.WidgetNameConstants.Y_AXIS: {
                    consumed = widget.dispatchEvent('mouseUpEvent', event_4);
                    break;
                }
            }
            if (consumed) {
                this._chart.updatePane(1 /* UpdateLevel.Overlay */);
            }
        }
        this._mouseDownWidget = null;
        this._startScrollCoordinate = null;
        this._prevYAxisRange = null;
        this._xAxisStartScaleCoordinate = null;
        this._xAxisStartScaleDistance = 0;
        this._xAxisScale = 1;
        this._yAxisStartScaleDistance = 0;
        return consumed;
    };
    Event.prototype.mouseClickEvent = function (e) {
        var widget = this._findWidgetByEvent(e).widget;
        if (widget !== null) {
            var event_5 = this._makeWidgetEvent(e, widget);
            return widget.dispatchEvent('mouseClickEvent', event_5);
        }
        return false;
    };
    Event.prototype.mouseRightClickEvent = function (e) {
        var widget = this._findWidgetByEvent(e).widget;
        var consumed = false;
        if (widget !== null) {
            var event_6 = this._makeWidgetEvent(e, widget);
            var name_5 = widget.getName();
            switch (name_5) {
                case types_2.WidgetNameConstants.MAIN:
                case types_2.WidgetNameConstants.X_AXIS:
                case types_2.WidgetNameConstants.Y_AXIS: {
                    consumed = widget.dispatchEvent('mouseRightClickEvent', event_6);
                    break;
                }
            }
            if (consumed) {
                this._chart.updatePane(1 /* UpdateLevel.Overlay */);
            }
        }
        return false;
    };
    Event.prototype.mouseDoubleClickEvent = function (e) {
        var _a = this._findWidgetByEvent(e), pane = _a.pane, widget = _a.widget;
        if (widget !== null) {
            var name_6 = widget.getName();
            switch (name_6) {
                case types_2.WidgetNameConstants.MAIN: {
                    var event_7 = this._makeWidgetEvent(e, widget);
                    return widget.dispatchEvent('mouseDoubleClickEvent', event_7);
                }
                case types_2.WidgetNameConstants.Y_AXIS: {
                    var yAxis = pane.getAxisComponent();
                    if (!yAxis.getAutoCalcTickFlag()) {
                        yAxis.setAutoCalcTickFlag(true);
                        this._chart.layout({
                            measureWidth: true,
                            update: true,
                            buildYAxisTick: true
                        });
                        return true;
                    }
                    break;
                }
            }
        }
        return false;
    };
    Event.prototype.mouseLeaveEvent = function () {
        this._chart.getChartStore().setCrosshair();
        return true;
    };
    Event.prototype.touchStartEvent = function (e) {
        var _a;
        var _b = this._findWidgetByEvent(e), pane = _b.pane, widget = _b.widget;
        if (widget !== null) {
            var event_8 = this._makeWidgetEvent(e, widget);
            (_a = event_8.preventDefault) === null || _a === void 0 ? void 0 : _a.call(event_8);
            var name_7 = widget.getName();
            switch (name_7) {
                case types_2.WidgetNameConstants.MAIN: {
                    var chartStore = this._chart.getChartStore();
                    if (widget.dispatchEvent('mouseDownEvent', event_8)) {
                        this._touchCancelCrosshair = true;
                        this._touchCoordinate = null;
                        chartStore.setCrosshair(undefined, { notInvalidate: true });
                        this._chart.updatePane(1 /* UpdateLevel.Overlay */);
                        return true;
                    }
                    if (this._flingScrollRequestId !== null) {
                        (0, compatible_1.cancelAnimationFrame)(this._flingScrollRequestId);
                        this._flingScrollRequestId = null;
                    }
                    this._flingStartTime = new Date().getTime();
                    var yAxis = pane.getAxisComponent();
                    if (!yAxis.getAutoCalcTickFlag()) {
                        var range = yAxis.getRange();
                        this._prevYAxisRange = __assign({}, range);
                    }
                    this._startScrollCoordinate = { x: event_8.x, y: event_8.y };
                    chartStore.startScroll();
                    this._touchZoomed = false;
                    if (this._touchCoordinate !== null) {
                        var xDif = event_8.x - this._touchCoordinate.x;
                        var yDif = event_8.y - this._touchCoordinate.y;
                        var radius = Math.sqrt(xDif * xDif + yDif * yDif);
                        if (radius < SyntheticEvent_1.TOUCH_MIN_RADIUS) {
                            this._touchCoordinate = { x: event_8.x, y: event_8.y };
                            chartStore.setCrosshair({ x: event_8.x, y: event_8.y, paneId: pane === null || pane === void 0 ? void 0 : pane.getId() });
                        }
                        else {
                            this._touchCoordinate = null;
                            this._touchCancelCrosshair = true;
                            chartStore.setCrosshair();
                        }
                    }
                    return true;
                }
                case types_2.WidgetNameConstants.X_AXIS: {
                    return this._processXAxisScrollStartEvent(widget, event_8);
                }
                case types_2.WidgetNameConstants.Y_AXIS: {
                    return this._processYAxisScaleStartEvent(widget, event_8);
                }
            }
        }
        return false;
    };
    Event.prototype.touchMoveEvent = function (e) {
        var _a;
        var _b = this._findWidgetByEvent(e), pane = _b.pane, widget = _b.widget;
        if (widget !== null) {
            var event_9 = this._makeWidgetEvent(e, widget);
            (_a = event_9.preventDefault) === null || _a === void 0 ? void 0 : _a.call(event_9);
            var name_8 = widget.getName();
            var chartStore = this._chart.getChartStore();
            switch (name_8) {
                case types_2.WidgetNameConstants.MAIN: {
                    if (widget.dispatchEvent('pressedMouseMoveEvent', event_9)) {
                        chartStore.setCrosshair(undefined, { notInvalidate: true });
                        this._chart.updatePane(1 /* UpdateLevel.Overlay */);
                        return true;
                    }
                    if (this._touchCoordinate !== null) {
                        chartStore.setCrosshair({ x: event_9.x, y: event_9.y, paneId: pane === null || pane === void 0 ? void 0 : pane.getId() });
                    }
                    else {
                        this._processMainScrollingEvent(widget, event_9);
                    }
                    return true;
                }
                case types_2.WidgetNameConstants.X_AXIS: {
                    return this._processXAxisScrollingEvent(widget, event_9);
                }
                case types_2.WidgetNameConstants.Y_AXIS: {
                    return this._processYAxisScalingEvent(widget, event_9);
                }
            }
        }
        return false;
    };
    Event.prototype.touchEndEvent = function (e) {
        var _this = this;
        var widget = this._findWidgetByEvent(e).widget;
        if (widget !== null) {
            var event_10 = this._makeWidgetEvent(e, widget);
            var name_9 = widget.getName();
            switch (name_9) {
                case types_2.WidgetNameConstants.MAIN: {
                    widget.dispatchEvent('mouseUpEvent', event_10);
                    if (this._startScrollCoordinate !== null) {
                        var time = new Date().getTime() - this._flingStartTime;
                        var distance = event_10.x - this._startScrollCoordinate.x;
                        var v_1 = distance / (time > 0 ? time : 1) * 20;
                        if (time < 200 && Math.abs(v_1) > 0) {
                            var store_1 = this._chart.getChartStore();
                            var flingScroll_1 = function () {
                                _this._flingScrollRequestId = (0, compatible_1.requestAnimationFrame)(function () {
                                    store_1.startScroll();
                                    store_1.scroll(v_1);
                                    v_1 = v_1 * (1 - 0.025);
                                    if (Math.abs(v_1) < 1) {
                                        if (_this._flingScrollRequestId !== null) {
                                            (0, compatible_1.cancelAnimationFrame)(_this._flingScrollRequestId);
                                            _this._flingScrollRequestId = null;
                                        }
                                    }
                                    else {
                                        flingScroll_1();
                                    }
                                });
                            };
                            flingScroll_1();
                        }
                    }
                    return true;
                }
                case types_2.WidgetNameConstants.X_AXIS:
                case types_2.WidgetNameConstants.Y_AXIS: {
                    var consumed = widget.dispatchEvent('mouseUpEvent', event_10);
                    if (consumed) {
                        this._chart.updatePane(1 /* UpdateLevel.Overlay */);
                    }
                }
            }
            this._startScrollCoordinate = null;
            this._prevYAxisRange = null;
            this._xAxisStartScaleCoordinate = null;
            this._xAxisStartScaleDistance = 0;
            this._xAxisScale = 1;
            this._yAxisStartScaleDistance = 0;
        }
        return false;
    };
    Event.prototype.tapEvent = function (e) {
        var _a = this._findWidgetByEvent(e), pane = _a.pane, widget = _a.widget;
        var consumed = false;
        if (widget !== null) {
            var event_11 = this._makeWidgetEvent(e, widget);
            var result = widget.dispatchEvent('mouseClickEvent', event_11);
            if (widget.getName() === types_2.WidgetNameConstants.MAIN) {
                var event_12 = this._makeWidgetEvent(e, widget);
                var chartStore = this._chart.getChartStore();
                if (result) {
                    this._touchCancelCrosshair = true;
                    this._touchCoordinate = null;
                    chartStore.setCrosshair(undefined, { notInvalidate: true });
                    consumed = true;
                }
                else {
                    if (!this._touchCancelCrosshair && !this._touchZoomed) {
                        this._touchCoordinate = { x: event_12.x, y: event_12.y };
                        chartStore.setCrosshair({ x: event_12.x, y: event_12.y, paneId: pane === null || pane === void 0 ? void 0 : pane.getId() }, { notInvalidate: true });
                        consumed = true;
                    }
                    this._touchCancelCrosshair = false;
                }
            }
            if (consumed || result) {
                this._chart.updatePane(1 /* UpdateLevel.Overlay */);
            }
        }
        return consumed;
    };
    Event.prototype.doubleTapEvent = function (e) {
        return this.mouseDoubleClickEvent(e);
    };
    Event.prototype.longTapEvent = function (e) {
        var _a = this._findWidgetByEvent(e), pane = _a.pane, widget = _a.widget;
        if (widget !== null && widget.getName() === types_2.WidgetNameConstants.MAIN) {
            var event_13 = this._makeWidgetEvent(e, widget);
            this._touchCoordinate = { x: event_13.x, y: event_13.y };
            this._chart.getChartStore().setCrosshair({ x: event_13.x, y: event_13.y, paneId: pane === null || pane === void 0 ? void 0 : pane.getId() });
            return true;
        }
        return false;
    };
    Event.prototype._processMainScrollingEvent = function (widget, event) {
        if (this._startScrollCoordinate !== null) {
            var yAxis = widget.getPane().getAxisComponent();
            if (this._prevYAxisRange !== null && !yAxis.getAutoCalcTickFlag() && yAxis.scrollZoomEnabled) {
                var _a = this._prevYAxisRange, from = _a.from, to = _a.to, range = _a.range;
                var distance_1 = 0;
                if (yAxis.reverse) {
                    distance_1 = this._startScrollCoordinate.y - event.y;
                }
                else {
                    distance_1 = event.y - this._startScrollCoordinate.y;
                }
                var bounding = widget.getBounding();
                var scale = distance_1 / bounding.height;
                var difRange = range * scale;
                var newFrom = from + difRange;
                var newTo = to + difRange;
                var newRealFrom = yAxis.valueToRealValue(newFrom, { range: this._prevYAxisRange });
                var newRealTo = yAxis.valueToRealValue(newTo, { range: this._prevYAxisRange });
                var newDisplayFrom = yAxis.realValueToDisplayValue(newRealFrom, { range: this._prevYAxisRange });
                var newDisplayTo = yAxis.realValueToDisplayValue(newRealTo, { range: this._prevYAxisRange });
                yAxis.setRange({
                    from: newFrom,
                    to: newTo,
                    range: newTo - newFrom,
                    realFrom: newRealFrom,
                    realTo: newRealTo,
                    realRange: newRealTo - newRealFrom,
                    displayFrom: newDisplayFrom,
                    displayTo: newDisplayTo,
                    displayRange: newDisplayTo - newDisplayFrom
                });
            }
            var distance = event.x - this._startScrollCoordinate.x;
            this._chart.getChartStore().scroll(distance);
        }
    };
    Event.prototype._processXAxisScrollStartEvent = function (widget, event) {
        var consumed = widget.dispatchEvent('mouseDownEvent', event);
        if (consumed) {
            this._chart.updatePane(1 /* UpdateLevel.Overlay */);
        }
        this._xAxisStartScaleCoordinate = { x: event.x, y: event.y };
        this._xAxisStartScaleDistance = event.pageX;
        return consumed;
    };
    Event.prototype._processXAxisScrollingEvent = function (widget, event) {
        var _a;
        var consumed = widget.dispatchEvent('pressedMouseMoveEvent', event);
        if (!consumed) {
            var xAxis = widget.getPane().getAxisComponent();
            if (xAxis.scrollZoomEnabled && this._xAxisStartScaleDistance !== 0) {
                var scale = this._xAxisStartScaleDistance / event.pageX;
                if (Number.isFinite(scale)) {
                    var zoomScale = (scale - this._xAxisScale) * 10;
                    this._xAxisScale = scale;
                    this._chart.getChartStore().zoom(zoomScale, (_a = this._xAxisStartScaleCoordinate) !== null && _a !== void 0 ? _a : undefined);
                }
            }
        }
        else {
            this._chart.updatePane(1 /* UpdateLevel.Overlay */);
        }
        return consumed;
    };
    Event.prototype._processYAxisScaleStartEvent = function (widget, event) {
        var consumed = widget.dispatchEvent('mouseDownEvent', event);
        if (consumed) {
            this._chart.updatePane(1 /* UpdateLevel.Overlay */);
        }
        var range = widget.getPane().getAxisComponent().getRange();
        this._prevYAxisRange = __assign({}, range);
        this._yAxisStartScaleDistance = event.pageY;
        return consumed;
    };
    Event.prototype._processYAxisScalingEvent = function (widget, event) {
        var consumed = widget.dispatchEvent('pressedMouseMoveEvent', event);
        if (!consumed) {
            var yAxis = widget.getPane().getAxisComponent();
            if (this._prevYAxisRange !== null && yAxis.scrollZoomEnabled && this._yAxisStartScaleDistance !== 0) {
                var _a = this._prevYAxisRange, from = _a.from, to = _a.to, range = _a.range;
                var scale = event.pageY / this._yAxisStartScaleDistance;
                var newRange = range * scale;
                var difRange = (newRange - range) / 2;
                var newFrom = from - difRange;
                var newTo = to + difRange;
                var newRealFrom = yAxis.valueToRealValue(newFrom, { range: this._prevYAxisRange });
                var newRealTo = yAxis.valueToRealValue(newTo, { range: this._prevYAxisRange });
                var newDisplayFrom = yAxis.realValueToDisplayValue(newRealFrom, { range: this._prevYAxisRange });
                var newDisplayTo = yAxis.realValueToDisplayValue(newRealTo, { range: this._prevYAxisRange });
                yAxis.setRange({
                    from: newFrom,
                    to: newTo,
                    range: newRange,
                    realFrom: newRealFrom,
                    realTo: newRealTo,
                    realRange: newRealTo - newRealFrom,
                    displayFrom: newDisplayFrom,
                    displayTo: newDisplayTo,
                    displayRange: newDisplayTo - newDisplayFrom
                });
                this._chart.layout({
                    measureWidth: true,
                    update: true,
                    buildYAxisTick: true
                });
            }
        }
        else {
            this._chart.updatePane(1 /* UpdateLevel.Overlay */);
        }
        return consumed;
    };
    Event.prototype._findWidgetByEvent = function (event) {
        var e_1, _a, e_2, _b;
        var x = event.x, y = event.y;
        var separatorPanes = this._chart.getSeparatorPanes();
        var separatorSize = this._chart.getStyles().separator.size;
        try {
            for (var separatorPanes_1 = __values(separatorPanes), separatorPanes_1_1 = separatorPanes_1.next(); !separatorPanes_1_1.done; separatorPanes_1_1 = separatorPanes_1.next()) {
                var items = separatorPanes_1_1.value;
                var pane_1 = items[1];
                var bounding = pane_1.getBounding();
                var top_1 = bounding.top - Math.round((types_2.REAL_SEPARATOR_HEIGHT - separatorSize) / 2);
                if (x >= bounding.left && x <= bounding.left + bounding.width &&
                    y >= top_1 && y <= top_1 + types_2.REAL_SEPARATOR_HEIGHT) {
                    return { pane: pane_1, widget: pane_1.getWidget() };
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (separatorPanes_1_1 && !separatorPanes_1_1.done && (_a = separatorPanes_1.return)) _a.call(separatorPanes_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var drawPanes = this._chart.getDrawPanes();
        var pane = null;
        try {
            for (var drawPanes_1 = __values(drawPanes), drawPanes_1_1 = drawPanes_1.next(); !drawPanes_1_1.done; drawPanes_1_1 = drawPanes_1.next()) {
                var p = drawPanes_1_1.value;
                var bounding = p.getBounding();
                if (x >= bounding.left && x <= bounding.left + bounding.width &&
                    y >= bounding.top && y <= bounding.top + bounding.height) {
                    pane = p;
                    break;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (drawPanes_1_1 && !drawPanes_1_1.done && (_b = drawPanes_1.return)) _b.call(drawPanes_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        var widget = null;
        if (pane !== null) {
            if (!(0, typeChecks_1.isValid)(widget)) {
                var mainWidget = pane.getMainWidget();
                var mainBounding = mainWidget.getBounding();
                if (x >= mainBounding.left && x <= mainBounding.left + mainBounding.width &&
                    y >= mainBounding.top && y <= mainBounding.top + mainBounding.height) {
                    widget = mainWidget;
                }
            }
            if (!(0, typeChecks_1.isValid)(widget)) {
                var yAxisWidget = pane.getYAxisWidget();
                if (yAxisWidget !== null) {
                    var yAxisBounding = yAxisWidget.getBounding();
                    if (x >= yAxisBounding.left && x <= yAxisBounding.left + yAxisBounding.width &&
                        y >= yAxisBounding.top && y <= yAxisBounding.top + yAxisBounding.height) {
                        widget = yAxisWidget;
                    }
                }
            }
        }
        return { pane: pane, widget: widget };
    };
    Event.prototype._makeWidgetEvent = function (event, widget) {
        var _a, _b, _c;
        var bounding = (_a = widget === null || widget === void 0 ? void 0 : widget.getBounding()) !== null && _a !== void 0 ? _a : null;
        return __assign(__assign({}, event), { x: event.x - ((_b = bounding === null || bounding === void 0 ? void 0 : bounding.left) !== null && _b !== void 0 ? _b : 0), y: event.y - ((_c = bounding === null || bounding === void 0 ? void 0 : bounding.top) !== null && _c !== void 0 ? _c : 0) });
    };
    Event.prototype.destroy = function () {
        this._container.removeEventListener('keydown', this._boundKeyBoardDownEvent);
        this._event.destroy();
    };
    return Event;
}());
exports.default = Event;
//# sourceMappingURL=Event.js.map