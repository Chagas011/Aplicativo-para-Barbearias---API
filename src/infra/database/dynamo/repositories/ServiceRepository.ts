import { Service } from "@/application/entites/Service";
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
import { ServiceItem } from "../items/ServiceItem";

@Injectable()
export class ServiceRepository {
  constructor(private readonly appConfig: AppConfig) {}

  async create(service: Service): Promise<void> {
    const item = ServiceItem.fromEntity(service).toItem();

    await dynamoClient.send(
      new PutCommand({
        TableName: this.appConfig.db.dynamodb.mainTable,
        Item: item,
      }),
    );
  }

  async findById(barberId: string, serviceId: string): Promise<Service | null> {
    const result = await dynamoClient.send(
      new GetCommand({
        TableName: this.appConfig.db.dynamodb.mainTable,
        Key: {
          PK: ServiceItem.getPK(barberId),
          SK: ServiceItem.getSK(serviceId),
        },
      }),
    );

    if (!result.Item) {
      return null;
    }

    return ServiceItem.toEntity(result.Item as ServiceItem.ItemTypes);
  }

  async listByBarber(barberId: string): Promise<Service[]> {
    const result = await dynamoClient.send(
      new QueryCommand({
        TableName: this.appConfig.db.dynamodb.mainTable,
        KeyConditionExpression: "PK =  :pk AND begins_with(SK, :sk)",
        ExpressionAttributeValues: {
          ":pk": ServiceItem.getPK(barberId),
          ":sk": "SERVICE#",
        },
      }),
    );

    return (
      result.Items?.map((item) =>
        ServiceItem.toEntity(item as ServiceItem.ItemTypes),
      ) ?? []
    );
  }

  async delete(
    accountId: string,
    serviceId: string,
    barberId: string,
  ): Promise<void> {
    await dynamoClient.send(
      new DeleteCommand({
        TableName: this.appConfig.db.dynamodb.mainTable,
        Key: {
          PK: ServiceItem.getPK(barberId),
          SK: ServiceItem.getSK(serviceId),
        },
        ConditionExpression: "accountId = :accountId",
        ExpressionAttributeValues: {
          ":accountId": accountId,
        },
      }),
    );
  }

  async save(service: Service): Promise<void> {
    const item = ServiceItem.fromEntity(service).toItem();

    await dynamoClient.send(
      new UpdateCommand({
        TableName: this.appConfig.db.dynamodb.mainTable,
        Key: {
          PK: item.PK,
          SK: item.SK,
        },
        UpdateExpression:
          "SET #name = :name, #duration = :duration, #price = :price, #photoURL = :photoURL, #isActive = :isActive",
        ExpressionAttributeNames: {
          "#name": "name",
          "#duration": "duration",
          "#price": "price",
          "#photoURL": "photoURL",
          "#isActive": "isActive",
        },
        ConditionExpression: "accountId = :accountId",
        ExpressionAttributeValues: {
          ":name": item.name,
          ":duration": item.duration,
          ":price": item.price,
          ":photoURL": item.photoURL ?? null,
          ":isActive": item.isActive,
          ":accountId": item.accountId,
        },
      }),
    );
  }
}
