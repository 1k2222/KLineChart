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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var XAxisWidget_1 = __importDefault(require("../widget/XAxisWidget"));
var DrawPane_1 = __importDefault(require("./DrawPane"));
var x_axis_1 = require("../extension/x-axis");
var XAxisPane = /** @class */ (function (_super) {
    __extends(XAxisPane, _super);
    function XAxisPane() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    XAxisPane.prototype.createAxisComponent = function (name) {
        var XAxisClass = (0, x_axis_1.getXAxisClass)(name);
        return new XAxisClass(this);
    };
    XAxisPane.prototype.createMainWidget = function (container) {
        return new XAxisWidget_1.default(container, this);
    };
    return XAxisPane;
}(DrawPane_1.default));
exports.default = XAxisPane;
//# sourceMappingURL=XAxisPane.js.map