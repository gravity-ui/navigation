import type {SettingsProps} from '../types';

export interface SettingsContextType
    extends Pick<
        SettingsProps,
        'renderRightAdornment' | 'renderSectionRightAdornment' | 'showRightAdornmentOnHover'
    > {}
