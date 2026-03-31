import * as cdk from "aws-cdk-lib";
import * as amplify from "aws-cdk-lib/aws-amplify";
import { Construct } from "constructs";

export class ClawbotWebWidgetStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Amplify Hosting App (manual deployment / Git-based)
    const amplifyApp = new amplify.CfnApp(this, "ClawbotWidgetAmplify", {
      name: "clawbot-web-widget",
      platform: "WEB_COMPUTE",
      environmentVariables: [
        {
          name: "VITE_NANOCLAW_WS_URL",
          value: this.node.tryGetContext("nanoclaw_ws_url") ?? "wss://api.nanoclaw.com",
        },
        {
          name: "VITE_CHANNEL_ID",
          value: this.node.tryGetContext("channel_id") ?? "demo-channel",
        },
        {
          name: "VITE_CLIENT_SECRET",
          value: this.node.tryGetContext("client_secret") ?? "change-me-secret",
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
      appId: amplifyApp.attrAppId,
      branchName: "main",
      enableAutoBuild: true,
    });

    new cdk.CfnOutput(this, "AmplifyAppId", {
      value: amplifyApp.attrAppId,
    });

    new cdk.CfnOutput(this, "AmplifyAppUrl", {
      value: `https://main.${amplifyApp.attrDefaultDomain}`,
      description: "Amplify default URL for the widget",
    });
  }
}
