import { Subscription } from "@/application/entites/Subscription";
import { dynamoClient } from "@/infra/clients/dynamoClient";
import { Injectable } from "@/kernel/decorators/Injectable";
import { AppConfig } from "@/shared/config/Appconfig";
import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { SubscriptionItem } from "../items/SubscriptionItem";

@Injectable()
export class SubscriptionRepository {
  constructor(private readonly appConfig: AppConfig) {}

  async create(subscription: Subscription): Promise<void> {
    const item = SubscriptionItem.fromEntity(subscription).toItem();

    await dynamoClient.send(
      new PutCommand({
        TableName: this.appConfig.db.dynamodb.mainTable,
        Item: item,
      }),
    );
  }

  async findById(
    accountId: string,
    subscriptionId: string,
  ): Promise<Subscription | null> {
    const result = await dynamoClient.send(
      new GetCommand({
        TableName: this.appConfig.db.dynamodb.mainTable,
        Key: {
          PK: SubscriptionItem.getPK(accountId),
          SK: SubscriptionItem.getSK(subscriptionId),
        },
      }),
    );

    if (!result.Item) {
      return null;
    }

    return SubscriptionItem.toEntity(result.Item as SubscriptionItem.ItemTypes);
  }

  async listByAccount(accountId: string): Promise<Subscription[]> {
    const result = await dynamoClient.send(
      new QueryCommand({
        TableName: this.appConfig.db.dynamodb.mainTable,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
        ExpressionAttributeValues: {
          ":pk": SubscriptionItem.getPK(accountId),
          ":sk": "SUBSCRIPTION#",
        },
      }),
    );

    return (
      result.Items?.map((item) =>
        SubscriptionItem.toEntity(item as SubscriptionItem.ItemTypes),
      ) ?? []
    );
  }

  async findActiveByAccount(accountId: string): Promise<Subscription | null> {
    const subscriptions = await this.listByAccount(accountId);

    return (
      subscriptions.find((subscription) => subscription.status === "ACTIVE") ??
      null
    );
  }

  async save(subscription: Subscription): Promise<void> {
    const item = SubscriptionItem.fromEntity(subscription).toItem();

    await dynamoClient.send(
      new UpdateCommand({
        TableName: this.appConfig.db.dynamodb.mainTable,
        Key: {
          PK: item.PK,
          SK: item.SK,
        },
        UpdateExpression: "SET #plan = :plan, #status = :status",
        ExpressionAttributeNames: {
          "#plan": "plan",
          "#status": "status",
        },
        ExpressionAttributeValues: {
          ":plan": item.plan,
          ":status": item.status,
        },
      }),
    );
  }

  async delete(accountId: string, subscriptionId: string): Promise<void> {
    await dynamoClient.send(
      new DeleteCommand({
        TableName: this.appConfig.db.dynamodb.mainTable,
        Key: {
          PK: SubscriptionItem.getPK(accountId),
          SK: SubscriptionItem.getSK(subscriptionId),
        },
      }),
    );
  }
}
