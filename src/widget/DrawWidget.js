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
var Canvas_1 = __importDefault(require("../common/Canvas"));
var Widget_1 = __importDefault(require("./Widget"));
var dom_1 = require("../common/utils/dom");
var canvas_1 = require("../common/utils/canvas");
var DrawWidget = /** @class */ (function (_super) {
    __extends(DrawWidget, _super);
    function DrawWidget(rootContainer, pane) {
        var _this = _super.call(this, rootContainer, pane) || this;
        _this._mainCanvas = new Canvas_1.default({
            position: 'absolute',
            top: '0',
            left: '0',
            zIndex: '2',
            boxSizing: 'border-box'
        }, function () {
            _this.updateMain(_this._mainCanvas.getContext());
        });
        _this._overlayCanvas = new Canvas_1.default({
            position: 'absolute',
            top: '0',
            left: '0',
            zIndex: '2',
            boxSizing: 'border-box'
        }, function () {
            _this.updateOverlay(_this._overlayCanvas.getContext());
        });
        var container = _this.getContainer();
        container.appendChild(_this._mainCanvas.getElement());
        container.appendChild(_this._overlayCanvas.getElement());
        return _this;
    }
    DrawWidget.prototype.createContainer = function () {
        return (0, dom_1.createDom)('div', {
            margin: '0',
            padding: '0',
            position: 'absolute',
            top: '0',
            overflow: 'hidden',
            boxSizing: 'border-box',
            zIndex: '1'
        });
    };
    DrawWidget.prototype.updateImp = function (container, bounding, level) {
        var width = bounding.width, height = bounding.height, left = bounding.left;
        container.style.left = "".concat(left, "px");
        var l = level;
        var w = container.clientWidth;
        var h = container.clientHeight;
        if (width !== w || height !== h) {
            container.style.width = "".concat(width, "px");
            container.style.height = "".concat(height, "px");
            l = 3 /* UpdateLevel.Drawer */;
        }
        switch (l) {
            case 0 /* UpdateLevel.Main */: {
                this._mainCanvas.update(width, height);
                break;
            }
            case 1 /* UpdateLevel.Overlay */: {
                this._overlayCanvas.update(width, height);
                break;
            }
            case 3 /* UpdateLevel.Drawer */:
            case 4 /* UpdateLevel.All */: {
                this._mainCanvas.update(width, height);
                this._overlayCanvas.update(width, height);
                break;
            }
            default: {
                break;
            }
        }
    };
    DrawWidget.prototype.destroy = function () {
        this._mainCanvas.destroy();
        this._overlayCanvas.destroy();
    };
    DrawWidget.prototype.getImage = function (includeOverlay) {
        var _a = this.getBounding(), width = _a.width, height = _a.height;
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
        ctx.drawImage(this._mainCanvas.getElement(), 0, 0, width, height);
        if (includeOverlay) {
            ctx.drawImage(this._overlayCanvas.getElement(), 0, 0, width, height);
        }
        return canvas;
    };
    return DrawWidget;
}(Widget_1.default));
exports.default = DrawWidget;
//# sourceMappingURL=DrawWidget.js.map