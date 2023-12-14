#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkSimpleApiGwCustomDomainStack } from '../lib/cdk-simple-api-gw-custom-domain-stack';

const app = new cdk.App();
new CdkSimpleApiGwCustomDomainStack(app, 'CdkSimpleApiGwCustomDomainStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }
});