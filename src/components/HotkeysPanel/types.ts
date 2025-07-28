export type HotkeysItem = {
    title: string;
    value: string;
    hint?: string;
};

export type HotkeysGroup<T = {}> = {
    title: string;
    items: HotkeysItem[];
} & T;

export type HotkeysListItem = {
    title: string;
    group?: boolean;
    value?: string;
    hint?: string;
};
