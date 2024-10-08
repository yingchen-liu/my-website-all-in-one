
1. Login
Create an IAM user with the following permissions:
AmazonEC2ContainerRegistryFullAccess
AmazonS3FullAccess
AmazonElasticFileSystemFullAccess
AmazonVPCFullAccess
AmazonECS_FullAccess
CloudWatchFullAccess

```shell
$ aws configure
```

2. Authenticate Docker to ECR
```shell
$ aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 058264218531.dkr.ecr.us-east-2.amazonaws.com
```

3. Terraform


3. Build and Push Docker Images
```shell
docker buildx build --platform linux/amd64 -t 058264218531.dkr.ecr.us-east-2.amazonaws.com/my-website-repo:spring-boot-app --push ./services

docker buildx build --platform linux/amd64 --build-arg MODE=production -t 058264218531.dkr.ecr.us-east-2.amazonaws.com/my-website-repo:vite-app --push ./web
```