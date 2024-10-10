
# IAM Role for ECS execution
resource "aws_iam_role" "ecs_execution_role" {
  name = "my-website-ecs-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
        Effect    = "Allow"
        Sid       = ""
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution_role_policy_attachment" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy" # Attach the AWS-managed policy
}

resource "aws_iam_role_policy_attachment" "ecs_s3_policy_attachment" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess" # Attach this if you need S3 access
}

resource "aws_iam_role_policy_attachment" "ecs_execution_role_secrets" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/SecretsManagerReadWrite"
}

# Attach policy to ECS execution role
resource "aws_iam_policy_attachment" "ecs_execution_policy" {
  name       = "ecs-execution-policy-attachment"
  roles      = [aws_iam_role.ecs_execution_role.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}