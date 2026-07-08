import { Injectable } from "@/kernel/decorators/Injectable";
import { env } from "./env";

@Injectable()
export class AppConfig {
  readonly auth: AppConfig.Auth;
  readonly db: AppConfig.Database;
  readonly storage: AppConfig.Storage;
  readonly cdn: AppConfig.CDN;
  readonly stripe: AppConfig.Stripe;
  constructor() {
    this.auth = {
      cognito: {
        clientId: env.COGNITO_CLIENT_ID,
        clientSecret: env.COGNITO_CLIENT_SECRET,
        userPoolId: env.COGNITO_POOL_ID,
      },
    };

    this.db = {
      dynamodb: {
        mainTable: env.MAIN_TABLE_NAME,
      },
    };

    this.storage = {
      barbershopBucket: env.BARBERSHOP_BUCKET,
    };
    this.cdn = {
      barbershopCDN: env.BARBERSHOP_CDN_DOMAIN_NAME,
    };

    this.stripe = {
      stripeSecretKey: env.STRIPE_SECRET_KEY,
      webhookSecret: env.WEBHOOK_SECRET,
      webhookClientSecret: env.WEBHOOK_CLIENT_SECRET,
    };
  }
}

export namespace AppConfig {
  export type Auth = {
    cognito: {
      clientId: string;
      clientSecret: string;
      userPoolId: string;
    };
  };

  export type Database = {
    dynamodb: {
      mainTable: string;
    };
  };

  export type Storage = {
    barbershopBucket: string;
  };

  export type CDN = {
    barbershopCDN: string;
  };

  export type Stripe = {
    stripeSecretKey: string;
    webhookSecret: string;
    webhookClientSecret: string;
  };
}
