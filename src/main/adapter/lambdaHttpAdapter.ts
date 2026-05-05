import { Controller } from "@/application/contracts/Controller";
import { ApplicationError } from "@/application/errors/application/ApplicationError";
import { ErrorCode } from "@/application/errors/ErrorCode";
import { HttpError } from "@/application/errors/http/HttpError";

import { Registry } from "@/kernel/di/Registry";

import { Constructor } from "@/shared/types/Constructor";
import { Role } from "@/shared/types/Role";
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { ZodError } from "zod";
import { lambdaBodyParser } from "../utils/lambdaBodyParser";
import { lambdaErrorResponse } from "../utils/lambdaErrorResponse";

export function lambdaHttpAdapter(
  controllerImpl: Constructor<Controller<any, unknown>>,
) {
  return async (
    event: APIGatewayProxyEventV2 | APIGatewayProxyEventV2WithJWTAuthorizer,
  ): Promise<APIGatewayProxyResultV2> => {
    try {
      const controller = Registry.getInstance().resolve(controllerImpl);
      const body = lambdaBodyParser(event.body);
      const params = event.pathParameters ?? {};

      const queryParams = event.queryStringParameters ?? {};
      const accountId =
        "authorizer" in event.requestContext
          ? (event.requestContext.authorizer.jwt.claims.internalId as string)
          : null;

      const claims =
        "authorizer" in event.requestContext
          ? event.requestContext.authorizer.jwt.claims
          : null;

      const role = (claims?.["cognito:groups"] ?? []) as Role[];
      const response = await controller.execute({
        body,
        params,
        queryParams,
        accountId,
        role,
      });

      return {
        statusCode: response.statusCode,
        body: response.body ? JSON.stringify(response.body) : undefined,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        return lambdaErrorResponse({
          code: ErrorCode.VALIDATION,
          message: error.issues.map((issue) => ({
            field: issue.path.join("."),
            error: issue.message,
          })),
          statusCode: 400,
        });
      }

      if (error instanceof HttpError) {
        return lambdaErrorResponse(error);
      }
      if (error instanceof ApplicationError) {
        return lambdaErrorResponse({
          statusCode: error.statusCode ?? 400,
          code: error.code,
          message: error.message,
        });
      }
      // eslint-disable-next-line no-console
      console.log(error);
      return lambdaErrorResponse({
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: "Internal server error",
        statusCode: 500,
      });
    }
  };
}
