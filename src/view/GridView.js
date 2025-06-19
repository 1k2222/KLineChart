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
var GridView = /** @class */ (function (_super) {
    __extends(GridView, _super);
    function GridView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GridView.prototype.drawImp = function (ctx) {
        var _a, _b;
        var widget = this.getWidget();
        var pane = this.getWidget().getPane();
        var chart = pane.getChart();
        var bounding = widget.getBounding();
        var styles = chart.getStyles().grid;
        var show = styles.show;
        if (show) {
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            var horizontalStyles = styles.horizontal;
            var horizontalShow = horizontalStyles.show;
            if (horizontalShow) {
                var yAxis = pane.getAxisComponent();
                var attrs = yAxis.getTicks().map(function (tick) { return ({
                    coordinates: [
                        { x: 0, y: tick.coord },
                        { x: bounding.width, y: tick.coord }
                    ]
                }); });
                (_a = this.createFigure({
                    name: 'line',
                    attrs: attrs,
                    styles: horizontalStyles
                })) === null || _a === void 0 ? void 0 : _a.draw(ctx);
            }
            var verticalStyles = styles.vertical;
            var verticalShow = verticalStyles.show;
            if (verticalShow) {
                var xAxis = chart.getXAxisPane().getAxisComponent();
                var attrs = xAxis.getTicks().map(function (tick) { return ({
                    coordinates: [
                        { x: tick.coord, y: 0 },
                        { x: tick.coord, y: bounding.height }
                    ]
                }); });
                (_b = this.createFigure({
                    name: 'line',
                    attrs: attrs,
                    styles: verticalStyles
                })) === null || _b === void 0 ? void 0 : _b.draw(ctx);
            }
            ctx.restore();
        }
    };
    return GridView;
}(View_1.default));
exports.default = GridView;
//# sourceMappingURL=GridView.js.map