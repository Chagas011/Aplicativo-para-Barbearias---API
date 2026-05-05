import { Controller } from "@/application/contracts/Controller";

import { SignUpAdminUseCase } from "@/application/useCases/auth/SignUpAdminUseCase";
import { Injectable } from "@/kernel/decorators/Injectable";
import { Schema } from "@/kernel/decorators/Schema";
import { SignUpBody, signUpSchema } from "./schemas/signUpSchema";
@Injectable()
@Schema(signUpSchema)
export class SignUpAdminController extends Controller<
  "public",
  SignUpAdminController.Response
> {
  constructor(private readonly signUpAdminUseCase: SignUpAdminUseCase) {
    super();
  }
  protected override async handle({
    body,
  }: Controller.Request<"public", SignUpBody>): Promise<
    Controller.Response<SignUpAdminController.Response>
  > {
    const { account } = body;

    const { accessToken, refreshToken } = await this.signUpAdminUseCase.execute(
      {
        account,
      },
    );
    return {
      statusCode: 201,
      body: {
        accessToken,
        refreshToken,
      },
    };
  }
}

export namespace SignUpAdminController {
  export type Response = {
    accessToken: string;
    refreshToken: string;
  };
}
