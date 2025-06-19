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
var View_1 = __importDefault(require("./View"));
var AxisView = /** @class */ (function (_super) {
    __extends(AxisView, _super);
    function AxisView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AxisView.prototype.drawImp = function (ctx, extend) {
        var _this = this;
        var _a, _b;
        var widget = this.getWidget();
        var pane = widget.getPane();
        var bounding = widget.getBounding();
        var axis = pane.getAxisComponent();
        var styles = this.getAxisStyles(pane.getChart().getStyles());
        if (styles.show) {
            if (styles.axisLine.show) {
                (_a = this.createFigure({
                    name: 'line',
                    attrs: this.createAxisLine(bounding, styles),
                    styles: styles.axisLine
                })) === null || _a === void 0 ? void 0 : _a.draw(ctx);
            }
            if (!extend[0]) {
                var ticks = axis.getTicks();
                if (styles.tickLine.show) {
                    var lines = this.createTickLines(ticks, bounding, styles);
                    lines.forEach(function (line) {
                        var _a;
                        (_a = _this.createFigure({
                            name: 'line',
                            attrs: line,
                            styles: styles.tickLine
                        })) === null || _a === void 0 ? void 0 : _a.draw(ctx);
                    });
                }
                if (styles.tickText.show) {
                    var texts = this.createTickTexts(ticks, bounding, styles);
                    (_b = this.createFigure({
                        name: 'text',
                        attrs: texts,
                        styles: styles.tickText
                    })) === null || _b === void 0 ? void 0 : _b.draw(ctx);
                }
            }
        }
    };
    return AxisView;
}(View_1.default));
exports.default = AxisView;
//# sourceMappingURL=AxisView.js.map