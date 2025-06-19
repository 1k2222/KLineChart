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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var canvas_1 = require("./utils/canvas");
var dom_1 = require("./utils/dom");
var typeChecks_1 = require("./utils/typeChecks");
var compatible_1 = require("./utils/compatible");
function isSupportedDevicePixelContentBox() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve) {
                        var ro = new ResizeObserver(function (entries) {
                            resolve(entries.every(function (entry) { return 'devicePixelContentBoxSize' in entry; }));
                            ro.disconnect();
                        });
                        ro.observe(document.body, { box: 'device-pixel-content-box' });
                    }).catch(function () { return false; })];
                case 1: 
                // eslint-disable-next-line promise/avoid-new -- ignore
                return [2 /*return*/, _a.sent()];
            }
        });
    });
}
var Canvas = /** @class */ (function () {
    function Canvas(style, listener) {
        var _this = this;
        this._supportedDevicePixelContentBox = false;
        this._width = 0;
        this._height = 0;
        this._pixelWidth = 0;
        this._pixelHeight = 0;
        this._nextPixelWidth = 0;
        this._nextPixelHeight = 0;
        this._requestAnimationId = compatible_1.DEFAULT_REQUEST_ID;
        this._mediaQueryListener = function () {
            var pixelRatio = (0, canvas_1.getPixelRatio)(_this._element);
            _this._nextPixelWidth = Math.round(_this._element.clientWidth * pixelRatio);
            _this._nextPixelHeight = Math.round(_this._element.clientHeight * pixelRatio);
            _this._resetPixelRatio();
        };
        this._listener = listener;
        this._element = (0, dom_1.createDom)('canvas', style);
        this._ctx = this._element.getContext('2d');
        isSupportedDevicePixelContentBox().then(function (result) {
            _this._supportedDevicePixelContentBox = result;
            if (result) {
                _this._resizeObserver = new ResizeObserver(function (entries) {
                    var entry = entries.find(function (entry) { return entry.target === _this._element; });
                    var size = entry === null || entry === void 0 ? void 0 : entry.devicePixelContentBoxSize[0];
                    if ((0, typeChecks_1.isValid)(size)) {
                        _this._nextPixelWidth = size.inlineSize;
                        _this._nextPixelHeight = size.blockSize;
                        if (_this._pixelWidth !== _this._nextPixelWidth || _this._pixelHeight !== _this._nextPixelHeight) {
                            _this._resetPixelRatio();
                        }
                    }
                });
                _this._resizeObserver.observe(_this._element, { box: 'device-pixel-content-box' });
            }
            else {
                _this._mediaQueryList = window.matchMedia("(resolution: ".concat((0, canvas_1.getPixelRatio)(_this._element), "dppx)"));
                // eslint-disable-next-line @typescript-eslint/no-deprecated -- ignore
                _this._mediaQueryList.addListener(_this._mediaQueryListener);
            }
        }).catch(function (_) { return false; });
    }
    Canvas.prototype._resetPixelRatio = function () {
        var _this = this;
        this._executeListener(function () {
            var width = _this._element.clientWidth;
            var height = _this._element.clientHeight;
            _this._width = width;
            _this._height = height;
            _this._pixelWidth = _this._nextPixelWidth;
            _this._pixelHeight = _this._nextPixelHeight;
            _this._element.width = _this._nextPixelWidth;
            _this._element.height = _this._nextPixelHeight;
            var horizontalPixelRatio = _this._nextPixelWidth / width;
            var verticalPixelRatio = _this._nextPixelHeight / height;
            _this._ctx.scale(horizontalPixelRatio, verticalPixelRatio);
        });
    };
    Canvas.prototype._executeListener = function (fn) {
        var _this = this;
        if (this._requestAnimationId === compatible_1.DEFAULT_REQUEST_ID) {
            this._requestAnimationId = (0, compatible_1.requestAnimationFrame)(function () {
                _this._ctx.clearRect(0, 0, _this._width, _this._height);
                fn === null || fn === void 0 ? void 0 : fn();
                _this._listener();
                _this._requestAnimationId = compatible_1.DEFAULT_REQUEST_ID;
            });
        }
    };
    Canvas.prototype.update = function (w, h) {
        if (this._width !== w || this._height !== h) {
            this._element.style.width = "".concat(w, "px");
            this._element.style.height = "".concat(h, "px");
            if (!this._supportedDevicePixelContentBox) {
                var pixelRatio = (0, canvas_1.getPixelRatio)(this._element);
                this._nextPixelWidth = Math.round(w * pixelRatio);
                this._nextPixelHeight = Math.round(h * pixelRatio);
                this._resetPixelRatio();
            }
        }
        else {
            this._executeListener();
        }
    };
    Canvas.prototype.getElement = function () {
        return this._element;
    };
    Canvas.prototype.getContext = function () {
        return this._ctx;
    };
    Canvas.prototype.destroy = function () {
        if ((0, typeChecks_1.isValid)(this._resizeObserver)) {
            this._resizeObserver.unobserve(this._element);
        }
        if ((0, typeChecks_1.isValid)(this._mediaQueryList)) {
            // eslint-disable-next-line @typescript-eslint/no-deprecated -- ignore
            this._mediaQueryList.removeListener(this._mediaQueryListener);
        }
    };
    return Canvas;
}());
exports.default = Canvas;
//# sourceMappingURL=Canvas.js.map