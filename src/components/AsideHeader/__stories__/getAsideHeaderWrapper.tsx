import React, {FC} from 'react';

import {AsideHeader} from '../AsideHeader';
import {AsideHeaderProps} from '../types';

import logoIcon from '../../../../.storybook/assets/logo.svg';

const AsideHeaderWrapper = ({Story, ...props}: AsideHeaderProps & {Story: FC}) => {
    const [pinned, setPinned] = React.useState(props.pinned);

    return (
        <AsideHeader
            {...props}
            pinned={pinned}
            onChangePinned={setPinned}
            renderContent={() => <Story />}
        />
    );
};

export function getAsideHeaderWrapper(
    props: AsideHeaderProps = {
        logo: {
            icon: logoIcon,
            iconSize: 24,
            text: 'My Service',
            'aria-label': 'My Service',
        },
        pinned: false,
    },
) {
    return function withAsideHeaderWrapper(Story: FC) {
        return <AsideHeaderWrapper Story={Story} {...props} />;
    };
}
