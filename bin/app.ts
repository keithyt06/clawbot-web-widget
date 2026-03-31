#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { ClawbotWebWidgetStack } from "../lib/clawbot-web-widget-stack";

const app = new cdk.App();

new ClawbotWebWidgetStack(app, "ClawbotWebWidgetStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? "us-east-1",
  },
});
