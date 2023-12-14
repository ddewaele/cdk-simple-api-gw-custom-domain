import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as path from 'path';
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as targets from 'aws-cdk-lib/aws-route53-targets'

export class CdkSimpleApiGwCustomDomainStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define the Lambda function
    const myLambda = new lambda.Function(this, 'MyLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.resolve(__dirname, '../lambda/simple-lambda')), // Path to your Lambda function code
    });

    // Define the API Gateway REST API
    const api = new apigateway.RestApi(this, 'MyApi', {
      restApiName: 'MyApi',
      description: 'API Gateway Proxying Lambda.'
    });

    // Add a resource with an ANY method
    const resource = api.root.addResource('myresource');
    resource.addMethod('ANY', new apigateway.LambdaIntegration(myLambda));

    // Define a custom domain for the API Gateway
    const domainName = 'api.example.com';
    const certificateArn = 'arn:aws:acm:xxx';
    const certificate = acm.Certificate.fromCertificateArn(this, 'Certificate', certificateArn);
    const domain = new apigateway.DomainName(this, 'CustomDomain', {
      domainName: domainName,
      certificate: certificate
    });

    // Associate the domain with a default stage
    new apigateway.BasePathMapping(this, 'BasePathMapping', {
      domainName: domain,
      restApi: api,
    });

    // Define a hosted zone (assuming it's already created in Route 53)
    const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: 'example.com' // replace with your domain name
    });

    // Create a Route 53 alias record to point to the API Gateway domain
    new route53.ARecord(this, 'APIGatewayAliasRecord', {
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(new targets.ApiGatewayDomain(domain)),
      recordName: 'api',
      
    });
  }

}
