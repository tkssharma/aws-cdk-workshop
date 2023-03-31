import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

import * as path from 'path';

export class LambdaAppStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 👇 lambda function definition
    const myFunction = new lambda.Function(this, 'my-function', {
      runtime: lambda.Runtime.NODEJS_16_X,
      memorySize: 1024,
      timeout: cdk.Duration.seconds(5),
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '/../src')),
    });

    // 👇 define a metric for lambda errors
    const functionErrors = myFunction.metricErrors({
      period: cdk.Duration.minutes(1),
    });
    // 👇 define a metric for lambda invocations
    const functionInvocation = myFunction.metricInvocations({
      period: cdk.Duration.minutes(1),
    });

    // 👇 create an Alarm using the Alarm construct
    new cdk.aws_cloudwatch.Alarm(this, 'lambda-errors-alarm', {
      metric: functionErrors,
      threshold: 1,
      comparisonOperator:
        cdk.aws_cloudwatch.ComparisonOperator
          .GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      evaluationPeriods: 1,
      alarmDescription:
        'Alarm if the SUM of Errors is greater than or equal to the threshold (1) for 1 evaluation period',
    });

    // 👇 create an Alarm directly on the Metric
    functionInvocation.createAlarm(this, 'lambda-invocation-alarm', {
      threshold: 1,
      evaluationPeriods: 1,
      alarmDescription:
        'Alarm if the SUM of Lambda invocations is greater than or equal to the  threshold (1) for 1 evaluation period',
    });
  }
}
