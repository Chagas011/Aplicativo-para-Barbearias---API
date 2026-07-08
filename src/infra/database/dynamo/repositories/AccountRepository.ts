import { Account } from "@/application/entites/Account";
import { dynamoClient } from "@/infra/clients/dynamoClient";

import { Injectable } from "@/kernel/decorators/Injectable";
import { AppConfig } from "@/shared/config/Appconfig";
import {
  GetCommand,
  PutCommand,
  PutCommandInput,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { AccountItem } from "../items/AccountItem";

@Injectable()
export class AccountRepository {
  constructor(private readonly appConfig: AppConfig) {}

  async findEmail(email: string): Promise<Account | null> {
    const command = new QueryCommand({
      TableName: this.appConfig.db.dynamodb.mainTable,
      IndexName: "GS1",
      Limit: 1,
      KeyConditionExpression: "#GS1PK = :GS1PK AND #GS1SK = :GS1SK",
      ExpressionAttributeNames: {
        "#GS1PK": "GS1PK",
        "#GS1SK": "GS1SK",
      },
      ExpressionAttributeValues: {
        ":GS1PK": AccountItem.getGS1PK(email),
        ":GS1SK": AccountItem.getGS1SK(email),
      },
    });

    const { Items = [] } = await dynamoClient.send(command);
    const account = Items[0] as AccountItem.ItemTypes | undefined;

    if (!account) {
      return null;
    }
    return AccountItem.toEntity(account);
  }

  getPutCommandInput(account: Account): PutCommandInput {
    const accountItem = AccountItem.fromEntity(account);
    return {
      TableName: this.appConfig.db.dynamodb.mainTable,
      Item: accountItem.toItem(),
    };
  }

  async create(account: Account): Promise<void> {
    const command = new PutCommand(this.getPutCommandInput(account));

    await dynamoClient.send(command);
  }

  async findById(accountId: string): Promise<Account | null> {
    const result = await dynamoClient.send(
      new GetCommand({
        TableName: this.appConfig.db.dynamodb.mainTable,
        Key: {
          PK: AccountItem.getPK(accountId),
          SK: AccountItem.getSK(accountId),
        },
      }),
    );

    if (!result.Item) {
      return null;
    }
    return AccountItem.toEntity(result.Item as AccountItem.ItemTypes);
  }

  async save(account: Account): Promise<void> {
    const item = AccountItem.fromEntity(account).toItem();

    await dynamoClient.send(
      new UpdateCommand({
        TableName: this.appConfig.db.dynamodb.mainTable,
        Key: {
          PK: item.PK,
          SK: item.SK,
        },
        UpdateExpression:
          "SET #stripeConnectAccountId = :stripeConnectAccountId",
        ExpressionAttributeNames: {
          "#stripeConnectAccountId": "stripeConnectAccountId",
        },
        ExpressionAttributeValues: {
          ":stripeConnectAccountId": item.stripeConnectAccountId,
        },
      }),
    );
  }
}
