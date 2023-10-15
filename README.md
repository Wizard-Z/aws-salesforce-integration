# aws-salesforce-integration

Starter code having configuration to connect to salesforce via event bridge.

# Intro

The project contains 2 lambda services, 2 event bus configs a Dynamodb table to store track events. The services are just template service that can be changed to based on usecase. Deploying this stack will require IAM Permission setup for SAM CLI.

For more details check out this [article.](https://medium.com/@sourabhk880/efficient-event-orchestration-uniting-salesforce-with-aws-eventbridge-78cbaabd1137)

# Build process

- sam build
- sam deploy --guided
