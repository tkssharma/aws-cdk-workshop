// Package.
import { aws_s3, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Stage } from '@aws-cdk/cdk-common';

// Code.
export interface BuildS3BucketParams {
  stack: Construct;
  stage: Stage;
}

export function buildS3Bucket(params: BuildS3BucketParams) {
  const { stack, stage } = params;

  const bucket = new aws_s3.Bucket(stack, 's3-bucket-test', {
    bucketName: 'cdc3-test',
    removalPolicy:
      stage === Stage.Development
        ? RemovalPolicy.DESTROY
        : RemovalPolicy.RETAIN,
  });

  return {
    bucket,
  };
}

export function buildWikiBucket(params: BuildS3BucketParams) {
  const { stack, stage } = params;

  const wikiBucket = new aws_s3.Bucket(stack, 's3-bucket-wiki', {
    bucketName: 'cdc3-wiki',
    publicReadAccess: true,
    websiteIndexDocument: 'index.html',
    removalPolicy:
      stage === Stages.Development
        ? RemovalPolicy.DESTROY
        : RemovalPolicy.RETAIN,
  });

  return { wikiBucket };
}
