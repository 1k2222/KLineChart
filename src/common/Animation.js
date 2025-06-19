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
var compatible_1 = require("./utils/compatible");
var typeChecks_1 = require("./utils/typeChecks");
var Animation = /** @class */ (function () {
    function Animation(options) {
        this._options = { duration: 500, iterationCount: 1 };
        this._currentIterationCount = 0;
        this._running = false;
        this._time = 0;
        (0, typeChecks_1.merge)(this._options, options);
    }
    Animation.prototype._loop = function () {
        var _this = this;
        this._running = true;
        var step = function () {
            var _a;
            if (_this._running) {
                var diffTime = new Date().getTime() - _this._time;
                if (diffTime < _this._options.duration) {
                    (_a = _this._doFrameCallback) === null || _a === void 0 ? void 0 : _a.call(_this, diffTime);
                    (0, compatible_1.requestAnimationFrame)(step);
                }
                else {
                    _this.stop();
                    _this._currentIterationCount++;
                    if (_this._currentIterationCount < _this._options.iterationCount) {
                        _this.start();
                    }
                }
            }
        };
        (0, compatible_1.requestAnimationFrame)(step);
    };
    Animation.prototype.doFrame = function (callback) {
        this._doFrameCallback = callback;
        return this;
    };
    Animation.prototype.setDuration = function (duration) {
        this._options.duration = duration;
        return this;
    };
    Animation.prototype.setIterationCount = function (iterationCount) {
        this._options.iterationCount = iterationCount;
        return this;
    };
    Animation.prototype.start = function () {
        if (!this._running) {
            this._time = new Date().getTime();
            this._loop();
        }
    };
    Animation.prototype.stop = function () {
        var _a;
        if (this._running) {
            (_a = this._doFrameCallback) === null || _a === void 0 ? void 0 : _a.call(this, this._options.duration);
        }
        this._running = false;
    };
    return Animation;
}());
exports.default = Animation;
//# sourceMappingURL=Animation.js.map