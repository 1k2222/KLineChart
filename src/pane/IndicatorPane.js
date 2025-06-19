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
var IndicatorWidget_1 = __importDefault(require("../widget/IndicatorWidget"));
var YAxisWidget_1 = __importDefault(require("../widget/YAxisWidget"));
var y_axis_1 = require("../extension/y-axis");
var DrawPane_1 = __importDefault(require("./DrawPane"));
var IndicatorPane = /** @class */ (function (_super) {
    __extends(IndicatorPane, _super);
    function IndicatorPane() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IndicatorPane.prototype.createAxisComponent = function (name) {
        var YAxisClass = (0, y_axis_1.getYAxisClass)(name !== null && name !== void 0 ? name : 'default');
        return new YAxisClass(this);
    };
    IndicatorPane.prototype.createMainWidget = function (container) {
        return new IndicatorWidget_1.default(container, this);
    };
    IndicatorPane.prototype.createYAxisWidget = function (container) {
        return new YAxisWidget_1.default(container, this);
    };
    return IndicatorPane;
}(DrawPane_1.default));
exports.default = IndicatorPane;
//# sourceMappingURL=IndicatorPane.js.map