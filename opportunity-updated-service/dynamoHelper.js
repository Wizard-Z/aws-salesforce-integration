const { DynamoDBClient, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({ region: "ap-south-1" });
// const tableName = process.env.OPPORTUNITY_TABLE_NAME;
const tableName = 'aws-sf-demo-OpportunityTable-121FWKLTTQKVY';

const checkEventStore = async (event) => {
  const key = { eventId: { S: event.eventId } };
  // Create an expression for the update
  const updateExpression = 'SET #currentStage = :statusValue';
  const expressionAttributeNames = { '#currentStage': 'currentStage' };
  const expressionAttributeValues = { ':statusValue': { S: event.currentStage } }; // Replace 'NewStatus' with the new status value.


  // Compound expression while insertion. check if exist.attribute_not_exists(‘PRIMARY KEY’) OR ‘CURRENT VERSION’ < ‘NEW VERSION’
  //https://amazon-dynamodb-labs.workshop.aws/event-driven-architecture/ex3fixbugs/step1.html
  // ConditionalCheckFailedException
  const updateItemCommand = new UpdateItemCommand({
    TableName: tableName,
    Key: key,
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW', // Specify what data to return after the update
  });

  try {
    const data = await client.send(updateItemCommand);
    console.log('Item updated successfully:', data);
    return data
  } catch (error) {
    console.error('Error updating item:', error);
  }

};
module.exports = { checkEventStore };
