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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var typeChecks_1 = require("../common/utils/typeChecks");
var Axis_1 = __importDefault(require("./Axis"));
var canvas_1 = require("../common/utils/canvas");
var Period_1 = require("../common/Period");
var XAxisImp = /** @class */ (function (_super) {
    __extends(XAxisImp, _super);
    function XAxisImp(parent, xAxis) {
        var _this = _super.call(this, parent) || this;
        _this.override(xAxis);
        return _this;
    }
    XAxisImp.prototype.override = function (xAxis) {
        var name = xAxis.name, scrollZoomEnabled = xAxis.scrollZoomEnabled, createTicks = xAxis.createTicks;
        if (!(0, typeChecks_1.isString)(this.name)) {
            this.name = name;
        }
        this.scrollZoomEnabled = scrollZoomEnabled !== null && scrollZoomEnabled !== void 0 ? scrollZoomEnabled : this.scrollZoomEnabled;
        this.createTicks = createTicks !== null && createTicks !== void 0 ? createTicks : this.createTicks;
    };
    XAxisImp.prototype.createRangeImp = function () {
        var chartStore = this.getParent().getChart().getChartStore();
        var visibleDataRange = chartStore.getVisibleRange();
        var realFrom = visibleDataRange.realFrom, realTo = visibleDataRange.realTo;
        var af = realFrom;
        var at = realTo;
        var diff = realTo - realFrom + 1;
        var range = {
            from: af,
            to: at,
            range: diff,
            realFrom: af,
            realTo: at,
            realRange: diff,
            displayFrom: af,
            displayTo: at,
            displayRange: diff
        };
        return range;
    };
    XAxisImp.prototype.createTicksImp = function () {
        var _a;
        var _b = this.getRange(), realFrom = _b.realFrom, realTo = _b.realTo, from = _b.from;
        var chartStore = this.getParent().getChart().getChartStore();
        var formatDate = chartStore.getInnerFormatter().formatDate;
        var period = chartStore.getPeriod();
        var ticks = [];
        var barSpace = chartStore.getBarSpace().bar;
        var textStyles = chartStore.getStyles().xAxis.tickText;
        var tickTextWidth = Math.max((0, canvas_1.calcTextWidth)('YYYY-MM-DD HH:mm:ss', textStyles.size, textStyles.weight, textStyles.family), this.getBounding().width / 8);
        var tickBetweenBarCount = Math.ceil(tickTextWidth / barSpace);
        if (tickBetweenBarCount % 2 !== 0) {
            tickBetweenBarCount += 1;
        }
        var startDataIndex = Math.floor(realFrom / tickBetweenBarCount) * tickBetweenBarCount;
        for (var i = startDataIndex; i < realTo; i += tickBetweenBarCount) {
            if (i >= from) {
                var timestamp = chartStore.dataIndexToTimestamp(i);
                if ((0, typeChecks_1.isNumber)(timestamp)) {
                    ticks.push({
                        coord: this.convertToPixel(i),
                        value: timestamp,
                        text: formatDate(timestamp, Period_1.PeriodTypeXAxisFormat[(_a = period === null || period === void 0 ? void 0 : period.type) !== null && _a !== void 0 ? _a : 'day'], 'xAxis')
                    });
                }
            }
        }
        if ((0, typeChecks_1.isFunction)(this.createTicks)) {
            return this.createTicks({
                range: this.getRange(),
                bounding: this.getBounding(),
                defaultTicks: ticks
            });
        }
        return ticks;
    };
    XAxisImp.prototype.getAutoSize = function () {
        var styles = this.getParent().getChart().getStyles();
        var xAxisStyles = styles.xAxis;
        var height = xAxisStyles.size;
        if (height !== 'auto') {
            return height;
        }
        var crosshairStyles = styles.crosshair;
        var xAxisHeight = 0;
        if (xAxisStyles.show) {
            if (xAxisStyles.axisLine.show) {
                xAxisHeight += xAxisStyles.axisLine.size;
            }
            if (xAxisStyles.tickLine.show) {
                xAxisHeight += xAxisStyles.tickLine.length;
            }
            if (xAxisStyles.tickText.show) {
                xAxisHeight += (xAxisStyles.tickText.marginStart + xAxisStyles.tickText.marginEnd + xAxisStyles.tickText.size);
            }
        }
        var crosshairVerticalTextHeight = 0;
        if (crosshairStyles.show &&
            crosshairStyles.vertical.show &&
            crosshairStyles.vertical.text.show) {
            crosshairVerticalTextHeight += (crosshairStyles.vertical.text.paddingTop +
                crosshairStyles.vertical.text.paddingBottom +
                crosshairStyles.vertical.text.borderSize * 2 +
                crosshairStyles.vertical.text.size);
        }
        return Math.max(xAxisHeight, crosshairVerticalTextHeight);
    };
    XAxisImp.prototype.getBounding = function () {
        return this.getParent().getMainWidget().getBounding();
    };
    XAxisImp.prototype.convertTimestampFromPixel = function (pixel) {
        var chartStore = this.getParent().getChart().getChartStore();
        var dataIndex = chartStore.coordinateToDataIndex(pixel);
        return chartStore.dataIndexToTimestamp(dataIndex);
    };
    XAxisImp.prototype.convertTimestampToPixel = function (timestamp) {
        var chartStore = this.getParent().getChart().getChartStore();
        var dataIndex = chartStore.timestampToDataIndex(timestamp);
        return chartStore.dataIndexToCoordinate(dataIndex);
    };
    XAxisImp.prototype.convertFromPixel = function (pixel) {
        return this.getParent().getChart().getChartStore().coordinateToDataIndex(pixel);
    };
    XAxisImp.prototype.convertToPixel = function (value) {
        return this.getParent().getChart().getChartStore().dataIndexToCoordinate(value);
    };
    XAxisImp.extend = function (template) {
        var Custom = /** @class */ (function (_super) {
            __extends(Custom, _super);
            function Custom(parent) {
                return _super.call(this, parent, template) || this;
            }
            return Custom;
        }(XAxisImp));
        return Custom;
    };
    return XAxisImp;
}(Axis_1.default));
exports.default = XAxisImp;
//# sourceMappingURL=XAxis.js.map