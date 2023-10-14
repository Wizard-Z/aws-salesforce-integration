const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
} = require("@aws-sdk/lib-dynamodb");
const crypto = require('crypto');
const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = process.env.OPPORTUNITY_TABLE_NAME;


const checkEventStore = async (event) => {
  // Compound expression while insertion. check if exist.attribute_not_exists(‘PRIMARY KEY’) OR ‘CURRENT VERSION’ < ‘NEW VERSION’
  //https://amazon-dynamodb-labs.workshop.aws/event-driven-architecture/ex3fixbugs/step1.html
  // ConditionalCheckFailedException
  let responseToReturn;
  try {
    const existingEvent = await dynamo.send(
      new GetCommand({
        TableName: tableName,
        Key: {
          eventId: event.eventId
        },
      })
    );
    if (existingEvent.Item) {
      const item = await dynamo.send(
        new PutCommand({
          TableName: tableName,
          Item: {
            eventId: existingEvent.Item.eventId,
            opportunityName: existingEvent.Item.opportunityName,
            closeDate: existingEvent.Item.closeDate,
            amount: existingEvent.Item.amount,
            currentStage: event.currentStage,
            updatedTimestamp: new Date().toISOString()
          },
        })
      );
      responseToReturn = {dbResponse: item}
      
    } else {
      const item = await dynamo.send(
        new PutCommand({
          TableName: tableName,
          Item: {
            eventId: event.eventId,
            orderId: event.orderId,
            opportunityName: event.opportunityName,
            closeDate: event.closeDate,
            amount: event.amount,
            currentStage: event.currentStage,
            createdTimestamp: new Date().toISOString()
          },
        })
      );
      responseToReturn = { dbResponse: item };
    }
    return responseToReturn;
  } catch (error) {
    console.log(error, "errorOccured");
  }
};
module.exports = { checkEventStore };
