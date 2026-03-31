import * as crypto from "crypto";
import * as cdk from "aws-cdk-lib";
import * as amplify from "aws-cdk-lib/aws-amplify";
import { Construct } from "constructs";

export class ClawbotWebWidgetStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 凭证：首次部署自动生成，后续通过 -c channelId=xxx -c clientSecret=xxx 传入复用
    const clientId = this.node.tryGetContext('channelId') || crypto.randomUUID();
    const clientSecret = this.node.tryGetContext('clientSecret') || crypto.randomBytes(32).toString('hex');

    // nanoclaw WebSocket URL 从 CDK context 读取（必填）
    const nanoclawWsUrl = this.node.tryGetContext('nanoclawWsUrl');
    if (!nanoclawWsUrl) {
      throw new Error('Required: -c nanoclawWsUrl=wss://your-nanoclaw-domain.com');
    }

    // Amplify Hosting App (manual deployment / Git-based)
    const app = new amplify.CfnApp(this, "ClawbotWidgetAmplify", {
      name: "clawbot-web-widget",
      platform: "WEB_COMPUTE",
      environmentVariables: [
        {
          name: "VITE_NANOCLAW_WS_URL",
          value: nanoclawWsUrl,
        },
        {
          name: "VITE_CHANNEL_ID",
          value: clientId,
        },
        {
          name: "VITE_CLIENT_SECRET",
          value: clientSecret,
        },
      ],
      buildSpec: JSON.stringify({
        version: 1,
        frontend: {
          phases: {
            preBuild: { commands: ["cd frontend", "npm ci"] },
            build: { commands: ["npm run build"] },
          },
          artifacts: {
            baseDirectory: "frontend/dist",
            files: ["**/*"],
          },
          cache: { paths: ["frontend/node_modules/**/*"] },
        },
      }),
    });

    const branch = new amplify.CfnBranch(this, "MainBranch", {
      appId: app.attrAppId,
      branchName: "main",
      enableAutoBuild: true,
    });

    new cdk.CfnOutput(this, 'WidgetUrl', {
      value: `https://main.${app.attrAppId}.amplifyapp.com`,
      description: 'Chat widget URL',
    });

    new cdk.CfnOutput(this, 'ChannelId', {
      value: clientId,
      description: 'Web Widget Channel ID — register this in NanoClaw console',
    });

    // DEMO-LEVEL: CfnOutput exposes secret so user can register it in NanoClaw.
    // For production, store in Secrets Manager and retrieve out-of-band.
    new cdk.CfnOutput(this, 'ClientSecret', {
      value: clientSecret,
      description: 'SENSITIVE: Web Widget Client Secret — save it and register in NanoClaw. Only shown once in CDK output.',
    });

    new cdk.CfnOutput(this, 'NanoclawWsUrl', {
      value: nanoclawWsUrl,
      description: 'NanoClaw WebSocket endpoint',
    });

    new cdk.CfnOutput(this, 'EmbedCode', {
      value: `<iframe src="https://main.${app.attrAppId}.amplifyapp.com?userId=USER_ID" style="width:400px;height:600px;border:none;" />`,
      description: 'Embed code (replace USER_ID)',
    });
  }
}
