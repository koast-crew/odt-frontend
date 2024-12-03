export type ResultResponse<T> = {
  payload: T | undefined | null
  status: number
};