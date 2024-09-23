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
var SvgControlMenuButton = function SvgControlMenuButton(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    width: 8,
    height: 8,
    viewBox: "0 0 8 8",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    d: "m.72 7.64 6.39-3.2a.5.5 0 0 0 0-.89L.72.36A.5.5 0 0 0 0 .81v6.38c0 .37.4.61.72.45Z"
  })));
};
var controlMenuButtonIcon = SvgControlMenuButton;

exports["default"] = controlMenuButtonIcon;
//# sourceMappingURL=control-menu-button.svg.js.map
