export type PropsWithPull<T> = T & {
    pull?: 'left' | 'left-grow' | 'right' | 'right-grow' | 'center' | 'center-grow';
};
