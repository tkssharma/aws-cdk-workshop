// Package.
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Stages } from '@cdc3/cdk-common';

// Internal.
import { buildS3Bucket, buildWikiBucket } from '../lib/warmBuckets';

// Code.
export interface S3BucketsStackProps extends cdk.StackProps {
  stage: Stages;
}

export class S3BucketsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: S3BucketsStackProps) {
    super(scope, id, props);

    const { stage } = props;

    // Buckets
    const { bucket } = buildS3Bucket({ stack: this, stage });
    const { wikiBucket } = buildWikiBucket({ stack: this, stage });

    // Outputs
    new cdk.CfnOutput(this, 's3-bucket-wiki-arn', {
      value: wikiBucket.bucketArn,
      exportName: 's3-bucket-wiki-arn',
      description:
        'ARN identifier for S3 bucket Wiki that can be imported for further usage',
    });
  }
}
