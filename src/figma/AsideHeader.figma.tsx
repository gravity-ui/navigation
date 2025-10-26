import React from 'react';

import figma from '@figma/code-connect';

import {AsideHeader} from '../components/AsideHeader/AsideHeader';

const figmaUrl =
    'https://www.figma.com/design/LwOcKoxx9fpdYlUjqQhzzBb4/YC-Gravity-UI?node-id=66588-8927&t=jICbwJPiAvFzYTnw-4';

figma.connect(AsideHeader, figmaUrl, {
    props: {
        compact: figma.boolean('Expand', {
            true: false,
            false: true,
        }),
    },
    example: (props) => <AsideHeader compact={props.compact} />,
});
