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
var Overlay_1 = require("../component/Overlay");
var types_1 = require("../pane/types");
var View_1 = __importDefault(require("./View"));
var OverlayView = /** @class */ (function (_super) {
    __extends(OverlayView, _super);
    function OverlayView(widget) {
        var _this = _super.call(this, widget) || this;
        _this._initEvent();
        return _this;
    }
    OverlayView.prototype._initEvent = function () {
        var _this = this;
        var widget = this.getWidget();
        var pane = widget.getPane();
        var paneId = pane.getId();
        var chart = pane.getChart();
        var chartStore = chart.getChartStore();
        this.registerEvent('mouseMoveEvent', function (event) {
            var _a;
            var progressOverlayInfo = chartStore.getProgressOverlayInfo();
            if (progressOverlayInfo !== null) {
                var overlay = progressOverlayInfo.overlay;
                var progressOverlayPaneId = progressOverlayInfo.paneId;
                if (overlay.isStart()) {
                    chartStore.updateProgressOverlayInfo(paneId);
                    progressOverlayPaneId = paneId;
                }
                var index = overlay.points.length - 1;
                if (overlay.isDrawing() && progressOverlayPaneId === paneId) {
                    overlay.eventMoveForDrawing(_this._coordinateToPoint(overlay, event));
                    (_a = overlay.onDrawing) === null || _a === void 0 ? void 0 : _a.call(overlay, __assign({ chart: chart, overlay: overlay }, event));
                }
                return _this._figureMouseMoveEvent(overlay, 'point', index, { key: "".concat(Overlay_1.OVERLAY_FIGURE_KEY_PREFIX, "point_").concat(index), type: 'circle', attrs: {} })(event);
            }
            chartStore.setHoverOverlayInfo({
                paneId: paneId,
                overlay: null,
                figureType: 'none',
                figureIndex: -1,
                figure: null
            }, function (o, f) { return _this._processOverlayMouseEnterEvent(o, f, event); }, function (o, f) { return _this._processOverlayMouseLeaveEvent(o, f, event); });
            widget.setForceCursor(null);
            return false;
        }).registerEvent('mouseClickEvent', function (event) {
            var _a, _b;
            var progressOverlayInfo = chartStore.getProgressOverlayInfo();
            if (progressOverlayInfo !== null) {
                var overlay = progressOverlayInfo.overlay;
                var progressOverlayPaneId = progressOverlayInfo.paneId;
                if (overlay.isStart()) {
                    chartStore.updateProgressOverlayInfo(paneId, true);
                    progressOverlayPaneId = paneId;
                }
                var index = overlay.points.length - 1;
                if (overlay.isDrawing() && progressOverlayPaneId === paneId) {
                    overlay.eventMoveForDrawing(_this._coordinateToPoint(overlay, event));
                    (_a = overlay.onDrawing) === null || _a === void 0 ? void 0 : _a.call(overlay, __assign({ chart: chart, overlay: overlay }, event));
                    overlay.nextStep();
                    if (!overlay.isDrawing()) {
                        chartStore.progressOverlayComplete();
                        (_b = overlay.onDrawEnd) === null || _b === void 0 ? void 0 : _b.call(overlay, __assign({ chart: chart, overlay: overlay }, event));
                    }
                }
                return _this._figureMouseClickEvent(overlay, 'point', index, {
                    key: "".concat(Overlay_1.OVERLAY_FIGURE_KEY_PREFIX, "point_").concat(index),
                    type: 'circle',
                    attrs: {}
                })(event);
            }
            chartStore.setClickOverlayInfo({
                paneId: paneId,
                overlay: null,
                figureType: 'none',
                figureIndex: -1,
                figure: null
            }, function (o, f) { return _this._processOverlaySelectedEvent(o, f, event); }, function (o, f) { return _this._processOverlayDeselectedEvent(o, f, event); });
            return false;
        }).registerEvent('mouseDoubleClickEvent', function (event) {
            var _a;
            var progressOverlayInfo = chartStore.getProgressOverlayInfo();
            if (progressOverlayInfo !== null) {
                var overlay = progressOverlayInfo.overlay;
                var progressOverlayPaneId = progressOverlayInfo.paneId;
                if (overlay.isDrawing() && progressOverlayPaneId === paneId) {
                    overlay.forceComplete();
                    if (!overlay.isDrawing()) {
                        chartStore.progressOverlayComplete();
                        (_a = overlay.onDrawEnd) === null || _a === void 0 ? void 0 : _a.call(overlay, __assign({ chart: chart, overlay: overlay }, event));
                    }
                }
                var index = overlay.points.length - 1;
                return _this._figureMouseClickEvent(overlay, 'point', index, {
                    key: "".concat(Overlay_1.OVERLAY_FIGURE_KEY_PREFIX, "point_").concat(index),
                    type: 'circle',
                    attrs: {}
                })(event);
            }
            return false;
        }).registerEvent('mouseRightClickEvent', function (event) {
            var progressOverlayInfo = chartStore.getProgressOverlayInfo();
            if (progressOverlayInfo !== null) {
                var overlay = progressOverlayInfo.overlay;
                if (overlay.isDrawing()) {
                    var index = overlay.points.length - 1;
                    return _this._figureMouseRightClickEvent(overlay, 'point', index, {
                        key: "".concat(Overlay_1.OVERLAY_FIGURE_KEY_PREFIX, "point_").concat(index),
                        type: 'circle',
                        attrs: {}
                    })(event);
                }
            }
            return false;
        }).registerEvent('mouseUpEvent', function (event) {
            var _a;
            var _b = chartStore.getPressedOverlayInfo(), overlay = _b.overlay, figure = _b.figure;
            if (overlay !== null) {
                if ((0, Overlay_1.checkOverlayFigureEvent)('onPressedMoveEnd', figure)) {
                    (_a = overlay.onPressedMoveEnd) === null || _a === void 0 ? void 0 : _a.call(overlay, __assign({ chart: chart, overlay: overlay, figure: figure !== null && figure !== void 0 ? figure : undefined }, event));
                }
            }
            chartStore.setPressedOverlayInfo({
                paneId: paneId,
                overlay: null,
                figureType: 'none',
                figureIndex: -1,
                figure: null
            });
            return false;
        }).registerEvent('pressedMouseMoveEvent', function (event) {
            var _a;
            var _b = chartStore.getPressedOverlayInfo(), overlay = _b.overlay, figureType = _b.figureType, figureIndex = _b.figureIndex, figure = _b.figure;
            if (overlay !== null) {
                if ((0, Overlay_1.checkOverlayFigureEvent)('onPressedMoving', figure)) {
                    if (!overlay.lock) {
                        var point = _this._coordinateToPoint(overlay, event);
                        if (figureType === 'point') {
                            overlay.eventPressedPointMove(point, figureIndex);
                        }
                        else {
                            overlay.eventPressedOtherMove(point, _this.getWidget().getPane().getChart().getChartStore());
                        }
                        var prevented_1 = false;
                        (_a = overlay.onPressedMoving) === null || _a === void 0 ? void 0 : _a.call(overlay, __assign(__assign({ chart: chart, overlay: overlay, figure: figure !== null && figure !== void 0 ? figure : undefined }, event), { preventDefault: function () { prevented_1 = true; } }));
                        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- ignore
                        if (prevented_1) {
                            _this.getWidget().setForceCursor(null);
                        }
                        else {
                            _this.getWidget().setForceCursor('pointer');
                        }
                    }
                    return true;
                }
            }
            _this.getWidget().setForceCursor(null);
            return false;
        });
    };
    OverlayView.prototype._createFigureEvents = function (overlay, figureType, figureIndex, figure) {
        if (overlay.isDrawing()) {
            return null;
        }
        return {
            mouseMoveEvent: this._figureMouseMoveEvent(overlay, figureType, figureIndex, figure),
            mouseDownEvent: this._figureMouseDownEvent(overlay, figureType, figureIndex, figure),
            mouseClickEvent: this._figureMouseClickEvent(overlay, figureType, figureIndex, figure),
            mouseRightClickEvent: this._figureMouseRightClickEvent(overlay, figureType, figureIndex, figure),
            mouseDoubleClickEvent: this._figureMouseDoubleClickEvent(overlay, figureType, figureIndex, figure)
        };
    };
    OverlayView.prototype._processOverlayMouseEnterEvent = function (overlay, figure, event) {
        if ((0, typeChecks_1.isFunction)(overlay.onMouseEnter) && (0, Overlay_1.checkOverlayFigureEvent)('onMouseEnter', figure)) {
            overlay.onMouseEnter(__assign({ chart: this.getWidget().getPane().getChart(), overlay: overlay, figure: figure !== null && figure !== void 0 ? figure : undefined }, event));
            return true;
        }
        return false;
    };
    OverlayView.prototype._processOverlayMouseLeaveEvent = function (overlay, figure, event) {
        if ((0, typeChecks_1.isFunction)(overlay.onMouseLeave) && (0, Overlay_1.checkOverlayFigureEvent)('onMouseLeave', figure)) {
            overlay.onMouseLeave(__assign({ chart: this.getWidget().getPane().getChart(), overlay: overlay, figure: figure !== null && figure !== void 0 ? figure : undefined }, event));
            return true;
        }
        return false;
    };
    OverlayView.prototype._processOverlaySelectedEvent = function (overlay, figure, event) {
        var _a;
        if ((0, Overlay_1.checkOverlayFigureEvent)('onSelected', figure)) {
            (_a = overlay.onSelected) === null || _a === void 0 ? void 0 : _a.call(overlay, __assign({ chart: this.getWidget().getPane().getChart(), overlay: overlay, figure: figure !== null && figure !== void 0 ? figure : undefined }, event));
            return true;
        }
        return false;
    };
    OverlayView.prototype._processOverlayDeselectedEvent = function (overlay, figure, event) {
        var _a;
        if ((0, Overlay_1.checkOverlayFigureEvent)('onDeselected', figure)) {
            (_a = overlay.onDeselected) === null || _a === void 0 ? void 0 : _a.call(overlay, __assign({ chart: this.getWidget().getPane().getChart(), overlay: overlay, figure: figure !== null && figure !== void 0 ? figure : undefined }, event));
            return true;
        }
        return false;
    };
    OverlayView.prototype._figureMouseMoveEvent = function (overlay, figureType, figureIndex, figure) {
        var _this = this;
        return function (event) {
            var _a;
            var pane = _this.getWidget().getPane();
            var check = !overlay.isDrawing() && (0, Overlay_1.checkOverlayFigureEvent)('onMouseMove', figure);
            if (check) {
                var prevented_2 = false;
                (_a = overlay.onMouseMove) === null || _a === void 0 ? void 0 : _a.call(overlay, __assign(__assign({ chart: pane.getChart(), overlay: overlay, figure: figure }, event), { preventDefault: function () { prevented_2 = true; } }));
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- ignore
                if (prevented_2) {
                    _this.getWidget().setForceCursor(null);
                }
                else {
                    _this.getWidget().setForceCursor('pointer');
                }
            }
            pane.getChart().getChartStore().setHoverOverlayInfo({ paneId: pane.getId(), overlay: overlay, figureType: figureType, figure: figure, figureIndex: figureIndex }, function (o, f) { return _this._processOverlayMouseEnterEvent(o, f, event); }, function (o, f) { return _this._processOverlayMouseLeaveEvent(o, f, event); });
            return check;
        };
    };
    OverlayView.prototype._figureMouseDownEvent = function (overlay, figureType, figureIndex, figure) {
        var _this = this;
        return function (event) {
            var _a;
            var pane = _this.getWidget().getPane();
            var paneId = pane.getId();
            overlay.startPressedMove(_this._coordinateToPoint(overlay, event));
            if ((0, Overlay_1.checkOverlayFigureEvent)('onPressedMoveStart', figure)) {
                (_a = overlay.onPressedMoveStart) === null || _a === void 0 ? void 0 : _a.call(overlay, __assign({ chart: pane.getChart(), overlay: overlay, figure: figure }, event));
                pane.getChart().getChartStore().setPressedOverlayInfo({ paneId: paneId, overlay: overlay, figureType: figureType, figureIndex: figureIndex, figure: figure });
                return !overlay.isDrawing();
            }
            return false;
        };
    };
    OverlayView.prototype._figureMouseClickEvent = function (overlay, figureType, figureIndex, figure) {
        var _this = this;
        return function (event) {
            var _a;
            var pane = _this.getWidget().getPane();
            var paneId = pane.getId();
            var check = !overlay.isDrawing() && (0, Overlay_1.checkOverlayFigureEvent)('onClick', figure);
            if (check) {
                (_a = overlay.onClick) === null || _a === void 0 ? void 0 : _a.call(overlay, __assign({ chart: _this.getWidget().getPane().getChart(), overlay: overlay, figure: figure }, event));
            }
            pane.getChart().getChartStore().setClickOverlayInfo({ paneId: paneId, overlay: overlay, figureType: figureType, figureIndex: figureIndex, figure: figure }, function (o, f) { return _this._processOverlaySelectedEvent(o, f, event); }, function (o, f) { return _this._processOverlayDeselectedEvent(o, f, event); });
            return check;
        };
    };
    OverlayView.prototype._figureMouseDoubleClickEvent = function (overlay, _figureType, _figureIndex, figure) {
        var _this = this;
        return function (event) {
            var _a;
            if ((0, Overlay_1.checkOverlayFigureEvent)('onDoubleClick', figure)) {
                (_a = overlay.onDoubleClick) === null || _a === void 0 ? void 0 : _a.call(overlay, __assign(__assign({}, event), { chart: _this.getWidget().getPane().getChart(), figure: figure, overlay: overlay }));
                return !overlay.isDrawing();
            }
            return false;
        };
    };
    OverlayView.prototype._figureMouseRightClickEvent = function (overlay, _figureType, _figureIndex, figure) {
        var _this = this;
        return function (event) {
            var _a;
            if ((0, Overlay_1.checkOverlayFigureEvent)('onRightClick', figure)) {
                var prevented_3 = false;
                (_a = overlay.onRightClick) === null || _a === void 0 ? void 0 : _a.call(overlay, __assign(__assign({ chart: _this.getWidget().getPane().getChart(), overlay: overlay, figure: figure }, event), { preventDefault: function () { prevented_3 = true; } }));
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- ignore
                if (!prevented_3) {
                    _this.getWidget().getPane().getChart().getChartStore().removeOverlay(overlay);
                }
                return !overlay.isDrawing();
            }
            return false;
        };
    };
    OverlayView.prototype._coordinateToPoint = function (o, coordinate) {
        var _a;
        var point = {};
        var pane = this.getWidget().getPane();
        var chart = pane.getChart();
        var paneId = pane.getId();
        var chartStore = chart.getChartStore();
        if (this.coordinateToPointTimestampDataIndexFlag()) {
            var xAxis = chart.getXAxisPane().getAxisComponent();
            var dataIndex = xAxis.convertFromPixel(coordinate.x);
            var timestamp = (_a = chartStore.dataIndexToTimestamp(dataIndex)) !== null && _a !== void 0 ? _a : undefined;
            point.timestamp = timestamp;
            point.dataIndex = dataIndex;
        }
        if (this.coordinateToPointValueFlag()) {
            var yAxis = pane.getAxisComponent();
            var value = yAxis.convertFromPixel(coordinate.y);
            if (o.mode !== 'normal' && paneId === types_1.PaneIdConstants.CANDLE && (0, typeChecks_1.isNumber)(point.dataIndex)) {
                var kLineData = chartStore.getDataByDataIndex(point.dataIndex);
                if (kLineData !== null) {
                    var modeSensitivity = o.modeSensitivity;
                    if (value > kLineData.high) {
                        if (o.mode === 'weak_magnet') {
                            var highY = yAxis.convertToPixel(kLineData.high);
                            var buffValue = yAxis.convertFromPixel(highY - modeSensitivity);
                            if (value < buffValue) {
                                value = kLineData.high;
                            }
                        }
                        else {
                            value = kLineData.high;
                        }
                    }
                    else if (value < kLineData.low) {
                        if (o.mode === 'weak_magnet') {
                            var lowY = yAxis.convertToPixel(kLineData.low);
                            var buffValue = yAxis.convertFromPixel(lowY - modeSensitivity);
                            if (value > buffValue) {
                                value = kLineData.low;
                            }
                        }
                        else {
                            value = kLineData.low;
                        }
                    }
                    else {
                        var max = Math.max(kLineData.open, kLineData.close);
                        var min = Math.min(kLineData.open, kLineData.close);
                        if (value > max) {
                            if (value - max < kLineData.high - value) {
                                value = max;
                            }
                            else {
                                value = kLineData.high;
                            }
                        }
                        else if (value < min) {
                            if (value - kLineData.low < min - value) {
                                value = kLineData.low;
                            }
                            else {
                                value = min;
                            }
                        }
                        else if (max - value < value - min) {
                            value = max;
                        }
                        else {
                            value = min;
                        }
                    }
                }
            }
            point.value = value;
        }
        return point;
    };
    OverlayView.prototype.coordinateToPointValueFlag = function () {
        return true;
    };
    OverlayView.prototype.coordinateToPointTimestampDataIndexFlag = function () {
        return true;
    };
    OverlayView.prototype.dispatchEvent = function (name, event) {
        if (this.getWidget().getPane().getChart().getChartStore().isOverlayDrawing()) {
            return this.onEvent(name, event);
        }
        return _super.prototype.dispatchEvent.call(this, name, event);
    };
    OverlayView.prototype.drawImp = function (ctx) {
        var _this = this;
        var overlays = this.getCompleteOverlays();
        overlays.forEach(function (overlay) {
            if (overlay.visible) {
                _this._drawOverlay(ctx, overlay);
            }
        });
        var progressOverlay = this.getProgressOverlay();
        if ((0, typeChecks_1.isValid)(progressOverlay) && progressOverlay.visible) {
            this._drawOverlay(ctx, progressOverlay);
        }
    };
    OverlayView.prototype._drawOverlay = function (ctx, overlay) {
        var points = overlay.points;
        var pane = this.getWidget().getPane();
        var chart = pane.getChart();
        var chartStore = chart.getChartStore();
        var yAxis = pane.getAxisComponent();
        var xAxis = chart.getXAxisPane().getAxisComponent();
        var coordinates = points.map(function (point) {
            var _a;
            var dataIndex = null;
            if ((0, typeChecks_1.isNumber)(point.timestamp)) {
                dataIndex = chartStore.timestampToDataIndex(point.timestamp);
            }
            var coordinate = { x: 0, y: 0 };
            if ((0, typeChecks_1.isNumber)(dataIndex)) {
                coordinate.x = xAxis.convertToPixel(dataIndex);
            }
            if ((0, typeChecks_1.isNumber)(point.value)) {
                coordinate.y = (_a = yAxis === null || yAxis === void 0 ? void 0 : yAxis.convertToPixel(point.value)) !== null && _a !== void 0 ? _a : 0;
            }
            return coordinate;
        });
        if (coordinates.length > 0) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- ignore
            // @ts-expect-error
            var figures = [].concat(this.getFigures(overlay, coordinates));
            this.drawFigures(ctx, overlay, figures);
        }
        this.drawDefaultFigures(ctx, overlay, coordinates);
    };
    OverlayView.prototype.drawFigures = function (ctx, overlay, figures) {
        var _this = this;
        var defaultStyles = this.getWidget().getPane().getChart().getStyles().overlay;
        figures.forEach(function (figure, figureIndex) {
            var type = figure.type, styles = figure.styles, attrs = figure.attrs;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- ignore
            // @ts-expect-error
            var attrsArray = [].concat(attrs);
            attrsArray.forEach(function (ats) {
                var _a, _b;
                var events = _this._createFigureEvents(overlay, 'other', figureIndex, figure);
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- ignore
                // @ts-expect-error
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- ignore
                var ss = __assign(__assign(__assign({}, defaultStyles[type]), (_a = overlay.styles) === null || _a === void 0 ? void 0 : _a[type]), styles);
                (_b = _this.createFigure({
                    name: type, attrs: ats, styles: ss
                }, events !== null && events !== void 0 ? events : undefined)) === null || _b === void 0 ? void 0 : _b.draw(ctx);
            });
        });
    };
    OverlayView.prototype.getCompleteOverlays = function () {
        var pane = this.getWidget().getPane();
        return pane.getChart().getChartStore().getOverlaysByPaneId(pane.getId());
    };
    OverlayView.prototype.getProgressOverlay = function () {
        var pane = this.getWidget().getPane();
        var info = pane.getChart().getChartStore().getProgressOverlayInfo();
        if ((0, typeChecks_1.isValid)(info) && info.paneId === pane.getId()) {
            return info.overlay;
        }
        return null;
    };
    OverlayView.prototype.getFigures = function (o, coordinates) {
        var _a, _b;
        var widget = this.getWidget();
        var pane = widget.getPane();
        var chart = pane.getChart();
        var yAxis = pane.getAxisComponent();
        var xAxis = chart.getXAxisPane().getAxisComponent();
        var bounding = widget.getBounding();
        return (_b = (_a = o.createPointFigures) === null || _a === void 0 ? void 0 : _a.call(o, { chart: chart, overlay: o, coordinates: coordinates, bounding: bounding, xAxis: xAxis, yAxis: yAxis })) !== null && _b !== void 0 ? _b : [];
    };
    OverlayView.prototype.drawDefaultFigures = function (ctx, overlay, coordinates) {
        var _this = this;
        var _a, _b;
        if (overlay.needDefaultPointFigure) {
            var chartStore = this.getWidget().getPane().getChart().getChartStore();
            var hoverOverlayInfo_1 = chartStore.getHoverOverlayInfo();
            var clickOverlayInfo = chartStore.getClickOverlayInfo();
            if ((((_a = hoverOverlayInfo_1.overlay) === null || _a === void 0 ? void 0 : _a.id) === overlay.id && hoverOverlayInfo_1.figureType !== 'none') ||
                (((_b = clickOverlayInfo.overlay) === null || _b === void 0 ? void 0 : _b.id) === overlay.id && clickOverlayInfo.figureType !== 'none')) {
                var defaultStyles = chartStore.getStyles().overlay;
                var styles = overlay.styles;
                var pointStyles_1 = __assign(__assign({}, defaultStyles.point), styles === null || styles === void 0 ? void 0 : styles.point);
                coordinates.forEach(function (_a, index) {
                    var _b, _c, _d, _e, _f;
                    var x = _a.x, y = _a.y;
                    var radius = pointStyles_1.radius;
                    var color = pointStyles_1.color;
                    var borderColor = pointStyles_1.borderColor;
                    var borderSize = pointStyles_1.borderSize;
                    if (((_b = hoverOverlayInfo_1.overlay) === null || _b === void 0 ? void 0 : _b.id) === overlay.id &&
                        hoverOverlayInfo_1.figureType === 'point' &&
                        ((_c = hoverOverlayInfo_1.figure) === null || _c === void 0 ? void 0 : _c.key) === "".concat(Overlay_1.OVERLAY_FIGURE_KEY_PREFIX, "point_").concat(index)) {
                        radius = pointStyles_1.activeRadius;
                        color = pointStyles_1.activeColor;
                        borderColor = pointStyles_1.activeBorderColor;
                        borderSize = pointStyles_1.activeBorderSize;
                    }
                    (_e = _this.createFigure({
                        name: 'circle',
                        attrs: { x: x, y: y, r: radius + borderSize },
                        styles: { color: borderColor }
                    }, (_d = _this._createFigureEvents(overlay, 'point', index, {
                        key: "".concat(Overlay_1.OVERLAY_FIGURE_KEY_PREFIX, "point_").concat(index),
                        type: 'circle',
                        attrs: { x: x, y: y, r: radius + borderSize },
                        styles: { color: borderColor }
                    })) !== null && _d !== void 0 ? _d : undefined)) === null || _e === void 0 ? void 0 : _e.draw(ctx);
                    (_f = _this.createFigure({
                        name: 'circle',
                        attrs: { x: x, y: y, r: radius },
                        styles: { color: color }
                    })) === null || _f === void 0 ? void 0 : _f.draw(ctx);
                });
            }
        }
    };
    return OverlayView;
}(View_1.default));
exports.default = OverlayView;
//# sourceMappingURL=OverlayView.js.map