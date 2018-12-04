(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@babel/runtime/helpers/readOnlyError'), require('@babel/runtime/helpers/extends'), require('@babel/runtime/helpers/objectSpread'), require('@babel/runtime/helpers/classCallCheck'), require('@babel/runtime/helpers/createClass'), require('@babel/runtime/helpers/typeof')) :
  typeof define === 'function' && define.amd ? define(['exports', '@babel/runtime/helpers/readOnlyError', '@babel/runtime/helpers/extends', '@babel/runtime/helpers/objectSpread', '@babel/runtime/helpers/classCallCheck', '@babel/runtime/helpers/createClass', '@babel/runtime/helpers/typeof'], factory) :
  (factory((global.Gantt = {}),global._readOnlyError,global._extends,global._objectSpread,global._classCallCheck,global._createClass,global._typeof));
}(this, (function (exports,_readOnlyError,_extends,_objectSpread,_classCallCheck,_createClass,_typeof) { 'use strict';

  _readOnlyError = _readOnlyError && _readOnlyError.hasOwnProperty('default') ? _readOnlyError['default'] : _readOnlyError;
  _extends = _extends && _extends.hasOwnProperty('default') ? _extends['default'] : _extends;
  _objectSpread = _objectSpread && _objectSpread.hasOwnProperty('default') ? _objectSpread['default'] : _objectSpread;
  _classCallCheck = _classCallCheck && _classCallCheck.hasOwnProperty('default') ? _classCallCheck['default'] : _classCallCheck;
  _createClass = _createClass && _createClass.hasOwnProperty('default') ? _createClass['default'] : _createClass;
  _typeof = _typeof && _typeof.hasOwnProperty('default') ? _typeof['default'] : _typeof;

  function addChild(c, childNodes) {
    if (c === null || c === undefined) return;

    if (typeof c === 'string' || typeof c === 'number') {
      childNodes.push(c.toString());
    } else if (Array.isArray(c)) {
      for (var i = 0; i < c.length; i++) {
        addChild(c[i], childNodes);
      }
    } else {
      childNodes.push(c);
    }
  }

  function h(tag, props) {
    var childNodes = [];

    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    addChild(children, childNodes);

    if (typeof tag === 'function') {
      return tag(_objectSpread({}, props, {
        children: childNodes
      }));
    }

    return {
      tag: tag,
      props: props,
      children: childNodes
    };
  }

  var DAY = 24 * 3600 * 1000;
  function addDays(date, days) {
    return new Date(date.valueOf() + days * DAY);
  }
  function getDates(begin, end) {
    var dates = [];
    var s = new Date(begin);
    s.setHours(24, 0, 0, 0);

    while (s.getTime() <= end) {
      dates.push(s.getTime());
      s = (_readOnlyError("s"), addDays(s, 1));
    }

    return dates;
  }
  var ctx = null;
  function textWidth(text, font, pad) {
    ctx = ctx || document.createElement('canvas').getContext('2d');
    ctx.font = font;
    return ctx.measureText(text).width + pad;
  }
  function formatMonth(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    return "".concat(y, "/").concat(m > 9 ? m : "0".concat(m));
  }
  function formatDay(date) {
    var m = date.getMonth() + 1;
    var d = date.getDate();
    return "".concat(m, "/").concat(d);
  }
  function minDate(a, b) {
    if (a && b) {
      return a > b ? b : a;
    }

    return a || b;
  }
  function maxDate(a, b) {
    if (a && b) {
      return a < b ? b : a;
    }

    return a || b;
  }
  function max(list, defaultValue) {
    if (list.length) {
      return Math.max.apply(null, list);
    }

    return defaultValue;
  }

  function Layout(_ref) {
    var styles = _ref.styles,
        width = _ref.width,
        height = _ref.height,
        offsetY = _ref.offsetY,
        thickWidth = _ref.thickWidth,
        maxTextWidth = _ref.maxTextWidth;
    var x0 = thickWidth / 2;
    var W = width - thickWidth;
    var H = height - thickWidth;
    return h("g", null, h("rect", {
      x: x0,
      y: x0,
      width: W,
      height: H,
      style: styles.box
    }), h("line", {
      x1: 0,
      x2: width,
      y1: offsetY - x0,
      y2: offsetY - x0,
      style: styles.bline
    }), h("line", {
      x1: maxTextWidth,
      x2: width,
      y1: offsetY / 2,
      y2: offsetY / 2,
      style: styles.line
    }));
  }

  function YearMonth(_ref) {
    var styles = _ref.styles,
        dates = _ref.dates,
        unit = _ref.unit,
        offsetY = _ref.offsetY,
        minTime = _ref.minTime,
        maxTime = _ref.maxTime,
        maxTextWidth = _ref.maxTextWidth;
    var months = dates.filter(function (v) {
      return new Date(v).getDate() === 1;
    });
    months.unshift(minTime);
    months.push(maxTime);
    var ticks = [];
    var x0 = maxTextWidth;
    var y2 = offsetY / 2;
    var len = months.length - 1;

    for (var i = 0; i < len; i++) {
      var cur = new Date(months[i]);
      var str = formatMonth(cur);
      var x = x0 + (months[i] - minTime) / unit;
      var t = (months[i + 1] - months[i]) / unit;
      ticks.push(h("g", null, h("line", {
        x1: x,
        x2: x,
        y1: 0,
        y2: y2,
        style: styles.line
      }), t > 50 ? h("text", {
        x: x + t / 2,
        y: offsetY * 0.25,
        style: styles.text3
      }, str) : null));
    }

    return h("g", null, ticks);
  }

  function DayHeader(_ref) {
    var styles = _ref.styles,
        unit = _ref.unit,
        minTime = _ref.minTime,
        maxTime = _ref.maxTime,
        height = _ref.height,
        offsetY = _ref.offsetY,
        maxTextWidth = _ref.maxTextWidth,
        footerHeight = _ref.footerHeight;
    var dates = getDates(minTime, maxTime);
    var ticks = [];
    var x0 = maxTextWidth;
    var y0 = offsetY / 2;
    var RH = height - y0 - footerHeight;
    var len = dates.length - 1;

    for (var i = 0; i < len; i++) {
      var cur = new Date(dates[i]);
      var day = cur.getDay();
      var x = x0 + (dates[i] - minTime) / unit;
      var t = (dates[i + 1] - dates[i]) / unit;
      ticks.push(h("g", null, day === 0 || day === 6 ? h("rect", {
        x: x,
        y: y0,
        width: t,
        height: RH,
        style: styles.week
      }) : null, h("line", {
        x1: x,
        x2: x,
        y1: y0,
        y2: offsetY,
        style: styles.line
      }), h("text", {
        x: x + t / 2,
        y: offsetY * 0.75,
        style: styles.text3
      }, cur.getDate()), i === len - 1 ? h("line", {
        x1: x + t,
        x2: x + t,
        y1: y0,
        y2: offsetY,
        style: styles.line
      }) : null));
    }

    return h("g", null, h(YearMonth, {
      styles: styles,
      unit: unit,
      dates: dates,
      offsetY: offsetY,
      minTime: minTime,
      maxTime: maxTime,
      maxTextWidth: maxTextWidth
    }), ticks);
  }

  function WeekHeader(_ref) {
    var styles = _ref.styles,
        unit = _ref.unit,
        minTime = _ref.minTime,
        maxTime = _ref.maxTime,
        height = _ref.height,
        offsetY = _ref.offsetY,
        maxTextWidth = _ref.maxTextWidth,
        footerHeight = _ref.footerHeight;
    var dates = getDates(minTime, maxTime);
    var weeks = dates.filter(function (v) {
      return new Date(v).getDay() === 0;
    });
    weeks.push(maxTime);
    var ticks = [];
    var x0 = maxTextWidth;
    var y0 = offsetY / 2;
    var RH = height - y0 - footerHeight;
    var d = DAY / unit;
    var len = weeks.length - 1;

    for (var i = 0; i < len; i++) {
      var cur = new Date(weeks[i]);
      var x = x0 + (weeks[i] - minTime) / unit;
      var curDay = cur.getDate();
      var prevDay = addDays(cur, -1).getDate();
      ticks.push(h("g", null, h("rect", {
        x: x - d,
        y: y0,
        width: d * 2,
        height: RH,
        style: styles.week
      }), h("line", {
        x1: x,
        x2: x,
        y1: y0,
        y2: offsetY,
        style: styles.line
      }), h("text", {
        x: x + 3,
        y: offsetY * 0.75,
        style: styles.text2
      }, curDay), x - x0 > 28 ? h("text", {
        x: x - 3,
        y: offsetY * 0.75,
        style: styles.text1
      }, prevDay) : null));
    }

    return h("g", null, h(YearMonth, {
      styles: styles,
      unit: unit,
      dates: dates,
      offsetY: offsetY,
      minTime: minTime,
      maxTime: maxTime,
      maxTextWidth: maxTextWidth
    }), ticks);
  }

  function Year(_ref) {
    var styles = _ref.styles,
        months = _ref.months,
        unit = _ref.unit,
        offsetY = _ref.offsetY,
        minTime = _ref.minTime,
        maxTime = _ref.maxTime,
        maxTextWidth = _ref.maxTextWidth;
    var years = months.filter(function (v) {
      return new Date(v).getMonth() === 0;
    });
    years.unshift(minTime);
    years.push(maxTime);
    var ticks = [];
    var x0 = maxTextWidth;
    var y2 = offsetY / 2;
    var len = years.length - 1;

    for (var i = 0; i < len; i++) {
      var cur = new Date(years[i]);
      var x = x0 + (years[i] - minTime) / unit;
      var t = (years[i + 1] - years[i]) / unit;
      ticks.push(h("g", null, h("line", {
        x1: x,
        x2: x,
        y1: 0,
        y2: y2,
        style: styles.line
      }), t > 35 ? h("text", {
        x: x + t / 2,
        y: offsetY * 0.25,
        style: styles.text3
      }, cur.getFullYear()) : null));
    }

    return h("g", null, ticks);
  }

  function MonthHeader(_ref) {
    var styles = _ref.styles,
        unit = _ref.unit,
        minTime = _ref.minTime,
        maxTime = _ref.maxTime,
        offsetY = _ref.offsetY,
        maxTextWidth = _ref.maxTextWidth;
    var MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var dates = getDates(minTime, maxTime);
    var months = dates.filter(function (v) {
      return new Date(v).getDate() === 1;
    });
    months.unshift(minTime);
    months.push(maxTime);
    var ticks = [];
    var x0 = maxTextWidth;
    var y0 = offsetY / 2;
    var len = months.length - 1;

    for (var i = 0; i < len; i++) {
      var cur = new Date(months[i]);
      var month = cur.getMonth();
      var x = x0 + (months[i] - minTime) / unit;
      var t = (months[i + 1] - months[i]) / unit;
      ticks.push(h("g", null, h("line", {
        x1: x,
        x2: x,
        y1: y0,
        y2: offsetY,
        style: styles.line
      }), t > 30 ? h("text", {
        x: x + t / 2,
        y: offsetY * 0.75,
        style: styles.text3
      }, MONTH[month]) : null));
    }

    return h("g", null, h(Year, {
      styles: styles,
      unit: unit,
      months: months,
      offsetY: offsetY,
      minTime: minTime,
      maxTime: maxTime,
      maxTextWidth: maxTextWidth
    }), ticks);
  }

  function Grid(_ref) {
    var styles = _ref.styles,
        data = _ref.data,
        width = _ref.width,
        height = _ref.height,
        offsetY = _ref.offsetY,
        thickWidth = _ref.thickWidth,
        rowHeight = _ref.rowHeight,
        footerHeight = _ref.footerHeight,
        maxTextWidth = _ref.maxTextWidth;
    var H = height - footerHeight;
    return h("g", null, data.map(function (v, i) {
      var y = (i + 1) * rowHeight + offsetY;
      return h("line", {
        key: i,
        x1: 0,
        x2: width,
        y1: y,
        y2: y,
        style: styles.line
      });
    }), h("line", {
      x1: maxTextWidth,
      x2: maxTextWidth,
      y1: 0,
      y2: H,
      style: styles.bline
    }));
  }

  function Labels(_ref) {
    var styles = _ref.styles,
        data = _ref.data,
        rowHeight = _ref.rowHeight,
        offsetY = _ref.offsetY;
    return h("g", null, data.map(function (v, i) {
      return h("text", {
        key: i,
        x: 10,
        y: (i + 0.5) * rowHeight + offsetY,
        style: styles.label
      }, v.text);
    }));
  }

  function Bar(_ref) {
    var styles = _ref.styles,
        data = _ref.data,
        unit = _ref.unit,
        height = _ref.height,
        offsetY = _ref.offsetY,
        minTime = _ref.minTime,
        rowHeight = _ref.rowHeight,
        barHeight = _ref.barHeight,
        footerHeight = _ref.footerHeight,
        maxTextWidth = _ref.maxTextWidth,
        current = _ref.current,
        onClick = _ref.onClick;
    var x0 = maxTextWidth;
    var y0 = (rowHeight - barHeight) / 2 + offsetY;
    var cur = x0 + (current - minTime) / unit;
    return h("g", null, h("line", {
      x1: cur,
      x2: cur,
      y1: offsetY,
      y2: height - footerHeight,
      style: styles.cline
    }), data.map(function (v, i) {
      if (!v.end || !v.start) {
        return null;
      }

      var x = x0 + (v.start - minTime) / unit;
      var y = y0 + i * rowHeight;
      var cy = y + barHeight / 2;

      if (v.type === 'milestone') {
        var _h = barHeight / 2;

        var points = [[x, cy - _h], [x + _h, cy], [x, cy + _h], [x - _h, cy]].map(function (p) {
          return "".concat(p[0], ",").concat(p[1]);
        }).join(' ');
        return h("g", {
          key: i,
          class: "gantt-bar",
          style: {
            cursor: 'pointer'
          },
          onClick: handler
        }, h("polygon", {
          points: points,
          style: styles.milestone,
          onClick: handler
        }), h("circle", {
          class: "gantt-ctrl-start",
          "data-id": v.id,
          cx: x - 12,
          cy: cy,
          r: 6,
          style: styles.ctrl
        }), h("circle", {
          class: "gantt-ctrl-finish",
          "data-id": v.id,
          cx: x + barHeight + 12,
          cy: cy,
          r: 6,
          style: styles.ctrl
        }));
      }

      var w1 = (v.end - v.start) / unit;
      var w2 = w1 * v.percent;
      var bar = v.type === 'group' ? {
        back: styles.groupBack,
        front: styles.groupFront
      } : {
        back: styles.taskBack,
        front: styles.taskFront
      };

      if (x + w2 < cur && v.percent < 0.999999) {
        bar.front = styles.warning;
      }

      if (x + w1 < cur && v.percent < 0.999999) {
        bar.front = styles.danger;
      }

      var handler = function handler() {
        return onClick(v);
      };

      return h("g", {
        key: i,
        class: "gantt-bar",
        style: {
          cursor: 'pointer'
        },
        onClick: handler
      }, h("text", {
        x: x - 4,
        y: cy,
        style: styles.text1
      }, formatDay(new Date(v.from))), h("text", {
        x: x + w1 + 4,
        y: cy,
        style: styles.text2
      }, formatDay(new Date(v.to))), h("rect", {
        x: x,
        y: y,
        width: w1,
        height: barHeight,
        rx: 1.8,
        ry: 1.8,
        style: bar.back,
        onClick: handler
      }), w2 > 0.000001 ? h("rect", {
        x: x,
        y: y,
        width: w2,
        height: barHeight,
        rx: 1.8,
        ry: 1.8,
        style: bar.front
      }) : null, h("circle", {
        class: "gantt-ctrl-start",
        "data-id": v.id,
        cx: x - 12,
        cy: cy,
        r: 6,
        style: styles.ctrl
      }), h("circle", {
        class: "gantt-ctrl-finish",
        "data-id": v.id,
        cx: x + w1 + 12,
        cy: cy,
        r: 6,
        style: styles.ctrl
      }));
    }));
  }

  function Legend(_ref) {
    var styles = _ref.styles,
        legends = _ref.legends,
        width = _ref.width,
        height = _ref.height,
        barHeight = _ref.barHeight,
        footerHeight = _ref.footerHeight;
    var W = 100;
    var len = legends.length;
    return h("g", null, legends.map(function (v, i) {
      var x = (width - len * W) / 2 + i * W;
      var y = height - footerHeight / 2;
      var RY = y - barHeight / 2;
      return h("g", {
        key: i
      }, h("rect", {
        x: x,
        y: RY,
        width: barHeight,
        height: barHeight,
        style: styles[v.type]
      }), h("text", {
        x: x + barHeight + 5,
        y: y,
        style: styles.label
      }, v.name));
    }));
  }

  var SIZE = '14px';
  var TYPE = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  function getFont(_ref) {
    var _ref$fontSize = _ref.fontSize,
        fontSize = _ref$fontSize === void 0 ? SIZE : _ref$fontSize,
        _ref$fontFamily = _ref.fontFamily,
        fontFamily = _ref$fontFamily === void 0 ? TYPE : _ref$fontFamily;
    return "bold ".concat(fontSize, " ").concat(fontFamily);
  }
  function getStyles(_ref2) {
    var _ref2$bgColor = _ref2.bgColor,
        bgColor = _ref2$bgColor === void 0 ? '#fff' : _ref2$bgColor,
        _ref2$lineColor = _ref2.lineColor,
        lineColor = _ref2$lineColor === void 0 ? '#eee' : _ref2$lineColor,
        _ref2$redLineColor = _ref2.redLineColor,
        redLineColor = _ref2$redLineColor === void 0 ? '#f04134' : _ref2$redLineColor,
        _ref2$groupBack = _ref2.groupBack,
        groupBack = _ref2$groupBack === void 0 ? '#3db9d3' : _ref2$groupBack,
        _ref2$groupFront = _ref2.groupFront,
        groupFront = _ref2$groupFront === void 0 ? '#299cb4' : _ref2$groupFront,
        _ref2$taskBack = _ref2.taskBack,
        taskBack = _ref2$taskBack === void 0 ? '#65c16f' : _ref2$taskBack,
        _ref2$taskFront = _ref2.taskFront,
        taskFront = _ref2$taskFront === void 0 ? '#46ad51' : _ref2$taskFront,
        _ref2$milestone = _ref2.milestone,
        _ref2$warning = _ref2.warning,
        warning = _ref2$warning === void 0 ? '#faad14' : _ref2$warning,
        _ref2$danger = _ref2.danger,
        danger = _ref2$danger === void 0 ? '#f5222d' : _ref2$danger,
        _ref2$textColor = _ref2.textColor,
        textColor = _ref2$textColor === void 0 ? '#222' : _ref2$textColor,
        _ref2$lightTextColor = _ref2.lightTextColor,
        lightTextColor = _ref2$lightTextColor === void 0 ? '#999' : _ref2$lightTextColor,
        _ref2$lineWidth = _ref2.lineWidth,
        lineWidth = _ref2$lineWidth === void 0 ? '1px' : _ref2$lineWidth,
        _ref2$thickLineWidth = _ref2.thickLineWidth,
        thickLineWidth = _ref2$thickLineWidth === void 0 ? '1.4px' : _ref2$thickLineWidth,
        _ref2$fontSize = _ref2.fontSize,
        fontSize = _ref2$fontSize === void 0 ? SIZE : _ref2$fontSize,
        _ref2$smallFontSize = _ref2.smallFontSize,
        smallFontSize = _ref2$smallFontSize === void 0 ? '12px' : _ref2$smallFontSize,
        _ref2$fontFamily = _ref2.fontFamily,
        fontFamily = _ref2$fontFamily === void 0 ? TYPE : _ref2$fontFamily;
    var line = {
      stroke: lineColor,
      'stroke-width': lineWidth
    };
    var redLine = {
      stroke: redLineColor,
      'stroke-width': lineWidth
    };
    var thickLine = {
      stroke: lineColor,
      'stroke-width': thickLineWidth
    };
    var text = {
      fill: textColor,
      'dominant-baseline': 'central',
      'font-size': fontSize,
      'font-family': fontFamily
    };
    var smallText = {
      fill: lightTextColor,
      'font-size': smallFontSize
    };
    return {
      week: {
        fill: 'rgba(252, 248, 227, .6)'
      },
      box: _objectSpread({}, thickLine, {
        fill: bgColor
      }),
      line: line,
      cline: redLine,
      bline: thickLine,
      label: text,
      groupLabel: _objectSpread({}, text, {
        'font-weight': '600'
      }),
      text1: _objectSpread({}, text, smallText, {
        'text-anchor': 'end'
      }),
      text2: _objectSpread({}, text, smallText),
      text3: _objectSpread({}, text, smallText, {
        'text-anchor': 'middle'
      }),
      groupBack: {
        fill: groupBack
      },
      groupFront: {
        fill: groupFront
      },
      taskBack: {
        fill: taskBack
      },
      taskFront: {
        fill: taskFront
      },
      warning: {
        fill: warning
      },
      danger: {
        fill: danger
      },
      ctrl: {
        display: 'none',
        fill: '#f0f0f0',
        stroke: '#929292',
        'stroke-width': '1px'
      }
    };
  }

  var LEGENDS = [{
    type: 'bar',
    name: 'Remaining'
  }, {
    type: 'green',
    name: 'Completed'
  }, {
    type: 'red',
    name: 'Delay'
  }];
  var UNIT = {
    day: DAY / 28,
    week: 7 * DAY / 56,
    month: 30 * DAY / 56
  };

  function NOOP() {}

  function Gantt(_ref) {
    var _ref$data = _ref.data,
        data = _ref$data === void 0 ? [] : _ref$data,
        _ref$onClick = _ref.onClick,
        onClick = _ref$onClick === void 0 ? NOOP : _ref$onClick,
        _ref$viewMode = _ref.viewMode,
        viewMode = _ref$viewMode === void 0 ? 'week' : _ref$viewMode,
        _ref$maxTextWidth = _ref.maxTextWidth,
        maxTextWidth = _ref$maxTextWidth === void 0 ? 140 : _ref$maxTextWidth,
        _ref$offsetY = _ref.offsetY,
        offsetY = _ref$offsetY === void 0 ? 60 : _ref$offsetY,
        _ref$rowHeight = _ref.rowHeight,
        rowHeight = _ref$rowHeight === void 0 ? 40 : _ref$rowHeight,
        _ref$barHeight = _ref.barHeight,
        barHeight = _ref$barHeight === void 0 ? 16 : _ref$barHeight,
        _ref$thickWidth = _ref.thickWidth,
        thickWidth = _ref$thickWidth === void 0 ? 1.4 : _ref$thickWidth,
        _ref$footerHeight = _ref.footerHeight,
        footerHeight = _ref$footerHeight === void 0 ? 50 : _ref$footerHeight,
        _ref$legends = _ref.legends,
        legends = _ref$legends === void 0 ? LEGENDS : _ref$legends,
        _ref$styleOptions = _ref.styleOptions,
        styleOptions = _ref$styleOptions === void 0 ? {} : _ref$styleOptions,
        start = _ref.start,
        end = _ref.end;
    var unit = UNIT[viewMode];
    var minTime = start.getTime() - unit * 48;
    var maxTime = end.getTime() + unit * 48;
    var width = (maxTime - minTime) / unit + maxTextWidth;
    var height = data.length * rowHeight + offsetY + footerHeight;
    var box = "0 0 ".concat(width, " ").concat(height);
    var current = Date.now();
    var styles = getStyles(styleOptions);
    return h("svg", {
      width: width,
      height: height,
      viewBox: box
    }, h(Layout, {
      styles: styles,
      width: width,
      height: height,
      offsetY: offsetY,
      thickWidth: thickWidth,
      maxTextWidth: maxTextWidth
    }), viewMode === 'day' ? h(DayHeader, {
      styles: styles,
      unit: unit,
      height: height,
      offsetY: offsetY,
      minTime: minTime,
      maxTime: maxTime,
      maxTextWidth: maxTextWidth,
      footerHeight: footerHeight
    }) : null, viewMode === 'week' ? h(WeekHeader, {
      styles: styles,
      unit: unit,
      height: height,
      offsetY: offsetY,
      minTime: minTime,
      maxTime: maxTime,
      maxTextWidth: maxTextWidth,
      footerHeight: footerHeight
    }) : null, viewMode === 'month' ? h(MonthHeader, {
      styles: styles,
      unit: unit,
      offsetY: offsetY,
      minTime: minTime,
      maxTime: maxTime,
      maxTextWidth: maxTextWidth,
      footerHeight: footerHeight
    }) : null, h(Grid, {
      styles: styles,
      data: data,
      width: width,
      height: height,
      offsetY: offsetY,
      rowHeight: rowHeight,
      thickWidth: thickWidth,
      footerHeight: footerHeight,
      maxTextWidth: maxTextWidth
    }), maxTextWidth > 0 ? h(Labels, {
      styles: styles,
      data: data,
      offsetY: offsetY,
      rowHeight: rowHeight
    }) : null, h(Bar, {
      styles: styles,
      data: data,
      unit: unit,
      height: height,
      current: current,
      offsetY: offsetY,
      minTime: minTime,
      onClick: onClick,
      rowHeight: rowHeight,
      barHeight: barHeight,
      maxTextWidth: maxTextWidth,
      footerHeight: footerHeight
    }), h(Legend, {
      styles: styles,
      legends: legends,
      width: width,
      height: height,
      barHeight: barHeight,
      footerHeight: footerHeight
    }));
  }

  var NS = 'http://www.w3.org/2000/svg';
  var doc = document;

  function applyProperties(node, props) {
    Object.keys(props).forEach(function (k) {
      var v = props[k];

      if (k === 'style' && _typeof(v) === 'object') {
        Object.keys(v).forEach(function (sk) {
          // eslint-disable-next-line
          node.style[sk] = v[sk];
        });
      } else if (k === 'onClick') {
        if (typeof v === 'function' && node.tagName === 'g') {
          node.addEventListener('click', v);
        }
      } else {
        node.setAttribute(k, v);
      }
    });
  }

  function render(vnode, ctx) {
    var tag = vnode.tag,
        props = vnode.props,
        children = vnode.children;
    var node = doc.createElementNS(NS, tag);

    if (props) {
      applyProperties(node, props);
    }

    children.forEach(function (v) {
      node.appendChild(typeof v === 'string' ? doc.createTextNode(v) : render(v, ctx));
    });
    return node;
  }

  var SVGGantt =
  /*#__PURE__*/
  function () {
    function SVGGantt(element, data) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      _classCallCheck(this, SVGGantt);

      this.dom = typeof element === 'string' ? document.querySelector(element) : element;
      this.format(data);
      this.options = options;
      this.render();
    }

    _createClass(SVGGantt, [{
      key: "format",
      value: function format(data) {
        this.data = data;
        var start = null;
        var end = null;
        data.forEach(function (v) {
          start = minDate(start, v.start);
          end = maxDate(end, v.end);
        });
        this.start = start || new Date();
        this.end = end || new Date();
      }
    }, {
      key: "setData",
      value: function setData(data) {
        this.format(data);
        this.render();
      }
    }, {
      key: "setOptions",
      value: function setOptions(options) {
        this.options = _objectSpread({}, this.options, options);
        this.render();
      }
    }, {
      key: "render",
      value: function render$$1() {
        var data = this.data,
            start = this.start,
            end = this.end,
            options = this.options;

        if (this.tree) {
          this.dom.removeChild(this.tree);
        }

        if (options.maxTextWidth === undefined) {
          var font = getFont(options.styleOptions || {});

          var w = function w(v) {
            return textWidth(v.text, font, 20);
          };

          options.maxTextWidth = max(data.map(w), 0);
        }

        var props = _objectSpread({}, options, {
          start: start,
          end: end
        });

        this.tree = render(h(Gantt, _extends({
          data: data
        }, props)));
        this.dom.appendChild(this.tree);
      }
    }]);

    return SVGGantt;
  }();

  function render$1(vnode, ctx, e) {
    var tag = vnode.tag,
        props = vnode.props,
        children = vnode.children;

    if (tag === 'svg') {
      var width = props.width,
          height = props.height;
      ctx.width = width;
      ctx.height = height;
    }

    if (tag === 'line') {
      var x1 = props.x1,
          x2 = props.x2,
          y1 = props.y1,
          y2 = props.y2,
          _props$style = props.style,
          style = _props$style === void 0 ? {} : _props$style;

      if (style.stroke) {
        ctx.strokeStyle = style.stroke;
        ctx.lineWidth = parseFloat(style['stroke-width'] || 1);
      }

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    if (tag === 'rect') {
      var x = props.x,
          y = props.y,
          _width = props.width,
          _height = props.height,
          _props$rx = props.rx,
          rx = _props$rx === void 0 ? 0 : _props$rx,
          _props$ry = props.ry,
          ry = _props$ry === void 0 ? 0 : _props$ry,
          onClick = props.onClick,
          _props$style2 = props.style,
          _style = _props$style2 === void 0 ? {} : _props$style2; // From https://github.com/canvg/canvg


      ctx.beginPath();
      ctx.moveTo(x + rx, y);
      ctx.lineTo(x + _width - rx, y);
      ctx.quadraticCurveTo(x + _width, y, x + _width, y + ry);
      ctx.lineTo(x + _width, y + _height - ry);
      ctx.quadraticCurveTo(x + _width, y + _height, x + _width - rx, y + _height);
      ctx.lineTo(x + rx, y + _height);
      ctx.quadraticCurveTo(x, y + _height, x, y + _height - ry);
      ctx.lineTo(x, y + ry);
      ctx.quadraticCurveTo(x, y, x + rx, y);

      if (e && onClick && ctx.isPointInPath(e.x, e.y)) {
        onClick();
      }

      ctx.closePath();

      if (_style.fill) {
        ctx.fillStyle = _style.fill;
      }

      ctx.fill();

      if (_style.stroke) {
        ctx.strokeStyle = _style.stroke;
        ctx.lineWidth = parseFloat(_style['stroke-width'] || 1);
        ctx.stroke();
      }
    }

    if (tag === 'text') {
      var _x = props.x,
          _y = props.y,
          _style2 = props.style;

      if (_style2) {
        ctx.fillStyle = _style2.fill;
        var BL = {
          central: 'middle',
          middle: 'middle',
          hanging: 'hanging',
          alphabetic: 'alphabetic',
          ideographic: 'ideographic'
        };
        var AL = {
          start: 'start',
          middle: 'center',
          end: 'end'
        };
        ctx.textBaseline = BL[_style2['dominant-baseline']] || 'alphabetic';
        ctx.textAlign = AL[_style2['text-anchor']] || 'start';
        ctx.font = "".concat(_style2['font-weight'] || '', " ").concat(_style2['font-size'], " ").concat(_style2['font-family']);
      }

      ctx.fillText(children.join(''), _x, _y);
    }

    children.forEach(function (v) {
      if (typeof v !== 'string') {
        render$1(v, ctx, e);
      }
    });
  }

  function createContext(dom) {
    var canvas = typeof dom === 'string' ? document.querySelector(dom) : dom;
    var ctx = canvas.getContext('2d');
    var backingStore = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
    var ratio = (window.devicePixelRatio || 1) / backingStore;
    ['width', 'height'].forEach(function (key) {
      Object.defineProperty(ctx, key, {
        get: function get() {
          return canvas[key] / ratio;
        },
        set: function set(v) {
          canvas[key] = v * ratio;
          canvas.style[key] = "".concat(v, "px");
          ctx.scale(ratio, ratio);
        },
        enumerable: true,
        configurable: true
      });
    });
    canvas.addEventListener('click', function (e) {
      if (!ctx.onClick) return;
      var rect = canvas.getBoundingClientRect();
      ctx.onClick({
        x: (e.clientX - rect.left) * ratio,
        y: (e.clientY - rect.top) * ratio
      });
    });
    return ctx;
  }

  var CanvasGantt =
  /*#__PURE__*/
  function () {
    function CanvasGantt(element, data) {
      var _this = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      _classCallCheck(this, CanvasGantt);

      this.ctx = createContext(element);
      this.format(data);
      this.options = options;
      this.render();

      this.ctx.onClick = function (e) {
        return _this.render(e);
      };
    }

    _createClass(CanvasGantt, [{
      key: "format",
      value: function format(data) {
        this.data = data;
        var start = null;
        var end = null;
        data.forEach(function (v) {
          start = minDate(start, v.start);
          end = maxDate(end, v.end);
        });
        this.start = start || new Date();
        this.end = end || new Date();
      }
    }, {
      key: "setData",
      value: function setData(data) {
        this.format(data);
        this.render();
      }
    }, {
      key: "setOptions",
      value: function setOptions(options) {
        this.options = _objectSpread({}, this.options, options);
        this.render();
      }
    }, {
      key: "render",
      value: function render(e) {
        var data = this.data,
            start = this.start,
            end = this.end,
            options = this.options;

        if (options.maxTextWidth === undefined) {
          var font = getFont(options.styleOptions || {});

          var w = function w(v) {
            return textWidth(v.text, font, 20);
          };

          options.maxTextWidth = max(data.map(w), 0);
        }

        var props = _objectSpread({}, options, {
          start: start,
          end: end
        });

        render$1(h(Gantt, _extends({
          data: data
        }, props)), this.ctx, e);
      }
    }]);

    return CanvasGantt;
  }();

  function attrEscape(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/\t/g, '&#x9;').replace(/\n/g, '&#xA;').replace(/\r/g, '&#xD;');
  }

  function escape(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r/g, '&#xD;');
  }

  function render$2(vnode, ctx) {
    var tag = vnode.tag,
        props = vnode.props,
        children = vnode.children;
    var tokens = [];
    tokens.push("<".concat(tag));
    Object.keys(props || {}).forEach(function (k) {
      var v = props[k];
      if (k === 'onClick') return;

      if (k === 'style' && _typeof(v) === 'object') {
        v = Object.keys(v).map(function (i) {
          return "".concat(i, ":").concat(v[i], ";");
        }).join('');
      }

      tokens.push(" ".concat(k, "=\"").concat(attrEscape(v), "\""));
    });

    if (!children || !children.length) {
      tokens.push(' />');
      return tokens.join('');
    }

    tokens.push('>');
    children.forEach(function (v) {
      if (typeof v === 'string') {
        tokens.push(escape(v));
      } else {
        tokens.push(render$2(v, ctx));
      }
    });
    tokens.push("</".concat(tag, ">"));
    return tokens.join('');
  }

  var StrGantt =
  /*#__PURE__*/
  function () {
    function StrGantt(data) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, StrGantt);

      this.format(data);
      this.options = options;
    }

    _createClass(StrGantt, [{
      key: "format",
      value: function format(data) {
        this.data = data;
        var start = null;
        var end = null;
        data.forEach(function (v) {
          start = minDate(start, v.start);
          end = maxDate(end, v.end);
        });
        this.start = start || new Date();
        this.end = end || new Date();
      }
    }, {
      key: "setData",
      value: function setData(data) {
        this.format(data);
      }
    }, {
      key: "setOptions",
      value: function setOptions(options) {
        this.options = _objectSpread({}, this.options, options);
      }
    }, {
      key: "render",
      value: function render() {
        var data = this.data,
            start = this.start,
            end = this.end,
            options = this.options;

        var props = _objectSpread({}, options, {
          start: start,
          end: end
        });

        return render$2(h(Gantt, _extends({
          data: data
        }, props)));
      }
    }]);

    return StrGantt;
  }();

  exports.default = CanvasGantt;
  exports.SVGGantt = SVGGantt;
  exports.CanvasGantt = CanvasGantt;
  exports.StrGantt = StrGantt;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
