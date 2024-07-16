type QuerySelection<T> = {
  [K in keyof T]: any;
};

type Truly<T> = {
  [K in keyof T as T[K] extends true ? K : never]: T[K];
};

type Contain<K, T> = K extends keyof T ? K : never;

type QueryResult<T, S> = {
  [K in keyof T as Contain<K, Truly<S>>]: T[K];
};

export class MappingModel<T> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  select<S extends QuerySelection<T>>(selection: S): QueryResult<T, S> {
    return selection;
  }
}
