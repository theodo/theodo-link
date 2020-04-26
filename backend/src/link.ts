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

const redirectTo = (location: string) => ({
  statusCode: 301,
  headers: {
    Location: location,
  },
  body: "",
});

const notFound = {
  statusCode: 404,
  body: "Not found",
};

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  _context: Context
) => {
  if (!event.pathParameters) {
    return redirectTo(process.env.ADMIN_URL);
  }

  const linkId = event.pathParameters.link;
  console.log(linkId);
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: linkId,
    },
  };
  const result = await dynamodbClient.get(params).promise();
  const link = result.Item as Link;

  return link ? redirectTo(link.location) : notFound;
};
