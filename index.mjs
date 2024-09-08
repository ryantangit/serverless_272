import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

const dynamo = DynamoDBDocument.from(new DynamoDB());

export const handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  let body;
  let statusCode = "200";
  const headers = {
    "Content-Type": "application/json",
  };
  const params = {
    TableName: "StudentRecords",
  };

  try {
    switch (event.httpMethod) {
      case "DELETE":
        params.Key = JSON.parse(event.body);
        body = await dynamo.delete(params);
        break;
      case "GET":
        params.Key = { student_id: event.queryStringParameters.student_id };
        body = await dynamo.get(params);
        break;
      case "POST":
        params.Item = JSON.parse(event.body);
        body = await dynamo.put(params);
        break;
      case "PUT":
        params.Item = JSON.parse(event.body);
        body = await dynamo.put(params);
        break;
      default:
        throw new Error(`Unsupported method "${event.httpMethod}"`);
    }
  } catch (err) {
    statusCode = "400";
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};
