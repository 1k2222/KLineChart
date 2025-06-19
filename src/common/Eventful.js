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
var typeChecks_1 = require("./utils/typeChecks");
var Eventful = /** @class */ (function () {
    function Eventful() {
        this._children = [];
        this._callbacks = new Map();
    }
    Eventful.prototype.registerEvent = function (name, callback) {
        this._callbacks.set(name, callback);
        return this;
    };
    Eventful.prototype.onEvent = function (name, event) {
        var callback = this._callbacks.get(name);
        if ((0, typeChecks_1.isValid)(callback) && this.checkEventOn(event)) {
            return callback(event);
        }
        return false;
    };
    Eventful.prototype.dispatchEventToChildren = function (name, event) {
        var start = this._children.length - 1;
        if (start > -1) {
            for (var i = start; i > -1; i--) {
                if (this._children[i].dispatchEvent(name, event)) {
                    return true;
                }
            }
        }
        return false;
    };
    Eventful.prototype.dispatchEvent = function (name, event) {
        if (this.dispatchEventToChildren(name, event)) {
            return true;
        }
        return this.onEvent(name, event);
    };
    Eventful.prototype.addChild = function (eventful) {
        this._children.push(eventful);
        return this;
    };
    Eventful.prototype.clear = function () {
        this._children = [];
    };
    return Eventful;
}());
exports.default = Eventful;
//# sourceMappingURL=Eventful.js.map