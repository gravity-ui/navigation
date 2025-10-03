import React from 'react';

interface MultipleTooltipContextProps {
    active: boolean;
    activeIndex: number | undefined;
    hideCollapseItemTooltip: boolean;
    lastClickedItemIndex: number | undefined;
    setValue<K extends keyof Omit<MultipleTooltipContextProps, 'setValue'>>(
        value:
            | Pick<Omit<MultipleTooltipContextProps, 'setValue'>, K>
            | Omit<MultipleTooltipContextProps, 'setValue'>,
    ): void;
}

const multipleTooltipContextDefaults = {
    active: false,
    activeIndex: undefined,
    hideCollapseItemTooltip: false,
    lastClickedItemIndex: undefined,
    setValue: () => {},
};

export const MultipleTooltipContext = React.createContext<MultipleTooltipContextProps>(
    multipleTooltipContextDefaults,
);

type MultipleTooltipProviderState = Omit<MultipleTooltipContextProps, 'setValue'>;

export class MultipleTooltipProvider extends React.PureComponent<
    {children: React.ReactNode},
    MultipleTooltipProviderState
> {
    state = {
        ...multipleTooltipContextDefaults,
    };

    render() {
        const {children} = this.props;

        return (
            <MultipleTooltipContext.Provider value={{...this.state, setValue: this.setValue}}>
                {children}
            </MultipleTooltipContext.Provider>
        );
    }

    setValue: MultipleTooltipContextProps['setValue'] = (value) => {
        this.setState({...value});
    };
}
