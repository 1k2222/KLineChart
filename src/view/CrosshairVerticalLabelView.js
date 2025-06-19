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
var CrosshairHorizontalLabelView_1 = __importDefault(require("./CrosshairHorizontalLabelView"));
var Period_1 = require("../common/Period");
var CrosshairVerticalLabelView = /** @class */ (function (_super) {
    __extends(CrosshairVerticalLabelView, _super);
    function CrosshairVerticalLabelView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CrosshairVerticalLabelView.prototype.compare = function (crosshair) {
        return (0, typeChecks_1.isValid)(crosshair.timestamp);
    };
    CrosshairVerticalLabelView.prototype.getDirectionStyles = function (styles) {
        return styles.vertical;
    };
    CrosshairVerticalLabelView.prototype.getText = function (crosshair, chartStore) {
        var _a, _b;
        var timestamp = crosshair.timestamp;
        return chartStore.getInnerFormatter().formatDate(timestamp, Period_1.PeriodTypeCrosshairTooltipFormat[(_b = (_a = chartStore.getPeriod()) === null || _a === void 0 ? void 0 : _a.type) !== null && _b !== void 0 ? _b : 'day'], 'crosshair');
    };
    CrosshairVerticalLabelView.prototype.getTextAttrs = function (text, textWidth, crosshair, bounding, _axis, styles) {
        var x = crosshair.realX;
        var optimalX = 0;
        var align = 'center';
        if (x - textWidth / 2 - styles.paddingLeft < 0) {
            optimalX = 0;
            align = 'left';
        }
        else if (x + textWidth / 2 + styles.paddingRight > bounding.width) {
            optimalX = bounding.width;
            align = 'right';
        }
        else {
            optimalX = x;
        }
        return { x: optimalX, y: 0, text: text, align: align, baseline: 'top' };
    };
    return CrosshairVerticalLabelView;
}(CrosshairHorizontalLabelView_1.default));
exports.default = CrosshairVerticalLabelView;
//# sourceMappingURL=CrosshairVerticalLabelView.js.map