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
exports.merge = merge;
exports.clone = clone;
exports.isArray = isArray;
exports.isFunction = isFunction;
exports.isObject = isObject;
exports.isNumber = isNumber;
exports.isValid = isValid;
exports.isBoolean = isBoolean;
exports.isString = isString;
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- ignore
function merge(target, source) {
    if ((!isObject(target) && !isObject(source))) {
        return;
    }
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access -- ignore
            var targetProp = target[key];
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access -- ignore
            var sourceProp = source[key];
            if (isObject(sourceProp) &&
                isObject(targetProp)) {
                merge(targetProp, sourceProp);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- ignore
                if (isValid(source[key])) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access -- ignore
                    target[key] = clone(source[key]);
                }
            }
        }
    }
}
function clone(target) {
    if (!isObject(target)) {
        return target;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ignore
    var copy = null;
    if (isArray(target)) {
        copy = [];
    }
    else {
        copy = {};
    }
    for (var key in target) {
        if (Object.prototype.hasOwnProperty.call(target, key)) {
            var v = target[key];
            if (isObject(v)) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- ignore
                copy[key] = clone(v);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- ignore
                copy[key] = v;
            }
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- ignore
    return copy;
}
function isArray(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
}
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters -- ignore
function isFunction(value) {
    return typeof value === 'function';
}
function isObject(value) {
    return (typeof value === 'object') && isValid(value);
}
function isNumber(value) {
    return typeof value === 'number' && Number.isFinite(value);
}
function isValid(value) {
    return value !== null && value !== undefined;
}
function isBoolean(value) {
    return typeof value === 'boolean';
}
function isString(value) {
    return typeof value === 'string';
}
//# sourceMappingURL=typeChecks.js.map