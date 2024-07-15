export type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends (infer R)[]
    ? ReadonlyArray<DeepReadonly<R>>
    : T[K] extends object
    ? DeepReadonly<T[K]>
    : T[K]
}