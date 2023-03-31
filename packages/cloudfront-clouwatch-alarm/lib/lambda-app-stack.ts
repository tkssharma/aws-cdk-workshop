// Package.
import * as cdk from 'aws-cdk-lib';
import {
  aws_cloudwatch,
  Duration,
  aws_cloudwatch_actions,
  aws_sns,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

// Internal.

// Code.
export interface Distributions {
  name: string;
  id: string;
}

export interface CDNAlaramsStackProps extends cdk.StackProps {
  stage: string;
  distroIds: Distributions[];
  infraFrontEndAlarmNotificationARN: string;
}

export class CDNAlaramStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CDNAlaramsStackProps) {
    super(scope, id, props);

    const { stage, distroIds, infraFrontEndAlarmNotificationARN, env } = props;

    const cdnMatrix = new aws_cloudwatch.Metric({
      namespace: `AWS/CloudFront`,
      metricName: '5xxErrorRate',
      unit: cdk.aws_cloudwatch.Unit.PERCENT,
      region: env?.region, // tried 'Global' as well
      statistic: 'Average',
      period: Duration.minutes(1),
      dimensionsMap: { DistributionId: `${distroIds[1].id}`, Region: 'Global' },
    });

    const alarmNotificationTopic = cdk.aws_sns.Topic.fromTopicArn(
      this,
      `infra-alarm-notification-topic-${stage}`,
      infraFrontEndAlarmNotificationARN!
    );

    const CfMetricAlarm = new aws_cloudwatch.Alarm(
      this,
      `${stage}CloudFrontErrors`,
      {
        metric: cdnMatrix,
        threshold: 75,
        evaluationPeriods: 3,
        datapointsToAlarm: 2,
      }
    );

    CfMetricAlarm.addAlarmAction(
      new aws_cloudwatch_actions.SnsAction(alarmNotificationTopic)
    );

    // Outputs

    new cdk.CfnOutput(this, `infra-alarm-notifications-alarm-${stage}`, {
      value: alarmNotificationTopic.topicArn,
      exportName: `infra-alarm-notifications-alarm-${stage}`,
    });
  }
}
