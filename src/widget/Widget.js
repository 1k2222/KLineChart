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
var Bounding_1 = require("../common/Bounding");
var Eventful_1 = __importDefault(require("../common/Eventful"));
var typeChecks_1 = require("../common/utils/typeChecks");
var Widget = /** @class */ (function (_super) {
    __extends(Widget, _super);
    function Widget(rootContainer, pane) {
        var _this = _super.call(this) || this;
        _this._bounding = (0, Bounding_1.createDefaultBounding)();
        _this._cursor = 'crosshair';
        _this._forceCursor = null;
        _this._pane = pane;
        _this._rootContainer = rootContainer;
        _this._container = _this.createContainer();
        rootContainer.appendChild(_this._container);
        return _this;
    }
    Widget.prototype.setBounding = function (bounding) {
        (0, typeChecks_1.merge)(this._bounding, bounding);
        return this;
    };
    Widget.prototype.getContainer = function () { return this._container; };
    Widget.prototype.getBounding = function () {
        return this._bounding;
    };
    Widget.prototype.getPane = function () {
        return this._pane;
    };
    Widget.prototype.checkEventOn = function (_) {
        return true;
    };
    Widget.prototype.setCursor = function (cursor) {
        if (!(0, typeChecks_1.isString)(this._forceCursor)) {
            if (cursor !== this._cursor) {
                this._cursor = cursor;
                this._container.style.cursor = this._cursor;
            }
        }
    };
    Widget.prototype.setForceCursor = function (cursor) {
        var _a;
        if (cursor !== this._forceCursor) {
            this._forceCursor = cursor;
            this._container.style.cursor = (_a = this._forceCursor) !== null && _a !== void 0 ? _a : this._cursor;
        }
    };
    Widget.prototype.getForceCursor = function () {
        return this._forceCursor;
    };
    Widget.prototype.update = function (level) {
        this.updateImp(this._container, this._bounding, level !== null && level !== void 0 ? level : 3 /* UpdateLevel.Drawer */);
    };
    Widget.prototype.destroy = function () {
        this._rootContainer.removeChild(this._container);
    };
    return Widget;
}(Eventful_1.default));
exports.default = Widget;
//# sourceMappingURL=Widget.js.map