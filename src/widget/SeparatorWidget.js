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
var dom_1 = require("../common/utils/dom");
var performance_1 = require("../common/utils/performance");
var typeChecks_1 = require("../common/utils/typeChecks");
var Widget_1 = __importDefault(require("./Widget"));
var types_1 = require("./types");
var SeparatorWidget = /** @class */ (function (_super) {
    __extends(SeparatorWidget, _super);
    function SeparatorWidget(rootContainer, pane) {
        var _this = _super.call(this, rootContainer, pane) || this;
        _this._dragFlag = false;
        _this._dragStartY = 0;
        _this._topPaneHeight = 0;
        _this._bottomPaneHeight = 0;
        _this._topPane = null;
        _this._bottomPane = null;
        // eslint-disable-next-line @typescript-eslint/unbound-method -- ignore
        _this._pressedMouseMoveEvent = (0, performance_1.throttle)(_this._pressedTouchMouseMoveEvent, 20);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- ignore
        _this.registerEvent('touchStartEvent', _this._mouseDownEvent.bind(_this))
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- ignore
            .registerEvent('touchMoveEvent', _this._pressedMouseMoveEvent.bind(_this))
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- ignore
            .registerEvent('touchEndEvent', _this._mouseUpEvent.bind(_this))
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- ignore
            .registerEvent('mouseDownEvent', _this._mouseDownEvent.bind(_this))
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- ignore
            .registerEvent('mouseUpEvent', _this._mouseUpEvent.bind(_this))
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- ignore
            .registerEvent('pressedMouseMoveEvent', _this._pressedMouseMoveEvent.bind(_this))
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- ignore
            .registerEvent('mouseEnterEvent', _this._mouseEnterEvent.bind(_this))
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- ignore
            .registerEvent('mouseLeaveEvent', _this._mouseLeaveEvent.bind(_this));
        return _this;
    }
    SeparatorWidget.prototype.getName = function () {
        return types_1.WidgetNameConstants.SEPARATOR;
    };
    SeparatorWidget.prototype._mouseDownEvent = function (event) {
        var _this = this;
        this._dragFlag = true;
        this._dragStartY = event.pageY;
        var pane = this.getPane();
        var chart = pane.getChart();
        this._topPane = pane.getTopPane();
        this._bottomPane = pane.getBottomPane();
        var drawPanes = chart.getDrawPanes();
        if (this._topPane.getOptions().state === 'minimize') {
            var index = drawPanes.findIndex(function (pane) { var _a; return pane.getId() === ((_a = _this._topPane) === null || _a === void 0 ? void 0 : _a.getId()); });
            for (var i = index - 1; i > -1; i--) {
                var pane_1 = drawPanes[i];
                if (pane_1.getOptions().state !== 'minimize') {
                    this._topPane = pane_1;
                    break;
                }
            }
        }
        if (this._bottomPane.getOptions().state === 'minimize') {
            var index = drawPanes.findIndex(function (pane) { var _a; return pane.getId() === ((_a = _this._bottomPane) === null || _a === void 0 ? void 0 : _a.getId()); });
            for (var i = index + 1; i < drawPanes.length; i++) {
                var pane_2 = drawPanes[i];
                if (pane_2.getOptions().state !== 'minimize') {
                    this._bottomPane = pane_2;
                    break;
                }
            }
        }
        this._topPaneHeight = this._topPane.getBounding().height;
        this._bottomPaneHeight = this._bottomPane.getBounding().height;
        return true;
    };
    SeparatorWidget.prototype._mouseUpEvent = function () {
        this._dragFlag = false;
        this._topPane = null;
        this._bottomPane = null;
        this._topPaneHeight = 0;
        this._bottomPaneHeight = 0;
        return this._mouseLeaveEvent();
    };
    SeparatorWidget.prototype._pressedTouchMouseMoveEvent = function (event) {
        var dragDistance = event.pageY - this._dragStartY;
        var isUpDrag = dragDistance < 0;
        if ((0, typeChecks_1.isValid)(this._topPane) && (0, typeChecks_1.isValid)(this._bottomPane)) {
            var bottomPaneOptions = this._bottomPane.getOptions();
            if (this._topPane.getOptions().state !== 'minimize' &&
                bottomPaneOptions.state !== 'minimize' &&
                bottomPaneOptions.dragEnabled) {
                var reducedPane = null;
                var increasedPane = null;
                var startDragReducedPaneHeight = 0;
                var startDragIncreasedPaneHeight = 0;
                if (isUpDrag) {
                    reducedPane = this._topPane;
                    increasedPane = this._bottomPane;
                    startDragReducedPaneHeight = this._topPaneHeight;
                    startDragIncreasedPaneHeight = this._bottomPaneHeight;
                }
                else {
                    reducedPane = this._bottomPane;
                    increasedPane = this._topPane;
                    startDragReducedPaneHeight = this._bottomPaneHeight;
                    startDragIncreasedPaneHeight = this._topPaneHeight;
                }
                var reducedPaneMinHeight = reducedPane.getOptions().minHeight;
                if (startDragReducedPaneHeight > reducedPaneMinHeight) {
                    var reducedPaneHeight = Math.max(startDragReducedPaneHeight - Math.abs(dragDistance), reducedPaneMinHeight);
                    var diffHeight = startDragReducedPaneHeight - reducedPaneHeight;
                    reducedPane.setBounding({ height: reducedPaneHeight });
                    increasedPane.setBounding({ height: startDragIncreasedPaneHeight + diffHeight });
                    var currentPane = this.getPane();
                    var chart = currentPane.getChart();
                    chart.getChartStore().executeAction('onPaneDrag', { paneId: currentPane.getId() });
                    chart.layout({
                        measureHeight: true,
                        measureWidth: true,
                        update: true,
                        buildYAxisTick: true,
                        forceBuildYAxisTick: true
                    });
                }
            }
        }
        return true;
    };
    SeparatorWidget.prototype._mouseEnterEvent = function () {
        var pane = this.getPane();
        var bottomPane = pane.getBottomPane();
        if (bottomPane.getOptions().dragEnabled) {
            var chart = pane.getChart();
            var styles = chart.getStyles().separator;
            this.getContainer().style.background = styles.activeBackgroundColor;
            return true;
        }
        return false;
    };
    SeparatorWidget.prototype._mouseLeaveEvent = function () {
        if (!this._dragFlag) {
            this.getContainer().style.background = 'transparent';
            return true;
        }
        return false;
    };
    SeparatorWidget.prototype.createContainer = function () {
        return (0, dom_1.createDom)('div', {
            width: '100%',
            height: "".concat(types_1.REAL_SEPARATOR_HEIGHT, "px"),
            margin: '0',
            padding: '0',
            position: 'absolute',
            top: '-3px',
            zIndex: '20',
            boxSizing: 'border-box',
            cursor: 'ns-resize'
        });
    };
    SeparatorWidget.prototype.updateImp = function (container, _bounding, level) {
        if (level === 4 /* UpdateLevel.All */ || level === 2 /* UpdateLevel.Separator */) {
            var styles = this.getPane().getChart().getStyles().separator;
            container.style.top = "".concat(-Math.floor((types_1.REAL_SEPARATOR_HEIGHT - styles.size) / 2), "px");
            container.style.height = "".concat(types_1.REAL_SEPARATOR_HEIGHT, "px");
        }
    };
    return SeparatorWidget;
}(Widget_1.default));
exports.default = SeparatorWidget;
//# sourceMappingURL=SeparatorWidget.js.map