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
exports.DEFAULT_MIN_TIME_SPAN = exports.SCALE_MULTIPLIER = void 0;
var VisibleRange_1 = require("./common/VisibleRange");
var TaskScheduler_1 = __importStar(require("./common/TaskScheduler"));
var Action_1 = __importDefault(require("./common/Action"));
var format_1 = require("./common/utils/format");
var Styles_1 = require("./common/Styles");
var typeChecks_1 = require("./common/utils/typeChecks");
var id_1 = require("./common/utils/id");
var number_1 = require("./common/utils/number");
var logger_1 = require("./common/utils/logger");
var index_1 = require("./extension/indicator/index");
var Overlay_1 = require("./component/Overlay");
var index_2 = require("./extension/overlay/index");
var index_3 = require("./extension/styles/index");
var types_1 = require("./pane/types");
var BarSpaceLimitConstants = {
    MIN: 1,
    MAX: 50
};
var DEFAULT_BAR_SPACE = 10;
var DEFAULT_OFFSET_RIGHT_DISTANCE = 80;
var BAR_GAP_RATIO = 0.2;
exports.SCALE_MULTIPLIER = 10;
exports.DEFAULT_MIN_TIME_SPAN = 15 * 60 * 1000;
var StoreImp = /** @class */ (function () {
    function StoreImp(chart, options) {
        var _this = this;
        /**
         * Styles
         */
        this._styles = (0, Styles_1.getDefaultStyles)();
        /**
         * Custom api
         */
        this._formatter = {
            formatDate: function (_a) {
                var dateTimeFormat = _a.dateTimeFormat, timestamp = _a.timestamp, template = _a.template;
                return (0, format_1.formatTimestampByTemplate)(dateTimeFormat, timestamp, template);
            },
            formatBigNumber: format_1.formatBigNumber,
            formatExtendText: function (_) { return ''; }
        };
        /**
         * Inner formatter
         * @description Internal use only
         */
        this._innerFormatter = {
            formatDate: function (timestamp, template, type) { return _this._formatter.formatDate({ dateTimeFormat: _this._dateTimeFormat, timestamp: timestamp, template: template, type: type }); },
            formatBigNumber: function (value) { return _this._formatter.formatBigNumber(value); },
            formatExtendText: function (params) { return _this._formatter.formatExtendText(params); }
        };
        /**
         * Locale
         */
        this._locale = 'en-US';
        /**
         * Thousands separator
         */
        this._thousandsSeparator = {
            sign: ',',
            format: function (value) { return (0, format_1.formatThousands)(value, _this._thousandsSeparator.sign); }
        };
        /**
         * Decimal fold
         */
        this._decimalFold = {
            threshold: 3,
            format: function (value) { return (0, format_1.formatFoldDecimal)(value, _this._decimalFold.threshold); }
        };
        /**
         * Symbol
         */
        this._symbol = null;
        /**
         * Period
         */
        this._period = null;
        /**
         * Data source
         */
        this._dataList = [];
        /**
         * Load more data callback
         */
        this._dataLoader = null;
        /**
         * Is loading data flag
         */
        this._loading = false;
        /**
        * Whether there are forward and backward more flag
         */
        this._dataLoadMore = { forward: false, backward: false };
        /**
         * Scale enabled flag
         */
        this._zoomEnabled = true;
        /**
         * Scroll enabled flag
         */
        this._scrollEnabled = true;
        /**
         * Total space of drawing area
         */
        this._totalBarSpace = 0;
        /**
         * Space occupied by a single piece of data
         */
        this._barSpace = DEFAULT_BAR_SPACE;
        /**
         * Distance from the last data to the right of the drawing area
         */
        this._offsetRightDistance = DEFAULT_OFFSET_RIGHT_DISTANCE;
        /**
         * The number of bar to the right of the drawing area from the last data when scrolling starts
         */
        this._startLastBarRightSideDiffBarCount = 0;
        /**
         * Scroll limit role
         */
        this._scrollLimitRole = 'bar_count';
        /**
         * Scroll to the leftmost and rightmost visible bar
         */
        this._minVisibleBarCount = { left: 2, right: 2 };
        /**
         * Scroll to the leftmost and rightmost distance
         */
        this._maxOffsetDistance = { left: 50, right: 50 };
        /**
         * Start and end points of visible area data index
         */
        this._visibleRange = (0, VisibleRange_1.getDefaultVisibleRange)();
        /**
         * Visible data array
         */
        this._visibleRangeDataList = [];
        /**
         * Visible highest lowest price data
         */
        this._visibleRangeHighLowPrice = [
            { x: 0, price: Number.MIN_SAFE_INTEGER },
            { x: 0, price: Number.MAX_SAFE_INTEGER }
        ];
        /**
         * Crosshair info
         */
        this._crosshair = {};
        /**
         * Actions
         */
        this._actions = new Map();
        /**
         * Indicator
         */
        this._indicators = new Map();
        /**
         * Task scheduler
         */
        this._taskScheduler = new TaskScheduler_1.default();
        /**
         * Overlay
         */
        this._overlays = new Map();
        /**
         * Overlay information in painting
         */
        this._progressOverlayInfo = null;
        this._lastPriceMarkExtendTextUpdateTimers = [];
        /**
         * Overlay information by the mouse pressed
         */
        this._pressedOverlayInfo = {
            paneId: '',
            overlay: null,
            figureType: 'none',
            figureIndex: -1,
            figure: null
        };
        /**
         * Overlay information by hover
         */
        this._hoverOverlayInfo = {
            paneId: '',
            overlay: null,
            figureType: 'none',
            figureIndex: -1,
            figure: null
        };
        /**
         * Overlay information by the mouse click
         */
        this._clickOverlayInfo = {
            paneId: '',
            overlay: null,
            figureType: 'none',
            figureIndex: -1,
            figure: null
        };
        this._chart = chart;
        this._calcOptimalBarSpace();
        this._lastBarRightSideDiffBarCount = this._offsetRightDistance / this._barSpace;
        var _a = options !== null && options !== void 0 ? options : {}, styles = _a.styles, locale = _a.locale, timezone = _a.timezone, formatter = _a.formatter, thousandsSeparator = _a.thousandsSeparator, decimalFold = _a.decimalFold;
        if ((0, typeChecks_1.isValid)(styles)) {
            this.setStyles(styles);
        }
        if ((0, typeChecks_1.isString)(locale)) {
            this.setLocale(locale);
        }
        this.setTimezone(timezone !== null && timezone !== void 0 ? timezone : '');
        if ((0, typeChecks_1.isValid)(formatter)) {
            this.setFormatter(formatter);
        }
        if ((0, typeChecks_1.isValid)(thousandsSeparator)) {
            this.setThousandsSeparator(thousandsSeparator);
        }
        if ((0, typeChecks_1.isValid)(decimalFold)) {
            this.setDecimalFold(decimalFold);
        }
    }
    StoreImp.prototype.setStyles = function (value) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f;
        var styles = null;
        if ((0, typeChecks_1.isString)(value)) {
            styles = (0, index_3.getStyles)(value);
        }
        else {
            styles = value;
        }
        (0, typeChecks_1.merge)(this._styles, styles);
        // `candle.tooltip.custom` should override
        if ((0, typeChecks_1.isArray)((_c = (_b = (_a = styles === null || styles === void 0 ? void 0 : styles.candle) === null || _a === void 0 ? void 0 : _a.tooltip) === null || _b === void 0 ? void 0 : _b.legend) === null || _c === void 0 ? void 0 : _c.custom)) {
            this._styles.candle.tooltip.legend.custom = styles.candle.tooltip.legend.custom;
        }
        if ((0, typeChecks_1.isValid)((_f = (_e = (_d = styles === null || styles === void 0 ? void 0 : styles.candle) === null || _d === void 0 ? void 0 : _d.priceMark) === null || _e === void 0 ? void 0 : _e.last) === null || _f === void 0 ? void 0 : _f.extendTexts)) {
            this._clearLastPriceMarkExtendTextUpdateTimer();
            var intervals_1 = [];
            this._styles.candle.priceMark.last.extendTexts.forEach(function (item) {
                var updateInterval = item.updateInterval;
                if (item.show && updateInterval > 0 && !intervals_1.includes(updateInterval)) {
                    intervals_1.push(updateInterval);
                    var timer = setInterval(function () {
                        _this._chart.updatePane(0 /* UpdateLevel.Main */, types_1.PaneIdConstants.CANDLE);
                    }, updateInterval);
                    _this._lastPriceMarkExtendTextUpdateTimers.push(timer);
                }
            });
        }
    };
    StoreImp.prototype.getStyles = function () { return this._styles; };
    StoreImp.prototype.setFormatter = function (formatter) {
        (0, typeChecks_1.merge)(this._formatter, formatter);
    };
    StoreImp.prototype.getFormatter = function () { return this._formatter; };
    StoreImp.prototype.getInnerFormatter = function () {
        return this._innerFormatter;
    };
    StoreImp.prototype.setLocale = function (locale) { this._locale = locale; };
    StoreImp.prototype.getLocale = function () { return this._locale; };
    StoreImp.prototype.setTimezone = function (timezone) {
        if (!(0, typeChecks_1.isValid)(this._dateTimeFormat) ||
            (this.getTimezone() !== timezone)) {
            var options = {
                hour12: false,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            };
            if (timezone.length > 0) {
                options.timeZone = timezone;
            }
            var dateTimeFormat = null;
            try {
                dateTimeFormat = new Intl.DateTimeFormat('en', options);
            }
            catch (e) {
                (0, logger_1.logWarn)('', '', 'Timezone is error!!!');
            }
            if (dateTimeFormat !== null) {
                this._dateTimeFormat = dateTimeFormat;
            }
        }
    };
    StoreImp.prototype.getTimezone = function () { return this._dateTimeFormat.resolvedOptions().timeZone; };
    StoreImp.prototype.getDateTimeFormat = function () {
        return this._dateTimeFormat;
    };
    StoreImp.prototype.setThousandsSeparator = function (thousandsSeparator) {
        (0, typeChecks_1.merge)(this._thousandsSeparator, thousandsSeparator);
    };
    StoreImp.prototype.getThousandsSeparator = function () { return this._thousandsSeparator; };
    StoreImp.prototype.setDecimalFold = function (decimalFold) { (0, typeChecks_1.merge)(this._decimalFold, decimalFold); };
    StoreImp.prototype.getDecimalFold = function () { return this._decimalFold; };
    StoreImp.prototype.setSymbol = function (symbol) {
        this._processDataUnsubscribe();
        this._symbol = symbol;
        this._synchronizeIndicatorSeriesPrecision();
        this.resetData();
    };
    StoreImp.prototype.getSymbol = function () {
        return this._symbol;
    };
    StoreImp.prototype.setPeriod = function (period) {
        this._processDataUnsubscribe();
        this._period = period;
        this.resetData();
    };
    StoreImp.prototype.getPeriod = function () {
        return this._period;
    };
    StoreImp.prototype.getDataList = function () {
        return this._dataList;
    };
    StoreImp.prototype.getVisibleRangeDataList = function () {
        return this._visibleRangeDataList;
    };
    StoreImp.prototype.getVisibleRangeHighLowPrice = function () {
        return this._visibleRangeHighLowPrice;
    };
    StoreImp.prototype._addData = function (data, type, more) {
        var _this = this;
        var _a, _b;
        var success = false;
        var adjustFlag = false;
        var dataLengthChange = 0;
        if ((0, typeChecks_1.isArray)(data)) {
            var realMore = { backward: false, forward: false };
            if ((0, typeChecks_1.isBoolean)(more)) {
                realMore.backward = more;
                realMore.forward = more;
            }
            else {
                realMore.backward = (_a = more === null || more === void 0 ? void 0 : more.backward) !== null && _a !== void 0 ? _a : false;
                realMore.forward = (_b = more === null || more === void 0 ? void 0 : more.forward) !== null && _b !== void 0 ? _b : false;
            }
            dataLengthChange = data.length;
            switch (type) {
                case 'init': {
                    this._clearData();
                    this._dataList = data;
                    this._dataLoadMore.backward = realMore.backward;
                    this._dataLoadMore.forward = realMore.forward;
                    this.setOffsetRightDistance(this._offsetRightDistance);
                    adjustFlag = true;
                    break;
                }
                case 'backward': {
                    this._dataList = this._dataList.concat(data);
                    this._dataLoadMore.backward = realMore.backward;
                    adjustFlag = dataLengthChange > 0;
                    break;
                }
                case 'forward': {
                    this._dataList = data.concat(this._dataList);
                    this._dataLoadMore.forward = realMore.forward;
                    adjustFlag = dataLengthChange > 0;
                    break;
                }
                default: {
                    break;
                }
            }
            success = true;
        }
        else {
            var dataCount = this._dataList.length;
            // Determine where individual data should be added
            var timestamp = data.timestamp;
            var lastDataTimestamp = (0, format_1.formatValue)(this._dataList[dataCount - 1], 'timestamp', 0);
            if (timestamp > lastDataTimestamp) {
                this._dataList.push(data);
                var lastBarRightSideDiffBarCount = this.getLastBarRightSideDiffBarCount();
                if (lastBarRightSideDiffBarCount < 0) {
                    this.setLastBarRightSideDiffBarCount(--lastBarRightSideDiffBarCount);
                }
                dataLengthChange = 1;
                success = true;
                adjustFlag = true;
            }
            else if (timestamp === lastDataTimestamp) {
                this._dataList[dataCount - 1] = data;
                success = true;
                adjustFlag = true;
            }
        }
        if (success) {
            if (adjustFlag) {
                this._adjustVisibleRange();
                this.setCrosshair(this._crosshair, { notInvalidate: true });
                var filterIndicators = this.getIndicatorsByFilter({});
                filterIndicators.forEach(function (indicator) {
                    _this._addIndicatorCalcTask(indicator, type);
                });
                this._chart.layout({
                    measureWidth: true,
                    update: true,
                    buildYAxisTick: true,
                    cacheYAxisWidth: type !== 'init'
                });
            }
        }
    };
    StoreImp.prototype.setDataLoader = function (dataLoader) {
        this._dataLoader = dataLoader;
        this.resetData();
    };
    StoreImp.prototype._calcOptimalBarSpace = function () {
        var specialBarSpace = 4;
        var ratio = 1 - BAR_GAP_RATIO * Math.atan(Math.max(specialBarSpace, this._barSpace) - specialBarSpace) / (Math.PI * 0.5);
        var gapBarSpace = Math.min(Math.floor(this._barSpace * ratio), Math.floor(this._barSpace));
        if (gapBarSpace % 2 === 0 && gapBarSpace + 2 >= this._barSpace) {
            --gapBarSpace;
        }
        this._gapBarSpace = Math.max(1, gapBarSpace);
    };
    StoreImp.prototype._adjustVisibleRange = function () {
        var _a, _b;
        var totalBarCount = this._dataList.length;
        var visibleBarCount = this._totalBarSpace / this._barSpace;
        var leftMinVisibleBarCount = 0;
        var rightMinVisibleBarCount = 0;
        if (this._scrollLimitRole === 'distance') {
            leftMinVisibleBarCount = (this._totalBarSpace - this._maxOffsetDistance.right) / this._barSpace;
            rightMinVisibleBarCount = (this._totalBarSpace - this._maxOffsetDistance.left) / this._barSpace;
        }
        else {
            leftMinVisibleBarCount = this._minVisibleBarCount.left;
            rightMinVisibleBarCount = this._minVisibleBarCount.right;
        }
        leftMinVisibleBarCount = Math.max(0, leftMinVisibleBarCount);
        rightMinVisibleBarCount = Math.max(0, rightMinVisibleBarCount);
        var maxRightOffsetBarCount = visibleBarCount - Math.min(leftMinVisibleBarCount, totalBarCount);
        if (this._lastBarRightSideDiffBarCount > maxRightOffsetBarCount) {
            this._lastBarRightSideDiffBarCount = maxRightOffsetBarCount;
        }
        var minRightOffsetBarCount = -totalBarCount + Math.min(rightMinVisibleBarCount, totalBarCount);
        if (this._lastBarRightSideDiffBarCount < minRightOffsetBarCount) {
            this._lastBarRightSideDiffBarCount = minRightOffsetBarCount;
        }
        var to = Math.round(this._lastBarRightSideDiffBarCount + totalBarCount + 0.5);
        var realTo = to;
        if (to > totalBarCount) {
            to = totalBarCount;
        }
        var from = Math.round(to - visibleBarCount) - 1;
        if (from < 0) {
            from = 0;
        }
        var realFrom = this._lastBarRightSideDiffBarCount > 0 ? Math.round(totalBarCount + this._lastBarRightSideDiffBarCount - visibleBarCount) - 1 : from;
        this._visibleRange = { from: from, to: to, realFrom: realFrom, realTo: realTo };
        this.executeAction('onVisibleRangeChange', this._visibleRange);
        this._visibleRangeDataList = [];
        this._visibleRangeHighLowPrice = [
            { x: 0, price: Number.MIN_SAFE_INTEGER },
            { x: 0, price: Number.MAX_SAFE_INTEGER }
        ];
        for (var i = realFrom; i < realTo; i++) {
            var kLineData = this._dataList[i];
            var x = this.dataIndexToCoordinate(i);
            this._visibleRangeDataList.push({
                dataIndex: i,
                x: x,
                data: {
                    prev: (_a = this._dataList[i - 1]) !== null && _a !== void 0 ? _a : kLineData,
                    current: kLineData,
                    next: (_b = this._dataList[i + 1]) !== null && _b !== void 0 ? _b : kLineData
                }
            });
            if ((0, typeChecks_1.isValid)(kLineData)) {
                if (this._visibleRangeHighLowPrice[0].price < kLineData.high) {
                    this._visibleRangeHighLowPrice[0].price = kLineData.high;
                    this._visibleRangeHighLowPrice[0].x = x;
                }
                if (this._visibleRangeHighLowPrice[1].price > kLineData.low) {
                    this._visibleRangeHighLowPrice[1].price = kLineData.low;
                    this._visibleRangeHighLowPrice[1].x = x;
                }
            }
        }
        // More processing and loading, more loading if there are callback methods and no data is being loaded
        if (!this._loading && (0, typeChecks_1.isValid)(this._dataLoader) && (0, typeChecks_1.isValid)(this._symbol) && (0, typeChecks_1.isValid)(this._period)) {
            if (from === 0) {
                if (this._dataLoadMore.forward) {
                    this._processDataLoad('forward');
                }
            }
            else if (to === totalBarCount) {
                if (this._dataLoadMore.backward) {
                    this._processDataLoad('backward');
                }
            }
        }
    };
    StoreImp.prototype._processDataLoad = function (type) {
        var _this = this;
        var _a, _b, _c, _d;
        if (!this._loading && (0, typeChecks_1.isValid)(this._dataLoader) && (0, typeChecks_1.isValid)(this._symbol) && (0, typeChecks_1.isValid)(this._period)) {
            this._loading = true;
            var params = {
                type: type,
                symbol: this._symbol,
                period: this._period,
                timestamp: null,
                callback: function (data, more) {
                    var _a, _b;
                    _this._loading = false;
                    _this._addData(data, type, more);
                    if (type === 'init') {
                        (_b = (_a = _this._dataLoader) === null || _a === void 0 ? void 0 : _a.subscribeBar) === null || _b === void 0 ? void 0 : _b.call(_a, {
                            symbol: _this._symbol,
                            period: _this._period,
                            callback: function (data) {
                                _this._addData(data, 'update');
                            }
                        });
                    }
                }
            };
            switch (type) {
                case 'backward': {
                    params.timestamp = (_b = (_a = this._dataList[this._dataList.length - 1]) === null || _a === void 0 ? void 0 : _a.timestamp) !== null && _b !== void 0 ? _b : null;
                    break;
                }
                case 'forward': {
                    params.timestamp = (_d = (_c = this._dataList[0]) === null || _c === void 0 ? void 0 : _c.timestamp) !== null && _d !== void 0 ? _d : null;
                    break;
                }
                default: {
                    break;
                }
            }
            void this._dataLoader.getBars(params);
        }
    };
    StoreImp.prototype._processDataUnsubscribe = function () {
        var _a, _b;
        if ((0, typeChecks_1.isValid)(this._dataLoader) && (0, typeChecks_1.isValid)(this._symbol) && (0, typeChecks_1.isValid)(this._period)) {
            (_b = (_a = this._dataLoader).unsubscribeBar) === null || _b === void 0 ? void 0 : _b.call(_a, {
                symbol: this._symbol,
                period: this._period
            });
        }
    };
    StoreImp.prototype.resetData = function () {
        this._loading = false;
        this._processDataLoad('init');
    };
    StoreImp.prototype.getBarSpace = function () {
        return {
            bar: this._barSpace,
            halfBar: this._barSpace / 2,
            gapBar: this._gapBarSpace,
            halfGapBar: Math.floor(this._gapBarSpace / 2)
        };
    };
    StoreImp.prototype.setBarSpace = function (barSpace, adjustBeforeFunc) {
        if (barSpace < BarSpaceLimitConstants.MIN || barSpace > BarSpaceLimitConstants.MAX || this._barSpace === barSpace) {
            return;
        }
        this._barSpace = barSpace;
        this._calcOptimalBarSpace();
        adjustBeforeFunc === null || adjustBeforeFunc === void 0 ? void 0 : adjustBeforeFunc();
        this._adjustVisibleRange();
        this.setCrosshair(this._crosshair, { notInvalidate: true });
        this._chart.layout({
            measureWidth: true,
            update: true,
            buildYAxisTick: true,
            cacheYAxisWidth: true
        });
    };
    StoreImp.prototype.setTotalBarSpace = function (totalSpace) {
        if (this._totalBarSpace !== totalSpace) {
            this._totalBarSpace = totalSpace;
            this._adjustVisibleRange();
            this.setCrosshair(this._crosshair, { notInvalidate: true });
        }
    };
    StoreImp.prototype.setOffsetRightDistance = function (distance, isUpdate) {
        this._offsetRightDistance = this._scrollLimitRole === 'distance' ? Math.min(this._maxOffsetDistance.right, distance) : distance;
        this._lastBarRightSideDiffBarCount = this._offsetRightDistance / this._barSpace;
        if (isUpdate !== null && isUpdate !== void 0 ? isUpdate : false) {
            this._adjustVisibleRange();
            this.setCrosshair(this._crosshair, { notInvalidate: true });
            this._chart.layout({
                measureWidth: true,
                update: true,
                buildYAxisTick: true,
                cacheYAxisWidth: true
            });
        }
        return this;
    };
    StoreImp.prototype.getInitialOffsetRightDistance = function () {
        return this._offsetRightDistance;
    };
    StoreImp.prototype.getOffsetRightDistance = function () {
        return Math.max(0, this._lastBarRightSideDiffBarCount * this._barSpace);
    };
    StoreImp.prototype.getLastBarRightSideDiffBarCount = function () {
        return this._lastBarRightSideDiffBarCount;
    };
    StoreImp.prototype.setLastBarRightSideDiffBarCount = function (barCount) {
        this._lastBarRightSideDiffBarCount = barCount;
    };
    StoreImp.prototype.setMaxOffsetLeftDistance = function (distance) {
        this._scrollLimitRole = 'distance';
        this._maxOffsetDistance.left = distance;
    };
    StoreImp.prototype.setMaxOffsetRightDistance = function (distance) {
        this._scrollLimitRole = 'distance';
        this._maxOffsetDistance.right = distance;
    };
    StoreImp.prototype.setLeftMinVisibleBarCount = function (barCount) {
        this._scrollLimitRole = 'bar_count';
        this._minVisibleBarCount.left = barCount;
    };
    StoreImp.prototype.setRightMinVisibleBarCount = function (barCount) {
        this._scrollLimitRole = 'bar_count';
        this._minVisibleBarCount.right = barCount;
    };
    StoreImp.prototype.getVisibleRange = function () {
        return this._visibleRange;
    };
    StoreImp.prototype.startScroll = function () {
        this._startLastBarRightSideDiffBarCount = this._lastBarRightSideDiffBarCount;
    };
    StoreImp.prototype.scroll = function (distance) {
        if (!this._scrollEnabled) {
            return;
        }
        var distanceBarCount = distance / this._barSpace;
        var prevLastBarRightSideDistance = this._lastBarRightSideDiffBarCount * this._barSpace;
        this._lastBarRightSideDiffBarCount = this._startLastBarRightSideDiffBarCount - distanceBarCount;
        this._adjustVisibleRange();
        this.setCrosshair(this._crosshair, { notInvalidate: true });
        this._chart.layout({
            measureWidth: true,
            update: true,
            buildYAxisTick: true,
            cacheYAxisWidth: true
        });
        var realDistance = Math.round(prevLastBarRightSideDistance - this._lastBarRightSideDiffBarCount * this._barSpace);
        if (realDistance !== 0) {
            this.executeAction('onScroll', { distance: realDistance });
        }
    };
    StoreImp.prototype.getDataByDataIndex = function (dataIndex) {
        var _a;
        return (_a = this._dataList[dataIndex]) !== null && _a !== void 0 ? _a : null;
    };
    StoreImp.prototype.coordinateToFloatIndex = function (x) {
        var dataCount = this._dataList.length;
        var deltaFromRight = (this._totalBarSpace - x) / this._barSpace;
        var index = dataCount + this._lastBarRightSideDiffBarCount - deltaFromRight;
        return Math.round(index * 1000000) / 1000000;
    };
    StoreImp.prototype.dataIndexToTimestamp = function (dataIndex) {
        var length = this._dataList.length;
        if (length === 0) {
            return null;
        }
        var data = this.getDataByDataIndex(dataIndex);
        if ((0, typeChecks_1.isValid)(data)) {
            return data.timestamp;
        }
        if ((0, typeChecks_1.isValid)(this._period)) {
            var lastIndex = length - 1;
            var referenceTimestamp = null;
            var diff = 0;
            if (dataIndex > lastIndex) {
                referenceTimestamp = this._dataList[lastIndex].timestamp;
                diff = dataIndex - lastIndex;
            }
            else if (dataIndex < 0) {
                referenceTimestamp = this._dataList[0].timestamp;
                diff = dataIndex;
            }
            if ((0, typeChecks_1.isNumber)(referenceTimestamp)) {
                var _a = this._period, type = _a.type, span = _a.span;
                switch (type) {
                    case 'second': {
                        return referenceTimestamp + span * 1000 * diff;
                    }
                    case 'minute': {
                        return referenceTimestamp + span * 60 * 1000 * diff;
                    }
                    case 'hour': {
                        return referenceTimestamp + span * 60 * 60 * 1000 * diff;
                    }
                    case 'day': {
                        return referenceTimestamp + span * 24 * 60 * 60 * 1000 * diff;
                    }
                    case 'week': {
                        return referenceTimestamp + span * 7 * 24 * 60 * 60 * 1000 * diff;
                    }
                    case 'month': {
                        var date = new Date(referenceTimestamp);
                        var originalDay = date.getDate();
                        var targetMonth = date.getMonth() + span * diff;
                        date.setMonth(targetMonth);
                        var lastDayOfTargetMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
                        date.setDate(Math.min(originalDay, lastDayOfTargetMonth));
                        return date.getTime();
                    }
                    case 'year': {
                        var date = new Date(referenceTimestamp);
                        date.setFullYear(date.getFullYear() + span * diff);
                        return date.getTime();
                    }
                }
            }
        }
        return null;
    };
    StoreImp.prototype.timestampToDataIndex = function (timestamp) {
        var length = this._dataList.length;
        if (length === 0) {
            return 0;
        }
        if ((0, typeChecks_1.isValid)(this._period)) {
            var referenceTimestamp = null;
            var baseDataIndex = 0;
            var lastIndex = length - 1;
            var lastTimestamp = this._dataList[lastIndex].timestamp;
            if (timestamp > lastTimestamp) {
                referenceTimestamp = lastTimestamp;
                baseDataIndex = lastIndex;
            }
            var firstTimestamp = this._dataList[0].timestamp;
            if (timestamp < firstTimestamp) {
                referenceTimestamp = firstTimestamp;
                baseDataIndex = 0;
            }
            if ((0, typeChecks_1.isNumber)(referenceTimestamp)) {
                var _a = this._period, type = _a.type, span = _a.span;
                switch (type) {
                    case 'second': {
                        return baseDataIndex + Math.floor((timestamp - referenceTimestamp) / (span * 1000));
                    }
                    case 'minute': {
                        return baseDataIndex + Math.floor((timestamp - referenceTimestamp) / (span * 60 * 1000));
                    }
                    case 'hour': {
                        return baseDataIndex + Math.floor((timestamp - referenceTimestamp) / (span * 60 * 60 * 1000));
                    }
                    case 'day': {
                        return baseDataIndex + Math.floor((timestamp - referenceTimestamp) / (span * 24 * 60 * 60 * 1000));
                    }
                    case 'week': {
                        return baseDataIndex + Math.floor((timestamp - referenceTimestamp) / (span * 7 * 24 * 60 * 60 * 1000));
                    }
                    case 'month': {
                        var referenceDate = new Date(referenceTimestamp);
                        var currentDate = new Date(timestamp);
                        var referenceYear = referenceDate.getFullYear();
                        var currentYear = currentDate.getFullYear();
                        var referenceMonth = referenceDate.getMonth();
                        var currentMonth = currentDate.getMonth();
                        return baseDataIndex + Math.floor((currentYear - referenceYear) * 12 + (currentMonth - referenceMonth) / span);
                    }
                    case 'year': {
                        var referenceYear = new Date(referenceTimestamp).getFullYear();
                        var currentYear = new Date(timestamp).getFullYear();
                        return baseDataIndex + Math.floor((currentYear - referenceYear) / span);
                    }
                }
            }
        }
        return (0, number_1.binarySearchNearest)(this._dataList, 'timestamp', timestamp);
    };
    StoreImp.prototype.dataIndexToCoordinate = function (dataIndex) {
        var dataCount = this._dataList.length;
        var deltaFromRight = dataCount + this._lastBarRightSideDiffBarCount - dataIndex;
        return Math.floor(this._totalBarSpace - (deltaFromRight - 0.5) * this._barSpace + 0.5);
    };
    StoreImp.prototype.coordinateToDataIndex = function (x) {
        return Math.ceil(this.coordinateToFloatIndex(x)) - 1;
    };
    StoreImp.prototype.zoom = function (scale, coordinate) {
        var _this = this;
        var _a;
        if (!this._zoomEnabled) {
            return;
        }
        var zoomCoordinate = coordinate !== null && coordinate !== void 0 ? coordinate : null;
        if (!(0, typeChecks_1.isNumber)(zoomCoordinate === null || zoomCoordinate === void 0 ? void 0 : zoomCoordinate.x)) {
            zoomCoordinate = { x: (_a = this._crosshair.x) !== null && _a !== void 0 ? _a : this._totalBarSpace / 2 };
        }
        var x = zoomCoordinate.x;
        var floatIndex = this.coordinateToFloatIndex(x);
        var prevBarSpace = this._barSpace;
        var barSpace = this._barSpace + scale * (this._barSpace / exports.SCALE_MULTIPLIER);
        this.setBarSpace(barSpace, function () {
            _this._lastBarRightSideDiffBarCount += (floatIndex - _this.coordinateToFloatIndex(x));
        });
        var realScale = this._barSpace / prevBarSpace;
        if (realScale !== 1) {
            this.executeAction('onZoom', { scale: realScale });
        }
    };
    StoreImp.prototype.setZoomEnabled = function (enabled) {
        this._zoomEnabled = enabled;
    };
    StoreImp.prototype.isZoomEnabled = function () {
        return this._zoomEnabled;
    };
    StoreImp.prototype.setScrollEnabled = function (enabled) {
        this._scrollEnabled = enabled;
    };
    StoreImp.prototype.isScrollEnabled = function () {
        return this._scrollEnabled;
    };
    StoreImp.prototype.setCrosshair = function (crosshair, options) {
        var _a;
        var _b = options !== null && options !== void 0 ? options : {}, notInvalidate = _b.notInvalidate, notExecuteAction = _b.notExecuteAction, forceInvalidate = _b.forceInvalidate;
        var cr = crosshair !== null && crosshair !== void 0 ? crosshair : {};
        var realDataIndex = 0;
        var dataIndex = 0;
        if ((0, typeChecks_1.isNumber)(cr.x)) {
            realDataIndex = this.coordinateToDataIndex(cr.x);
            if (realDataIndex < 0) {
                dataIndex = 0;
            }
            else if (realDataIndex > this._dataList.length - 1) {
                dataIndex = this._dataList.length - 1;
            }
            else {
                dataIndex = realDataIndex;
            }
        }
        else {
            realDataIndex = this._dataList.length - 1;
            dataIndex = realDataIndex;
        }
        var kLineData = this._dataList[dataIndex];
        var realX = this.dataIndexToCoordinate(realDataIndex);
        var prevCrosshair = { x: this._crosshair.x, y: this._crosshair.y, paneId: this._crosshair.paneId };
        this._crosshair = __assign(__assign({}, cr), { realX: realX, kLineData: kLineData, realDataIndex: realDataIndex, dataIndex: dataIndex, timestamp: (_a = this.dataIndexToTimestamp(realDataIndex)) !== null && _a !== void 0 ? _a : undefined });
        if (prevCrosshair.x !== cr.x ||
            prevCrosshair.y !== cr.y ||
            prevCrosshair.paneId !== cr.paneId ||
            (forceInvalidate !== null && forceInvalidate !== void 0 ? forceInvalidate : false)) {
            if ((0, typeChecks_1.isValid)(kLineData) && !(notExecuteAction !== null && notExecuteAction !== void 0 ? notExecuteAction : false)) {
                this._chart.crosshairChange(this._crosshair);
            }
            if (!(notInvalidate !== null && notInvalidate !== void 0 ? notInvalidate : false)) {
                this._chart.updatePane(1 /* UpdateLevel.Overlay */);
            }
        }
    };
    StoreImp.prototype.getCrosshair = function () {
        return this._crosshair;
    };
    StoreImp.prototype.executeAction = function (type, data) {
        var _a;
        (_a = this._actions.get(type)) === null || _a === void 0 ? void 0 : _a.execute(data);
    };
    StoreImp.prototype.subscribeAction = function (type, callback) {
        var _a;
        if (!this._actions.has(type)) {
            this._actions.set(type, new Action_1.default());
        }
        (_a = this._actions.get(type)) === null || _a === void 0 ? void 0 : _a.subscribe(callback);
    };
    StoreImp.prototype.unsubscribeAction = function (type, callback) {
        var action = this._actions.get(type);
        if ((0, typeChecks_1.isValid)(action)) {
            action.unsubscribe(callback);
            if (action.isEmpty()) {
                this._actions.delete(type);
            }
        }
    };
    StoreImp.prototype.hasAction = function (type) {
        var action = this._actions.get(type);
        return (0, typeChecks_1.isValid)(action) && !action.isEmpty();
    };
    StoreImp.prototype._sortIndicators = function (paneId) {
        var _a;
        if ((0, typeChecks_1.isString)(paneId)) {
            (_a = this._indicators.get(paneId)) === null || _a === void 0 ? void 0 : _a.sort(function (i1, i2) { return i1.zLevel - i2.zLevel; });
        }
        else {
            this._indicators.forEach(function (paneIndicators) {
                paneIndicators.sort(function (i1, i2) { return i1.zLevel - i2.zLevel; });
            });
        }
    };
    StoreImp.prototype._addIndicatorCalcTask = function (indicator, dataLoadType) {
        var _this = this;
        this._taskScheduler.addTask({
            id: (0, TaskScheduler_1.generateTaskId)(indicator.id),
            handler: function () {
                var _a;
                (_a = indicator.onDataStateChange) === null || _a === void 0 ? void 0 : _a.call(indicator, {
                    state: 'loading',
                    type: dataLoadType,
                    indicator: indicator
                });
                indicator.calcImp(_this._dataList).then(function (result) {
                    var _a;
                    if (result) {
                        _this._chart.layout({
                            measureWidth: true,
                            update: true,
                            buildYAxisTick: true,
                            cacheYAxisWidth: dataLoadType !== 'init'
                        });
                        (_a = indicator.onDataStateChange) === null || _a === void 0 ? void 0 : _a.call(indicator, {
                            state: 'ready',
                            type: dataLoadType,
                            indicator: indicator
                        });
                    }
                }).catch(function () {
                    var _a;
                    (_a = indicator.onDataStateChange) === null || _a === void 0 ? void 0 : _a.call(indicator, {
                        state: 'error',
                        type: dataLoadType,
                        indicator: indicator
                    });
                });
            }
        });
    };
    StoreImp.prototype.addIndicator = function (create, paneId, isStack) {
        var name = create.name;
        var filterIndicators = this.getIndicatorsByFilter(create);
        if (filterIndicators.length > 0) {
            return false;
        }
        var paneIndicators = this.getIndicatorsByPaneId(paneId);
        var IndicatorClazz = (0, index_1.getIndicatorClass)(name);
        var indicator = new IndicatorClazz();
        this._synchronizeIndicatorSeriesPrecision(indicator);
        indicator.paneId = paneId;
        indicator.override(create);
        if (!isStack) {
            this.removeIndicator({ paneId: paneId });
            paneIndicators = [];
        }
        paneIndicators.push(indicator);
        this._indicators.set(paneId, paneIndicators);
        this._sortIndicators(paneId);
        this._addIndicatorCalcTask(indicator, 'init');
        return true;
    };
    StoreImp.prototype.getIndicatorsByPaneId = function (paneId) {
        var _a;
        return (_a = this._indicators.get(paneId)) !== null && _a !== void 0 ? _a : [];
    };
    StoreImp.prototype.getIndicatorsByFilter = function (filter) {
        var paneId = filter.paneId, name = filter.name, id = filter.id;
        var match = function (indicator) {
            if ((0, typeChecks_1.isValid)(id)) {
                return indicator.id === id;
            }
            return !(0, typeChecks_1.isValid)(name) || indicator.name === name;
        };
        var indicators = [];
        if ((0, typeChecks_1.isValid)(paneId)) {
            indicators = indicators.concat(this.getIndicatorsByPaneId(paneId).filter(match));
        }
        else {
            this._indicators.forEach(function (paneIndicators) {
                indicators = indicators.concat(paneIndicators.filter(match));
            });
        }
        return indicators;
    };
    StoreImp.prototype.removeIndicator = function (filter) {
        var _this = this;
        var removed = false;
        var filterIndicators = this.getIndicatorsByFilter(filter);
        filterIndicators.forEach(function (indicator) {
            var paneIndicators = _this.getIndicatorsByPaneId(indicator.paneId);
            var index = paneIndicators.findIndex(function (ins) { return ins.id === indicator.id; });
            if (index > -1) {
                _this._taskScheduler.removeTask((0, TaskScheduler_1.generateTaskId)(indicator.id));
                paneIndicators.splice(index, 1);
                removed = true;
            }
            if (paneIndicators.length === 0) {
                _this._indicators.delete(indicator.paneId);
            }
        });
        return removed;
    };
    StoreImp.prototype.hasIndicators = function (paneId) {
        return this._indicators.has(paneId);
    };
    StoreImp.prototype._synchronizeIndicatorSeriesPrecision = function (indicator) {
        if ((0, typeChecks_1.isValid)(this._symbol)) {
            var _a = this._symbol, _b = _a.pricePrecision, pricePrecision_1 = _b === void 0 ? 2 : _b, _c = _a.volumePrecision, volumePrecision_1 = _c === void 0 ? 0 : _c;
            var synchronize_1 = function (indicator) {
                switch (indicator.series) {
                    case 'price': {
                        indicator.setSeriesPrecision(pricePrecision_1);
                        break;
                    }
                    case 'volume': {
                        indicator.setSeriesPrecision(volumePrecision_1);
                        break;
                    }
                    default: {
                        break;
                    }
                }
            };
            if ((0, typeChecks_1.isValid)(indicator)) {
                synchronize_1(indicator);
            }
            else {
                this._indicators.forEach(function (paneIndicators) {
                    paneIndicators.forEach(function (indicator) {
                        synchronize_1(indicator);
                    });
                });
            }
        }
    };
    StoreImp.prototype.overrideIndicator = function (override) {
        var _this = this;
        var updateFlag = false;
        var sortFlag = false;
        var filterIndicators = this.getIndicatorsByFilter(override);
        filterIndicators.forEach(function (indicator) {
            indicator.override(override);
            var _a = indicator.shouldUpdateImp(), calc = _a.calc, draw = _a.draw, sort = _a.sort;
            if (sort) {
                sortFlag = true;
            }
            if (calc) {
                _this._addIndicatorCalcTask(indicator, 'update');
            }
            else {
                if (draw) {
                    updateFlag = true;
                }
            }
        });
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- ignore
        if (sortFlag) {
            this._sortIndicators();
        }
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- ignore
        if (updateFlag) {
            this._chart.layout({ update: true });
            return true;
        }
        return false;
    };
    StoreImp.prototype.getOverlaysByFilter = function (filter) {
        var _a;
        var id = filter.id, groupId = filter.groupId, paneId = filter.paneId, name = filter.name;
        var match = function (overlay) {
            if ((0, typeChecks_1.isValid)(id)) {
                return overlay.id === id;
            }
            else {
                if ((0, typeChecks_1.isValid)(groupId)) {
                    return overlay.groupId === groupId && (!(0, typeChecks_1.isValid)(name) || overlay.name === name);
                }
            }
            return !(0, typeChecks_1.isValid)(name) || overlay.name === name;
        };
        var overlays = [];
        if ((0, typeChecks_1.isValid)(paneId)) {
            overlays = overlays.concat(this.getOverlaysByPaneId(paneId).filter(match));
        }
        else {
            this._overlays.forEach(function (paneOverlays) {
                overlays = overlays.concat(paneOverlays.filter(match));
            });
        }
        var progressOverlay = (_a = this._progressOverlayInfo) === null || _a === void 0 ? void 0 : _a.overlay;
        if ((0, typeChecks_1.isValid)(progressOverlay) && match(progressOverlay)) {
            overlays.push(progressOverlay);
        }
        return overlays;
    };
    StoreImp.prototype.getOverlaysByPaneId = function (paneId) {
        var _a;
        if (!(0, typeChecks_1.isString)(paneId)) {
            var overlays_1 = [];
            this._overlays.forEach(function (paneOverlays) {
                overlays_1 = overlays_1.concat(paneOverlays);
            });
            return overlays_1;
        }
        return (_a = this._overlays.get(paneId)) !== null && _a !== void 0 ? _a : [];
    };
    StoreImp.prototype._sortOverlays = function (paneId) {
        var _a;
        if ((0, typeChecks_1.isString)(paneId)) {
            (_a = this._overlays.get(paneId)) === null || _a === void 0 ? void 0 : _a.sort(function (o1, o2) { return o1.zLevel - o2.zLevel; });
        }
        else {
            this._overlays.forEach(function (paneOverlays) {
                paneOverlays.sort(function (o1, o2) { return o1.zLevel - o2.zLevel; });
            });
        }
    };
    StoreImp.prototype.addOverlays = function (os, appointPaneFlags) {
        var _this = this;
        var updatePaneIds = [];
        var ids = os.map(function (create, index) {
            var e_1, _a;
            var _b, _c, _d, _e, _f, _g;
            if ((0, typeChecks_1.isValid)(create.id)) {
                var findOverlay = null;
                try {
                    for (var _h = __values(_this._overlays), _j = _h.next(); !_j.done; _j = _h.next()) {
                        var item = _j.value;
                        var overlays = item[1];
                        var overlay = overlays.find(function (o) { return o.id === create.id; });
                        if ((0, typeChecks_1.isValid)(overlay)) {
                            findOverlay = overlay;
                            break;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_j && !_j.done && (_a = _h.return)) _a.call(_h);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                if ((0, typeChecks_1.isValid)(findOverlay)) {
                    return create.id;
                }
            }
            var OverlayClazz = (0, index_2.getOverlayInnerClass)(create.name);
            if ((0, typeChecks_1.isValid)(OverlayClazz)) {
                var id = (_b = create.id) !== null && _b !== void 0 ? _b : (0, id_1.createId)(Overlay_1.OVERLAY_ID_PREFIX);
                var overlay = new OverlayClazz();
                var paneId = (_c = create.paneId) !== null && _c !== void 0 ? _c : types_1.PaneIdConstants.CANDLE;
                create.id = id;
                (_d = create.groupId) !== null && _d !== void 0 ? _d : (create.groupId = id);
                var zLevel = _this.getOverlaysByPaneId(paneId).length;
                (_e = create.zLevel) !== null && _e !== void 0 ? _e : (create.zLevel = zLevel);
                overlay.override(create);
                if (!updatePaneIds.includes(paneId)) {
                    updatePaneIds.push(paneId);
                }
                if (overlay.isDrawing()) {
                    _this._progressOverlayInfo = { paneId: paneId, overlay: overlay, appointPaneFlag: appointPaneFlags[index] };
                }
                else {
                    if (!_this._overlays.has(paneId)) {
                        _this._overlays.set(paneId, []);
                    }
                    (_f = _this._overlays.get(paneId)) === null || _f === void 0 ? void 0 : _f.push(overlay);
                }
                if (overlay.isStart()) {
                    (_g = overlay.onDrawStart) === null || _g === void 0 ? void 0 : _g.call(overlay, ({ overlay: overlay, chart: _this._chart }));
                }
                return id;
            }
            return null;
        });
        if (updatePaneIds.length > 0) {
            this._sortOverlays();
            updatePaneIds.forEach(function (paneId) {
                _this._chart.updatePane(1 /* UpdateLevel.Overlay */, paneId);
            });
            this._chart.updatePane(1 /* UpdateLevel.Overlay */, types_1.PaneIdConstants.X_AXIS);
        }
        return ids;
    };
    StoreImp.prototype.getProgressOverlayInfo = function () {
        return this._progressOverlayInfo;
    };
    StoreImp.prototype.progressOverlayComplete = function () {
        var _a;
        if (this._progressOverlayInfo !== null) {
            var _b = this._progressOverlayInfo, overlay = _b.overlay, paneId = _b.paneId;
            if (!overlay.isDrawing()) {
                if (!this._overlays.has(paneId)) {
                    this._overlays.set(paneId, []);
                }
                (_a = this._overlays.get(paneId)) === null || _a === void 0 ? void 0 : _a.push(overlay);
                this._sortOverlays(paneId);
                this._progressOverlayInfo = null;
            }
        }
    };
    StoreImp.prototype.updateProgressOverlayInfo = function (paneId, appointPaneFlag) {
        if (this._progressOverlayInfo !== null) {
            if ((0, typeChecks_1.isBoolean)(appointPaneFlag) && appointPaneFlag) {
                this._progressOverlayInfo.appointPaneFlag = appointPaneFlag;
            }
            this._progressOverlayInfo.paneId = paneId;
            this._progressOverlayInfo.overlay.override({ paneId: paneId });
        }
    };
    StoreImp.prototype.overrideOverlay = function (override) {
        var _this = this;
        var sortFlag = false;
        var updatePaneIds = [];
        var filterOverlays = this.getOverlaysByFilter(override);
        filterOverlays.forEach(function (overlay) {
            overlay.override(override);
            var _a = overlay.shouldUpdate(), sort = _a.sort, draw = _a.draw;
            if (sort) {
                sortFlag = true;
            }
            if (sort || draw) {
                if (!updatePaneIds.includes(overlay.paneId)) {
                    updatePaneIds.push(overlay.paneId);
                }
            }
        });
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- ignore
        if (sortFlag) {
            this._sortOverlays();
        }
        if (updatePaneIds.length > 0) {
            updatePaneIds.forEach(function (paneId) {
                _this._chart.updatePane(1 /* UpdateLevel.Overlay */, paneId);
            });
            this._chart.updatePane(1 /* UpdateLevel.Overlay */, types_1.PaneIdConstants.X_AXIS);
            return true;
        }
        return false;
    };
    StoreImp.prototype.removeOverlay = function (filter) {
        var _this = this;
        var updatePaneIds = [];
        var filterOverlays = this.getOverlaysByFilter(filter);
        filterOverlays.forEach(function (overlay) {
            var _a;
            var paneId = overlay.paneId;
            var paneOverlays = _this.getOverlaysByPaneId(overlay.paneId);
            (_a = overlay.onRemoved) === null || _a === void 0 ? void 0 : _a.call(overlay, { overlay: overlay, chart: _this._chart });
            if (!updatePaneIds.includes(paneId)) {
                updatePaneIds.push(paneId);
            }
            if (overlay.isDrawing()) {
                _this._progressOverlayInfo = null;
            }
            else {
                var index = paneOverlays.findIndex(function (o) { return o.id === overlay.id; });
                if (index > -1) {
                    paneOverlays.splice(index, 1);
                }
            }
            if (paneOverlays.length === 0) {
                _this._overlays.delete(paneId);
            }
        });
        if (updatePaneIds.length > 0) {
            updatePaneIds.forEach(function (paneId) {
                _this._chart.updatePane(1 /* UpdateLevel.Overlay */, paneId);
            });
            this._chart.updatePane(1 /* UpdateLevel.Overlay */, types_1.PaneIdConstants.X_AXIS);
            return true;
        }
        return false;
    };
    StoreImp.prototype.setPressedOverlayInfo = function (info) {
        this._pressedOverlayInfo = info;
    };
    StoreImp.prototype.getPressedOverlayInfo = function () {
        return this._pressedOverlayInfo;
    };
    StoreImp.prototype.setHoverOverlayInfo = function (info, processOnMouseEnterEvent, processOnMouseLeaveEvent) {
        var _a = this._hoverOverlayInfo, overlay = _a.overlay, figureType = _a.figureType, figureIndex = _a.figureIndex, figure = _a.figure;
        var infoOverlay = info.overlay;
        if ((overlay === null || overlay === void 0 ? void 0 : overlay.id) !== (infoOverlay === null || infoOverlay === void 0 ? void 0 : infoOverlay.id) ||
            figureType !== info.figureType ||
            figureIndex !== info.figureIndex) {
            this._hoverOverlayInfo = info;
            if ((overlay === null || overlay === void 0 ? void 0 : overlay.id) !== (infoOverlay === null || infoOverlay === void 0 ? void 0 : infoOverlay.id)) {
                var ignoreUpdateFlag = false;
                var sortFlag = false;
                if (overlay !== null) {
                    overlay.override({ zLevel: overlay.getPrevZLevel() });
                    sortFlag = true;
                    if (processOnMouseLeaveEvent(overlay, figure)) {
                        ignoreUpdateFlag = true;
                    }
                }
                if (infoOverlay !== null) {
                    infoOverlay.setPrevZLevel(infoOverlay.zLevel);
                    infoOverlay.override({ zLevel: Number.MAX_SAFE_INTEGER });
                    sortFlag = true;
                    if (processOnMouseEnterEvent(infoOverlay, info.figure)) {
                        ignoreUpdateFlag = true;
                    }
                }
                if (sortFlag) {
                    this._sortOverlays();
                }
                if (!ignoreUpdateFlag) {
                    this._chart.updatePane(1 /* UpdateLevel.Overlay */);
                }
            }
        }
    };
    StoreImp.prototype.getHoverOverlayInfo = function () {
        return this._hoverOverlayInfo;
    };
    StoreImp.prototype.setClickOverlayInfo = function (info, processOnSelectedEvent, processOnDeselectedEvent) {
        var _a = this._clickOverlayInfo, paneId = _a.paneId, overlay = _a.overlay, figureType = _a.figureType, figure = _a.figure, figureIndex = _a.figureIndex;
        var infoOverlay = info.overlay;
        if ((overlay === null || overlay === void 0 ? void 0 : overlay.id) !== (infoOverlay === null || infoOverlay === void 0 ? void 0 : infoOverlay.id) || figureType !== info.figureType || figureIndex !== info.figureIndex) {
            this._clickOverlayInfo = info;
            if ((overlay === null || overlay === void 0 ? void 0 : overlay.id) !== (infoOverlay === null || infoOverlay === void 0 ? void 0 : infoOverlay.id)) {
                if ((0, typeChecks_1.isValid)(overlay)) {
                    processOnDeselectedEvent(overlay, figure);
                }
                if ((0, typeChecks_1.isValid)(infoOverlay)) {
                    processOnSelectedEvent(infoOverlay, info.figure);
                }
                this._chart.updatePane(1 /* UpdateLevel.Overlay */, info.paneId);
                if (paneId !== info.paneId) {
                    this._chart.updatePane(1 /* UpdateLevel.Overlay */, paneId);
                }
                this._chart.updatePane(1 /* UpdateLevel.Overlay */, types_1.PaneIdConstants.X_AXIS);
            }
        }
    };
    StoreImp.prototype.getClickOverlayInfo = function () {
        return this._clickOverlayInfo;
    };
    StoreImp.prototype.isOverlayEmpty = function () {
        return this._overlays.size === 0 && this._progressOverlayInfo === null;
    };
    StoreImp.prototype.isOverlayDrawing = function () {
        var _a, _b;
        return (_b = (_a = this._progressOverlayInfo) === null || _a === void 0 ? void 0 : _a.overlay.isDrawing()) !== null && _b !== void 0 ? _b : false;
    };
    StoreImp.prototype._clearLastPriceMarkExtendTextUpdateTimer = function () {
        this._lastPriceMarkExtendTextUpdateTimers.forEach(function (timer) {
            clearInterval(timer);
        });
        this._lastPriceMarkExtendTextUpdateTimers = [];
    };
    StoreImp.prototype._clearData = function () {
        this._dataLoadMore.backward = false;
        this._dataLoadMore.forward = false;
        this._loading = false;
        this._dataList = [];
        this._visibleRangeDataList = [];
        this._visibleRangeHighLowPrice = [
            { x: 0, price: Number.MIN_SAFE_INTEGER },
            { x: 0, price: Number.MAX_SAFE_INTEGER }
        ];
        this._visibleRange = (0, VisibleRange_1.getDefaultVisibleRange)();
        this._crosshair = {};
    };
    StoreImp.prototype.getChart = function () {
        return this._chart;
    };
    StoreImp.prototype.destroy = function () {
        this._clearData();
        this._clearLastPriceMarkExtendTextUpdateTimer();
        this._taskScheduler.removeTask();
        this._overlays.clear();
        this._indicators.clear();
        this._actions.clear();
    };
    return StoreImp;
}());
exports.default = StoreImp;
//# sourceMappingURL=Store.js.map