import { HttpStatus, ErrorMessage } from "../constants/enums";
import { IResponse } from "../interfaces/response.interface";

export class ResponseHandler {
  static success<T>(
    data: T,
    message: string = "Operation successful",
    status: HttpStatus = HttpStatus.OK,
    hasMore: boolean = false
  ): IResponse<T> {
    return {
      success: true,
      message,
      data,
      hasMore,
      status,
    };
  }

  static error<T>(
    message: string = ErrorMessage.SERVER_ERROR,
    error: string = "An error occurred",
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR
  ): IResponse<T> {
    return {
      success: false,
      message,
      error,
      status,
    } as IResponse<T>;
  }
}
