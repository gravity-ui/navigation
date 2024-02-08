import React, {FC} from 'react';

import {AsideHeader} from '../AsideHeader';
import {AsideHeaderProps} from '../types';

import logoIcon from '../../../../.storybook/assets/logo.svg';

const AsideHeaderWrapper = ({Story, ...props}: AsideHeaderProps & {Story: FC}) => {
    const [compact, setCompact] = React.useState(props.compact);

    return (
        <AsideHeader
            {...props}
            compact={compact}
            onChangeCompact={setCompact}
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
        },
        compact: true,
    },
) {
    return function withAsideHeaderWrapper(Story: FC) {
        return <AsideHeaderWrapper Story={Story} {...props} />;
    };
}
