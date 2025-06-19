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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Bounding_1 = require("./common/Bounding");
var Animation_1 = __importDefault(require("./common/Animation"));
var id_1 = require("./common/utils/id");
var dom_1 = require("./common/utils/dom");
var canvas_1 = require("./common/utils/canvas");
var typeChecks_1 = require("./common/utils/typeChecks");
var logger_1 = require("./common/utils/logger");
var number_1 = require("./common/utils/number");
var Store_1 = __importStar(require("./Store"));
var CandlePane_1 = __importDefault(require("./pane/CandlePane"));
var IndicatorPane_1 = __importDefault(require("./pane/IndicatorPane"));
var XAxisPane_1 = __importDefault(require("./pane/XAxisPane"));
var SeparatorPane_1 = __importDefault(require("./pane/SeparatorPane"));
var types_1 = require("./pane/types");
var index_1 = require("./extension/indicator/index");
var Event_1 = __importDefault(require("./Event"));
var ChartImp = /** @class */ (function () {
    function ChartImp(container, options) {
        this._chartBounding = (0, Bounding_1.createDefaultBounding)();
        this._drawPanes = [];
        this._separatorPanes = new Map();
        this._layoutOptions = {
            sort: true,
            measureHeight: true,
            measureWidth: true,
            update: true,
            buildYAxisTick: false,
            cacheYAxisWidth: false,
            forceBuildYAxisTick: false
        };
        this._layoutPending = false;
        this._cacheYAxisWidth = { left: 0, right: 0 };
        this._initContainer(container);
        this._chartEvent = new Event_1.default(this._chartContainer, this);
        this._chartStore = new Store_1.default(this, options);
        this._initPanes(options);
        this._layout();
    }
    ChartImp.prototype._initContainer = function (container) {
        this._container = container;
        this._chartContainer = (0, dom_1.createDom)('div', {
            position: 'relative',
            width: '100%',
            height: '100%',
            outline: 'none',
            borderStyle: 'none',
            cursor: 'crosshair',
            boxSizing: 'border-box',
            userSelect: 'none',
            webkitUserSelect: 'none',
            overflow: 'hidden',
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- ignore
            // @ts-expect-error
            msUserSelect: 'none',
            MozUserSelect: 'none',
            webkitTapHighlightColor: 'transparent'
        });
        this._chartContainer.tabIndex = 1;
        container.appendChild(this._chartContainer);
        this._cacheChartBounding();
    };
    ChartImp.prototype._cacheChartBounding = function () {
        this._chartBounding.width = Math.floor(this._chartContainer.clientWidth);
        this._chartBounding.height = Math.floor(this._chartContainer.clientHeight);
    };
    ChartImp.prototype._initPanes = function (options) {
        var _this = this;
        var _a;
        var layout = (_a = options === null || options === void 0 ? void 0 : options.layout) !== null && _a !== void 0 ? _a : [{ type: 'candle' }];
        var createCandlePane = function (child) {
            var _a, _b;
            if (!(0, typeChecks_1.isValid)(_this._candlePane)) {
                var paneOptions_1 = (_a = child.options) !== null && _a !== void 0 ? _a : {};
                (0, typeChecks_1.merge)(paneOptions_1, { id: types_1.PaneIdConstants.CANDLE });
                _this._candlePane = _this._createPane(CandlePane_1.default, types_1.PaneIdConstants.CANDLE, paneOptions_1);
                var content = (_b = child.content) !== null && _b !== void 0 ? _b : [];
                content.forEach(function (v) {
                    _this.createIndicator(v, true, paneOptions_1);
                });
            }
        };
        var createXAxisPane = function (ops) {
            if (!(0, typeChecks_1.isValid)(_this._xAxisPane)) {
                var pane = _this._createPane(XAxisPane_1.default, types_1.PaneIdConstants.X_AXIS, ops !== null && ops !== void 0 ? ops : {});
                _this._xAxisPane = pane;
            }
        };
        layout.forEach(function (child) {
            var _a, _b, _c;
            switch (child.type) {
                case 'candle': {
                    createCandlePane(child);
                    break;
                }
                case 'indicator': {
                    var content = (_a = child.content) !== null && _a !== void 0 ? _a : [];
                    if (content.length > 0) {
                        var paneId = (_c = (_b = child.options) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : null;
                        if ((0, typeChecks_1.isValid)(paneId)) {
                            paneId = (0, id_1.createId)(types_1.PaneIdConstants.INDICATOR);
                        }
                        var paneOptions_2 = __assign(__assign({}, child.options), { id: paneId });
                        content.forEach(function (v) {
                            _this.createIndicator(v, true, paneOptions_2);
                        });
                    }
                    break;
                }
                case 'xAxis': {
                    createXAxisPane(child.options);
                    break;
                }
            }
        });
        createCandlePane({ type: 'candle' });
        createXAxisPane({ order: Number.MAX_SAFE_INTEGER });
    };
    ChartImp.prototype._createPane = function (DrawPaneClass, id, options) {
        var pane = new DrawPaneClass(this, id, options !== null && options !== void 0 ? options : {});
        this._drawPanes.push(pane);
        return pane;
    };
    ChartImp.prototype._recalculatePaneHeight = function (currentPane, currentHeight, changeHeight) {
        if (changeHeight === 0) {
            return false;
        }
        var normalStatePanes = this._drawPanes.filter(function (pane) {
            var paneId = pane.getId();
            return (pane.getOptions().state === 'normal' &&
                paneId !== currentPane.getId() &&
                paneId !== types_1.PaneIdConstants.X_AXIS);
        });
        var count = normalStatePanes.length;
        if (count === 0) {
            return false;
        }
        if (currentPane.getId() !== types_1.PaneIdConstants.CANDLE &&
            (0, typeChecks_1.isValid)(this._candlePane) &&
            this._candlePane.getOptions().state === 'normal') {
            var height = this._candlePane.getBounding().height;
            if (height > 0) {
                var minHeight = this._candlePane.getOptions().minHeight;
                var newHeight = height + changeHeight;
                if (newHeight < minHeight) {
                    newHeight = minHeight;
                    currentHeight -= (height + changeHeight - newHeight);
                }
                this._candlePane.setBounding({ height: newHeight });
            }
        }
        else {
            var remainingHeight_1 = changeHeight;
            var normalStatePaneChangeHeight_1 = Math.floor(changeHeight / count);
            normalStatePanes.forEach(function (pane, index) {
                var height = pane.getBounding().height;
                var newHeight = 0;
                if (index === count - 1) {
                    newHeight = height + remainingHeight_1;
                }
                else {
                    newHeight = height + normalStatePaneChangeHeight_1;
                }
                if (newHeight < pane.getOptions().minHeight) {
                    newHeight = pane.getOptions().minHeight;
                }
                pane.setBounding({ height: newHeight });
                remainingHeight_1 -= (newHeight - height);
            });
            if (Math.abs(remainingHeight_1) > 0) {
                currentHeight -= remainingHeight_1;
            }
        }
        currentPane.setBounding({ height: currentHeight });
        return true;
    };
    ChartImp.prototype.getDrawPaneById = function (paneId) {
        if (paneId === types_1.PaneIdConstants.CANDLE) {
            return this._candlePane;
        }
        if (paneId === types_1.PaneIdConstants.X_AXIS) {
            return this._xAxisPane;
        }
        var pane = this._drawPanes.find(function (p) { return p.getId() === paneId; });
        return pane !== null && pane !== void 0 ? pane : null;
    };
    ChartImp.prototype.getContainer = function () { return this._container; };
    ChartImp.prototype.getChartStore = function () { return this._chartStore; };
    ChartImp.prototype.getXAxisPane = function () { return this._xAxisPane; };
    ChartImp.prototype.getDrawPanes = function () { return this._drawPanes; };
    ChartImp.prototype.getSeparatorPanes = function () { return this._separatorPanes; };
    ChartImp.prototype.layout = function (options) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g;
        if ((_a = options.sort) !== null && _a !== void 0 ? _a : false) {
            this._layoutOptions.sort = options.sort;
        }
        if ((_b = options.measureHeight) !== null && _b !== void 0 ? _b : false) {
            this._layoutOptions.measureHeight = options.measureHeight;
        }
        if ((_c = options.measureWidth) !== null && _c !== void 0 ? _c : false) {
            this._layoutOptions.measureWidth = options.measureWidth;
        }
        if ((_d = options.update) !== null && _d !== void 0 ? _d : false) {
            this._layoutOptions.update = options.update;
        }
        if ((_e = options.buildYAxisTick) !== null && _e !== void 0 ? _e : false) {
            this._layoutOptions.buildYAxisTick = options.buildYAxisTick;
        }
        if ((_f = options.cacheYAxisWidth) !== null && _f !== void 0 ? _f : false) {
            this._layoutOptions.cacheYAxisWidth = options.cacheYAxisWidth;
        }
        if ((_g = options.buildYAxisTick) !== null && _g !== void 0 ? _g : false) {
            this._layoutOptions.forceBuildYAxisTick = options.forceBuildYAxisTick;
        }
        if (!this._layoutPending) {
            this._layoutPending = true;
            Promise.resolve().then(function (_) {
                _this._layout();
                _this._layoutPending = false;
            }).catch(function (_) {
                // todo
            });
        }
    };
    ChartImp.prototype._layout = function () {
        var _this = this;
        var _a = this._layoutOptions, sort = _a.sort, measureHeight = _a.measureHeight, measureWidth = _a.measureWidth, update = _a.update, buildYAxisTick = _a.buildYAxisTick, cacheYAxisWidth = _a.cacheYAxisWidth, forceBuildYAxisTick = _a.forceBuildYAxisTick;
        if (sort) {
            while ((0, typeChecks_1.isValid)(this._chartContainer.firstChild)) {
                this._chartContainer.removeChild(this._chartContainer.firstChild);
            }
            this._separatorPanes.clear();
            this._drawPanes.sort(function (a, b) { return a.getOptions().order - b.getOptions().order; });
            var prevPane_1 = null;
            this._drawPanes.forEach(function (pane) {
                if (pane.getId() !== types_1.PaneIdConstants.X_AXIS) {
                    if ((0, typeChecks_1.isValid)(prevPane_1)) {
                        var separatorPane = new SeparatorPane_1.default(_this, '', prevPane_1, pane);
                        _this._chartContainer.appendChild(separatorPane.getContainer());
                        _this._separatorPanes.set(pane, separatorPane);
                    }
                    prevPane_1 = pane;
                }
                _this._chartContainer.appendChild(pane.getContainer());
            });
        }
        if (measureHeight) {
            var totalHeight = this._chartBounding.height;
            var separatorSize_1 = this.getStyles().separator.size;
            var xAxisHeight = this._xAxisPane.getAxisComponent().getAutoSize();
            var remainingHeight_2 = totalHeight - xAxisHeight;
            if (remainingHeight_2 < 0) {
                remainingHeight_2 = 0;
            }
            this._drawPanes.forEach(function (pane) {
                var paneId = pane.getId();
                if ((0, typeChecks_1.isValid)(_this._separatorPanes.get(pane))) {
                    remainingHeight_2 -= separatorSize_1;
                }
                if (paneId !== types_1.PaneIdConstants.X_AXIS && paneId !== types_1.PaneIdConstants.CANDLE && pane.getVisible()) {
                    var paneHeight = pane.getBounding().height;
                    if (paneHeight > remainingHeight_2) {
                        paneHeight = remainingHeight_2;
                        remainingHeight_2 = 0;
                    }
                    else {
                        remainingHeight_2 -= paneHeight;
                    }
                    pane.setBounding({ height: paneHeight });
                }
            });
            this._candlePane.setBounding({ height: Math.max(remainingHeight_2, 0) });
            this._xAxisPane.setBounding({ height: xAxisHeight });
            var top_1 = 0;
            this._drawPanes.forEach(function (pane) {
                var separatorPane = _this._separatorPanes.get(pane);
                if ((0, typeChecks_1.isValid)(separatorPane)) {
                    separatorPane.setBounding({ height: separatorSize_1, top: top_1 });
                    top_1 += separatorSize_1;
                }
                pane.setBounding({ top: top_1 });
                top_1 += pane.getBounding().height;
            });
        }
        var forceMeasureWidth = measureWidth;
        if (buildYAxisTick || forceBuildYAxisTick) {
            this._drawPanes.forEach(function (pane) {
                var success = pane.getAxisComponent().buildTicks(forceBuildYAxisTick);
                forceMeasureWidth || (forceMeasureWidth = success);
            });
        }
        if (forceMeasureWidth) {
            var totalWidth = this._chartBounding.width;
            var styles = this.getStyles();
            var leftYAxisWidth_1 = 0;
            var leftYAxisOutside_1 = true;
            var rightYAxisWidth_1 = 0;
            var rightYAxisOutside_1 = true;
            this._drawPanes.forEach(function (pane) {
                if (pane.getId() !== types_1.PaneIdConstants.X_AXIS) {
                    var yAxis = pane.getAxisComponent();
                    var inside = yAxis.inside;
                    var yAxisWidth = yAxis.getAutoSize();
                    if (yAxis.position === 'left') {
                        leftYAxisWidth_1 = Math.max(leftYAxisWidth_1, yAxisWidth);
                        if (inside) {
                            leftYAxisOutside_1 = false;
                        }
                    }
                    else {
                        rightYAxisWidth_1 = Math.max(rightYAxisWidth_1, yAxisWidth);
                        if (inside) {
                            rightYAxisOutside_1 = false;
                        }
                    }
                }
            });
            if (cacheYAxisWidth) {
                leftYAxisWidth_1 = Math.max(this._cacheYAxisWidth.left, leftYAxisWidth_1);
                rightYAxisWidth_1 = Math.max(this._cacheYAxisWidth.right, rightYAxisWidth_1);
            }
            this._cacheYAxisWidth.left = leftYAxisWidth_1;
            this._cacheYAxisWidth.right = rightYAxisWidth_1;
            var mainWidth = totalWidth;
            var mainLeft = 0;
            var mainRight = 0;
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- ignore
            if (leftYAxisOutside_1) {
                mainWidth -= leftYAxisWidth_1;
                mainLeft = leftYAxisWidth_1;
            }
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- ignore
            if (rightYAxisOutside_1) {
                mainWidth -= rightYAxisWidth_1;
                mainRight = rightYAxisWidth_1;
            }
            this._chartStore.setTotalBarSpace(mainWidth);
            var paneBounding_1 = { width: totalWidth };
            var mainBounding_1 = { width: mainWidth, left: mainLeft, right: mainRight };
            var leftYAxisBounding_1 = { width: leftYAxisWidth_1 };
            var rightYAxisBounding_1 = { width: rightYAxisWidth_1 };
            var separatorFill = styles.separator.fill;
            var separatorBounding_1 = {};
            if (!separatorFill) {
                separatorBounding_1 = mainBounding_1;
            }
            else {
                separatorBounding_1 = paneBounding_1;
            }
            this._drawPanes.forEach(function (pane) {
                var _a;
                (_a = _this._separatorPanes.get(pane)) === null || _a === void 0 ? void 0 : _a.setBounding(separatorBounding_1);
                pane.setBounding(paneBounding_1, mainBounding_1, leftYAxisBounding_1, rightYAxisBounding_1);
            });
        }
        if (update) {
            this._xAxisPane.getAxisComponent().buildTicks(true);
            this.updatePane(4 /* UpdateLevel.All */);
        }
        this._layoutOptions = {
            sort: false,
            measureHeight: false,
            measureWidth: false,
            update: false,
            buildYAxisTick: false,
            cacheYAxisWidth: false,
            forceBuildYAxisTick: false
        };
    };
    ChartImp.prototype.updatePane = function (level, paneId) {
        var _this = this;
        if ((0, typeChecks_1.isValid)(paneId)) {
            var pane = this.getDrawPaneById(paneId);
            pane === null || pane === void 0 ? void 0 : pane.update(level);
        }
        else {
            this._drawPanes.forEach(function (pane) {
                var _a;
                pane.update(level);
                (_a = _this._separatorPanes.get(pane)) === null || _a === void 0 ? void 0 : _a.update(level);
            });
        }
    };
    ChartImp.prototype.crosshairChange = function (crosshair) {
        var _this = this;
        if (this._chartStore.hasAction('onCrosshairChange')) {
            var indicatorData_1 = {};
            this._drawPanes.forEach(function (pane) {
                var id = pane.getId();
                var paneIndicatorData = {};
                var indicators = _this._chartStore.getIndicatorsByPaneId(id);
                indicators.forEach(function (indicator) {
                    var _a;
                    var result = indicator.result;
                    paneIndicatorData[indicator.name] = result[(_a = crosshair.dataIndex) !== null && _a !== void 0 ? _a : result.length - 1];
                });
                indicatorData_1[id] = paneIndicatorData;
            });
            if ((0, typeChecks_1.isString)(crosshair.paneId)) {
                this._chartStore.executeAction('onCrosshairChange', {
                    crosshair: crosshair,
                    indicatorData: indicatorData_1
                });
            }
        }
    };
    ChartImp.prototype.getDom = function (paneId, position) {
        var _a, _b;
        if ((0, typeChecks_1.isValid)(paneId)) {
            var pane = this.getDrawPaneById(paneId);
            if ((0, typeChecks_1.isValid)(pane)) {
                var pos = position !== null && position !== void 0 ? position : 'root';
                switch (pos) {
                    case 'root': {
                        return pane.getContainer();
                    }
                    case 'main': {
                        return pane.getMainWidget().getContainer();
                    }
                    case 'yAxis': {
                        return (_b = (_a = pane.getYAxisWidget()) === null || _a === void 0 ? void 0 : _a.getContainer()) !== null && _b !== void 0 ? _b : null;
                    }
                }
            }
        }
        else {
            return this._chartContainer;
        }
        return null;
    };
    ChartImp.prototype.getSize = function (paneId, position) {
        var _a, _b;
        if ((0, typeChecks_1.isValid)(paneId)) {
            var pane = this.getDrawPaneById(paneId);
            if ((0, typeChecks_1.isValid)(pane)) {
                var pos = position !== null && position !== void 0 ? position : 'root';
                switch (pos) {
                    case 'root': {
                        return pane.getBounding();
                    }
                    case 'main': {
                        return pane.getMainWidget().getBounding();
                    }
                    case 'yAxis': {
                        return (_b = (_a = pane.getYAxisWidget()) === null || _a === void 0 ? void 0 : _a.getBounding()) !== null && _b !== void 0 ? _b : null;
                    }
                }
            }
        }
        else {
            return this._chartBounding;
        }
        return null;
    };
    ChartImp.prototype.setSymbol = function (symbol) {
        this._chartStore.setSymbol(symbol);
    };
    ChartImp.prototype.getSymbol = function () {
        return this._chartStore.getSymbol();
    };
    ChartImp.prototype.setPeriod = function (period) {
        this._chartStore.setPeriod(period);
    };
    ChartImp.prototype.getPeriod = function () {
        return this._chartStore.getPeriod();
    };
    ChartImp.prototype.setStyles = function (value) {
        var _this = this;
        this._setOptions(function () {
            _this._chartStore.setStyles(value);
        });
    };
    ChartImp.prototype.getStyles = function () { return this._chartStore.getStyles(); };
    ChartImp.prototype.setFormatter = function (formatter) {
        var _this = this;
        this._setOptions(function () {
            _this._chartStore.setFormatter(formatter);
        });
    };
    ChartImp.prototype.getFormatter = function () { return this._chartStore.getFormatter(); };
    ChartImp.prototype.setLocale = function (locale) {
        var _this = this;
        this._setOptions(function () {
            _this._chartStore.setLocale(locale);
        });
    };
    ChartImp.prototype.getLocale = function () { return this._chartStore.getLocale(); };
    ChartImp.prototype.setTimezone = function (timezone) {
        var _this = this;
        this._setOptions(function () {
            _this._chartStore.setTimezone(timezone);
        });
    };
    ChartImp.prototype.getTimezone = function () { return this._chartStore.getTimezone(); };
    ChartImp.prototype.setThousandsSeparator = function (thousandsSeparator) {
        var _this = this;
        this._setOptions(function () {
            _this._chartStore.setThousandsSeparator(thousandsSeparator);
        });
    };
    ChartImp.prototype.getThousandsSeparator = function () { return this._chartStore.getThousandsSeparator(); };
    ChartImp.prototype.setDecimalFold = function (decimalFold) {
        var _this = this;
        this._setOptions(function () {
            _this._chartStore.setDecimalFold(decimalFold);
        });
    };
    ChartImp.prototype.getDecimalFold = function () { return this._chartStore.getDecimalFold(); };
    ChartImp.prototype._setOptions = function (fuc) {
        fuc();
        this.layout({
            measureHeight: true,
            measureWidth: true,
            update: true,
            buildYAxisTick: true,
            forceBuildYAxisTick: true
        });
    };
    ChartImp.prototype.setOffsetRightDistance = function (distance) {
        this._chartStore.setOffsetRightDistance(distance, true);
    };
    ChartImp.prototype.getOffsetRightDistance = function () {
        return this._chartStore.getOffsetRightDistance();
    };
    ChartImp.prototype.setMaxOffsetLeftDistance = function (distance) {
        if (distance < 0) {
            (0, logger_1.logWarn)('setMaxOffsetLeftDistance', 'distance', 'distance must greater than zero!!!');
            return;
        }
        this._chartStore.setMaxOffsetLeftDistance(distance);
    };
    ChartImp.prototype.setMaxOffsetRightDistance = function (distance) {
        if (distance < 0) {
            (0, logger_1.logWarn)('setMaxOffsetRightDistance', 'distance', 'distance must greater than zero!!!');
            return;
        }
        this._chartStore.setMaxOffsetRightDistance(distance);
    };
    ChartImp.prototype.setLeftMinVisibleBarCount = function (barCount) {
        if (barCount < 0) {
            (0, logger_1.logWarn)('setLeftMinVisibleBarCount', 'barCount', 'barCount must greater than zero!!!');
            return;
        }
        this._chartStore.setLeftMinVisibleBarCount(Math.ceil(barCount));
    };
    ChartImp.prototype.setRightMinVisibleBarCount = function (barCount) {
        if (barCount < 0) {
            (0, logger_1.logWarn)('setRightMinVisibleBarCount', 'barCount', 'barCount must greater than zero!!!');
            return;
        }
        this._chartStore.setRightMinVisibleBarCount(Math.ceil(barCount));
    };
    ChartImp.prototype.setBarSpace = function (space) {
        this._chartStore.setBarSpace(space);
    };
    ChartImp.prototype.getBarSpace = function () {
        return this._chartStore.getBarSpace();
    };
    ChartImp.prototype.getVisibleRange = function () {
        return this._chartStore.getVisibleRange();
    };
    ChartImp.prototype.resetData = function () {
        this._chartStore.resetData();
    };
    ChartImp.prototype.getDataList = function () {
        return this._chartStore.getDataList();
    };
    ChartImp.prototype.setDataLoader = function (dataLoader) {
        this._chartStore.setDataLoader(dataLoader);
    };
    ChartImp.prototype.createIndicator = function (value, isStack, paneOptions) {
        var _a;
        var indicator = (0, typeChecks_1.isString)(value) ? { name: value } : value;
        if ((0, index_1.getIndicatorClass)(indicator.name) === null) {
            (0, logger_1.logWarn)('createIndicator', 'value', 'indicator not supported, you may need to use registerIndicator to add one!!!');
            return null;
        }
        var paneOpts = paneOptions !== null && paneOptions !== void 0 ? paneOptions : {};
        if (!(0, typeChecks_1.isString)(paneOpts.id)) {
            paneOpts.id = (0, id_1.createId)(types_1.PaneIdConstants.INDICATOR);
        }
        if (!(0, typeChecks_1.isString)(indicator.id)) {
            indicator.id = (0, id_1.createId)(indicator.name);
        }
        var result = this._chartStore.addIndicator(indicator, paneOpts.id, isStack !== null && isStack !== void 0 ? isStack : false);
        if (result) {
            var shouldSort = false;
            if (!(0, typeChecks_1.isValid)(this.getDrawPaneById(paneOpts.id))) {
                this._createPane(IndicatorPane_1.default, paneOpts.id, paneOpts);
                (_a = paneOpts.height) !== null && _a !== void 0 ? _a : (paneOpts.height = types_1.PANE_DEFAULT_HEIGHT);
                shouldSort = true;
            }
            this.setPaneOptions(paneOpts);
            this.layout({
                sort: shouldSort,
                measureHeight: true,
                measureWidth: true,
                update: true,
                buildYAxisTick: true,
                forceBuildYAxisTick: true
            });
            return indicator.id;
        }
        return null;
    };
    ChartImp.prototype.overrideIndicator = function (override) {
        return this._chartStore.overrideIndicator(override);
    };
    ChartImp.prototype.getIndicators = function (filter) {
        return this._chartStore.getIndicatorsByFilter(filter !== null && filter !== void 0 ? filter : {});
    };
    ChartImp.prototype.removeIndicator = function (filter) {
        var _this = this;
        var removed = this._chartStore.removeIndicator(filter !== null && filter !== void 0 ? filter : {});
        if (removed) {
            var shouldMeasureHeight_1 = false;
            var paneIds_1 = [];
            this._drawPanes.forEach(function (pane) {
                var paneId = pane.getId();
                if (paneId !== types_1.PaneIdConstants.CANDLE && paneId !== types_1.PaneIdConstants.X_AXIS) {
                    paneIds_1.push(paneId);
                }
            });
            paneIds_1.forEach(function (paneId) {
                if (!_this._chartStore.hasIndicators(paneId)) {
                    var index = _this._drawPanes.findIndex(function (pane) { return pane.getId() === paneId; });
                    var pane = _this._drawPanes[index];
                    if ((0, typeChecks_1.isValid)(pane)) {
                        shouldMeasureHeight_1 = true;
                        _this._recalculatePaneHeight(pane, 0, pane.getBounding().height);
                        _this._drawPanes.splice(index, 1);
                        pane.destroy();
                    }
                }
            });
            if (this._drawPanes.length === 2) {
                this._candlePane.setVisible(true);
                this._candlePane.setBounding({ height: this._chartBounding.height - this._xAxisPane.getBounding().height });
            }
            this.layout({
                sort: shouldMeasureHeight_1,
                measureHeight: shouldMeasureHeight_1,
                measureWidth: true,
                update: true,
                buildYAxisTick: true,
                forceBuildYAxisTick: true
            });
        }
        return removed;
    };
    ChartImp.prototype.createOverlay = function (value) {
        var _this = this;
        var overlays = [];
        var appointPaneFlags = [];
        var build = function (overlay) {
            if (!(0, typeChecks_1.isValid)(overlay.paneId) || _this.getDrawPaneById(overlay.paneId) === null) {
                overlay.paneId = types_1.PaneIdConstants.CANDLE;
                appointPaneFlags.push(false);
            }
            else {
                appointPaneFlags.push(true);
            }
            overlays.push(overlay);
        };
        if ((0, typeChecks_1.isString)(value)) {
            build({ name: value });
        }
        else if ((0, typeChecks_1.isArray)(value)) {
            value.forEach(function (v) {
                var overlay = null;
                if ((0, typeChecks_1.isString)(v)) {
                    overlay = { name: v };
                }
                else {
                    overlay = v;
                }
                build(overlay);
            });
        }
        else {
            build(value);
        }
        var ids = this._chartStore.addOverlays(overlays, appointPaneFlags);
        if ((0, typeChecks_1.isArray)(value)) {
            return ids;
        }
        return ids[0];
    };
    ChartImp.prototype.getOverlays = function (filter) {
        return this._chartStore.getOverlaysByFilter(filter !== null && filter !== void 0 ? filter : {});
    };
    ChartImp.prototype.overrideOverlay = function (override) {
        return this._chartStore.overrideOverlay(override);
    };
    ChartImp.prototype.removeOverlay = function (filter) {
        return this._chartStore.removeOverlay(filter !== null && filter !== void 0 ? filter : {});
    };
    ChartImp.prototype.setPaneOptions = function (options) {
        var e_1, _a;
        var _this = this;
        var _b;
        var shouldMeasureHeight = false;
        var shouldLayout = false;
        var validId = (0, typeChecks_1.isValid)(options.id);
        var _loop_1 = function (currentPane) {
            var currentPaneId = currentPane.getId();
            if ((validId && options.id === currentPaneId) || !validId) {
                if (currentPaneId !== types_1.PaneIdConstants.X_AXIS) {
                    if ((0, typeChecks_1.isNumber)(options.height) && options.height > 0) {
                        var minHeight = Math.max((_b = options.minHeight) !== null && _b !== void 0 ? _b : currentPane.getOptions().minHeight, 0);
                        var height = Math.max(minHeight, options.height);
                        shouldLayout = true;
                        shouldMeasureHeight = true;
                        currentPane.setOriginalBounding({ height: height });
                        this_1._recalculatePaneHeight(currentPane, height, -height);
                    }
                    if ((0, typeChecks_1.isValid)(options.state) &&
                        currentPane.getOptions().state !== options.state) {
                        shouldMeasureHeight = true;
                        shouldLayout = true;
                        var state = options.state;
                        switch (state) {
                            case 'maximize': {
                                var maximizePane = this_1._drawPanes.find(function (pane) {
                                    var paneId = pane.getId();
                                    return pane.getOptions().state === 'maximize' && paneId !== types_1.PaneIdConstants.X_AXIS;
                                });
                                if (!(0, typeChecks_1.isValid)(maximizePane)) {
                                    if (currentPane.getOptions().state === 'normal') {
                                        currentPane.setOriginalBounding({ height: currentPane.getBounding().height });
                                    }
                                    currentPane.setOptions({ state: state });
                                    var totalHeight = this_1._chartBounding.height;
                                    currentPane.setBounding({ height: totalHeight - this_1._xAxisPane.getBounding().height });
                                    this_1._drawPanes.forEach(function (pane) {
                                        var _a;
                                        if (pane.getId() !== types_1.PaneIdConstants.X_AXIS && pane.getId() !== currentPaneId) {
                                            pane.setBounding({ height: pane.getOriginalBounding().height });
                                            pane.setVisible(false);
                                            (_a = _this._separatorPanes.get(pane)) === null || _a === void 0 ? void 0 : _a.setVisible(false);
                                        }
                                    });
                                }
                                break;
                            }
                            case 'minimize': {
                                var height = currentPane.getBounding().height;
                                var currentState = currentPane.getOptions().state;
                                var changeHeight = height - types_1.PANE_MIN_HEIGHT;
                                if (currentState === 'maximize') {
                                    changeHeight = currentPane.getOriginalBounding().height - types_1.PANE_MIN_HEIGHT;
                                }
                                if (this_1._recalculatePaneHeight(currentPane, types_1.PANE_MIN_HEIGHT, changeHeight)) {
                                    if (currentState === 'normal') {
                                        currentPane.setOriginalBounding({ height: height });
                                    }
                                    currentPane.setOptions({ state: state });
                                }
                                this_1._drawPanes.forEach(function (pane) {
                                    var _a;
                                    if (pane.getId() !== types_1.PaneIdConstants.X_AXIS) {
                                        pane.setVisible(true);
                                        (_a = _this._separatorPanes.get(pane)) === null || _a === void 0 ? void 0 : _a.setVisible(true);
                                    }
                                });
                                break;
                            }
                            default: {
                                var height = currentPane.getOriginalBounding().height;
                                if (this_1._recalculatePaneHeight(currentPane, height, currentPane.getBounding().height - height)) {
                                    currentPane.setOptions({ state: state });
                                }
                                this_1._drawPanes.forEach(function (pane) {
                                    var _a;
                                    if (pane.getId() !== types_1.PaneIdConstants.X_AXIS) {
                                        pane.setVisible(true);
                                        (_a = _this._separatorPanes.get(pane)) === null || _a === void 0 ? void 0 : _a.setVisible(true);
                                    }
                                });
                                break;
                            }
                        }
                    }
                }
                if ((0, typeChecks_1.isValid)(options.axis)) {
                    shouldLayout = true;
                }
                var ops = __assign({}, options);
                delete ops.state;
                currentPane.setOptions(ops);
                if (currentPaneId === options.id) {
                    return "break";
                }
            }
        };
        var this_1 = this;
        try {
            for (var _c = __values(this._drawPanes), _d = _c.next(); !_d.done; _d = _c.next()) {
                var currentPane = _d.value;
                var state_1 = _loop_1(currentPane);
                if (state_1 === "break")
                    break;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (shouldLayout) {
            this.layout({
                measureHeight: shouldMeasureHeight,
                measureWidth: true,
                update: true,
                buildYAxisTick: true,
                forceBuildYAxisTick: true
            });
        }
    };
    ChartImp.prototype.getPaneOptions = function (id) {
        var _a;
        if ((0, typeChecks_1.isValid)(id)) {
            var pane = this.getDrawPaneById(id);
            return (_a = pane === null || pane === void 0 ? void 0 : pane.getOptions()) !== null && _a !== void 0 ? _a : null;
        }
        return this._drawPanes.map(function (pane) { return pane.getOptions(); });
    };
    ChartImp.prototype.setZoomEnabled = function (enabled) {
        this._chartStore.setZoomEnabled(enabled);
    };
    ChartImp.prototype.isZoomEnabled = function () {
        return this._chartStore.isZoomEnabled();
    };
    ChartImp.prototype.setScrollEnabled = function (enabled) {
        this._chartStore.setScrollEnabled(enabled);
    };
    ChartImp.prototype.isScrollEnabled = function () {
        return this._chartStore.isScrollEnabled();
    };
    ChartImp.prototype.scrollByDistance = function (distance, animationDuration) {
        var _this = this;
        var duration = (0, typeChecks_1.isNumber)(animationDuration) && animationDuration > 0 ? animationDuration : 0;
        this._chartStore.startScroll();
        if (duration > 0) {
            var animation = new Animation_1.default({ duration: duration });
            animation.doFrame(function (frameTime) {
                var progressDistance = distance * (frameTime / duration);
                _this._chartStore.scroll(progressDistance);
            });
            animation.start();
        }
        else {
            this._chartStore.scroll(distance);
        }
    };
    ChartImp.prototype.scrollToRealTime = function (animationDuration) {
        var barSpace = this._chartStore.getBarSpace().bar;
        var difBarCount = this._chartStore.getLastBarRightSideDiffBarCount() - this._chartStore.getInitialOffsetRightDistance() / barSpace;
        var distance = difBarCount * barSpace;
        this.scrollByDistance(distance, animationDuration);
    };
    ChartImp.prototype.scrollToDataIndex = function (dataIndex, animationDuration) {
        var distance = (this._chartStore.getLastBarRightSideDiffBarCount() + (this.getDataList().length - 1 - dataIndex)) * this._chartStore.getBarSpace().bar;
        this.scrollByDistance(distance, animationDuration);
    };
    ChartImp.prototype.scrollToTimestamp = function (timestamp, animationDuration) {
        var dataIndex = (0, number_1.binarySearchNearest)(this.getDataList(), 'timestamp', timestamp);
        this.scrollToDataIndex(dataIndex, animationDuration);
    };
    ChartImp.prototype.zoomAtCoordinate = function (scale, coordinate, animationDuration) {
        var _this = this;
        var duration = (0, typeChecks_1.isNumber)(animationDuration) && animationDuration > 0 ? animationDuration : 0;
        var barSpace = this._chartStore.getBarSpace().bar;
        var scaleBarSpace = barSpace * scale;
        var difSpace = scaleBarSpace - barSpace;
        if (duration > 0) {
            var prevProgressBarSpace_1 = 0;
            var animation = new Animation_1.default({ duration: duration });
            animation.doFrame(function (frameTime) {
                var progressBarSpace = difSpace * (frameTime / duration);
                var scale = (progressBarSpace - prevProgressBarSpace_1) / _this._chartStore.getBarSpace().bar * Store_1.SCALE_MULTIPLIER;
                _this._chartStore.zoom(scale, coordinate);
                prevProgressBarSpace_1 = progressBarSpace;
            });
            animation.start();
        }
        else {
            this._chartStore.zoom(difSpace / barSpace * Store_1.SCALE_MULTIPLIER, coordinate);
        }
    };
    ChartImp.prototype.zoomAtDataIndex = function (scale, dataIndex, animationDuration) {
        var x = this._chartStore.dataIndexToCoordinate(dataIndex);
        this.zoomAtCoordinate(scale, { x: x, y: 0 }, animationDuration);
    };
    ChartImp.prototype.zoomAtTimestamp = function (scale, timestamp, animationDuration) {
        var dataIndex = (0, number_1.binarySearchNearest)(this.getDataList(), 'timestamp', timestamp);
        this.zoomAtDataIndex(scale, dataIndex, animationDuration);
    };
    ChartImp.prototype.convertToPixel = function (points, filter) {
        var _this = this;
        var _a;
        var _b = filter !== null && filter !== void 0 ? filter : {}, _c = _b.paneId, paneId = _c === void 0 ? types_1.PaneIdConstants.CANDLE : _c, _d = _b.absolute, absolute = _d === void 0 ? false : _d;
        var coordinates = [];
        if (paneId !== types_1.PaneIdConstants.X_AXIS) {
            var pane = this.getDrawPaneById(paneId);
            if (pane !== null) {
                var bounding_1 = pane.getBounding();
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- ignore
                // @ts-expect-error
                var ps = [].concat(points);
                var xAxis_1 = this._xAxisPane.getAxisComponent();
                var yAxis_1 = pane.getAxisComponent();
                coordinates = ps.map(function (point) {
                    var coordinate = {};
                    var dataIndex = point.dataIndex;
                    if ((0, typeChecks_1.isNumber)(point.timestamp)) {
                        dataIndex = _this._chartStore.timestampToDataIndex(point.timestamp);
                    }
                    if ((0, typeChecks_1.isNumber)(dataIndex)) {
                        coordinate.x = xAxis_1.convertToPixel(dataIndex);
                    }
                    if ((0, typeChecks_1.isNumber)(point.value)) {
                        var y = yAxis_1.convertToPixel(point.value);
                        coordinate.y = absolute ? bounding_1.top + y : y;
                    }
                    return coordinate;
                });
            }
        }
        return (0, typeChecks_1.isArray)(points) ? coordinates : ((_a = coordinates[0]) !== null && _a !== void 0 ? _a : {});
    };
    ChartImp.prototype.convertFromPixel = function (coordinates, filter) {
        var _this = this;
        var _a;
        var _b = filter !== null && filter !== void 0 ? filter : {}, _c = _b.paneId, paneId = _c === void 0 ? types_1.PaneIdConstants.CANDLE : _c, _d = _b.absolute, absolute = _d === void 0 ? false : _d;
        var points = [];
        if (paneId !== types_1.PaneIdConstants.X_AXIS) {
            var pane = this.getDrawPaneById(paneId);
            if (pane !== null) {
                var bounding_2 = pane.getBounding();
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- ignore
                // @ts-expect-error
                var cs = [].concat(coordinates);
                var xAxis_2 = this._xAxisPane.getAxisComponent();
                var yAxis_2 = pane.getAxisComponent();
                points = cs.map(function (coordinate) {
                    var _a;
                    var point = {};
                    if ((0, typeChecks_1.isNumber)(coordinate.x)) {
                        var dataIndex = xAxis_2.convertFromPixel(coordinate.x);
                        point.dataIndex = dataIndex;
                        point.timestamp = (_a = _this._chartStore.dataIndexToTimestamp(dataIndex)) !== null && _a !== void 0 ? _a : undefined;
                    }
                    if ((0, typeChecks_1.isNumber)(coordinate.y)) {
                        var y = absolute ? coordinate.y - bounding_2.top : coordinate.y;
                        point.value = yAxis_2.convertFromPixel(y);
                    }
                    return point;
                });
            }
        }
        return (0, typeChecks_1.isArray)(coordinates) ? points : ((_a = points[0]) !== null && _a !== void 0 ? _a : {});
    };
    ChartImp.prototype.executeAction = function (type, data) {
        var _a;
        switch (type) {
            case 'onCrosshairChange': {
                var crosshair = __assign({}, data);
                (_a = crosshair.paneId) !== null && _a !== void 0 ? _a : (crosshair.paneId = types_1.PaneIdConstants.CANDLE);
                this._chartStore.setCrosshair(crosshair, { notExecuteAction: true });
                break;
            }
            default: {
                break;
            }
        }
    };
    ChartImp.prototype.subscribeAction = function (type, callback) {
        this._chartStore.subscribeAction(type, callback);
    };
    ChartImp.prototype.unsubscribeAction = function (type, callback) {
        this._chartStore.unsubscribeAction(type, callback);
    };
    ChartImp.prototype.getConvertPictureUrl = function (includeOverlay, type, backgroundColor) {
        var _this = this;
        var _a = this._chartBounding, width = _a.width, height = _a.height;
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
        ctx.fillStyle = backgroundColor !== null && backgroundColor !== void 0 ? backgroundColor : '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        var overlayFlag = includeOverlay !== null && includeOverlay !== void 0 ? includeOverlay : false;
        this._drawPanes.forEach(function (pane) {
            var separatorPane = _this._separatorPanes.get(pane);
            if ((0, typeChecks_1.isValid)(separatorPane)) {
                var separatorBounding = separatorPane.getBounding();
                ctx.drawImage(separatorPane.getImage(overlayFlag), separatorBounding.left, separatorBounding.top, separatorBounding.width, separatorBounding.height);
            }
            var bounding = pane.getBounding();
            ctx.drawImage(pane.getImage(overlayFlag), 0, bounding.top, width, bounding.height);
        });
        return canvas.toDataURL("image/".concat(type !== null && type !== void 0 ? type : 'jpeg'));
    };
    ChartImp.prototype.resize = function () {
        this._cacheChartBounding();
        this.layout({
            measureHeight: true,
            measureWidth: true,
            update: true,
            buildYAxisTick: true,
            forceBuildYAxisTick: true
        });
    };
    ChartImp.prototype.destroy = function () {
        this._chartEvent.destroy();
        this._drawPanes.forEach(function (pane) {
            pane.destroy();
        });
        this._drawPanes = [];
        this._separatorPanes.clear();
        this._chartStore.destroy();
        this._container.removeChild(this._chartContainer);
    };
    return ChartImp;
}());
exports.default = ChartImp;
//# sourceMappingURL=Chart.js.map