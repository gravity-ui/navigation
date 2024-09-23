import * as React from 'react';

var _path;
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
var SvgControlMenuButton = function SvgControlMenuButton(props) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: 8,
    height: 8,
    viewBox: "0 0 8 8",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/React.createElement("path", {
    d: "m.72 7.64 6.39-3.2a.5.5 0 0 0 0-.89L.72.36A.5.5 0 0 0 0 .81v6.38c0 .37.4.61.72.45Z"
  })));
};
var controlMenuButtonIcon = SvgControlMenuButton;

export { controlMenuButtonIcon as default };
//# sourceMappingURL=control-menu-button.svg.js.map
