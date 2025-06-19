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
exports.getSupportedFigures = getSupportedFigures;
exports.getFigureClass = getFigureClass;
exports.getInnerFigureClass = getInnerFigureClass;
exports.registerFigure = registerFigure;
var Figure_1 = __importDefault(require("../../component/Figure"));
var circle_1 = __importDefault(require("./circle"));
var line_1 = __importDefault(require("./line"));
var polygon_1 = __importDefault(require("./polygon"));
var rect_1 = __importDefault(require("./rect"));
var text_1 = __importDefault(require("./text"));
var arc_1 = __importDefault(require("./arc"));
var path_1 = __importDefault(require("./path"));
var figures = {};
var extensions = [circle_1.default, line_1.default, polygon_1.default, rect_1.default, text_1.default, arc_1.default, path_1.default];
extensions.forEach(function (figure) {
    figures[figure.name] = Figure_1.default.extend(figure);
});
function getSupportedFigures() {
    return Object.keys(figures);
}
function registerFigure(figure) {
    figures[figure.name] = Figure_1.default.extend(figure);
}
function getInnerFigureClass(name) {
    var _a;
    return (_a = figures[name]) !== null && _a !== void 0 ? _a : null;
}
function getFigureClass(name) {
    var _a;
    return (_a = figures[name]) !== null && _a !== void 0 ? _a : null;
}
//# sourceMappingURL=index.js.map