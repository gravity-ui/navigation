import { addComponentKeysets } from '@gravity-ui/uikit/i18n';
import { NAMESPACE } from '../../utils/cn.mjs';
import en from './en.json.mjs';
import ru from './ru.json.mjs';

const COMPONENT = "AllPagesPanel";
const i18n = addComponentKeysets({ en, ru }, `${NAMESPACE}${COMPONENT}`);

export { i18n as default };
//# sourceMappingURL=index.mjs.map
