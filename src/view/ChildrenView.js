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
var View_1 = __importDefault(require("./View"));
var ChildrenView = /** @class */ (function (_super) {
    __extends(ChildrenView, _super);
    function ChildrenView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChildrenView.prototype.eachChildren = function (childCallback) {
        var pane = this.getWidget().getPane();
        var chartStore = pane.getChart().getChartStore();
        var visibleRangeDataList = chartStore.getVisibleRangeDataList();
        var barSpace = chartStore.getBarSpace();
        var dataLength = visibleRangeDataList.length;
        var index = 0;
        while (index < dataLength) {
            childCallback(visibleRangeDataList[index], barSpace, index);
            ++index;
        }
    };
    return ChildrenView;
}(View_1.default));
exports.default = ChildrenView;
//# sourceMappingURL=ChildrenView.js.map