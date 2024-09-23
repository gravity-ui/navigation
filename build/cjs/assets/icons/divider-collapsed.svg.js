'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function _interopNamespace(e) {
	if (e && e.__esModule) return e;
	var n = Object.create(null);
	if (e) {
		Object.keys(e).forEach(function (k) {
			if (k !== 'default') {
				var d = Object.getOwnPropertyDescriptor(e, k);
				Object.defineProperty(n, k, d.get ? d : {
					enumerable: true,
					get: function () { return e[k]; }
				});
			}
		});
	}
	n["default"] = e;
	return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespace(React);

var _path;
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
var SvgDividerCollapsed = function SvgDividerCollapsed(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: 56,
    height: 29,
    viewBox: "0 0 56 29",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M56 0v29c-.8-1-7-6.1-17.7-8.4L13 15.7A16 16 0 0 1 0 0Z"
  })));
};
var headerDividerCollapsedIcon = SvgDividerCollapsed;

exports["default"] = headerDividerCollapsedIcon;
//# sourceMappingURL=divider-collapsed.svg.js.map
