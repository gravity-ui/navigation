'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const Item = require('./index.cjs22.js');
const constants = require('./index.cjs23.js');
const cn = require('./index.cjs24.js');
;/* empty css             */

const b = cn.block("footer-item");
const FooterItem = ({ item, ...props }) => {
  return /* @__PURE__ */ jsxRuntime.jsx(
    Item.Item,
    {
      ...props,
      item: { iconSize: constants.ASIDE_HEADER_ICON_SIZE, ...item },
      className: b({ compact: props.compact }),
      onItemClick: item.onItemClick,
      onItemClickCapture: item.onItemClickCapture
    }
  );
};

exports.FooterItem = FooterItem;
//# sourceMappingURL=index.cjs4.js.map
