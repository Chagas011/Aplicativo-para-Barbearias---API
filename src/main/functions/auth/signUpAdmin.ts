import "reflect-metadata";

import { SignUpAdminController } from "@/application/controllers/auth/SignUpAdminController";
import { lambdaHttpAdapter } from "@/main/adapter/lambdaHttpAdapter";

export const handler = lambdaHttpAdapter(SignUpAdminController);
