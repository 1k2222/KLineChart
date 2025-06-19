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
var AxisView_1 = __importDefault(require("./AxisView"));
var YAxisView = /** @class */ (function (_super) {
    __extends(YAxisView, _super);
    function YAxisView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    YAxisView.prototype.getAxisStyles = function (styles) {
        return styles.yAxis;
    };
    YAxisView.prototype.createAxisLine = function (bounding, styles) {
        var yAxis = this.getWidget().getPane().getAxisComponent();
        var size = styles.axisLine.size;
        var x = 0;
        if (yAxis.isFromZero()) {
            x = 0;
        }
        else {
            x = bounding.width - size;
        }
        return {
            coordinates: [
                { x: x, y: 0 },
                { x: x, y: bounding.height }
            ]
        };
    };
    YAxisView.prototype.createTickLines = function (ticks, bounding, styles) {
        var yAxis = this.getWidget().getPane().getAxisComponent();
        var axisLineStyles = styles.axisLine;
        var tickLineStyles = styles.tickLine;
        var startX = 0;
        var endX = 0;
        if (yAxis.isFromZero()) {
            startX = 0;
            if (axisLineStyles.show) {
                startX += axisLineStyles.size;
            }
            endX = startX + tickLineStyles.length;
        }
        else {
            startX = bounding.width;
            if (axisLineStyles.show) {
                startX -= axisLineStyles.size;
            }
            endX = startX - tickLineStyles.length;
        }
        return ticks.map(function (tick) { return ({
            coordinates: [
                { x: startX, y: tick.coord },
                { x: endX, y: tick.coord }
            ]
        }); });
    };
    YAxisView.prototype.createTickTexts = function (ticks, bounding, styles) {
        var yAxis = this.getWidget().getPane().getAxisComponent();
        var axisLineStyles = styles.axisLine;
        var tickLineStyles = styles.tickLine;
        var tickTextStyles = styles.tickText;
        var x = 0;
        if (yAxis.isFromZero()) {
            x = tickTextStyles.marginStart;
            if (axisLineStyles.show) {
                x += axisLineStyles.size;
            }
            if (tickLineStyles.show) {
                x += tickLineStyles.length;
            }
        }
        else {
            x = bounding.width - tickTextStyles.marginEnd;
            if (axisLineStyles.show) {
                x -= axisLineStyles.size;
            }
            if (tickLineStyles.show) {
                x -= tickLineStyles.length;
            }
        }
        var textAlign = this.getWidget().getPane().getAxisComponent().isFromZero() ? 'left' : 'right';
        return ticks.map(function (tick) { return ({
            x: x,
            y: tick.coord,
            text: tick.text,
            align: textAlign,
            baseline: 'middle'
        }); });
    };
    return YAxisView;
}(AxisView_1.default));
exports.default = YAxisView;
//# sourceMappingURL=YAxisView.js.map