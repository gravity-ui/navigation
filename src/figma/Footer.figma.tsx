import React from 'react';

import figma from '@figma/code-connect';

import {Footer} from '../components/Footer/desktop/Footer';

const figmaUrl =
    'https://www.figma.com/design/LwOcKoxx9fpdYlUjqQhzzBb4/YC-Gravity-UI?node-id=51827-41016&t=jICbwJPiAvFzYTnw-4';

figma.connect(Footer, figmaUrl, {
    props: {
        withDivider: figma.boolean('Divider'),
        view: figma.enum('View', {
            Normal: 'normal',
            Clear: 'clear',
        }),
    },
    example: (props) => (
        <Footer
            view={props.view}
            withDivider={props.withDivider}
            menuItems={[
                {
                    text: 'About Service',
                    href: 'https://gravity-ui.com/',
                    target: 'blank',
                },
            ]}
            copyright={'© Yandex LLC'}
        />
    ),
});
