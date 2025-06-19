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
function getDefaultAxisRange() {
    return {
        from: 0,
        to: 0,
        range: 0,
        realFrom: 0,
        realTo: 0,
        realRange: 0,
        displayFrom: 0,
        displayTo: 0,
        displayRange: 0
    };
}
var AxisImp = /** @class */ (function () {
    function AxisImp(parent) {
        this.scrollZoomEnabled = true;
        this._range = getDefaultAxisRange();
        this._prevRange = getDefaultAxisRange();
        this._ticks = [];
        this._autoCalcTickFlag = true;
        this._parent = parent;
    }
    AxisImp.prototype.getParent = function () { return this._parent; };
    AxisImp.prototype.buildTicks = function (force) {
        if (this._autoCalcTickFlag) {
            this._range = this.createRangeImp();
        }
        if (this._prevRange.from !== this._range.from || this._prevRange.to !== this._range.to || force) {
            this._prevRange = this._range;
            this._ticks = this.createTicksImp();
            return true;
        }
        return false;
    };
    AxisImp.prototype.getTicks = function () {
        return this._ticks;
    };
    AxisImp.prototype.setRange = function (range) {
        this._autoCalcTickFlag = false;
        this._range = range;
    };
    AxisImp.prototype.getRange = function () { return this._range; };
    AxisImp.prototype.setAutoCalcTickFlag = function (flag) {
        this._autoCalcTickFlag = flag;
    };
    AxisImp.prototype.getAutoCalcTickFlag = function () { return this._autoCalcTickFlag; };
    return AxisImp;
}());
exports.default = AxisImp;
//# sourceMappingURL=Axis.js.map