import { jsx } from 'react/jsx-runtime';
import { Item } from '../CompositeBar/Item/Item.mjs';
import { ASIDE_HEADER_ICON_SIZE } from '../constants.mjs';
import { block } from '../utils/cn.mjs';
/* empty css                 */

const b = block("footer-item");
const FooterItem = ({ item, ...props }) => {
  return /* @__PURE__ */ jsx(
    Item,
    {
      ...props,
      item: { iconSize: ASIDE_HEADER_ICON_SIZE, ...item },
      className: b({ compact: props.compact }),
      onItemClick: item.onItemClick,
      onItemClickCapture: item.onItemClickCapture
    }
  );
};

export { FooterItem };
//# sourceMappingURL=FooterItem.mjs.map
