import { ErrorCode } from "../ErrorCode";
import { HttpError } from "./HttpError";

export class ForbiddenError extends HttpError {
  public override statusCode = 403;
  public override code: ErrorCode;

  constructor(message: any, code?: ErrorCode) {
    super();

    this.name = "FORBIDDEN";
    this.code = code ?? ErrorCode.FORBIDEN;
    this.message = message ?? "FORBIDDEN";
  }
}
