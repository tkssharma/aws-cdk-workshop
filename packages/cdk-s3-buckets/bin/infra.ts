#!/usr/bin/env node
// Package.
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';

// Internal.
import { S3BucketsStack } from '../stacks/s3-buckets-stack';
import { Stages } from '@cdc3/cdk-common';

// Code.
const app = new cdk.App();

const stage = (process.env.STAGE as Stages) || Stages.Development;

new S3BucketsStack(app, 'cdk-s3-buckets', {
  stage,
  env: {
    region: 'eu-central-1',
  },
  stackName: 'cdk-s3-buckets',
  description:
    'AWS S3 buckets used to store apps, files, logs and any other archived data',
  terminationProtection: stage === Stages.Production,
});
