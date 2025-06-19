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
exports.DEFAULT_REQUEST_ID = void 0;
exports.requestAnimationFrame = requestAnimationFrame;
exports.cancelAnimationFrame = cancelAnimationFrame;
exports.requestIdleCallback = requestIdleCallback;
exports.cancelIdleCallback = cancelIdleCallback;
var typeChecks_1 = require("./typeChecks");
exports.DEFAULT_REQUEST_ID = -1;
function requestAnimationFrame(fn) {
    if ((0, typeChecks_1.isFunction)(window.requestAnimationFrame)) {
        return window.requestAnimationFrame(fn);
    }
    return window.setTimeout(fn, 20);
}
function cancelAnimationFrame(id) {
    if ((0, typeChecks_1.isFunction)(window.cancelAnimationFrame)) {
        window.cancelAnimationFrame(id);
    }
    else {
        window.clearTimeout(id);
    }
}
function requestIdleCallback(fn) {
    if ((0, typeChecks_1.isFunction)(window.requestIdleCallback)) {
        return window.requestIdleCallback(fn);
    }
    var startTime = performance.now();
    return window.setTimeout(function () {
        fn({
            didTimeout: false,
            timeRemaining: function () {
                return Math.max(0, 50 - (performance.now() - startTime));
            }
        });
    }, 1);
}
function cancelIdleCallback(id) {
    if ((0, typeChecks_1.isFunction)(window.cancelIdleCallback)) {
        window.cancelIdleCallback(id);
    }
    else {
        window.clearTimeout(id);
    }
}
//# sourceMappingURL=compatible.js.map