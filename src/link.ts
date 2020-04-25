import {
  Context,
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
} from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import "source-map-support/register";

const dynamodbClient = new DynamoDB.DocumentClient({});

interface Link {
  id: string;
  location: string;
}

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  _context: Context
) => {
  const linkId = event.pathParameters.path;
  console.log(linkId);
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: linkId,
    },
  };
  const result = await dynamodbClient.get(params).promise();
  const link = result.Item as Link;

  return link
    ? {
        statusCode: 301,
        headers: {
          Location: link.location,
        },
        body: "",
      }
    : {
        statusCode: 404,
        body: "Not found",
      };
};
