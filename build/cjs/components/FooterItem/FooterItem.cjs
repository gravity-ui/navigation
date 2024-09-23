'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const Item = require('../CompositeBar/Item/Item.cjs');
const constants = require('../constants.cjs');
const cn = require('../utils/cn.cjs');
;/* empty css                  */

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
//# sourceMappingURL=FooterItem.cjs.map
