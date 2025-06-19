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
exports.DEVIATION = void 0;
var Eventful_1 = __importDefault(require("../common/Eventful"));
exports.DEVIATION = 2;
var FigureImp = /** @class */ (function (_super) {
    __extends(FigureImp, _super);
    function FigureImp(figure) {
        var _this = _super.call(this) || this;
        _this.attrs = figure.attrs;
        _this.styles = figure.styles;
        return _this;
    }
    FigureImp.prototype.checkEventOn = function (event) {
        return this.checkEventOnImp(event, this.attrs, this.styles);
    };
    FigureImp.prototype.setAttrs = function (attrs) {
        this.attrs = attrs;
        return this;
    };
    FigureImp.prototype.setStyles = function (styles) {
        this.styles = styles;
        return this;
    };
    FigureImp.prototype.draw = function (ctx) {
        this.drawImp(ctx, this.attrs, this.styles);
    };
    FigureImp.extend = function (figure) {
        var Custom = /** @class */ (function (_super) {
            __extends(Custom, _super);
            function Custom() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Custom.prototype.checkEventOnImp = function (coordinate, attrs, styles) {
                return figure.checkEventOn(coordinate, attrs, styles);
            };
            Custom.prototype.drawImp = function (ctx, attrs, styles) {
                figure.draw(ctx, attrs, styles);
            };
            return Custom;
        }(FigureImp));
        return Custom;
    };
    return FigureImp;
}(Eventful_1.default));
exports.default = FigureImp;
//# sourceMappingURL=Figure.js.map