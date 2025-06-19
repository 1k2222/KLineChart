"use strict";
/* eslint-disable eslint-comments/require-description -- ignore */
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
exports.TOUCH_MIN_RADIUS = void 0;
var platform_1 = require("./utils/platform");
var typeChecks_1 = require("./utils/typeChecks");
// we can use `const name = 500;` but with `const enum` this values will be inlined into code
// so we do not need to have it as variables
var Delay = {
    ResetClick: 500,
    LongTap: 500,
    PreventFiresTouchEvents: 500
};
var ManhattanDistance = {
    CancelClick: 5,
    CancelTap: 5,
    DoubleClick: 5,
    DoubleTap: 30
};
var MouseEventButton = {
    Left: 0,
    Middle: 1,
    Right: 2
};
exports.TOUCH_MIN_RADIUS = 10;
// TODO: get rid of a lot of boolean flags, probably we should replace it with some enum
var SyntheticEvent = /** @class */ (function () {
    function SyntheticEvent(target, handler, options) {
        var _this = this;
        this._clickCount = 0;
        this._clickTimeoutId = null;
        this._clickCoordinate = { x: Number.NEGATIVE_INFINITY, y: Number.POSITIVE_INFINITY };
        this._tapCount = 0;
        this._tapTimeoutId = null;
        this._tapCoordinate = { x: Number.NEGATIVE_INFINITY, y: Number.POSITIVE_INFINITY };
        this._longTapTimeoutId = null;
        this._longTapActive = false;
        this._mouseMoveStartCoordinate = null;
        this._touchMoveStartCoordinate = null;
        this._touchMoveExceededManhattanDistance = false;
        this._cancelClick = false;
        this._cancelTap = false;
        this._unsubscribeOutsideMouseEvents = null;
        this._unsubscribeOutsideTouchEvents = null;
        this._unsubscribeMobileSafariEvents = null;
        this._unsubscribeMousemove = null;
        this._unsubscribeMouseWheel = null;
        this._unsubscribeContextMenu = null;
        this._unsubscribeRootMouseEvents = null;
        this._unsubscribeRootTouchEvents = null;
        this._startPinchMiddleCoordinate = null;
        this._startPinchDistance = 0;
        this._pinchPrevented = false;
        this._preventTouchDragProcess = false;
        this._mousePressed = false;
        this._lastTouchEventTimeStamp = 0;
        // for touchstart/touchmove/touchend events we handle only first touch
        // i.e. we don't support several active touches at the same time (except pinch event)
        this._activeTouchId = null;
        // accept all mouse leave events if it's not an iOS device
        // see _mouseEnterHandler, _mouseMoveHandler, _mouseLeaveHandler
        this._acceptMouseLeave = !(0, platform_1.isIOS)();
        /**
         * In Firefox mouse events dont't fire if the mouse position is outside of the browser's border.
         * To prevent the mouse from hanging while pressed we're subscribing on the mouseleave event of the document element.
         * We're subscribing on mouseleave, but this event is actually fired on mouseup outside of the browser's border.
         */
        this._onFirefoxOutsideMouseUp = function (mouseUpEvent) {
            _this._mouseUpHandler(mouseUpEvent);
        };
        /**
         * Safari doesn't fire touchstart/mousedown events on double tap since iOS 13.
         * There are two possible solutions:
         * 1) Call preventDefault in touchEnd handler. But it also prevents click event from firing.
         * 2) Add listener on dblclick event that fires with the preceding mousedown/mouseup.
         * https://developer.apple.com/forums/thread/125073
         */
        this._onMobileSafariDoubleClick = function (dblClickEvent) {
            if (_this._firesTouchEvents(dblClickEvent)) {
                ++_this._tapCount;
                if (_this._tapTimeoutId !== null && _this._tapCount > 1) {
                    var manhattanDistance = _this._mouseTouchMoveWithDownInfo(_this._getCoordinate(dblClickEvent), _this._tapCoordinate).manhattanDistance;
                    if (manhattanDistance < ManhattanDistance.DoubleTap && !_this._cancelTap) {
                        _this._processEvent(_this._makeCompatEvent(dblClickEvent), _this._handler.doubleTapEvent);
                    }
                    _this._resetTapTimeout();
                }
            }
            else {
                ++_this._clickCount;
                if (_this._clickTimeoutId !== null && _this._clickCount > 1) {
                    var manhattanDistance = _this._mouseTouchMoveWithDownInfo(_this._getCoordinate(dblClickEvent), _this._clickCoordinate).manhattanDistance;
                    if (manhattanDistance < ManhattanDistance.DoubleClick && !_this._cancelClick) {
                        _this._processEvent(_this._makeCompatEvent(dblClickEvent), _this._handler.mouseDoubleClickEvent);
                    }
                    _this._resetClickTimeout();
                }
            }
        };
        this._target = target;
        this._handler = handler;
        this._options = options;
        this._init();
    }
    SyntheticEvent.prototype.destroy = function () {
        if (this._unsubscribeOutsideMouseEvents !== null) {
            this._unsubscribeOutsideMouseEvents();
            this._unsubscribeOutsideMouseEvents = null;
        }
        if (this._unsubscribeOutsideTouchEvents !== null) {
            this._unsubscribeOutsideTouchEvents();
            this._unsubscribeOutsideTouchEvents = null;
        }
        if (this._unsubscribeMousemove !== null) {
            this._unsubscribeMousemove();
            this._unsubscribeMousemove = null;
        }
        if (this._unsubscribeMouseWheel !== null) {
            this._unsubscribeMouseWheel();
            this._unsubscribeMouseWheel = null;
        }
        if (this._unsubscribeContextMenu !== null) {
            this._unsubscribeContextMenu();
            this._unsubscribeContextMenu = null;
        }
        if (this._unsubscribeRootMouseEvents !== null) {
            this._unsubscribeRootMouseEvents();
            this._unsubscribeRootMouseEvents = null;
        }
        if (this._unsubscribeRootTouchEvents !== null) {
            this._unsubscribeRootTouchEvents();
            this._unsubscribeRootTouchEvents = null;
        }
        if (this._unsubscribeMobileSafariEvents !== null) {
            this._unsubscribeMobileSafariEvents();
            this._unsubscribeMobileSafariEvents = null;
        }
        this._clearLongTapTimeout();
        this._resetClickTimeout();
    };
    SyntheticEvent.prototype._mouseEnterHandler = function (enterEvent) {
        var _this = this;
        var _a, _b, _c;
        (_a = this._unsubscribeMousemove) === null || _a === void 0 ? void 0 : _a.call(this);
        (_b = this._unsubscribeMouseWheel) === null || _b === void 0 ? void 0 : _b.call(this);
        (_c = this._unsubscribeContextMenu) === null || _c === void 0 ? void 0 : _c.call(this);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        var boundMouseMoveHandler = this._mouseMoveHandler.bind(this);
        this._unsubscribeMousemove = function () {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            _this._target.removeEventListener('mousemove', boundMouseMoveHandler);
        };
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this._target.addEventListener('mousemove', boundMouseMoveHandler);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        var boundMouseWheel = this._mouseWheelHandler.bind(this);
        this._unsubscribeMouseWheel = function () {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            _this._target.removeEventListener('wheel', boundMouseWheel);
        };
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this._target.addEventListener('wheel', boundMouseWheel, { passive: false });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        var boundContextMenu = this._contextMenuHandler.bind(this);
        this._unsubscribeContextMenu = function () {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            _this._target.removeEventListener('contextmenu', boundContextMenu);
        };
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this._target.addEventListener('contextmenu', boundContextMenu, { passive: false });
        if (this._firesTouchEvents(enterEvent)) {
            return;
        }
        this._processEvent(this._makeCompatEvent(enterEvent), this._handler.mouseEnterEvent);
        this._acceptMouseLeave = true;
    };
    SyntheticEvent.prototype._resetClickTimeout = function () {
        if (this._clickTimeoutId !== null) {
            clearTimeout(this._clickTimeoutId);
        }
        this._clickCount = 0;
        this._clickTimeoutId = null;
        this._clickCoordinate = { x: Number.NEGATIVE_INFINITY, y: Number.POSITIVE_INFINITY };
    };
    SyntheticEvent.prototype._resetTapTimeout = function () {
        if (this._tapTimeoutId !== null) {
            clearTimeout(this._tapTimeoutId);
        }
        this._tapCount = 0;
        this._tapTimeoutId = null;
        this._tapCoordinate = { x: Number.NEGATIVE_INFINITY, y: Number.POSITIVE_INFINITY };
    };
    SyntheticEvent.prototype._mouseMoveHandler = function (moveEvent) {
        if (this._mousePressed || this._touchMoveStartCoordinate !== null) {
            return;
        }
        if (this._firesTouchEvents(moveEvent)) {
            return;
        }
        this._processEvent(this._makeCompatEvent(moveEvent), this._handler.mouseMoveEvent);
        this._acceptMouseLeave = true;
    };
    SyntheticEvent.prototype._mouseWheelHandler = function (wheelEvent) {
        if (Math.abs(wheelEvent.deltaX) > Math.abs(wheelEvent.deltaY)) {
            if (!(0, typeChecks_1.isValid)(this._handler.mouseWheelHortEvent)) {
                return;
            }
            this._preventDefault(wheelEvent);
            if (Math.abs(wheelEvent.deltaX) === 0) {
                return;
            }
            this._handler.mouseWheelHortEvent(this._makeCompatEvent(wheelEvent), -wheelEvent.deltaX);
        }
        else {
            if (!(0, typeChecks_1.isValid)(this._handler.mouseWheelVertEvent)) {
                return;
            }
            var deltaY = -(wheelEvent.deltaY / 100);
            if (deltaY === 0) {
                return;
            }
            this._preventDefault(wheelEvent);
            switch (wheelEvent.deltaMode) {
                case wheelEvent.DOM_DELTA_PAGE: {
                    deltaY *= 120;
                    break;
                }
                case wheelEvent.DOM_DELTA_LINE: {
                    deltaY *= 32;
                    break;
                }
            }
            if (deltaY !== 0) {
                var scale = Math.sign(deltaY) * Math.min(1, Math.abs(deltaY));
                this._handler.mouseWheelVertEvent(this._makeCompatEvent(wheelEvent), scale);
            }
        }
    };
    SyntheticEvent.prototype._contextMenuHandler = function (mouseEvent) {
        this._preventDefault(mouseEvent);
    };
    SyntheticEvent.prototype._touchMoveHandler = function (moveEvent) {
        var touch = this._touchWithId(moveEvent.changedTouches, this._activeTouchId);
        if (touch === null) {
            return;
        }
        this._lastTouchEventTimeStamp = this._eventTimeStamp(moveEvent);
        if (this._startPinchMiddleCoordinate !== null) {
            return;
        }
        if (this._preventTouchDragProcess) {
            return;
        }
        // prevent pinch if move event comes faster than the second touch
        this._pinchPrevented = true;
        var moveInfo = this._mouseTouchMoveWithDownInfo(this._getCoordinate(touch), this._touchMoveStartCoordinate);
        var xOffset = moveInfo.xOffset, yOffset = moveInfo.yOffset, manhattanDistance = moveInfo.manhattanDistance;
        if (!this._touchMoveExceededManhattanDistance && manhattanDistance < ManhattanDistance.CancelTap) {
            return;
        }
        if (!this._touchMoveExceededManhattanDistance) {
            // first time when current position exceeded manhattan distance
            // vertical drag is more important than horizontal drag
            // because we scroll the page vertically often than horizontally
            var correctedXOffset = xOffset * 0.5;
            // a drag can be only if touch page scroll isn't allowed
            var isVertDrag = yOffset >= correctedXOffset && !this._options.treatVertDragAsPageScroll();
            var isHorzDrag = correctedXOffset > yOffset && !this._options.treatHorzDragAsPageScroll();
            // if drag event happened then we should revert preventDefault state to original one
            // and try to process the drag event
            // else we shouldn't prevent default of the event and ignore processing the drag event
            if (!isVertDrag && !isHorzDrag) {
                this._preventTouchDragProcess = true;
            }
            this._touchMoveExceededManhattanDistance = true;
            // if manhattan distance is more that 5 - we should cancel tap event
            this._cancelTap = true;
            this._clearLongTapTimeout();
            this._resetTapTimeout();
        }
        if (!this._preventTouchDragProcess) {
            this._processEvent(this._makeCompatEvent(moveEvent, touch), this._handler.touchMoveEvent);
            // we should prevent default in case of touch only
            // to prevent scroll of the page
            // preventDefault(moveEvent)
        }
    };
    SyntheticEvent.prototype._mouseMoveWithDownHandler = function (moveEvent) {
        if (moveEvent.button !== MouseEventButton.Left) {
            return;
        }
        var moveInfo = this._mouseTouchMoveWithDownInfo(this._getCoordinate(moveEvent), this._mouseMoveStartCoordinate);
        var manhattanDistance = moveInfo.manhattanDistance;
        if (manhattanDistance >= ManhattanDistance.CancelClick) {
            // if manhattan distance is more that 5 - we should cancel click event
            this._cancelClick = true;
            this._resetClickTimeout();
        }
        if (this._cancelClick) {
            // if this._cancelClick is true, that means that minimum manhattan distance is already exceeded
            this._processEvent(this._makeCompatEvent(moveEvent), this._handler.pressedMouseMoveEvent);
        }
    };
    SyntheticEvent.prototype._mouseTouchMoveWithDownInfo = function (currentCoordinate, startCoordinate) {
        var xOffset = Math.abs(startCoordinate.x - currentCoordinate.x);
        var yOffset = Math.abs(startCoordinate.y - currentCoordinate.y);
        var manhattanDistance = xOffset + yOffset;
        return { xOffset: xOffset, yOffset: yOffset, manhattanDistance: manhattanDistance };
    };
    SyntheticEvent.prototype._touchEndHandler = function (touchEndEvent) {
        var touch = this._touchWithId(touchEndEvent.changedTouches, this._activeTouchId);
        if (touch === null && touchEndEvent.touches.length === 0) {
            // something went wrong, somehow we missed the required touchend event
            // probably the browser has not sent this event
            touch = touchEndEvent.changedTouches[0];
        }
        if (touch === null) {
            return;
        }
        this._activeTouchId = null;
        this._lastTouchEventTimeStamp = this._eventTimeStamp(touchEndEvent);
        this._clearLongTapTimeout();
        this._touchMoveStartCoordinate = null;
        if (this._unsubscribeRootTouchEvents !== null) {
            this._unsubscribeRootTouchEvents();
            this._unsubscribeRootTouchEvents = null;
        }
        var compatEvent = this._makeCompatEvent(touchEndEvent, touch);
        this._processEvent(compatEvent, this._handler.touchEndEvent);
        ++this._tapCount;
        if (this._tapTimeoutId !== null && this._tapCount > 1) {
            // check that both clicks are near enough
            var manhattanDistance = this._mouseTouchMoveWithDownInfo(this._getCoordinate(touch), this._tapCoordinate).manhattanDistance;
            if (manhattanDistance < ManhattanDistance.DoubleTap && !this._cancelTap) {
                this._processEvent(compatEvent, this._handler.doubleTapEvent);
            }
            this._resetTapTimeout();
        }
        else {
            if (!this._cancelTap) {
                this._processEvent(compatEvent, this._handler.tapEvent);
                // do not fire mouse events if tap handler was executed
                // prevent click event on new dom element (who appeared after tap)
                if ((0, typeChecks_1.isValid)(this._handler.tapEvent)) {
                    this._preventDefault(touchEndEvent);
                }
            }
        }
        // prevent, for example, safari's dblclick-to-zoom or fast-click after long-tap
        // we handle mouseDoubleClickEvent here ourselves
        if (this._tapCount === 0) {
            this._preventDefault(touchEndEvent);
        }
        if (touchEndEvent.touches.length === 0) {
            if (this._longTapActive) {
                this._longTapActive = false;
                // prevent native click event
                this._preventDefault(touchEndEvent);
            }
        }
    };
    SyntheticEvent.prototype._mouseUpHandler = function (mouseUpEvent) {
        if (mouseUpEvent.button !== MouseEventButton.Left) {
            return;
        }
        var compatEvent = this._makeCompatEvent(mouseUpEvent);
        this._mouseMoveStartCoordinate = null;
        this._mousePressed = false;
        if (this._unsubscribeRootMouseEvents !== null) {
            this._unsubscribeRootMouseEvents();
            this._unsubscribeRootMouseEvents = null;
        }
        if ((0, platform_1.isFF)()) {
            var rootElement = this._target.ownerDocument.documentElement;
            rootElement.removeEventListener('mouseleave', this._onFirefoxOutsideMouseUp);
        }
        if (this._firesTouchEvents(mouseUpEvent)) {
            return;
        }
        this._processEvent(compatEvent, this._handler.mouseUpEvent);
        ++this._clickCount;
        if (this._clickTimeoutId !== null && this._clickCount > 1) {
            // check that both clicks are near enough
            var manhattanDistance = this._mouseTouchMoveWithDownInfo(this._getCoordinate(mouseUpEvent), this._clickCoordinate).manhattanDistance;
            if (manhattanDistance < ManhattanDistance.DoubleClick && !this._cancelClick) {
                this._processEvent(compatEvent, this._handler.mouseDoubleClickEvent);
            }
            this._resetClickTimeout();
        }
        else {
            if (!this._cancelClick) {
                this._processEvent(compatEvent, this._handler.mouseClickEvent);
            }
        }
    };
    SyntheticEvent.prototype._clearLongTapTimeout = function () {
        if (this._longTapTimeoutId === null) {
            return;
        }
        clearTimeout(this._longTapTimeoutId);
        this._longTapTimeoutId = null;
    };
    SyntheticEvent.prototype._touchStartHandler = function (downEvent) {
        if (this._activeTouchId !== null) {
            return;
        }
        var touch = downEvent.changedTouches[0];
        this._activeTouchId = touch.identifier;
        this._lastTouchEventTimeStamp = this._eventTimeStamp(downEvent);
        var rootElement = this._target.ownerDocument.documentElement;
        this._cancelTap = false;
        this._touchMoveExceededManhattanDistance = false;
        this._preventTouchDragProcess = false;
        this._touchMoveStartCoordinate = this._getCoordinate(touch);
        if (this._unsubscribeRootTouchEvents !== null) {
            this._unsubscribeRootTouchEvents();
            this._unsubscribeRootTouchEvents = null;
        }
        {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            var boundTouchMoveWithDownHandler_1 = this._touchMoveHandler.bind(this);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            var boundTouchEndHandler_1 = this._touchEndHandler.bind(this);
            this._unsubscribeRootTouchEvents = function () {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                rootElement.removeEventListener('touchmove', boundTouchMoveWithDownHandler_1);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                rootElement.removeEventListener('touchend', boundTouchEndHandler_1);
            };
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            rootElement.addEventListener('touchmove', boundTouchMoveWithDownHandler_1, { passive: false });
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            rootElement.addEventListener('touchend', boundTouchEndHandler_1, { passive: false });
            this._clearLongTapTimeout();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            this._longTapTimeoutId = setTimeout(this._longTapHandler.bind(this, downEvent), Delay.LongTap);
        }
        this._processEvent(this._makeCompatEvent(downEvent, touch), this._handler.touchStartEvent);
        if (this._tapTimeoutId === null) {
            this._tapCount = 0;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            this._tapTimeoutId = setTimeout(this._resetTapTimeout.bind(this), Delay.ResetClick);
            this._tapCoordinate = this._getCoordinate(touch);
        }
    };
    SyntheticEvent.prototype._mouseDownHandler = function (downEvent) {
        if (downEvent.button === MouseEventButton.Right) {
            this._preventDefault(downEvent);
            this._processEvent(this._makeCompatEvent(downEvent), this._handler.mouseRightClickEvent);
            return;
        }
        if (downEvent.button !== MouseEventButton.Left) {
            return;
        }
        var rootElement = this._target.ownerDocument.documentElement;
        if ((0, platform_1.isFF)()) {
            rootElement.addEventListener('mouseleave', this._onFirefoxOutsideMouseUp);
        }
        this._cancelClick = false;
        this._mouseMoveStartCoordinate = this._getCoordinate(downEvent);
        if (this._unsubscribeRootMouseEvents !== null) {
            this._unsubscribeRootMouseEvents();
            this._unsubscribeRootMouseEvents = null;
        }
        {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            var boundMouseMoveWithDownHandler_1 = this._mouseMoveWithDownHandler.bind(this);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            var boundMouseUpHandler_1 = this._mouseUpHandler.bind(this);
            this._unsubscribeRootMouseEvents = function () {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                rootElement.removeEventListener('mousemove', boundMouseMoveWithDownHandler_1);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                rootElement.removeEventListener('mouseup', boundMouseUpHandler_1);
            };
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            rootElement.addEventListener('mousemove', boundMouseMoveWithDownHandler_1);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            rootElement.addEventListener('mouseup', boundMouseUpHandler_1);
        }
        this._mousePressed = true;
        if (this._firesTouchEvents(downEvent)) {
            return;
        }
        this._processEvent(this._makeCompatEvent(downEvent), this._handler.mouseDownEvent);
        if (this._clickTimeoutId === null) {
            this._clickCount = 0;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            this._clickTimeoutId = setTimeout(this._resetClickTimeout.bind(this), Delay.ResetClick);
            this._clickCoordinate = this._getCoordinate(downEvent);
        }
    };
    SyntheticEvent.prototype._init = function () {
        var _this = this;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this._target.addEventListener('mouseenter', this._mouseEnterHandler.bind(this));
        // Do not show context menu when something went wrong
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this._target.addEventListener('touchcancel', this._clearLongTapTimeout.bind(this));
        {
            var doc_1 = this._target.ownerDocument;
            var outsideHandler_1 = function (event) {
                if (_this._handler.mouseDownOutsideEvent == null) {
                    return;
                }
                if (event.composed && _this._target.contains(event.composedPath()[0])) {
                    return;
                }
                if ((event.target !== null) && _this._target.contains(event.target)) {
                    return;
                }
                _this._handler.mouseDownOutsideEvent({ x: 0, y: 0, pageX: 0, pageY: 0 });
            };
            this._unsubscribeOutsideTouchEvents = function () {
                doc_1.removeEventListener('touchstart', outsideHandler_1);
            };
            this._unsubscribeOutsideMouseEvents = function () {
                doc_1.removeEventListener('mousedown', outsideHandler_1);
            };
            doc_1.addEventListener('mousedown', outsideHandler_1);
            doc_1.addEventListener('touchstart', outsideHandler_1, { passive: true });
        }
        if ((0, platform_1.isIOS)()) {
            this._unsubscribeMobileSafariEvents = function () {
                _this._target.removeEventListener('dblclick', _this._onMobileSafariDoubleClick);
            };
            this._target.addEventListener('dblclick', this._onMobileSafariDoubleClick);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this._target.addEventListener('mouseleave', this._mouseLeaveHandler.bind(this));
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this._target.addEventListener('touchstart', this._touchStartHandler.bind(this), { passive: true });
        this._target.addEventListener('mousedown', function (e) {
            if (e.button === MouseEventButton.Middle) {
                // prevent incorrect scrolling event
                e.preventDefault();
                return false;
            }
            return undefined;
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this._target.addEventListener('mousedown', this._mouseDownHandler.bind(this));
        this._initPinch();
        // Hey mobile Safari, what's up?
        // If mobile Safari doesn't have any touchmove handler with passive=false
        // it treats a touchstart and the following touchmove events as cancelable=false,
        // so we can't prevent them (as soon we subscribe on touchmove inside touchstart's handler).
        // And we'll get scroll of the page along with chart's one instead of only chart's scroll.
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this._target.addEventListener('touchmove', function () { }, { passive: false });
    };
    SyntheticEvent.prototype._initPinch = function () {
        var _this = this;
        if (!(0, typeChecks_1.isValid)(this._handler.pinchStartEvent) &&
            !(0, typeChecks_1.isValid)(this._handler.pinchEvent) &&
            !(0, typeChecks_1.isValid)(this._handler.pinchEndEvent)) {
            return;
        }
        this._target.addEventListener('touchstart', function (event) { _this._checkPinchState(event.touches); }, { passive: true });
        this._target.addEventListener('touchmove', function (event) {
            if (event.touches.length !== 2 || _this._startPinchMiddleCoordinate === null) {
                return;
            }
            if ((0, typeChecks_1.isValid)(_this._handler.pinchEvent)) {
                var currentDistance = _this._getTouchDistance(event.touches[0], event.touches[1]);
                var scale = currentDistance / _this._startPinchDistance;
                _this._handler.pinchEvent(__assign(__assign({}, _this._startPinchMiddleCoordinate), { pageX: 0, pageY: 0 }), scale);
                _this._preventDefault(event);
            }
        }, { passive: false });
        this._target.addEventListener('touchend', function (event) {
            _this._checkPinchState(event.touches);
        });
    };
    SyntheticEvent.prototype._checkPinchState = function (touches) {
        if (touches.length === 1) {
            this._pinchPrevented = false;
        }
        if (touches.length !== 2 || this._pinchPrevented || this._longTapActive) {
            this._stopPinch();
        }
        else {
            this._startPinch(touches);
        }
    };
    SyntheticEvent.prototype._startPinch = function (touches) {
        var box = this._target.getBoundingClientRect();
        this._startPinchMiddleCoordinate = {
            x: ((touches[0].clientX - box.left) + (touches[1].clientX - box.left)) / 2,
            y: ((touches[0].clientY - box.top) + (touches[1].clientY - box.top)) / 2
        };
        this._startPinchDistance = this._getTouchDistance(touches[0], touches[1]);
        if ((0, typeChecks_1.isValid)(this._handler.pinchStartEvent)) {
            this._handler.pinchStartEvent({ x: 0, y: 0, pageX: 0, pageY: 0 });
        }
        this._clearLongTapTimeout();
    };
    SyntheticEvent.prototype._stopPinch = function () {
        if (this._startPinchMiddleCoordinate === null) {
            return;
        }
        this._startPinchMiddleCoordinate = null;
        if ((0, typeChecks_1.isValid)(this._handler.pinchEndEvent)) {
            this._handler.pinchEndEvent({ x: 0, y: 0, pageX: 0, pageY: 0 });
        }
    };
    SyntheticEvent.prototype._mouseLeaveHandler = function (event) {
        var _a, _b, _c;
        (_a = this._unsubscribeMousemove) === null || _a === void 0 ? void 0 : _a.call(this);
        (_b = this._unsubscribeMouseWheel) === null || _b === void 0 ? void 0 : _b.call(this);
        (_c = this._unsubscribeContextMenu) === null || _c === void 0 ? void 0 : _c.call(this);
        if (this._firesTouchEvents(event)) {
            return;
        }
        if (!this._acceptMouseLeave) {
            // mobile Safari sometimes emits mouse leave event for no reason, there is no way to handle it in other way
            // just ignore this event if there was no mouse move or mouse enter events
            return;
        }
        this._processEvent(this._makeCompatEvent(event), this._handler.mouseLeaveEvent);
        // accept all mouse leave events if it's not an iOS device
        this._acceptMouseLeave = !(0, platform_1.isIOS)();
    };
    SyntheticEvent.prototype._longTapHandler = function (event) {
        var touch = this._touchWithId(event.touches, this._activeTouchId);
        if (touch === null) {
            return;
        }
        this._processEvent(this._makeCompatEvent(event, touch), this._handler.longTapEvent);
        this._cancelTap = true;
        // long tap is active until touchend event with 0 touches occurred
        this._longTapActive = true;
    };
    SyntheticEvent.prototype._firesTouchEvents = function (e) {
        var _a;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if ((0, typeChecks_1.isValid)((_a = e.sourceCapabilities) === null || _a === void 0 ? void 0 : _a.firesTouchEvents)) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
            return e.sourceCapabilities.firesTouchEvents;
        }
        return this._eventTimeStamp(e) < this._lastTouchEventTimeStamp + Delay.PreventFiresTouchEvents;
    };
    SyntheticEvent.prototype._processEvent = function (event, callback) {
        callback === null || callback === void 0 ? void 0 : callback.call(this._handler, event);
    };
    SyntheticEvent.prototype._makeCompatEvent = function (event, touch) {
        var _this = this;
        // TouchEvent has no clientX/Y coordinates:
        // We have to use the last Touch instead
        var eventLike = touch !== null && touch !== void 0 ? touch : event;
        var box = this._target.getBoundingClientRect();
        return {
            x: eventLike.clientX - box.left,
            y: eventLike.clientY - box.top,
            pageX: eventLike.pageX,
            pageY: eventLike.pageY,
            isTouch: !event.type.startsWith('mouse') && event.type !== 'contextmenu' && event.type !== 'click' && event.type !== 'wheel',
            preventDefault: function () {
                if (event.type !== 'touchstart') {
                    // touchstart is passive and cannot be prevented
                    _this._preventDefault(event);
                }
            }
        };
    };
    SyntheticEvent.prototype._getTouchDistance = function (p1, p2) {
        var xDiff = p1.clientX - p2.clientX;
        var yDiff = p1.clientY - p2.clientY;
        return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    };
    SyntheticEvent.prototype._preventDefault = function (event) {
        if (event.cancelable) {
            event.preventDefault();
        }
    };
    SyntheticEvent.prototype._getCoordinate = function (eventLike) {
        return {
            x: eventLike.pageX,
            y: eventLike.pageY
        };
    };
    SyntheticEvent.prototype._eventTimeStamp = function (e) {
        var _a;
        // for some reason e.timestamp is always 0 on iPad with magic mouse, so we use performance.now() as a fallback
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        return (_a = e.timeStamp) !== null && _a !== void 0 ? _a : performance.now();
    };
    SyntheticEvent.prototype._touchWithId = function (touches, id) {
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (var i = 0; i < touches.length; ++i) {
            if (touches[i].identifier === id) {
                return touches[i];
            }
        }
        return null;
    };
    return SyntheticEvent;
}());
exports.default = SyntheticEvent;
//# sourceMappingURL=SyntheticEvent.js.map