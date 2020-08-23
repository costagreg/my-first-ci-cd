const { Duration } = require("@aws-cdk/core");
const cdk = require("@aws-cdk/core");
const ecr = require("@aws-cdk/aws-ecr");
const ec2 = require("@aws-cdk/aws-ec2");
const ecs = require("@aws-cdk/aws-ecs");
const iam = require("@aws-cdk/aws-iam");
const ecsPatterns = require("@aws-cdk/aws-ecs-patterns");

class EcsDevopsSandboxCdkStack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const ecrRepository = new ecr.Repository(
      this,
      "ecs-devops-sandbox-repository",
      {
        repositoryName: "ecs-devops-sandbox-repository",
      }
    );
    const vpc = new ec2.Vpc(this, "ecs-devops-sandbox-vpc", { maxAzs: 3 });
  
    const cluster = new ecs.Cluster(this, "ecs-devops-sandbox-cluster", {
      clusterName: "ecs-devops-sandbox-cluster",
      vpc,
    });
    const executionRole = new iam.Role(
      this,
      "ecs-devops-sandbox-execution-role",
      {
        assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
        roleName: "ecs-devops-sandbox-execution-role",
      }
    );
    executionRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: ["*"],
        actions: [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
        ],
      })
    );

    const taskDefinition = new ecs.FargateTaskDefinition(
      this,
      "ecs-devops-sandbox-task-definition",
      {
        executionRole,
        family: "ecs-devops-sandbox-task-definition",
      }
    );

    const container = taskDefinition.addContainer("ecs-devops-sandbox", {
      image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
    });

    container.addPortMappings({
      containerPort: 3000,
    })
    
    const loadBalancedFargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'ecs-devops-sandbox-service', {
      serviceName: 'ecs-devops-sandbox-service',
      cluster,
      taskDefinition,
    });
  }
}

module.exports = { EcsDevopsSandboxCdkStack };
