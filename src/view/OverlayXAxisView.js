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
var OverlayYAxisView_1 = __importDefault(require("./OverlayYAxisView"));
var OverlayXAxisView = /** @class */ (function (_super) {
    __extends(OverlayXAxisView, _super);
    function OverlayXAxisView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OverlayXAxisView.prototype.coordinateToPointTimestampDataIndexFlag = function () {
        return true;
    };
    OverlayXAxisView.prototype.coordinateToPointValueFlag = function () {
        return false;
    };
    OverlayXAxisView.prototype.getCompleteOverlays = function () {
        return this.getWidget().getPane().getChart().getChartStore().getOverlaysByPaneId();
    };
    OverlayXAxisView.prototype.getProgressOverlay = function () {
        var _a, _b;
        return (_b = (_a = this.getWidget().getPane().getChart().getChartStore().getProgressOverlayInfo()) === null || _a === void 0 ? void 0 : _a.overlay) !== null && _b !== void 0 ? _b : null;
    };
    OverlayXAxisView.prototype.getDefaultFigures = function (overlay, coordinates) {
        var _a;
        var figures = [];
        var widget = this.getWidget();
        var pane = widget.getPane();
        var chartStore = pane.getChart().getChartStore();
        var clickOverlayInfo = chartStore.getClickOverlayInfo();
        if (overlay.needDefaultXAxisFigure && overlay.id === ((_a = clickOverlayInfo.overlay) === null || _a === void 0 ? void 0 : _a.id)) {
            var leftX_1 = Number.MAX_SAFE_INTEGER;
            var rightX_1 = Number.MIN_SAFE_INTEGER;
            coordinates.forEach(function (coordinate, index) {
                leftX_1 = Math.min(leftX_1, coordinate.x);
                rightX_1 = Math.max(rightX_1, coordinate.x);
                var point = overlay.points[index];
                if ((0, typeChecks_1.isNumber)(point.timestamp)) {
                    var text = chartStore.getInnerFormatter().formatDate(point.timestamp, 'YYYY-MM-DD HH:mm', 'crosshair');
                    figures.push({ type: 'text', attrs: { x: coordinate.x, y: 0, text: text, align: 'center' }, ignoreEvent: true });
                }
            });
            if (coordinates.length > 1) {
                figures.unshift({ type: 'rect', attrs: { x: leftX_1, y: 0, width: rightX_1 - leftX_1, height: widget.getBounding().height }, ignoreEvent: true });
            }
        }
        return figures;
    };
    OverlayXAxisView.prototype.getFigures = function (o, coordinates) {
        var _a, _b;
        var widget = this.getWidget();
        var pane = widget.getPane();
        var chart = pane.getChart();
        var yAxis = pane.getAxisComponent();
        var xAxis = chart.getXAxisPane().getAxisComponent();
        var bounding = widget.getBounding();
        return (_b = (_a = o.createXAxisFigures) === null || _a === void 0 ? void 0 : _a.call(o, { chart: chart, overlay: o, coordinates: coordinates, bounding: bounding, xAxis: xAxis, yAxis: yAxis })) !== null && _b !== void 0 ? _b : [];
    };
    return OverlayXAxisView;
}(OverlayYAxisView_1.default));
exports.default = OverlayXAxisView;
//# sourceMappingURL=OverlayXAxisView.js.map