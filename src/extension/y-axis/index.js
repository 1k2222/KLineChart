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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerYAxis = registerYAxis;
exports.getYAxisClass = getYAxisClass;
var YAxis_1 = __importDefault(require("../../component/YAxis"));
var normal_1 = __importDefault(require("./normal"));
var percentage_1 = __importDefault(require("./percentage"));
var logarithm_1 = __importDefault(require("./logarithm"));
var yAxises = {
    normal: YAxis_1.default.extend(normal_1.default),
    percentage: YAxis_1.default.extend(percentage_1.default),
    logarithm: YAxis_1.default.extend(logarithm_1.default)
};
function registerYAxis(axis) {
    yAxises[axis.name] = YAxis_1.default.extend(axis);
}
function getYAxisClass(name) {
    var _a;
    return (_a = yAxises[name]) !== null && _a !== void 0 ? _a : yAxises.normal;
}
//# sourceMappingURL=index.js.map