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
Object.defineProperty(exports, "__esModule", { value: true });
var Bounding_1 = require("../common/Bounding");
var dom_1 = require("../common/utils/dom");
var typeChecks_1 = require("../common/utils/typeChecks");
var Pane = /** @class */ (function () {
    function Pane(chart, id) {
        this._bounding = (0, Bounding_1.createDefaultBounding)();
        this._originalBounding = (0, Bounding_1.createDefaultBounding)();
        this._visible = true;
        this._chart = chart;
        this._id = id;
        this._container = (0, dom_1.createDom)('div', {
            width: '100%',
            margin: '0',
            padding: '0',
            position: 'relative',
            overflow: 'hidden',
            boxSizing: 'border-box'
        });
    }
    Pane.prototype.getContainer = function () {
        return this._container;
    };
    Pane.prototype.setVisible = function (visible) {
        if (this._visible !== visible) {
            this._container.style.display = visible ? 'block' : 'none';
            this._visible = visible;
        }
    };
    Pane.prototype.getVisible = function () {
        return this._visible;
    };
    Pane.prototype.getId = function () {
        return this._id;
    };
    Pane.prototype.getChart = function () {
        return this._chart;
    };
    Pane.prototype.getBounding = function () {
        return this._bounding;
    };
    Pane.prototype.setOriginalBounding = function (bounding) {
        (0, typeChecks_1.merge)(this._originalBounding, bounding);
    };
    Pane.prototype.getOriginalBounding = function () {
        return this._originalBounding;
    };
    Pane.prototype.update = function (level) {
        if (this._bounding.height !== this._container.clientHeight) {
            this._container.style.height = "".concat(this._bounding.height, "px");
        }
        this.updateImp(level !== null && level !== void 0 ? level : 3 /* UpdateLevel.Drawer */, this._container, this._bounding);
    };
    return Pane;
}());
exports.default = Pane;
//# sourceMappingURL=Pane.js.map