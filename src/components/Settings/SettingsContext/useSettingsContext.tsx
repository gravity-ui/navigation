import React from 'react';

import type {SettingsContext} from './SettingsContext';

export const useSettingsContext = () => React.useContext(SettingsContext);
