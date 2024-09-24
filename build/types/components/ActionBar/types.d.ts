export type PropsWithPull<T> = T & {
    pull?: 'left' | 'right' | 'center';
};
