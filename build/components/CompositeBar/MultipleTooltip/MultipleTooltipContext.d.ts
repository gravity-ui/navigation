import { default as React } from 'react';
interface MultipleTooltipContextProps {
    active: boolean;
    activeIndex: number | undefined;
    hideCollapseItemTooltip: boolean;
    lastClickedItemIndex: number | undefined;
    setValue<K extends keyof Omit<MultipleTooltipContextProps, 'setValue'>>(value: Pick<Omit<MultipleTooltipContextProps, 'setValue'>, K> | Omit<MultipleTooltipContextProps, 'setValue'>): void;
}
export declare const MultipleTooltipContext: React.Context<MultipleTooltipContextProps>;
type MultipleTooltipProviderState = Omit<MultipleTooltipContextProps, 'setValue'>;
export declare class MultipleTooltipProvider extends React.PureComponent<{
    children: React.ReactNode;
}, MultipleTooltipProviderState> {
    state: {
        active: boolean;
        activeIndex: undefined;
        hideCollapseItemTooltip: boolean;
        lastClickedItemIndex: undefined;
        setValue: () => void;
    };
    setValue: MultipleTooltipContextProps['setValue'];
    render(): React.JSX.Element;
}
export {};
