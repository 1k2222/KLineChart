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
exports.registerIndicator = registerIndicator;
exports.getIndicatorClass = getIndicatorClass;
exports.getSupportedIndicators = getSupportedIndicators;
var Indicator_1 = __importDefault(require("../../component/Indicator"));
var averagePrice_1 = __importDefault(require("./averagePrice"));
var awesomeOscillator_1 = __importDefault(require("./awesomeOscillator"));
var bias_1 = __importDefault(require("./bias"));
var bollingerBands_1 = __importDefault(require("./bollingerBands"));
var brar_1 = __importDefault(require("./brar"));
var bullAndBearIndex_1 = __importDefault(require("./bullAndBearIndex"));
var commodityChannelIndex_1 = __importDefault(require("./commodityChannelIndex"));
var currentRatio_1 = __importDefault(require("./currentRatio"));
var differentOfMovingAverage_1 = __importDefault(require("./differentOfMovingAverage"));
var directionalMovementIndex_1 = __importDefault(require("./directionalMovementIndex"));
var easeOfMovementValue_1 = __importDefault(require("./easeOfMovementValue"));
var exponentialMovingAverage_1 = __importDefault(require("./exponentialMovingAverage"));
var momentum_1 = __importDefault(require("./momentum"));
var movingAverage_1 = __importDefault(require("./movingAverage"));
var movingAverageConvergenceDivergence_1 = __importDefault(require("./movingAverageConvergenceDivergence"));
var onBalanceVolume_1 = __importDefault(require("./onBalanceVolume"));
var priceAndVolumeTrend_1 = __importDefault(require("./priceAndVolumeTrend"));
var psychologicalLine_1 = __importDefault(require("./psychologicalLine"));
var rateOfChange_1 = __importDefault(require("./rateOfChange"));
var relativeStrengthIndex_1 = __importDefault(require("./relativeStrengthIndex"));
var simpleMovingAverage_1 = __importDefault(require("./simpleMovingAverage"));
var stoch_1 = __importDefault(require("./stoch"));
var stopAndReverse_1 = __importDefault(require("./stopAndReverse"));
var tripleExponentiallySmoothedAverage_1 = __importDefault(require("./tripleExponentiallySmoothedAverage"));
var volume_1 = __importDefault(require("./volume"));
var volumeRatio_1 = __importDefault(require("./volumeRatio"));
var williamsR_1 = __importDefault(require("./williamsR"));
var indicators = {};
var extensions = [
    averagePrice_1.default, awesomeOscillator_1.default, bias_1.default, bollingerBands_1.default, brar_1.default,
    bullAndBearIndex_1.default, commodityChannelIndex_1.default, currentRatio_1.default, differentOfMovingAverage_1.default,
    directionalMovementIndex_1.default, easeOfMovementValue_1.default, exponentialMovingAverage_1.default, momentum_1.default,
    movingAverage_1.default, movingAverageConvergenceDivergence_1.default, onBalanceVolume_1.default, priceAndVolumeTrend_1.default,
    psychologicalLine_1.default, rateOfChange_1.default, relativeStrengthIndex_1.default, simpleMovingAverage_1.default,
    stoch_1.default, stopAndReverse_1.default, tripleExponentiallySmoothedAverage_1.default, volume_1.default, volumeRatio_1.default, williamsR_1.default
];
extensions.forEach(function (indicator) {
    indicators[indicator.name] = Indicator_1.default.extend(indicator);
});
function registerIndicator(indicator) {
    indicators[indicator.name] = Indicator_1.default.extend(indicator);
}
function getIndicatorClass(name) {
    var _a;
    return (_a = indicators[name]) !== null && _a !== void 0 ? _a : null;
}
function getSupportedIndicators() {
    return Object.keys(indicators);
}
//# sourceMappingURL=index.js.map