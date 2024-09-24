import i18n from './i18n/index.mjs';
import Ellipsis from '../../node_modules/@gravity-ui/icons/esm/Ellipsis.mjs';

const ALL_PAGES_ID = "all-pages";
function getAllPagesMenuItem() {
  return {
    id: ALL_PAGES_ID,
    title: i18n("menu-item.all-pages.title"),
    tooltipText: i18n("menu-item.all-pages.title"),
    icon: Ellipsis
  };
}

export { ALL_PAGES_ID, getAllPagesMenuItem };
//# sourceMappingURL=constants.mjs.map
