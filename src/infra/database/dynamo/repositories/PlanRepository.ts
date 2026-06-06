import { Plan } from "@/application/entites/Plan";
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
import { PlanItem } from "../items/PlanItem";

@Injectable()
export class PlanRepository {
  constructor(private readonly appConfig: AppConfig) {}

  async create(plan: Plan): Promise<void> {
    const item = PlanItem.fromEntity(plan).toItem();

    await dynamoClient.send(
      new PutCommand({
        TableName: this.appConfig.db.dynamodb.mainTable,
        Item: item,
      }),
    );
  }

  async findById(barbershopId: string, planId: string): Promise<Plan | null> {
    const result = await dynamoClient.send(
      new GetCommand({
        TableName: this.appConfig.db.dynamodb.mainTable,
        Key: {
          PK: PlanItem.getPK(barbershopId),
          SK: PlanItem.getSK(planId),
        },
      }),
    );

    if (!result.Item) {
      return null;
    }

    return PlanItem.toEntity(result.Item as PlanItem.ItemTypes);
  }

  async listByBarbershop(barbershopId: string): Promise<Plan[]> {
    const result = await dynamoClient.send(
      new QueryCommand({
        TableName: this.appConfig.db.dynamodb.mainTable,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
        ExpressionAttributeValues: {
          ":pk": PlanItem.getPK(barbershopId),
          ":sk": "PLAN#",
        },
      }),
    );

    return (
      result.Items?.map((item) =>
        PlanItem.toEntity(item as PlanItem.ItemTypes),
      ) ?? []
    );
  }

  async delete(barbershopId: string, planId: string): Promise<void> {
    await dynamoClient.send(
      new DeleteCommand({
        TableName: this.appConfig.db.dynamodb.mainTable,
        Key: {
          PK: PlanItem.getPK(barbershopId),
          SK: PlanItem.getSK(planId),
        },
      }),
    );
  }

  async save(plan: Plan): Promise<void> {
    const item = PlanItem.fromEntity(plan).toItem();

    await dynamoClient.send(
      new UpdateCommand({
        TableName: this.appConfig.db.dynamodb.mainTable,
        Key: {
          PK: item.PK,
          SK: item.SK,
        },
        UpdateExpression:
          "SET #name = :name, #price = :price, #remaningServices = :remaningServices, #services = :services",
        ExpressionAttributeNames: {
          "#name": "name",
          "#price": "price",
          "#remaningServices": "remaningServices",
          "#services": "services",
        },
        ExpressionAttributeValues: {
          ":name": item.name,
          ":price": item.price,
          ":remaningServices": item.remaningServices,
          ":services": item.services,
        },
      }),
    );
  }
}
