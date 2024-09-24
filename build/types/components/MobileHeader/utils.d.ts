import { MobileHeaderEventOptions, MobileMenuItem } from './types';
export declare const getItemHeight: (item: MobileMenuItem) => 1 | 48;
export declare const getSelectedItemIndex: (items: MobileMenuItem[]) => number | undefined;
export declare const getMobileHeaderCustomEvent: (eventName: string, detail?: MobileHeaderEventOptions) => CustomEvent<MobileHeaderEventOptions>;
