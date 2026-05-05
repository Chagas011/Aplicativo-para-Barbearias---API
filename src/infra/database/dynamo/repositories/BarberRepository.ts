import { Barber } from "@/application/entites/Barber";
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
import { BarberItem } from "../items/BarberItem";

@Injectable()
export class BarberRepository {
  constructor(private readonly appConfig: AppConfig) {}

  async create(barber: Barber): Promise<void> {
    const item = BarberItem.fromEntity(barber).toItem();

    await dynamoClient.send(
      new PutCommand({
        TableName: this.appConfig.db.dynamodb.mainTable,
        Item: item,
      }),
    );
  }

  async findById(
    barbershopId: string,
    barberId: string,
  ): Promise<Barber | null> {
    const result = await dynamoClient.send(
      new GetCommand({
        TableName: this.appConfig.db.dynamodb.mainTable,
        Key: {
          PK: BarberItem.getPK(barbershopId),
          SK: BarberItem.getSK(barberId),
        },
      }),
    );

    if (!result.Item) {
      return null;
    }

    return BarberItem.toEntity(result.Item as BarberItem.ItemTypes);
  }

  async listByBarbershop(barbershopId: string): Promise<Barber[]> {
    const result = await dynamoClient.send(
      new QueryCommand({
        TableName: this.appConfig.db.dynamodb.mainTable,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
        ExpressionAttributeValues: {
          ":pk": BarberItem.getPK(barbershopId),
          ":sk": "BARBER#",
        },
      }),
    );

    return (
      result.Items?.map((item) =>
        BarberItem.toEntity(item as BarberItem.ItemTypes),
      ) ?? []
    );
  }

  async delete(
    barbershopId: string,
    barberId: string,
    accountId: string,
  ): Promise<void> {
    await dynamoClient.send(
      new DeleteCommand({
        TableName: this.appConfig.db.dynamodb.mainTable,
        Key: {
          PK: BarberItem.getPK(barbershopId),
          SK: BarberItem.getSK(barberId),
        },
        ConditionExpression: "accountId = :accountId",
        ExpressionAttributeValues: {
          ":accountId": accountId,
        },
      }),
    );
  }

  async save(barber: Barber): Promise<void> {
    const item = BarberItem.fromEntity(barber).toItem();

    await dynamoClient.send(
      new UpdateCommand({
        TableName: this.appConfig.db.dynamodb.mainTable,
        Key: {
          PK: item.PK,
          SK: item.SK,
        },
        UpdateExpression:
          "SET #name = :name, #photoURL = :photoURL, #workingHours = :workingHours",
        ExpressionAttributeNames: {
          "#name": "name",
          "#photoURL": "photoURL",
          "#workingHours": "workingHours",
        },
        ConditionExpression: "accountId = :accountId",
        ExpressionAttributeValues: {
          ":name": item.name,
          ":photoURL": item.photoURL ?? null,
          ":workingHours": item.workingHours,
          ":accountId": item.accountId,
        },
      }),
    );
  }
}
