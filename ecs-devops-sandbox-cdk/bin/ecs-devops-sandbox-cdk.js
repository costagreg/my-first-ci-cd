#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { EcsDevopsSandboxCdkStack } = require('../lib/ecs-devops-sandbox-cdk-stack');

const app = new cdk.App();
new EcsDevopsSandboxCdkStack(app, 'EcsDevopsSandboxCdkStack');
