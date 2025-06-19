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
var XAxisView = /** @class */ (function (_super) {
    __extends(XAxisView, _super);
    function XAxisView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    XAxisView.prototype.getAxisStyles = function (styles) {
        return styles.xAxis;
    };
    XAxisView.prototype.createAxisLine = function (bounding) {
        return {
            coordinates: [
                { x: 0, y: 0 },
                { x: bounding.width, y: 0 }
            ]
        };
    };
    XAxisView.prototype.createTickLines = function (ticks, _bounding, styles) {
        var tickLineStyles = styles.tickLine;
        var axisLineSize = styles.axisLine.size;
        return ticks.map(function (tick) { return ({
            coordinates: [
                { x: tick.coord, y: 0 },
                { x: tick.coord, y: axisLineSize + tickLineStyles.length }
            ]
        }); });
    };
    XAxisView.prototype.createTickTexts = function (ticks, _bounding, styles) {
        var tickTickStyles = styles.tickText;
        var axisLineSize = styles.axisLine.size;
        var tickLineLength = styles.tickLine.length;
        return ticks.map(function (tick) { return ({
            x: tick.coord,
            y: axisLineSize + tickLineLength + tickTickStyles.marginStart,
            text: tick.text,
            align: 'center',
            baseline: 'top'
        }); });
    };
    return XAxisView;
}(AxisView_1.default));
exports.default = XAxisView;
//# sourceMappingURL=XAxisView.js.map