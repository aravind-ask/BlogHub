export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  TOO_MANY_REQUESTS = 429,
  SERVICE_UNAVAILABLE = 503,
}

export enum ErrorMessage {
  UNAUTHORIZED = "Unauthorized access",
  FORBIDDEN = "Forbidden action",
  NOT_FOUND = "Resource not found",
  SERVER_ERROR = "Internal server error",
  BAD_REQUEST= "Bad request",
  USER_ALREADY_EXISTS = "User already exists",
}
