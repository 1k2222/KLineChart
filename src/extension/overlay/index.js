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
exports.registerOverlay = registerOverlay;
exports.getOverlayClass = getOverlayClass;
exports.getOverlayInnerClass = getOverlayInnerClass;
exports.getSupportedOverlays = getSupportedOverlays;
var Overlay_1 = __importDefault(require("../../component/Overlay"));
var fibonacciLine_1 = __importDefault(require("./fibonacciLine"));
var horizontalRayLine_1 = __importDefault(require("./horizontalRayLine"));
var horizontalSegment_1 = __importDefault(require("./horizontalSegment"));
var horizontalStraightLine_1 = __importDefault(require("./horizontalStraightLine"));
var parallelStraightLine_1 = __importDefault(require("./parallelStraightLine"));
var priceChannelLine_1 = __importDefault(require("./priceChannelLine"));
var priceLine_1 = __importDefault(require("./priceLine"));
var rayLine_1 = __importDefault(require("./rayLine"));
var segment_1 = __importDefault(require("./segment"));
var straightLine_1 = __importDefault(require("./straightLine"));
var verticalRayLine_1 = __importDefault(require("./verticalRayLine"));
var verticalSegment_1 = __importDefault(require("./verticalSegment"));
var verticalStraightLine_1 = __importDefault(require("./verticalStraightLine"));
var simpleAnnotation_1 = __importDefault(require("./simpleAnnotation"));
var simpleTag_1 = __importDefault(require("./simpleTag"));
var overlays = {};
var extensions = [
    fibonacciLine_1.default, horizontalRayLine_1.default, horizontalSegment_1.default, horizontalStraightLine_1.default,
    parallelStraightLine_1.default, priceChannelLine_1.default, priceLine_1.default, rayLine_1.default, segment_1.default,
    straightLine_1.default, verticalRayLine_1.default, verticalSegment_1.default, verticalStraightLine_1.default,
    simpleAnnotation_1.default, simpleTag_1.default
];
extensions.forEach(function (template) {
    overlays[template.name] = Overlay_1.default.extend(template);
});
function registerOverlay(template) {
    overlays[template.name] = Overlay_1.default.extend(template);
}
function getOverlayInnerClass(name) {
    var _a;
    return (_a = overlays[name]) !== null && _a !== void 0 ? _a : null;
}
function getOverlayClass(name) {
    var _a;
    return (_a = overlays[name]) !== null && _a !== void 0 ? _a : null;
}
function getSupportedOverlays() {
    return Object.keys(overlays);
}
//# sourceMappingURL=index.js.map