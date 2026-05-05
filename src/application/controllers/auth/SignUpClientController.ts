import { Controller } from "@/application/contracts/Controller";

import { SignUpClientUseCase } from "@/application/useCases/auth/SignUpClientUseCase";
import { Injectable } from "@/kernel/decorators/Injectable";
import { Schema } from "@/kernel/decorators/Schema";
import { SignUpBody, signUpSchema } from "./schemas/signUpSchema";
@Injectable()
@Schema(signUpSchema)
export class SignUpClientController extends Controller<
  "public",
  SignUpClientController.Response
> {
  constructor(private readonly signUpClientUseCase: SignUpClientUseCase) {
    super();
  }
  protected override async handle({
    body,
  }: Controller.Request<"public", SignUpBody>): Promise<
    Controller.Response<SignUpClientController.Response>
  > {
    const { account } = body;

    const { accessToken, refreshToken } =
      await this.signUpClientUseCase.execute({
        account,
      });
    return {
      statusCode: 201,
      body: {
        accessToken,
        refreshToken,
      },
    };
  }
}

export namespace SignUpClientController {
  export type Response = {
    accessToken: string;
    refreshToken: string;
  };
}
