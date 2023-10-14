const {
  checkEventStore
} = require("./dynamoHelper");

exports.handler = async function (event) {
  console.log(event,"Processing received event from bus");
  
  await checkEventStore(event)
  // returning dummy result . Tweak as per use case
  const result = {
    orderId: event.eventId,
    status: "OPPORTUNITY updated"
  }
  return result;
};
