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

import { SubscriptionClient } from "@/application/entites/SubscriptionClient";
import { SubscriptionClientItem } from "../items/SubscriptionClientItem";

@Injectable()
export class SubscriptionClientRepository {
  constructor(private readonly appConfig: AppConfig) {}

  async create(subscriptionClient: SubscriptionClient): Promise<void> {
    const item = SubscriptionClientItem.fromEntity(subscriptionClient).toItem();

    await dynamoClient.send(
      new PutCommand({
        TableName: this.appConfig.db.dynamodb.mainTable,
        Item: item,
      }),
    );
  }

  async findById(
    accountId: string,
    subscriptionClientId: string,
  ): Promise<SubscriptionClient | null> {
    const result = await dynamoClient.send(
      new GetCommand({
        TableName: this.appConfig.db.dynamodb.mainTable,
        Key: {
          PK: SubscriptionClientItem.getPK(accountId),
          SK: SubscriptionClientItem.getSK(subscriptionClientId),
        },
      }),
    );

    if (!result.Item) {
      return null;
    }

    return SubscriptionClientItem.toEntity(
      result.Item as SubscriptionClientItem.ItemTypes,
    );
  }

  async listByAccount(accountId: string): Promise<SubscriptionClient[]> {
    const result = await dynamoClient.send(
      new QueryCommand({
        TableName: this.appConfig.db.dynamodb.mainTable,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
        ExpressionAttributeValues: {
          ":pk": SubscriptionClientItem.getPK(accountId),
          ":sk": "SUBSCRIPTION#CLIENT#",
        },
      }),
    );

    return (
      result.Items?.map((item) =>
        SubscriptionClientItem.toEntity(
          item as SubscriptionClientItem.ItemTypes,
        ),
      ) ?? []
    );
  }

  async findActiveByAccount(
    accountId: string,
  ): Promise<SubscriptionClient | null> {
    const subscriptions = await this.listByAccount(accountId);

    return (
      subscriptions.find((subscription) => subscription.status === "ACTIVE") ??
      null
    );
  }

  async save(subscriptionClient: SubscriptionClient): Promise<void> {
    const item = SubscriptionClientItem.fromEntity(subscriptionClient).toItem();

    await dynamoClient.send(
      new UpdateCommand({
        TableName: this.appConfig.db.dynamodb.mainTable,
        Key: {
          PK: item.PK,
          SK: item.SK,
        },
        UpdateExpression:
          "SET #plan = :plan, #status = :status, #remaningServices = :remaningServices",
        ExpressionAttributeNames: {
          "#plan": "plan",
          "#status": "status",
          "#remaningServices": "remaningServices",
        },
        ExpressionAttributeValues: {
          ":plan": item.plan,
          ":status": item.status,
          ":remaningServices": item.plan.remaningServices,
        },
      }),
    );
  }

  async delete(accountId: string, subscriptionClientId: string): Promise<void> {
    await dynamoClient.send(
      new DeleteCommand({
        TableName: this.appConfig.db.dynamodb.mainTable,
        Key: {
          PK: SubscriptionClientItem.getPK(accountId),
          SK: SubscriptionClientItem.getSK(subscriptionClientId),
        },
      }),
    );
  }
}
