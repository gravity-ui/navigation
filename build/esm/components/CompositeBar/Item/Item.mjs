import { j as jsxRuntimeExports } from '../../../node_modules/react/jsx-runtime.mjs';
import React from '../../../node_modules/react/index.mjs';
import { useAsideHeaderContext } from '../../AsideHeader/AsideHeaderContext.mjs';
import { ASIDE_HEADER_ICON_SIZE } from '../../constants.mjs';
import { block } from '../../utils/cn.mjs';
import { HighlightedItem } from '../HighlightedItem/HighlightedItem.mjs';
import { ITEM_TYPE_REGULAR, COLLAPSE_ITEM_ID, POPUP_PLACEMENT, POPUP_ITEM_HEIGHT } from '../constants.mjs';
import { getSelectedItemIndex } from '../utils.mjs';
/* empty css           */
import { ActionTooltip } from '../../../node_modules/@gravity-ui/uikit/build/esm/components/ActionTooltip/ActionTooltip.mjs';
import { Icon } from '../../../node_modules/@gravity-ui/uikit/build/esm/components/Icon/Icon.mjs';
import { Popup } from '../../../node_modules/@gravity-ui/uikit/build/esm/components/Popup/Popup.mjs';
import { List } from '../../../node_modules/@gravity-ui/uikit/build/esm/components/List/List.mjs';

const b = block("composite-bar-item");
function renderItemTitle(item) {
  let titleNode = /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: b("title-text"), children: item.title });
  if (item.rightAdornment) {
    titleNode = /* @__PURE__ */ jsxRuntimeExports.jsxs(React.Fragment, { children: [
      titleNode,
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: b("title-adornment"), children: item.rightAdornment })
    ] });
  }
  return titleNode;
}
const defaultPopupPlacement = ["right-end"];
const defaultPopupOffset = [-20, 8];
const Item = (props) => {
  const {
    item,
    className,
    collapseItems,
    onMouseLeave,
    onMouseEnter,
    enableTooltip = true,
    popupVisible = false,
    popupAnchor,
    popupPlacement = defaultPopupPlacement,
    popupOffset = defaultPopupOffset,
    popupKeepMounted,
    popupContentClassName,
    renderPopupContent,
    onClosePopup,
    onItemClick,
    onItemClickCapture,
    bringForward
  } = props;
  const { compact } = useAsideHeaderContext();
  const [open, toggleOpen] = React.useState(false);
  const ref = React.useRef(null);
  const anchorRef = popupAnchor || ref;
  const highlightedRef = React.useRef(null);
  const type = item.type || ITEM_TYPE_REGULAR;
  const current = item.current || false;
  const tooltipText = item.tooltipText || item.title;
  const icon = item.icon;
  const iconSize = item.iconSize || ASIDE_HEADER_ICON_SIZE;
  const iconQa = item.iconQa;
  const collapsedItem = item.id === COLLAPSE_ITEM_ID;
  const modifiers = React.useMemo(
    () => [
      {
        name: "compact",
        enabled: true,
        options: { compact },
        phase: "main",
        fn() {
        }
      }
    ],
    [compact]
  );
  const onClose = React.useCallback(
    (event) => {
      if (event instanceof MouseEvent && event.target && ref.current?.contains(event.target)) {
        return;
      }
      onClosePopup?.();
    },
    [onClosePopup]
  );
  if (item.type === "divider") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: b("menu-divider") });
  }
  const makeIconNode = (iconEl) => {
    return compact ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      ActionTooltip,
      {
        title: "",
        description: tooltipText,
        disabled: !enableTooltip || collapsedItem && open || popupVisible,
        placement: "right",
        className: b("icon-tooltip", { "item-type": type }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            onMouseEnter: () => onMouseEnter?.(),
            onMouseLeave: () => onMouseLeave?.(),
            className: b("btn-icon"),
            children: iconEl
          }
        )
      }
    ) : iconEl;
  };
  const makeNode = ({ icon: iconEl, title: titleEl }) => {
    const createdNode = /* @__PURE__ */ jsxRuntimeExports.jsxs(React.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: b({ type, current, compact }, className),
          ref,
          "data-qa": item.qa,
          onClick: (event) => {
            if (collapsedItem) {
              toggleOpen(!open);
            } else {
              onItemClick?.(item, false, event);
            }
          },
          onClickCapture: onItemClickCapture,
          onMouseEnter: () => {
            if (!compact) {
              onMouseEnter?.();
            }
          },
          onMouseLeave: () => {
            if (!compact) {
              onMouseLeave?.();
            }
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: b("icon-place"), ref: highlightedRef, children: makeIconNode(iconEl) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: b("title"),
                title: typeof item.title === "string" ? item.title : void 0,
                children: titleEl
              }
            )
          ]
        }
      ),
      renderPopupContent && Boolean(anchorRef?.current) && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Popup,
        {
          contentClassName: b("popup", popupContentClassName),
          open: popupVisible,
          keepMounted: popupKeepMounted,
          placement: popupPlacement,
          offset: popupOffset,
          anchorRef,
          onClose,
          modifiers,
          children: renderPopupContent()
        }
      )
    ] });
    return item.link ? /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: item.link, className: b("link"), children: createdNode }) : createdNode;
  };
  const iconNode = icon ? /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { qa: iconQa, data: icon, size: iconSize, className: b("icon") }) : null;
  const titleNode = renderItemTitle(item);
  const params = { icon: iconNode, title: titleNode };
  let highlightedNode = null;
  let node;
  const opts = { compact: Boolean(compact), collapsed: false, item, ref };
  if (typeof item.itemWrapper === "function") {
    node = item.itemWrapper(params, makeNode, opts);
    highlightedNode = bringForward && item.itemWrapper(
      params,
      ({ icon: iconEl }) => makeIconNode(iconEl),
      opts
    );
  } else {
    node = makeNode(params);
    highlightedNode = bringForward && makeIconNode(iconNode);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(React.Fragment, { children: [
    bringForward && /* @__PURE__ */ jsxRuntimeExports.jsx(
      HighlightedItem,
      {
        iconNode: highlightedNode,
        iconRef: highlightedRef,
        onClick: (event) => onItemClick?.(item, false, event),
        onClickCapture: onItemClickCapture
      }
    ),
    node,
    open && collapsedItem && collapseItems?.length && Boolean(anchorRef?.current) && /* @__PURE__ */ jsxRuntimeExports.jsx(CollapsedPopup, { ...props, anchorRef: ref, onClose: () => toggleOpen(false) })
  ] });
};
Item.displayName = "Item";
function CollapsedPopup({
  onItemClick,
  collapseItems,
  anchorRef,
  onClose
}) {
  const { compact } = useAsideHeaderContext();
  return collapseItems?.length ? /* @__PURE__ */ jsxRuntimeExports.jsx(Popup, { placement: POPUP_PLACEMENT, open: true, anchorRef, onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: b("collapse-items-popup-content"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    List,
    {
      itemClassName: b("root-collapse-item"),
      items: collapseItems,
      selectedItemIndex: getSelectedItemIndex(collapseItems),
      itemHeight: POPUP_ITEM_HEIGHT,
      itemsHeight: collapseItems.length * POPUP_ITEM_HEIGHT,
      virtualized: false,
      filterable: false,
      sortable: false,
      onItemClick: onClose,
      renderItem: (collapseItem) => {
        const makeCollapseNode = ({
          title: titleEl,
          icon: iconEl
        }) => {
          const res = /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: b("collapse-item"),
              onClick: (event) => {
                onItemClick?.(collapseItem, true, event);
              },
              children: [
                iconEl,
                titleEl
              ]
            }
          );
          return collapseItem.link ? /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: collapseItem.link, className: b("link"), children: res }) : res;
        };
        const titleNode = renderItemTitle(collapseItem);
        const iconNode = collapseItem.icon && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Icon,
          {
            data: collapseItem.icon,
            size: 14,
            className: b("collapse-item-icon")
          }
        );
        const params = { title: titleNode, icon: iconNode };
        const opts = {
          compact: Boolean(compact),
          collapsed: true,
          item: collapseItem,
          ref: anchorRef
        };
        if (typeof collapseItem.itemWrapper === "function") {
          return collapseItem.itemWrapper(params, makeCollapseNode, opts);
        } else {
          return makeCollapseNode(params);
        }
      }
    }
  ) }) }) : null;
}

export { Item, defaultPopupOffset, defaultPopupPlacement };
//# sourceMappingURL=Item.mjs.map
