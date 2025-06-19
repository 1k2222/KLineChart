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
var format_1 = require("../common/utils/format");
var typeChecks_1 = require("../common/utils/typeChecks");
var OverlayView_1 = __importDefault(require("./OverlayView"));
var OverlayYAxisView = /** @class */ (function (_super) {
    __extends(OverlayYAxisView, _super);
    function OverlayYAxisView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OverlayYAxisView.prototype.coordinateToPointTimestampDataIndexFlag = function () {
        return false;
    };
    OverlayYAxisView.prototype.drawDefaultFigures = function (ctx, overlay, coordinates) {
        this.drawFigures(ctx, overlay, this.getDefaultFigures(overlay, coordinates));
    };
    OverlayYAxisView.prototype.getDefaultFigures = function (overlay, coordinates) {
        var _a;
        var widget = this.getWidget();
        var pane = widget.getPane();
        var chartStore = pane.getChart().getChartStore();
        var clickOverlayInfo = chartStore.getClickOverlayInfo();
        var figures = [];
        if (overlay.needDefaultYAxisFigure &&
            overlay.id === ((_a = clickOverlayInfo.overlay) === null || _a === void 0 ? void 0 : _a.id) &&
            clickOverlayInfo.paneId === pane.getId()) {
            var yAxis = pane.getAxisComponent();
            var bounding = widget.getBounding();
            var topY_1 = Number.MAX_SAFE_INTEGER;
            var bottomY_1 = Number.MIN_SAFE_INTEGER;
            var isFromZero = yAxis.isFromZero();
            var textAlign_1 = 'left';
            var x_1 = 0;
            if (isFromZero) {
                textAlign_1 = 'left';
                x_1 = 0;
            }
            else {
                textAlign_1 = 'right';
                x_1 = bounding.width;
            }
            var decimalFold_1 = chartStore.getDecimalFold();
            var thousandsSeparator_1 = chartStore.getThousandsSeparator();
            coordinates.forEach(function (coordinate, index) {
                var _a, _b;
                var point = overlay.points[index];
                if ((0, typeChecks_1.isNumber)(point.value)) {
                    topY_1 = Math.min(topY_1, coordinate.y);
                    bottomY_1 = Math.max(bottomY_1, coordinate.y);
                    var text = decimalFold_1.format(thousandsSeparator_1.format((0, format_1.formatPrecision)(point.value, (_b = (_a = chartStore.getSymbol()) === null || _a === void 0 ? void 0 : _a.pricePrecision) !== null && _b !== void 0 ? _b : 2)));
                    figures.push({ type: 'text', attrs: { x: x_1, y: coordinate.y, text: text, align: textAlign_1, baseline: 'middle' }, ignoreEvent: true });
                }
            });
            if (coordinates.length > 1) {
                figures.unshift({ type: 'rect', attrs: { x: 0, y: topY_1, width: bounding.width, height: bottomY_1 - topY_1 }, ignoreEvent: true });
            }
        }
        return figures;
    };
    OverlayYAxisView.prototype.getFigures = function (overlay, coordinates) {
        var _a, _b;
        var widget = this.getWidget();
        var pane = widget.getPane();
        var chart = pane.getChart();
        var yAxis = pane.getAxisComponent();
        var xAxis = chart.getXAxisPane().getAxisComponent();
        var bounding = widget.getBounding();
        return (_b = (_a = overlay.createYAxisFigures) === null || _a === void 0 ? void 0 : _a.call(overlay, { chart: chart, overlay: overlay, coordinates: coordinates, bounding: bounding, xAxis: xAxis, yAxis: yAxis })) !== null && _b !== void 0 ? _b : [];
    };
    return OverlayYAxisView;
}(OverlayView_1.default));
exports.default = OverlayYAxisView;
//# sourceMappingURL=OverlayYAxisView.js.map