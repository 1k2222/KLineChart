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
exports.generateTaskId = generateTaskId;
var compatible_1 = require("./utils/compatible");
var typeChecks_1 = require("./utils/typeChecks");
function generateTaskId() {
    var params = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        params[_i] = arguments[_i];
    }
    return params.join('_');
}
var TaskScheduler = /** @class */ (function () {
    function TaskScheduler(tasks) {
        this._requestIdleCallbackId = compatible_1.DEFAULT_REQUEST_ID;
        this._tasks = tasks !== null && tasks !== void 0 ? tasks : [];
        this._operateTasks();
    }
    TaskScheduler.prototype._operateTasks = function (fn) {
        var _this = this;
        if (this._requestIdleCallbackId !== compatible_1.DEFAULT_REQUEST_ID) {
            (0, compatible_1.cancelIdleCallback)(this._requestIdleCallbackId);
            this._requestIdleCallbackId = compatible_1.DEFAULT_REQUEST_ID;
        }
        fn === null || fn === void 0 ? void 0 : fn();
        this._requestIdleCallbackId = (0, compatible_1.requestIdleCallback)(function (deadline) { _this._runTasks(deadline); });
    };
    TaskScheduler.prototype._runTasks = function (deadline) {
        var _this = this;
        while (deadline.timeRemaining() > 0 && this._tasks.length > 0) {
            var task = this._tasks.shift();
            task === null || task === void 0 ? void 0 : task.handler();
        }
        if (this._tasks.length > 0) {
            this._requestIdleCallbackId = (0, compatible_1.requestIdleCallback)(function (deadline) { _this._runTasks(deadline); });
        }
    };
    TaskScheduler.prototype.addTask = function (task) {
        var _this = this;
        this._operateTasks(function () {
            var index = _this._tasks.findIndex(function (t) { return t.id === task.id; });
            if (index > -1) {
                _this._tasks[index] = task;
            }
            else {
                _this._tasks.push(task);
            }
        });
        return this;
    };
    TaskScheduler.prototype.removeTask = function (id) {
        var _this = this;
        if ((0, typeChecks_1.isValid)(id)) {
            this._operateTasks(function () {
                if ((0, typeChecks_1.isValid)(id)) {
                    var index = _this._tasks.findIndex(function (t) { return t.id === id; });
                    if (index > -1) {
                        _this._tasks.splice(index, 1);
                    }
                }
                else {
                    _this._tasks = [];
                }
            });
        }
        return this;
    };
    return TaskScheduler;
}());
exports.default = TaskScheduler;
//# sourceMappingURL=TaskScheduler.js.map