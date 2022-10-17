import React, {FC} from 'react';
import logoIcon from '../../../../.storybook/assets/logo.svg';
import {AsideHeader, AsideHeaderProps} from '../AsideHeader';

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
}
