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
var dom_1 = require("../common/utils/dom");
var canvas_1 = require("../common/utils/canvas");
var Pane_1 = __importDefault(require("./Pane"));
var SeparatorWidget_1 = __importDefault(require("../widget/SeparatorWidget"));
var SeparatorPane = /** @class */ (function (_super) {
    __extends(SeparatorPane, _super);
    function SeparatorPane(chart, id, topPane, bottomPane) {
        var _this = _super.call(this, chart, id) || this;
        _this.getContainer().style.overflow = '';
        _this._topPane = topPane;
        _this._bottomPane = bottomPane;
        _this._separatorWidget = new SeparatorWidget_1.default(_this.getContainer(), _this);
        return _this;
    }
    SeparatorPane.prototype.setBounding = function (rootBounding) {
        (0, typeChecks_1.merge)(this.getBounding(), rootBounding);
        return this;
    };
    SeparatorPane.prototype.getTopPane = function () {
        return this._topPane;
    };
    SeparatorPane.prototype.setTopPane = function (pane) {
        this._topPane = pane;
        return this;
    };
    SeparatorPane.prototype.getBottomPane = function () {
        return this._bottomPane;
    };
    SeparatorPane.prototype.setBottomPane = function (pane) {
        this._bottomPane = pane;
        return this;
    };
    SeparatorPane.prototype.getWidget = function () { return this._separatorWidget; };
    SeparatorPane.prototype.getImage = function (_includeOverlay) {
        var _a = this.getBounding(), width = _a.width, height = _a.height;
        var styles = this.getChart().getStyles().separator;
        var canvas = (0, dom_1.createDom)('canvas', {
            width: "".concat(width, "px"),
            height: "".concat(height, "px"),
            boxSizing: 'border-box'
        });
        var ctx = canvas.getContext('2d');
        var pixelRatio = (0, canvas_1.getPixelRatio)(canvas);
        canvas.width = width * pixelRatio;
        canvas.height = height * pixelRatio;
        ctx.scale(pixelRatio, pixelRatio);
        ctx.fillStyle = styles.color;
        ctx.fillRect(0, 0, width, height);
        return canvas;
    };
    SeparatorPane.prototype.updateImp = function (level, container, bounding) {
        if (level === 4 /* UpdateLevel.All */ || level === 2 /* UpdateLevel.Separator */) {
            var styles = this.getChart().getStyles().separator;
            container.style.backgroundColor = styles.color;
            container.style.height = "".concat(bounding.height, "px");
            container.style.marginLeft = "".concat(bounding.left, "px");
            container.style.width = "".concat(bounding.width, "px");
            this._separatorWidget.update(level);
        }
    };
    return SeparatorPane;
}(Pane_1.default));
exports.default = SeparatorPane;
//# sourceMappingURL=SeparatorPane.js.map