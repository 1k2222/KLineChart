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
var Eventful_1 = __importDefault(require("../common/Eventful"));
var typeChecks_1 = require("../common/utils/typeChecks");
var index_1 = require("../extension/figure/index");
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View(widget) {
        var _this = _super.call(this) || this;
        _this._widget = widget;
        return _this;
    }
    View.prototype.getWidget = function () { return this._widget; };
    View.prototype.createFigure = function (create, eventHandler) {
        var FigureClazz = (0, index_1.getInnerFigureClass)(create.name);
        if (FigureClazz !== null) {
            var figure = new FigureClazz(create);
            if ((0, typeChecks_1.isValid)(eventHandler)) {
                for (var key in eventHandler) {
                    // eslint-disable-next-line no-prototype-builtins -- ignore
                    if (eventHandler.hasOwnProperty(key)) {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- ignore
                        figure.registerEvent(key, eventHandler[key]);
                    }
                }
                this.addChild(figure);
            }
            return figure;
        }
        return null;
    };
    View.prototype.draw = function (ctx) {
        var extend = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            extend[_i - 1] = arguments[_i];
        }
        this.clear();
        this.drawImp(ctx, extend);
    };
    View.prototype.checkEventOn = function (_) {
        return true;
    };
    return View;
}(Eventful_1.default));
exports.default = View;
//# sourceMappingURL=View.js.map