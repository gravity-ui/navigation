import React from 'react';

import figma from '@figma/code-connect';

import {Drawer} from '../components/Drawer/Drawer';

const figmaUrl =
    'https://www.figma.com/design/LwOcKoxx9fpdYlUjqQhzzBb4/YC-Gravity-UI?node-id=68509-9160&t=jICbwJPiAvFzYTnw-4';

figma.connect(Drawer, figmaUrl, {
    props: {
        veil: figma.boolean('Veil'),
    },
    example: (props) => (
        <Drawer hideVeil={props.veil}>
            <div>Content</div>
        </Drawer>
    ),
});
