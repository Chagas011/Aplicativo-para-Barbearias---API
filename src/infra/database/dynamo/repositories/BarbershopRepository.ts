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

import { Barbershop } from "@/application/entites/BarberShop";
import { BarbershopItem } from "../items/BarbershopItem";

@Injectable()
export class BarbershopRepository {
  constructor(private readonly appConfig: AppConfig) {}

  async create(barbershop: Barbershop): Promise<void> {
    const item = BarbershopItem.fromEntity(barbershop).toItem();

    await dynamoClient.send(
      new PutCommand({
        TableName: this.appConfig.db.dynamodb.mainTable,
        Item: item,
      }),
    );
  }

  async listAll(): Promise<Barbershop[]> {
    const result = await dynamoClient.send(
      new QueryCommand({
        TableName: this.appConfig.db.dynamodb.mainTable,
        KeyConditionExpression: "GS1PK = :pk",
        IndexName: "GS1",
        ExpressionAttributeValues: {
          ":pk": BarbershopItem.getGS1PK(),
        },
      }),
    );

    return (
      result.Items?.map((item) =>
        BarbershopItem.toEntity(item as BarbershopItem.ItemTypes),
      ) ?? []
    );
  }

  async listAllByAccount(accountId: string): Promise<Barbershop[]> {
    const result = await dynamoClient.send(
      new QueryCommand({
        TableName: this.appConfig.db.dynamodb.mainTable,
        KeyConditionExpression: "GS2PK = :pk",
        IndexName: "GS2",
        ExpressionAttributeValues: {
          ":pk": BarbershopItem.getGS2PK(accountId),
        },
      }),
    );

    return (
      result.Items?.map((item) =>
        BarbershopItem.toEntity(item as BarbershopItem.ItemTypes),
      ) ?? []
    );
  }

  async save(barbershop: Barbershop): Promise<void> {
    const item = BarbershopItem.fromEntity(barbershop).toItem();
    const command = new UpdateCommand({
      TableName: this.appConfig.db.dynamodb.mainTable,

      Key: {
        PK: item.PK,
        SK: item.SK,
      },

      UpdateExpression:
        "SET #name = :name, #phone = :phone, #photoURL = :photoURL, #address = :address, #openingHours = :openingHours, #socialMedia = :socialMedia",

      ExpressionAttributeNames: {
        "#name": "name",
        "#phone": "phone",
        "#photoURL": "photoURL",
        "#address": "address",
        "#openingHours": "openingHours",
        "#socialMedia": "socialMedia",
      },

      ExpressionAttributeValues: {
        ":name": item.name,
        ":phone": item.phone,
        ":photoURL": item.photoURL,
        ":address": item.address,
        ":openingHours": item.openingHours,
        ":socialMedia": item.socialMedia,
        ":accountId": item.accountId,
      },
      ConditionExpression: "accountId = :accountId",
      ReturnValues: "NONE",
    });

    await dynamoClient.send(command);
  }

  async findById(barbershopId: string): Promise<Barbershop | null> {
    const result = await dynamoClient.send(
      new GetCommand({
        TableName: this.appConfig.db.dynamodb.mainTable,
        Key: {
          PK: BarbershopItem.getPK(barbershopId),
          SK: BarbershopItem.getSK(barbershopId),
        },
      }),
    );

    if (!result.Item) {
      return null;
    }

    return BarbershopItem.toEntity(result.Item as BarbershopItem.ItemTypes);
  }

  async delete(accountId: string, barbershopId: string): Promise<void> {
    await dynamoClient.send(
      new DeleteCommand({
        TableName: this.appConfig.db.dynamodb.mainTable,
        Key: {
          PK: BarbershopItem.getPK(barbershopId),
          SK: BarbershopItem.getSK(barbershopId),
        },
        ConditionExpression: "accountId = :accountId",
        ExpressionAttributeValues: {
          ":accountId": accountId,
        },
      }),
    );
  }
}
