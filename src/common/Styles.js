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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultStyles = getDefaultStyles;
var color_1 = require("./utils/color");
var Color = {
    RED: '#F92855',
    GREEN: '#2DC08E',
    WHITE: '#FFFFFF',
    GREY: '#76808F',
    BLUE: '#1677FF',
    LIGHTRED: 'hsl(347, 95%, 90%)',
    LIGHTGREEN: 'hsl(160, 62%, 90%)',
    LIGHTGREY: 'hsl(216, 10%, 90%)'
};
function getDefaultGridStyle() {
    return {
        show: true,
        horizontal: {
            show: true,
            size: 1,
            color: '#EDEDED',
            style: 'dashed',
            dashedValue: [2, 2]
        },
        vertical: {
            show: true,
            size: 1,
            color: '#EDEDED',
            style: 'dashed',
            dashedValue: [2, 2]
        }
    };
}
/**
 * Get default candle style
 * @type {{area: {backgroundColor: [{offset: number, color: string}, {offset: number, color: string}], lineColor: string, lineSize: number, value: string}, bar: {noChangeColor: string, upColor: string, downColor: string}, tooltip: {rect: {offsetTop: number, fillColor: string, borderColor: string, paddingBottom: number, borderRadius: number, paddingRight: number, borderSize: number, offsetLeft: number, paddingTop: number, paddingLeft: number, offsetRight: number}, showRule: string, values: null, showType: string, text: {marginRight: number, size: number, color: string, weight: string, marginBottom: number, family: string, marginTop: number, marginLeft: number}, labels: string[]}, type: string, priceMark: {high: {textMargin: number, textSize: number, color: string, textFamily: string, show: boolean, textWeight: string}, last: {noChangeColor: string, upColor: string, line: {dashValue: number[], size: number, show: boolean, style: string}, show: boolean, text: {paddingBottom: number, size: number, color: string, paddingRight: number, show: boolean, weight: string, paddingTop: number, family: string, paddingLeft: number}, downColor: string}, low: {textMargin: number, textSize: number, color: string, textFamily: string, show: boolean, textWeight: string}, show: boolean}}}
 */
function getDefaultCandleStyle() {
    var highLow = {
        show: true,
        color: Color.GREY,
        textOffset: 5,
        textSize: 10,
        textFamily: 'Helvetica Neue',
        textWeight: 'normal'
    };
    return {
        type: 'candle_solid',
        bar: {
            compareRule: 'current_open',
            upColor: Color.GREEN,
            downColor: Color.RED,
            noChangeColor: Color.GREY,
            upBorderColor: Color.GREEN,
            downBorderColor: Color.RED,
            noChangeBorderColor: Color.GREY,
            upWickColor: Color.GREEN,
            downWickColor: Color.RED,
            noChangeWickColor: Color.GREY
        },
        fadedBar: {
            compareRule: 'current_open',
            upColor: Color.LIGHTGREEN,
            downColor: Color.LIGHTRED,
            noChangeColor: Color.LIGHTGREY,
            upBorderColor: Color.LIGHTGREEN,
            downBorderColor: Color.LIGHTRED,
            noChangeBorderColor: Color.LIGHTGREY,
            upWickColor: Color.LIGHTGREEN,
            downWickColor: Color.LIGHTRED,
            noChangeWickColor: Color.LIGHTGREY
        },
        area: {
            lineSize: 2,
            lineColor: Color.BLUE,
            smooth: false,
            value: 'close',
            backgroundColor: [{
                    offset: 0,
                    color: (0, color_1.hexToRgb)(Color.BLUE, 0.01)
                }, {
                    offset: 1,
                    color: (0, color_1.hexToRgb)(Color.BLUE, 0.2)
                }],
            point: {
                show: true,
                color: Color.BLUE,
                radius: 4,
                rippleColor: (0, color_1.hexToRgb)(Color.BLUE, 0.3),
                rippleRadius: 8,
                animation: true,
                animationDuration: 1000
            }
        },
        priceMark: {
            show: true,
            high: __assign({}, highLow),
            low: __assign({}, highLow),
            last: {
                show: true,
                compareRule: 'current_open',
                upColor: Color.GREEN,
                downColor: Color.RED,
                noChangeColor: Color.GREY,
                line: {
                    show: true,
                    style: 'dashed',
                    dashedValue: [4, 4],
                    size: 1
                },
                text: {
                    show: true,
                    style: 'fill',
                    size: 12,
                    paddingLeft: 4,
                    paddingTop: 4,
                    paddingRight: 4,
                    paddingBottom: 4,
                    borderColor: 'transparent',
                    borderStyle: 'solid',
                    borderSize: 0,
                    borderDashedValue: [2, 2],
                    color: Color.WHITE,
                    family: 'Helvetica Neue',
                    weight: 'normal',
                    borderRadius: 2
                },
                extendTexts: []
            }
        },
        tooltip: {
            offsetLeft: 4,
            offsetTop: 6,
            offsetRight: 4,
            offsetBottom: 6,
            showRule: 'always',
            showType: 'standard',
            rect: {
                position: 'fixed',
                paddingLeft: 4,
                paddingRight: 4,
                paddingTop: 4,
                paddingBottom: 4,
                offsetLeft: 4,
                offsetTop: 4,
                offsetRight: 4,
                offsetBottom: 4,
                borderRadius: 4,
                borderSize: 1,
                borderColor: '#F2F3F5',
                color: '#FEFEFE'
            },
            title: {
                show: true,
                size: 14,
                family: 'Helvetica Neue',
                weight: 'normal',
                color: Color.GREY,
                marginLeft: 8,
                marginTop: 4,
                marginRight: 8,
                marginBottom: 4,
                template: '{ticker} · {period}'
            },
            legend: {
                size: 12,
                family: 'Helvetica Neue',
                weight: 'normal',
                color: Color.GREY,
                marginLeft: 8,
                marginTop: 4,
                marginRight: 8,
                marginBottom: 4,
                defaultValue: 'n/a',
                custom: [
                    { title: 'time', value: '{time}' },
                    { title: 'open', value: '{open}' },
                    { title: 'high', value: '{high}' },
                    { title: 'low', value: '{low}' },
                    { title: 'close', value: '{close}' },
                    { title: 'volume', value: '{volume}' }
                ]
            },
            features: []
        }
    };
}
/**
 * Get default indicator style
 */
function getDefaultIndicatorStyle() {
    var alphaGreen = (0, color_1.hexToRgb)(Color.GREEN, 0.7);
    var alphaRed = (0, color_1.hexToRgb)(Color.RED, 0.7);
    return {
        ohlc: {
            compareRule: 'current_open',
            upColor: alphaGreen,
            downColor: alphaRed,
            noChangeColor: Color.GREY
        },
        bars: [{
                style: 'fill',
                borderStyle: 'solid',
                borderSize: 1,
                borderDashedValue: [2, 2],
                upColor: alphaGreen,
                downColor: alphaRed,
                noChangeColor: Color.GREY
            }],
        lines: ['#FF9600', '#935EBD', Color.BLUE, '#E11D74', '#01C5C4'].map(function (color) { return ({
            style: 'solid',
            smooth: false,
            size: 1,
            dashedValue: [2, 2],
            color: color
        }); }),
        circles: [{
                style: 'fill',
                borderStyle: 'solid',
                borderSize: 1,
                borderDashedValue: [2, 2],
                upColor: alphaGreen,
                downColor: alphaRed,
                noChangeColor: Color.GREY
            }],
        lastValueMark: {
            show: false,
            text: {
                show: false,
                style: 'fill',
                color: Color.WHITE,
                size: 12,
                family: 'Helvetica Neue',
                weight: 'normal',
                borderStyle: 'solid',
                borderColor: 'transparent',
                borderSize: 0,
                borderDashedValue: [2, 2],
                paddingLeft: 4,
                paddingTop: 4,
                paddingRight: 4,
                paddingBottom: 4,
                borderRadius: 2
            }
        },
        tooltip: {
            offsetLeft: 4,
            offsetTop: 6,
            offsetRight: 4,
            offsetBottom: 6,
            showRule: 'always',
            showType: 'standard',
            title: {
                show: true,
                showName: true,
                showParams: true,
                size: 12,
                family: 'Helvetica Neue',
                weight: 'normal',
                color: Color.GREY,
                marginLeft: 8,
                marginTop: 4,
                marginRight: 8,
                marginBottom: 4
            },
            legend: {
                size: 12,
                family: 'Helvetica Neue',
                weight: 'normal',
                color: Color.GREY,
                marginLeft: 8,
                marginTop: 4,
                marginRight: 8,
                marginBottom: 4,
                defaultValue: 'n/a'
            },
            features: []
        }
    };
}
function getDefaultAxisStyle() {
    return {
        show: true,
        size: 'auto',
        axisLine: {
            show: true,
            color: '#DDDDDD',
            size: 1
        },
        tickText: {
            show: true,
            color: Color.GREY,
            size: 12,
            family: 'Helvetica Neue',
            weight: 'normal',
            marginStart: 4,
            marginEnd: 6
        },
        tickLine: {
            show: true,
            size: 1,
            length: 3,
            color: '#DDDDDD'
        }
    };
}
function getDefaultCrosshairStyle() {
    return {
        show: true,
        horizontal: {
            show: true,
            line: {
                show: true,
                style: 'dashed',
                dashedValue: [4, 2],
                size: 1,
                color: Color.GREY
            },
            text: {
                show: true,
                style: 'fill',
                color: Color.WHITE,
                size: 12,
                family: 'Helvetica Neue',
                weight: 'normal',
                borderStyle: 'solid',
                borderDashedValue: [2, 2],
                borderSize: 1,
                borderColor: Color.GREY,
                borderRadius: 2,
                paddingLeft: 4,
                paddingRight: 4,
                paddingTop: 4,
                paddingBottom: 4,
                backgroundColor: Color.GREY
            },
            features: []
        },
        vertical: {
            show: true,
            line: {
                show: true,
                style: 'dashed',
                dashedValue: [4, 2],
                size: 1,
                color: Color.GREY
            },
            text: {
                show: true,
                style: 'fill',
                color: Color.WHITE,
                size: 12,
                family: 'Helvetica Neue',
                weight: 'normal',
                borderStyle: 'solid',
                borderDashedValue: [2, 2],
                borderSize: 1,
                borderColor: Color.GREY,
                borderRadius: 2,
                paddingLeft: 4,
                paddingRight: 4,
                paddingTop: 4,
                paddingBottom: 4,
                backgroundColor: Color.GREY
            }
        }
    };
}
function getDefaultOverlayStyle() {
    var pointBorderColor = (0, color_1.hexToRgb)(Color.BLUE, 0.35);
    var alphaBg = (0, color_1.hexToRgb)(Color.BLUE, 0.25);
    function text() {
        return {
            style: 'fill',
            color: Color.WHITE,
            size: 12,
            family: 'Helvetica Neue',
            weight: 'normal',
            borderStyle: 'solid',
            borderDashedValue: [2, 2],
            borderSize: 1,
            borderRadius: 2,
            borderColor: Color.BLUE,
            paddingLeft: 4,
            paddingRight: 4,
            paddingTop: 4,
            paddingBottom: 4,
            backgroundColor: Color.BLUE
        };
    }
    return {
        point: {
            color: Color.BLUE,
            borderColor: pointBorderColor,
            borderSize: 1,
            radius: 5,
            activeColor: Color.BLUE,
            activeBorderColor: pointBorderColor,
            activeBorderSize: 3,
            activeRadius: 5
        },
        line: {
            style: 'solid',
            smooth: false,
            color: Color.BLUE,
            size: 1,
            dashedValue: [2, 2]
        },
        rect: {
            style: 'fill',
            color: alphaBg,
            borderColor: Color.BLUE,
            borderSize: 1,
            borderRadius: 0,
            borderStyle: 'solid',
            borderDashedValue: [2, 2]
        },
        polygon: {
            style: 'fill',
            color: Color.BLUE,
            borderColor: Color.BLUE,
            borderSize: 1,
            borderStyle: 'solid',
            borderDashedValue: [2, 2]
        },
        circle: {
            style: 'fill',
            color: alphaBg,
            borderColor: Color.BLUE,
            borderSize: 1,
            borderStyle: 'solid',
            borderDashedValue: [2, 2]
        },
        arc: {
            style: 'solid',
            color: Color.BLUE,
            size: 1,
            dashedValue: [2, 2]
        },
        text: text()
    };
}
function getDefaultSeparatorStyle() {
    return {
        size: 1,
        color: '#DDDDDD',
        fill: true,
        activeBackgroundColor: (0, color_1.hexToRgb)(Color.BLUE, 0.08)
    };
}
function getDefaultStyles() {
    return {
        grid: getDefaultGridStyle(),
        candle: getDefaultCandleStyle(),
        indicator: getDefaultIndicatorStyle(),
        xAxis: getDefaultAxisStyle(),
        yAxis: getDefaultAxisStyle(),
        separator: getDefaultSeparatorStyle(),
        crosshair: getDefaultCrosshairStyle(),
        overlay: getDefaultOverlayStyle()
    };
}
//# sourceMappingURL=Styles.js.map