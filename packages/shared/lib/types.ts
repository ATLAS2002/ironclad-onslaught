export interface ISession {
  id: string;
  name: string;
}

export type Empty<T> = T | undefined | null;

// eslint-disable-next-line no-unused-vars
export type FN<R = void, P = void> = (payload: P) => R;
// eslint-disable-next-line no-unused-vars
export type CB<P = void> = (payload: P) => void;
