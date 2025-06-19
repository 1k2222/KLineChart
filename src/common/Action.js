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
var Action = /** @class */ (function () {
    function Action() {
        this._callbacks = [];
    }
    Action.prototype.subscribe = function (callback) {
        var index = this._callbacks.indexOf(callback);
        if (index < 0) {
            this._callbacks.push(callback);
        }
    };
    Action.prototype.unsubscribe = function (callback) {
        if ((0, typeChecks_1.isFunction)(callback)) {
            var index = this._callbacks.indexOf(callback);
            if (index > -1) {
                this._callbacks.splice(index, 1);
            }
        }
        else {
            this._callbacks = [];
        }
    };
    Action.prototype.execute = function (data) {
        this._callbacks.forEach(function (callback) {
            callback(data);
        });
    };
    Action.prototype.isEmpty = function () {
        return this._callbacks.length === 0;
    };
    return Action;
}());
exports.default = Action;
//# sourceMappingURL=Action.js.map