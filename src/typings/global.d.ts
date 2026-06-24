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

declare module '@gravity-ui/uikit/i18n' {
    export function addComponentKeysets<T extends Record<string, string>>(
        keysets: {en: T; ru?: T},
        component: string,
    ): (key: keyof T & string) => string;
}
