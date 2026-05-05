import { getRoles } from "@/kernel/decorators/Role";
import { getSchema } from "@/kernel/decorators/Schema";
import { ForbiddenError } from "../errors/http/ForbidenError";
type TRouteType = "public" | "private";

export abstract class Controller<TType extends TRouteType, TBody = undefined> {
  protected abstract handle(
    params: Controller.Request<TType>,
  ): Promise<Controller.Response<TBody>>;

  public execute(
    request: Controller.Request<TType>,
  ): Promise<Controller.Response<TBody>> {
    this.validateRoles(request.role);
    const body = this.validateBody(request.body);
    return this.handle({
      ...request,
      body,
    });
  }

  private validateBody<T>(body: Controller.Request<TType>["body"]) {
    const schema = getSchema(this);
    if (!schema) {
      return body;
    }

    return schema.parse(body) as T;
  }

  private validateRoles(userRoles: string[]) {
    const requiredRoles = getRoles(this);

    if (!requiredRoles || requiredRoles.length === 0) {
      return;
    }

    const hasPermission = requiredRoles.some((role) =>
      userRoles?.includes(role),
    );

    if (!hasPermission) {
      throw new ForbiddenError("Forbidden");
    }
  }
}

export namespace Controller {
  type BaseRequest<
    TBody = Record<string, unknown>,
    TParams = Record<string, unknown>,
    TQueryParams = Record<string, unknown>,
    TRole = string[],
  > = {
    body: TBody;
    params: TParams;
    queryParams: TQueryParams;
    role: TRole;
  };

  type PublicRequest<
    TBody = Record<string, unknown>,
    TParams = Record<string, unknown>,
    TQueryParams = Record<string, unknown>,
    TRole = string[],
  > = BaseRequest<TBody, TParams, TQueryParams, TRole> & {
    accountId: null;
  };

  type PrivateRequest<
    TBody = Record<string, unknown>,
    TParams = Record<string, unknown>,
    TQueryParams = Record<string, unknown>,
    TRole = string[],
  > = BaseRequest<TBody, TParams, TQueryParams, TRole> & {
    accountId: string;
  };

  export type Request<
    TType extends TRouteType,
    TBody = Record<string, unknown>,
    TParams = Record<string, unknown>,
    TQueryParams = Record<string, unknown>,
    TRole = string[],
  > = TType extends "public"
    ? PublicRequest<TBody, TParams, TQueryParams, TRole>
    : PrivateRequest<TBody, TParams, TQueryParams, TRole>;

  export type Response<TBody = undefined> = {
    statusCode: number;
    body?: TBody;
  };
}
