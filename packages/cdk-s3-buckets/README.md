# @aws-cdk/cdk-s3-buckets

## Getting started

Configure your `aws` client with your SSO portal. Please follow the instructions at root [README.md](../../README.md)

```bash
aws configure sso
```

Load environment variables, where the aws credentials will be used by cdk to perform aws calls.

```bash
export AWS_ACCESS_KEY_ID=<access key>
export AWS_SECRET_ACCESS_KEY=<secret key>
export AWS_SESSION_TOKEN=<session token>
export CDK_DEFAULT_REGION=eu-central-1
export CDK_DEFAULT_ACCOUNT=XXXXXXXXX
```

### Initial bootstrap

This command setup AWS account for the AWS CDK framework. This command can also be used to update the `CDKToolkit` stack. For further information please check the [reference](https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping.html)

```
npm run cdk -- bootstrap aws://$CDK_DEFAULT_ACCOUNT/$CDK_DEFAULT_REGION
```

### Deploy

```
npm run cdk -- deploy --require-approval never
```

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
