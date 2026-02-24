//D:\BS-arena-NextJS\lib\apiResponse.ts
export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiError = {
  success: false;
  message: string;
};

export function success<T>(data: T): ApiSuccess<T> {
  return { success: true, data };
}

export function failure(message: string): ApiError {
  return { success: false, message };
}
