import { jsx } from 'react/jsx-runtime';
import { Item } from './index.es22.js';
import { ASIDE_HEADER_ICON_SIZE } from './index.es23.js';
import { block } from './index.es24.js';
/* empty css           */

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
//# sourceMappingURL=index.es4.js.map
