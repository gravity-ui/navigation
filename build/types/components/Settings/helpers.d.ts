type AnyFunc = (...args: any[]) => any;
export declare function useStableCallback<T extends AnyFunc>(func: T): (...args: Parameters<T>) => ReturnType<T> | undefined;
export declare function useCurrent<T>(value: T): () => T;
export declare function invariant(cond: boolean, message: string): void;
export declare function escapeStringForRegExp(input: string): string;
export {};
