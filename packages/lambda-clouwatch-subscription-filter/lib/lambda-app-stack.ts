import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as destinations from 'aws-cdk-lib/aws-logs-destinations';

import * as path from 'path';
import { StackProps } from 'aws-cdk-lib';
import { FilterPattern } from 'aws-cdk-lib/aws-logs';

export class LambdaAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    //Creating an AWS CloudWatch log group for receiving logs
    const logGroup = new cdk.aws_logs.LogGroup(
      this,
      'SubscriptionFilterLogGroup',
      {
        logGroupName: 'demo-app-logs',
        retention: cdk.aws_logs.RetentionDays.ONE_MONTH,
      }
    );

    //Create lambda function for cloudwatch data
    const logProcessingFunction = new cdk.aws_lambda.Function(
      this,
      'LogProcessingLambda',
      {
        code: cdk.aws_lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
        handler: 'log.handler',
        runtime: cdk.aws_lambda.Runtime.NODEJS_16_X,
        memorySize: 128,
      }
    );

    //Create subscription filter to forward logs to lambda
    const subscriptionFilter = new cdk.aws_logs.SubscriptionFilter(
      this,
      'LogSubscriptionFilter',
      {
        logGroup,
        destination: new destinations.LambdaDestination(logProcessingFunction),
        filterPattern: FilterPattern.anyTerm(
          'ERROR',
          'Error',
          'error',
          '404',
          '502'
        ),
      }
    );
  }
}
