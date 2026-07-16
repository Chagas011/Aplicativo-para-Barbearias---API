import { Scheduling } from "@/application/entites/Scheduling";
import { dynamoClient } from "@/infra/clients/dynamoClient";
import { Injectable } from "@/kernel/decorators/Injectable";
import { AppConfig } from "@/shared/config/Appconfig";
import { DeleteCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { SchedulingItem } from "../items/SchedulingItem";

@Injectable()
export class SchedulingRepository {
  constructor(private readonly appConfig: AppConfig) {}

  async listByBarberAndDate(
    barberId: string,
    date?: string,
  ): Promise<Scheduling[]> {
    const sk = date ? `SCHEDULING#${date}` : "SCHEDULING#";

    const result = await dynamoClient.send(
      new QueryCommand({
        TableName: this.appConfig.db.dynamodb.mainTable,

        KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",

        ExpressionAttributeValues: {
          ":pk": SchedulingItem.getPK(barberId),
          ":sk": sk,
        },

        ScanIndexForward: true,
      }),
    );

    return (
      result.Items?.map((item) =>
        SchedulingItem.toEntity(item as SchedulingItem.ItemTypes),
      ) ?? []
    );
  }

  async listByClient(accountId: string) {
    const result = await dynamoClient.send(
      new QueryCommand({
        TableName: this.appConfig.db.dynamodb.mainTable,
        IndexName: "GS1",
        KeyConditionExpression: "GS1PK = :pk",
        ExpressionAttributeValues: {
          ":pk": `ACCOUNT#${accountId}`,
        },
      }),
    );
    return (
      result.Items?.map((item) =>
        SchedulingItem.toEntity(item as SchedulingItem.ItemTypes),
      ) ?? []
    );
  }

  async delete(
    accountId: string,
    barberId: string,
    date: string,
    startTime: string,
  ): Promise<void> {
    const command = new DeleteCommand({
      TableName: this.appConfig.db.dynamodb.mainTable,

      Key: {
        PK: SchedulingItem.getPK(barberId),
        SK: SchedulingItem.getSK(date, startTime),
      },

      ConditionExpression: "attribute_exists(PK) AND accountId = :accountId",

      ExpressionAttributeValues: {
        ":accountId": accountId,
      },
    });

    await dynamoClient.send(command);
  }

  async create(scheduling: Scheduling): Promise<void> {
    const item = SchedulingItem.fromEntity(scheduling).toItem();
    await dynamoClient.send(
      new PutCommand({
        TableName: this.appConfig.db.dynamodb.mainTable,
        Item: item,
        ConditionExpression:
          "attribute_not_exists(PK) AND attribute_not_exists(SK)",
      }),
    );
  }
}
