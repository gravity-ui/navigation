declare type SVGIconData = import('@gravity-ui/uikit').IconProps['data'];

declare module '*.svg' {
    const content: SVGIconData;

    export default content;
}

declare module 'assets/*.svg' {
    const path: string;

    export default path;
}
