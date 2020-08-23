## Create a CI/CD Pipeline using AWS ECS and GitHub actions
This repository is the result of the following AWS tutorial

https://aws.amazon.com/blogs/containers/create-a-ci-cd-pipeline-for-amazon-ecs-with-github-actions-and-aws-codebuild-tests/

### Differences between the code in this repo and the tutorial code
- Examples in link above are in Python, I did use Node instead.
- I have updated the CDK stack (see ecs-devops-sandbox-cdk/lib/ecs-devops-sandbox-cdk-stack.js) to have an Application Load Balancer so I could test my Hello World App.

### Note
- In the tutorial is not very clear but you need to create a new IAM User for GitHub and add Access Key and Secret Key to you repo's secrets.
