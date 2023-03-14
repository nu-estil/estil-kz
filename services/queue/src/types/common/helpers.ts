export type MakeRequired<T> = Required<{ [K in keyof T]: NonNullable<T[K]> }>;
export type SetNullable<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type SetNonNullable<T, K extends keyof T> = Omit<T, K> & MakeRequired<Pick<T, K>>;
export type SetValue<T, K extends keyof T, V = null> = Omit<T, K> & Record<K, V>;

export type NullablePartial<
    T,
    NK extends keyof T = { [K in keyof T]: null extends T[K] ? K : never }[keyof T],
    NP = Partial<Pick<T, NK>> & Pick<T, Exclude<keyof T, NK>>,
> = { [K in keyof NP]: NP[K] };

export type PickNullable<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type OmitPartial<T, K extends keyof T> = Partial<Omit<T, K>>;

export type PickPartial<T, K extends keyof T> = Partial<Pick<T, K>>;
