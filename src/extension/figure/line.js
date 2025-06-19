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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCoordinateOnLine = checkCoordinateOnLine;
exports.getLinearYFromSlopeIntercept = getLinearYFromSlopeIntercept;
exports.getLinearYFromCoordinates = getLinearYFromCoordinates;
exports.getLinearSlopeIntercept = getLinearSlopeIntercept;
exports.lineTo = lineTo;
exports.drawLine = drawLine;
var Figure_1 = require("../../component/Figure");
var typeChecks_1 = require("../../common/utils/typeChecks");
function checkCoordinateOnLine(coordinate, attrs) {
    var e_1, _a;
    var lines = [];
    lines = lines.concat(attrs);
    try {
        for (var lines_1 = __values(lines), lines_1_1 = lines_1.next(); !lines_1_1.done; lines_1_1 = lines_1.next()) {
            var line_1 = lines_1_1.value;
            var coordinates = line_1.coordinates;
            if (coordinates.length > 1) {
                for (var i = 1; i < coordinates.length; i++) {
                    var prevCoordinate = coordinates[i - 1];
                    var currentCoordinate = coordinates[i];
                    if (prevCoordinate.x === currentCoordinate.x) {
                        if (Math.abs(prevCoordinate.y - coordinate.y) + Math.abs(currentCoordinate.y - coordinate.y) - Math.abs(prevCoordinate.y - currentCoordinate.y) < Figure_1.DEVIATION + Figure_1.DEVIATION &&
                            Math.abs(coordinate.x - prevCoordinate.x) < Figure_1.DEVIATION) {
                            return true;
                        }
                    }
                    else {
                        var kb = getLinearSlopeIntercept(prevCoordinate, currentCoordinate);
                        var y = getLinearYFromSlopeIntercept(kb, coordinate);
                        var yDif = Math.abs(y - coordinate.y);
                        if (Math.abs(prevCoordinate.x - coordinate.x) + Math.abs(currentCoordinate.x - coordinate.x) - Math.abs(prevCoordinate.x - currentCoordinate.x) < Figure_1.DEVIATION + Figure_1.DEVIATION &&
                            yDif * yDif / (kb[0] * kb[0] + 1) < Figure_1.DEVIATION * Figure_1.DEVIATION) {
                            return true;
                        }
                    }
                }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (lines_1_1 && !lines_1_1.done && (_a = lines_1.return)) _a.call(lines_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return false;
}
function getLinearYFromSlopeIntercept(kb, coordinate) {
    if (kb !== null) {
        return coordinate.x * kb[0] + kb[1];
    }
    return coordinate.y;
}
/**
 * 获取点在两点决定的一次函数上的y值
 * @param coordinate1
 * @param coordinate2
 * @param targetCoordinate
 */
function getLinearYFromCoordinates(coordinate1, coordinate2, targetCoordinate) {
    var kb = getLinearSlopeIntercept(coordinate1, coordinate2);
    return getLinearYFromSlopeIntercept(kb, targetCoordinate);
}
function getLinearSlopeIntercept(coordinate1, coordinate2) {
    var difX = coordinate1.x - coordinate2.x;
    if (difX !== 0) {
        var k = (coordinate1.y - coordinate2.y) / difX;
        var b = coordinate1.y - k * coordinate1.x;
        return [k, b];
    }
    return null;
}
function lineTo(ctx, coordinates, smooth) {
    var length = coordinates.length;
    var smoothParam = (0, typeChecks_1.isNumber)(smooth) ? (smooth > 0 && smooth < 1 ? smooth : 0) : (smooth ? 0.5 : 0);
    if ((smoothParam > 0) && length > 2) {
        var cpx0 = coordinates[0].x;
        var cpy0 = coordinates[0].y;
        for (var i = 1; i < length - 1; i++) {
            var prevCoordinate = coordinates[i - 1];
            var coordinate = coordinates[i];
            var nextCoordinate = coordinates[i + 1];
            var dx01 = coordinate.x - prevCoordinate.x;
            var dy01 = coordinate.y - prevCoordinate.y;
            var dx12 = nextCoordinate.x - coordinate.x;
            var dy12 = nextCoordinate.y - coordinate.y;
            var dx02 = nextCoordinate.x - prevCoordinate.x;
            var dy02 = nextCoordinate.y - prevCoordinate.y;
            var prevSegmentLength = Math.sqrt(dx01 * dx01 + dy01 * dy01);
            var nextSegmentLength = Math.sqrt(dx12 * dx12 + dy12 * dy12);
            var segmentLengthRatio = nextSegmentLength / (nextSegmentLength + prevSegmentLength);
            var nextCpx = coordinate.x + dx02 * smoothParam * segmentLengthRatio;
            var nextCpy = coordinate.y + dy02 * smoothParam * segmentLengthRatio;
            nextCpx = Math.min(nextCpx, Math.max(nextCoordinate.x, coordinate.x));
            nextCpy = Math.min(nextCpy, Math.max(nextCoordinate.y, coordinate.y));
            nextCpx = Math.max(nextCpx, Math.min(nextCoordinate.x, coordinate.x));
            nextCpy = Math.max(nextCpy, Math.min(nextCoordinate.y, coordinate.y));
            dx02 = nextCpx - coordinate.x;
            dy02 = nextCpy - coordinate.y;
            var cpx1 = coordinate.x - dx02 * prevSegmentLength / nextSegmentLength;
            var cpy1 = coordinate.y - dy02 * prevSegmentLength / nextSegmentLength;
            cpx1 = Math.min(cpx1, Math.max(prevCoordinate.x, coordinate.x));
            cpy1 = Math.min(cpy1, Math.max(prevCoordinate.y, coordinate.y));
            cpx1 = Math.max(cpx1, Math.min(prevCoordinate.x, coordinate.x));
            cpy1 = Math.max(cpy1, Math.min(prevCoordinate.y, coordinate.y));
            dx02 = coordinate.x - cpx1;
            dy02 = coordinate.y - cpy1;
            nextCpx = coordinate.x + dx02 * nextSegmentLength / prevSegmentLength;
            nextCpy = coordinate.y + dy02 * nextSegmentLength / prevSegmentLength;
            ctx.bezierCurveTo(cpx0, cpy0, cpx1, cpy1, coordinate.x, coordinate.y);
            cpx0 = nextCpx;
            cpy0 = nextCpy;
        }
        var lastCoordinate = coordinates[length - 1];
        ctx.bezierCurveTo(cpx0, cpy0, lastCoordinate.x, lastCoordinate.y, lastCoordinate.x, lastCoordinate.y);
    }
    else {
        for (var i = 1; i < length; i++) {
            ctx.lineTo(coordinates[i].x, coordinates[i].y);
        }
    }
}
function drawLine(ctx, attrs, styles) {
    var lines = [];
    lines = lines.concat(attrs);
    var _a = styles.style, style = _a === void 0 ? 'solid' : _a, _b = styles.smooth, smooth = _b === void 0 ? false : _b, _c = styles.size, size = _c === void 0 ? 1 : _c, _d = styles.color, color = _d === void 0 ? 'currentColor' : _d, _e = styles.dashedValue, dashedValue = _e === void 0 ? [2, 2] : _e;
    ctx.lineWidth = size;
    ctx.strokeStyle = color;
    if (style === 'dashed') {
        ctx.setLineDash(dashedValue);
    }
    else {
        ctx.setLineDash([]);
    }
    var correction = size % 2 === 1 ? 0.5 : 0;
    lines.forEach(function (_a) {
        var coordinates = _a.coordinates;
        if (coordinates.length > 1) {
            if (coordinates.length === 2 &&
                (coordinates[0].x === coordinates[1].x ||
                    coordinates[0].y === coordinates[1].y)) {
                ctx.beginPath();
                if (coordinates[0].x === coordinates[1].x) {
                    ctx.moveTo(coordinates[0].x + correction, coordinates[0].y);
                    ctx.lineTo(coordinates[1].x + correction, coordinates[1].y);
                }
                else {
                    ctx.moveTo(coordinates[0].x, coordinates[0].y + correction);
                    ctx.lineTo(coordinates[1].x, coordinates[1].y + correction);
                }
                ctx.stroke();
                ctx.closePath();
            }
            else {
                ctx.save();
                if (size % 2 === 1) {
                    ctx.translate(0.5, 0.5);
                }
                ctx.beginPath();
                ctx.moveTo(coordinates[0].x, coordinates[0].y);
                lineTo(ctx, coordinates, smooth);
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            }
        }
    });
}
var line = {
    name: 'line',
    checkEventOn: checkCoordinateOnLine,
    draw: function (ctx, attrs, styles) {
        drawLine(ctx, attrs, styles);
    }
};
exports.default = line;
//# sourceMappingURL=line.js.map