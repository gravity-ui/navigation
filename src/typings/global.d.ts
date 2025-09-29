declare type SVGIconData = import('@gravity-ui/uikit').IconProps['data'];

declare module '*.svg' {
    const content: SVGIconData;

    export default content;
}

declare module 'assets/*.svg' {
    const path: string;

    export default path;
}

declare module '*.scss' {
    const classes: {[key: string]: string};
    export default classes;
}

declare module '*.css' {
    const classes: {[key: string]: string};
    export default classes;
}
