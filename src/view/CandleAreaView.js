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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Animation_1 = __importDefault(require("../common/Animation"));
var typeChecks_1 = require("../common/utils/typeChecks");
var ChildrenView_1 = __importDefault(require("./ChildrenView"));
var line_1 = require("../extension/figure/line");
var CandleAreaView = /** @class */ (function (_super) {
    __extends(CandleAreaView, _super);
    function CandleAreaView() {
        var _this = _super.apply(this, __spreadArray([], __read(arguments), false)) || this;
        _this._ripplePoint = _this.createFigure({
            name: 'circle',
            attrs: {
                x: 0,
                y: 0,
                r: 0
            },
            styles: {
                style: 'fill'
            }
        });
        _this._animationFrameTime = 0;
        _this._animation = new Animation_1.default({ iterationCount: Infinity }).doFrame(function (time) {
            _this._animationFrameTime = time;
            var pane = _this.getWidget().getPane();
            pane.getChart().updatePane(0 /* UpdateLevel.Main */, pane.getId());
        });
        return _this;
    }
    CandleAreaView.prototype.drawImp = function (ctx) {
        var _a, _b, _c;
        var widget = this.getWidget();
        var pane = widget.getPane();
        var chart = pane.getChart();
        var dataList = chart.getDataList();
        var lastDataIndex = dataList.length - 1;
        var bounding = widget.getBounding();
        var yAxis = pane.getAxisComponent();
        var styles = chart.getStyles().candle.area;
        var coordinates = [];
        var minY = Number.MAX_SAFE_INTEGER;
        var areaStartX = Number.MIN_SAFE_INTEGER;
        var ripplePointCoordinate = null;
        this.eachChildren(function (data) {
            var x = data.x;
            var kLineData = data.data.current;
            var value = kLineData === null || kLineData === void 0 ? void 0 : kLineData[styles.value];
            if ((0, typeChecks_1.isNumber)(value)) {
                var y = yAxis.convertToPixel(value);
                if (areaStartX === Number.MIN_SAFE_INTEGER) {
                    areaStartX = x;
                }
                coordinates.push({ x: x, y: y });
                minY = Math.min(minY, y);
                if (data.dataIndex === lastDataIndex) {
                    ripplePointCoordinate = { x: x, y: y };
                }
            }
        });
        if (coordinates.length > 0) {
            (_a = this.createFigure({
                name: 'line',
                attrs: { coordinates: coordinates },
                styles: {
                    color: styles.lineColor,
                    size: styles.lineSize,
                    smooth: styles.smooth
                }
            })) === null || _a === void 0 ? void 0 : _a.draw(ctx);
            // render area
            var backgroundColor = styles.backgroundColor;
            var color = '';
            if ((0, typeChecks_1.isArray)(backgroundColor)) {
                var gradient_1 = ctx.createLinearGradient(0, bounding.height, 0, minY);
                try {
                    backgroundColor.forEach(function (_a) {
                        var offset = _a.offset, color = _a.color;
                        gradient_1.addColorStop(offset, color);
                    });
                }
                catch (e) {
                }
                color = gradient_1;
            }
            else {
                color = backgroundColor;
            }
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(areaStartX, bounding.height);
            ctx.lineTo(coordinates[0].x, coordinates[0].y);
            (0, line_1.lineTo)(ctx, coordinates, styles.smooth);
            ctx.lineTo(coordinates[coordinates.length - 1].x, bounding.height);
            ctx.closePath();
            ctx.fill();
        }
        var pointStyles = styles.point;
        if (pointStyles.show && (0, typeChecks_1.isValid)(ripplePointCoordinate)) {
            (_b = this.createFigure({
                name: 'circle',
                attrs: {
                    x: ripplePointCoordinate.x,
                    y: ripplePointCoordinate.y,
                    r: pointStyles.radius
                },
                styles: {
                    style: 'fill',
                    color: pointStyles.color
                }
            })) === null || _b === void 0 ? void 0 : _b.draw(ctx);
            var rippleRadius = pointStyles.rippleRadius;
            if (pointStyles.animation) {
                rippleRadius = pointStyles.radius + this._animationFrameTime / pointStyles.animationDuration * (pointStyles.rippleRadius - pointStyles.radius);
                this._animation.setDuration(pointStyles.animationDuration).start();
            }
            (_c = this._ripplePoint) === null || _c === void 0 ? void 0 : _c.setAttrs({
                x: ripplePointCoordinate.x,
                y: ripplePointCoordinate.y,
                r: rippleRadius
            }).setStyles({ style: 'fill', color: pointStyles.rippleColor }).draw(ctx);
        }
        else {
            this.stopAnimation();
        }
    };
    CandleAreaView.prototype.stopAnimation = function () {
        this._animation.stop();
    };
    return CandleAreaView;
}(ChildrenView_1.default));
exports.default = CandleAreaView;
//# sourceMappingURL=CandleAreaView.js.map