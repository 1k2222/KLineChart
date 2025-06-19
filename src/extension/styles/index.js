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
exports.registerStyles = registerStyles;
exports.getStyles = getStyles;
var light_1 = __importDefault(require("./light"));
var dark_1 = __importDefault(require("./dark"));
var styles = {
    light: light_1.default,
    dark: dark_1.default
};
function registerStyles(name, ss) {
    styles[name] = ss;
}
function getStyles(name) {
    var _a;
    return (_a = styles[name]) !== null && _a !== void 0 ? _a : null;
}
//# sourceMappingURL=index.js.map