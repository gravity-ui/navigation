import { addComponentKeysets } from '@gravity-ui/uikit/i18n';
import { NAMESPACE } from '../../utils/cn.js';
import en from './en.json.js';
import ru from './ru.json.js';

const COMPONENT = 'MobileHeader';
var i18n = addComponentKeysets({ en, ru }, `${NAMESPACE}${COMPONENT}`);

export { i18n as default };
//# sourceMappingURL=index.js.map
