# `@architect/aws-deploy-lite`

Typically AWS CloudFormation applications get deployed using the AWS CLI. Unfortunately, the AWS CLI is a large dependency. This library extracts the bare minimum `package` and `deploy` commands as standalone capabilities implemented in pure Node friendly JavaScript.

The following resource types are implemented:

- `AWS::Serverless::Function`
- `AWS::Lambda::Function`

> [!WARNING] 
> The following resource types are currently *not* implemented. This may affect custom plugins. Let us know if you need to support any of these resource types in Discord or an issue.
>
> - `AWS::AppSync::GraphQLSchema`
> - `AWS::Serverless::Api`
> - `AWS::AppSync::Resolver`
> - `AWS::AppSync::FunctionConfiguration`
> - `AWS::ApiGateway::RestApi`
> - `AWS::ElasticBeanstalk::ApplicationVersion`
> - `AWS::Lambda::LayerVersion`
> - `AWS::Serverless::LayerVersion`
> - `AWS::ServerlessRepo::Application`
> - `AWS::StepFunctions::StateMachine`
> - `AWS::Serverless::StateMachine`
> - `AWS::CloudFormation::Stack`
> - `AWS::Serverless::Application`
> - `AWS::Glue::Job`
> - `AWS::CodeCommit::Repository`
