export type ResponseResult<T = never> = {
  success: boolean;
  data: T;
};
