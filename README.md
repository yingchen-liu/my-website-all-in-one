# Deployment Guide

This guide will walk you through setting up your environment, configuring Terraform, and building and deploying Docker images to AWS.

## 1. AWS IAM Setup

Create an IAM user with the following AWS-managed permissions. This will enable the user to interact with the necessary AWS services:

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

These permissions are required to manage ECS, ECR, Route 53, load balancers, certificates, and more.

After creating the IAM user, configure the AWS CLI with the following command:

```bash
$ aws configure
```

Follow the prompts to enter your AWS `Access Key ID`, `Secret Access Key`, `Default region name` (e.g., `us-east-2`), and `Default output format` (optional, e.g., `json`).

## 2. Authenticate Docker to ECR

Run the following command to authenticate Docker with your Amazon Elastic Container Registry (ECR):

```bash
$ aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 058264218531.dkr.ecr.us-east-2.amazonaws.com
```

## 3. Build and Push Docker Images

Use the following commands to build and push your Docker images to ECR:

```bash
# Build and push the Spring Boot app
docker buildx build --platform linux/amd64 -t 058264218531.dkr.ecr.us-east-2.amazonaws.com/my-website-repo:spring-boot-app --push ./services

# Build and push the Vite app
docker buildx build --platform linux/amd64 --build-arg MODE=production -t 058264218531.dkr.ecr.us-east-2.amazonaws.com/my-website-repo:vite-app --push ./web
```

## 4. Terraform Configuration

Before running Terraform, export the required Neo4j database credentials as environment variables:

```bash
export NEO4J_URI=neo4j+s://4093d524.databases.neo4j.io:7687
export NEO4J_USERNAME=neo4j
export NEO4J_PASSWORD=<your_neo4j_password>
export TF_VAR_neo4j_password=<your_neo4j_password>
```

Ensure that the Neo4j password is set correctly.

```bash
terraform init
terraform plan
terraform apply
```