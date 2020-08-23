const { Duration } = require("@aws-cdk/core");
const cdk = require("@aws-cdk/core");
const ecr = require("@aws-cdk/aws-ecr");
const ec2 = require("@aws-cdk/aws-ec2");
const ecs = require("@aws-cdk/aws-ecs");
const iam = require("@aws-cdk/aws-iam");
const elbv2 = require("@aws-cdk/aws-elasticloadbalancingv2");

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
    const lb = new elbv2.ApplicationLoadBalancer(this, "LB", {
      vpc,
      internetFacing: true,
    });
    const listener = lb.addListener("Listener", {
      port: 80,
      open: true,
    });

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

    const service = new ecs.FargateService(this, "ecs-devops-sandbox-service", {
      cluster,
      taskDefinition,
      serviceName: "ecs-devops-sandbox-service",
    });

    listener.addTargets("listener-target", {
      targetGroupName: "listener-target",
      port: 80,
      targets: [
        service.loadBalancerTarget({
          containerName: "ecs-devops-sandbox",
          containerPort: container.containerPort,
        }),
      ],
      healthCheck: {
        interval: Duration.seconds(30),
        port: "80",
      },
    });
  }
}

module.exports = { EcsDevopsSandboxCdkStack };
