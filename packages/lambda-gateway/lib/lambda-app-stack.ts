import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

import * as path from 'path';

export interface LambdaProps extends cdk.StackProps {
  stage: string;
}

export class LambdaAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: LambdaProps) {
    super(scope, id, props);

    const { stage } = props;

    const userUploadsS3Bucket = new cdk.aws_s3.Bucket(
      this,
      `user-api-upload-${stage}`,
      {
        bucketName: `user-api-upload-${stage}`,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }
    );

    const userDynamoTable = new dynamodb.Table(this, `users-table-${stage}`, {
      tableName: `api-users-table-${stage}`,
      partitionKey: { name: 'user_id', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'created_at', type: dynamodb.AttributeType.NUMBER },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const apiGetUsersLambdaFn = new cdk.aws_lambda.Function(
      this,
      `api-get-user-${stage}`,
      {
        functionName: `api-get-user-lambda-${stage}`,
        runtime: cdk.aws_lambda.Runtime.NODEJS_16_X,
        memorySize: 1024,
        logRetention: cdk.aws_logs.RetentionDays.FIVE_DAYS,
        environment: {
          stage,
        },
        handler: 'index.handler',
        code: cdk.aws_lambda.Code.fromAsset(path.join(__dirname, '..', 'src')),
        initialPolicy: [
          new cdk.aws_iam.PolicyStatement({
            effect: cdk.aws_iam.Effect.ALLOW,
            actions: ['s3:*'],
            resources: [userUploadsS3Bucket.bucketArn],
          }),
          new cdk.aws_iam.PolicyStatement({
            effect: cdk.aws_iam.Effect.ALLOW,
            actions: ['sns:*'],
            resources: ['*'],
          }),
          new cdk.aws_iam.PolicyStatement({
            effect: cdk.aws_iam.Effect.ALLOW,
            actions: ['dynamodb:*'],
            resources: [userDynamoTable.tableArn],
          }),
        ],
      }
    );

    userDynamoTable.grantReadWriteData(apiGetUsersLambdaFn);
    userUploadsS3Bucket.grantReadWrite(apiGetUsersLambdaFn);

    // API GW
    const apiGw = new cdk.aws_apigateway.LambdaRestApi(this, `users-api-gw`, {
      handler: apiGetUsersLambdaFn,
      deploy: true,
      proxy: true,
      binaryMediaTypes: ['*/*'],
      deployOptions: {
        stageName: stage,
      },
    });

    new cdk.CfnOutput(this, `apiGetUsersLambdaFn`, {
      exportName: `apiGetUsersLambdaFn--arn`,
      value: apiGetUsersLambdaFn.functionArn,
    });

    new cdk.CfnOutput(this, `userDynamoTable`, {
      exportName: `userDynamoTable--arn`,
      value: userDynamoTable.tableArn,
    });
    new cdk.CfnOutput(this, `userUploadsS3Bucket`, {
      exportName: `userUploadsS3Bucket--arn`,
      value: userUploadsS3Bucket.bucketArn,
    });
    new cdk.CfnOutput(this, `user-api-gateway`, {
      exportName: `user-api--gateway-arn`,
      value: apiGw.restApiName,
    });
  }
}
