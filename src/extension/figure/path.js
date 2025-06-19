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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawPath = drawPath;
var typeChecks_1 = require("../../common/utils/typeChecks");
var rect_1 = require("./rect");
function drawEllipticalArc(ctx, x1, y1, args, offsetX, offsetY, isRelative) {
    var _a = __read(args, 7), rx = _a[0], ry = _a[1], rotation = _a[2], largeArcFlag = _a[3], sweepFlag = _a[4], x2 = _a[5], y2 = _a[6];
    var targetX = isRelative ? x1 + x2 : x2 + offsetX;
    var targetY = isRelative ? y1 + y2 : y2 + offsetY;
    var segments = ellipticalArcToBeziers(x1, y1, rx, ry, rotation, largeArcFlag, sweepFlag, targetX, targetY);
    segments.forEach(function (segment) {
        ctx.bezierCurveTo(segment[0], segment[1], segment[2], segment[3], segment[4], segment[5]);
    });
}
function ellipticalArcToBeziers(x1, y1, rx, ry, rotation, largeArcFlag, sweepFlag, x2, y2) {
    var _a = computeEllipticalArcParameters(x1, y1, rx, ry, rotation, largeArcFlag, sweepFlag, x2, y2), cx = _a.cx, cy = _a.cy, startAngle = _a.startAngle, deltaAngle = _a.deltaAngle;
    var segments = [];
    var numSegments = Math.ceil(Math.abs(deltaAngle) / (Math.PI / 2));
    for (var i = 0; i < numSegments; i++) {
        var start = startAngle + (i * deltaAngle) / numSegments;
        var end = startAngle + ((i + 1) * deltaAngle) / numSegments;
        var bezier = ellipticalArcToBezier(cx, cy, rx, ry, rotation, start, end);
        segments.push(bezier);
    }
    return segments;
}
function computeEllipticalArcParameters(x1, y1, rx, ry, rotation, largeArcFlag, sweepFlag, x2, y2) {
    var phi = (rotation * Math.PI) / 180;
    var dx = (x1 - x2) / 2;
    var dy = (y1 - y2) / 2;
    var x1p = Math.cos(phi) * dx + Math.sin(phi) * dy;
    var y1p = -Math.sin(phi) * dx + Math.cos(phi) * dy;
    var lambda = (Math.pow(x1p, 2)) / (Math.pow(rx, 2)) + (Math.pow(y1p, 2)) / (Math.pow(ry, 2));
    if (lambda > 1) {
        rx *= Math.sqrt(lambda);
        ry *= Math.sqrt(lambda);
    }
    var sign = largeArcFlag === sweepFlag ? -1 : 1;
    var numerator = (Math.pow(rx, 2)) * (Math.pow(ry, 2)) - (Math.pow(rx, 2)) * (Math.pow(y1p, 2)) - (Math.pow(ry, 2)) * (Math.pow(x1p, 2));
    var denominator = (Math.pow(rx, 2)) * (Math.pow(y1p, 2)) + (Math.pow(ry, 2)) * (Math.pow(x1p, 2));
    var cxp = sign * Math.sqrt(Math.abs(numerator / denominator)) * (rx * y1p / ry);
    var cyp = sign * Math.sqrt(Math.abs(numerator / denominator)) * (-ry * x1p / rx);
    var cx = Math.cos(phi) * cxp - Math.sin(phi) * cyp + (x1 + x2) / 2;
    var cy = Math.sin(phi) * cxp + Math.cos(phi) * cyp + (y1 + y2) / 2;
    var startAngle = Math.atan2((y1p - cyp) / ry, (x1p - cxp) / rx);
    var deltaAngle = Math.atan2((-y1p - cyp) / ry, (-x1p - cxp) / rx) - startAngle;
    if (deltaAngle < 0 && sweepFlag === 1) {
        deltaAngle += 2 * Math.PI;
    }
    else if (deltaAngle > 0 && sweepFlag === 0) {
        deltaAngle -= 2 * Math.PI;
    }
    return { cx: cx, cy: cy, startAngle: startAngle, deltaAngle: deltaAngle };
}
/**
 * Ellipse arc segment to Bezier curve
 * @param cx
 * @param cy
 * @param rx
 * @param ry
 * @param rotation
 * @param startAngle
 * @param endAngle
 * @returns
 */
function ellipticalArcToBezier(cx, cy, rx, ry, rotation, startAngle, endAngle) {
    // 计算控制点
    var alpha = Math.sin(endAngle - startAngle) * (Math.sqrt(4 + 3 * Math.pow(Math.tan((endAngle - startAngle) / 2), 2)) - 1) / 3;
    var cosPhi = Math.cos(rotation);
    var sinPhi = Math.sin(rotation);
    var x1 = cx + rx * Math.cos(startAngle) * cosPhi - ry * Math.sin(startAngle) * sinPhi;
    var y1 = cy + rx * Math.cos(startAngle) * sinPhi + ry * Math.sin(startAngle) * cosPhi;
    var x2 = cx + rx * Math.cos(endAngle) * cosPhi - ry * Math.sin(endAngle) * sinPhi;
    var y2 = cy + rx * Math.cos(endAngle) * sinPhi + ry * Math.sin(endAngle) * cosPhi;
    var cp1x = x1 + alpha * (-rx * Math.sin(startAngle) * cosPhi - ry * Math.cos(startAngle) * sinPhi);
    var cp1y = y1 + alpha * (-rx * Math.sin(startAngle) * sinPhi + ry * Math.cos(startAngle) * cosPhi);
    var cp2x = x2 - alpha * (-rx * Math.sin(endAngle) * cosPhi - ry * Math.cos(endAngle) * sinPhi);
    var cp2y = y2 - alpha * (-rx * Math.sin(endAngle) * sinPhi + ry * Math.cos(endAngle) * cosPhi);
    return [cp1x, cp1y, cp2x, cp2y, x2, y2];
}
function drawPath(ctx, attrs, styles) {
    var paths = [];
    paths = paths.concat(attrs);
    var _a = styles.lineWidth, lineWidth = _a === void 0 ? 1 : _a, _b = styles.color, color = _b === void 0 ? 'currentColor' : _b;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.setLineDash([]);
    paths.forEach(function (_a) {
        var x = _a.x, y = _a.y, path = _a.path;
        var commands = path.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/gi);
        if ((0, typeChecks_1.isValid)(commands)) {
            var offsetX_1 = x;
            var offsetY_1 = y;
            ctx.beginPath();
            commands.forEach(function (command) {
                var currentX = 0;
                var currentY = 0;
                var startX = 0;
                var startY = 0;
                var type = command[0];
                var args = command.slice(1).trim().split(/[\s,]+/).map(Number);
                switch (type) {
                    case 'M':
                        currentX = args[0] + offsetX_1;
                        currentY = args[1] + offsetY_1;
                        ctx.moveTo(currentX, currentY);
                        startX = currentX;
                        startY = currentY;
                        break;
                    case 'm':
                        currentX += args[0];
                        currentY += args[1];
                        ctx.moveTo(currentX, currentY);
                        startX = currentX;
                        startY = currentY;
                        break;
                    case 'L':
                        currentX = args[0] + offsetX_1;
                        currentY = args[1] + offsetY_1;
                        ctx.lineTo(currentX, currentY);
                        break;
                    case 'l':
                        currentX += args[0];
                        currentY += args[1];
                        ctx.lineTo(currentX, currentY);
                        break;
                    case 'H':
                        currentX = args[0] + offsetX_1;
                        ctx.lineTo(currentX, currentY);
                        break;
                    case 'h':
                        currentX += args[0];
                        ctx.lineTo(currentX, currentY);
                        break;
                    case 'V':
                        currentY = args[0] + offsetY_1;
                        ctx.lineTo(currentX, currentY);
                        break;
                    case 'v':
                        currentY += args[0];
                        ctx.lineTo(currentX, currentY);
                        break;
                    case 'C':
                        ctx.bezierCurveTo(args[0] + offsetX_1, args[1] + offsetY_1, args[2] + offsetX_1, args[3] + offsetY_1, args[4] + offsetX_1, args[5] + offsetY_1);
                        currentX = args[4] + offsetX_1;
                        currentY = args[5] + offsetY_1;
                        break;
                    case 'c':
                        ctx.bezierCurveTo(currentX + args[0], currentY + args[1], currentX + args[2], currentY + args[3], currentX + args[4], currentY + args[5]);
                        currentX += args[4];
                        currentY += args[5];
                        break;
                    case 'S':
                        ctx.bezierCurveTo(currentX, currentY, args[0] + offsetX_1, args[1] + offsetY_1, args[2] + offsetX_1, args[3] + offsetY_1);
                        currentX = args[2] + offsetX_1;
                        currentY = args[3] + offsetY_1;
                        break;
                    case 's':
                        ctx.bezierCurveTo(currentX, currentY, currentX + args[0], currentY + args[1], currentX + args[2], currentY + args[3]);
                        currentX += args[2];
                        currentY += args[3];
                        break;
                    case 'Q':
                        ctx.quadraticCurveTo(args[0] + offsetX_1, args[1] + offsetY_1, args[2] + offsetX_1, args[3] + offsetY_1);
                        currentX = args[2] + offsetX_1;
                        currentY = args[3] + offsetY_1;
                        break;
                    case 'q':
                        ctx.quadraticCurveTo(currentX + args[0], currentY + args[1], currentX + args[2], currentY + args[3]);
                        currentX += args[2];
                        currentY += args[3];
                        break;
                    case 'T':
                        ctx.quadraticCurveTo(currentX, currentY, args[0] + offsetX_1, args[1] + offsetY_1);
                        currentX = args[0] + offsetX_1;
                        currentY = args[1] + offsetY_1;
                        break;
                    case 't':
                        ctx.quadraticCurveTo(currentX, currentY, currentX + args[0], currentY + args[1]);
                        currentX += args[0];
                        currentY += args[1];
                        break;
                    case 'A':
                        // arc
                        // reference https://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
                        drawEllipticalArc(ctx, currentX, currentY, args, offsetX_1, offsetY_1, false);
                        currentX = args[5] + offsetX_1;
                        currentY = args[6] + offsetY_1;
                        break;
                    case 'a':
                        // arc
                        // reference https://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
                        drawEllipticalArc(ctx, currentX, currentY, args, offsetX_1, offsetY_1, true);
                        currentX += args[5];
                        currentY += args[6];
                        break;
                    case 'Z':
                    case 'z':
                        ctx.closePath();
                        currentX = startX;
                        currentY = startY;
                        break;
                    default: {
                        break;
                    }
                }
            });
            if (styles.style === 'fill') {
                ctx.fill();
            }
            else {
                ctx.stroke();
            }
        }
    });
}
var path = {
    name: 'path',
    checkEventOn: rect_1.checkCoordinateOnRect,
    draw: function (ctx, attrs, styles) {
        drawPath(ctx, attrs, styles);
    }
};
exports.default = path;
//# sourceMappingURL=path.js.map