
# Deployment Guide

This guide provides a step-by-step walkthrough for setting up your environment, configuring Terraform, and building and deploying Docker images to AWS.

## 1. Set Up Terraform State Bucket

Create an S3 bucket to store the Terraform state files:

- **Bucket name**: `my-website-terraform-state-bucket`

This bucket will be used to store your Terraform state remotely, ensuring the state is available and consistent across your deployments.

## 2. AWS IAM Setup

Create an IAM user with the necessary AWS-managed permissions to interact with required AWS services. Attach the following policies to the user:

- **AmazonEC2ContainerRegistryFullAccess**
- **AmazonECS_FullAccess**
- **AmazonRoute53FullAccess**
- **AmazonS3FullAccess**
- **AmazonVPCFullAccess**
- **AWSCertificateManagerFullAccess**
- **CloudWatchFullAccess**
- **ElasticLoadBalancingFullAccess**
- **IAMFullAccess**
- **SecretsManagerReadWrite**

These permissions are essential for managing ECS, ECR, Route 53, load balancers, SSL certificates, and other services.

Once the IAM user is created, configure the AWS CLI on your machine by running:

```bash
aws configure
```

Provide the following information when prompted:

- **Access Key ID**: IAM user's access key
- **Secret Access Key**: IAM user's secret key
- **Default region**: The AWS region you are using (e.g., `us-east-2`)
- **Output format**: JSON (or another format of your choice)

## 3. Authenticate Docker with ECR

You need to authenticate Docker with the Amazon Elastic Container Registry (ECR) to push Docker images. Run the following command:

```bash
aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 058264218531.dkr.ecr.us-east-2.amazonaws.com
```

This command retrieves the authentication token and logs Docker in to your ECR registry.

## 4. Build and Push Docker Images

Build and push your Docker images for the Spring Boot backend and Vite frontend apps:

### Spring Boot App

```bash
docker buildx build --platform linux/amd64 -t 058264218531.dkr.ecr.us-east-2.amazonaws.com/my-website-repo:spring-boot-app --push ./services
```

### Vite App

```bash
docker buildx build --platform linux/amd64 --build-arg MODE=production -t 058264218531.dkr.ecr.us-east-2.amazonaws.com/my-website-repo:vite-app --push ./web
```

This will build the images for both the Spring Boot and Vite applications and push them to the ECR repository.

## 5. Configure Terraform

Before running Terraform commands, ensure that your Neo4j database credentials are exported as environment variables:

```bash
export NEO4J_URI=neo4j+s://4093d524.databases.neo4j.io:7687
export NEO4J_USERNAME=neo4j
export NEO4J_PASSWORD=<your_neo4j_password>
export TF_VAR_neo4j_password=<your_neo4j_password>
```

Make sure the password is correct, as it will be used to connect to the Neo4j database.

## 6. Run Terraform Commands

Now that everything is set up, you can initialize, plan, and apply your Terraform configuration:

```bash
terraform init
terraform plan
terraform apply
```

These commands will provision the necessary AWS infrastructure for your application, including ECS, load balancers, Route 53, and more.
