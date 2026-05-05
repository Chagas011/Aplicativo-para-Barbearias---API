import "reflect-metadata";

import { SignUpClientController } from "@/application/controllers/auth/SignUpClientController";
import { lambdaHttpAdapter } from "@/main/adapter/lambdaHttpAdapter";

export const handler = lambdaHttpAdapter(SignUpClientController);
