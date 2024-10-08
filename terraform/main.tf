provider "aws" {
  region = "us-east-2"
}

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

# Attach policy to ECS execution role
resource "aws_iam_policy_attachment" "ecs_execution_policy" {
  name       = "ecs-execution-policy-attachment"
  roles      = [aws_iam_role.ecs_execution_role.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Create VPC
resource "aws_vpc" "my_vpc" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "my-website-vpc"
  }
}

# Create single subnet in one availability zone
resource "aws_subnet" "my_subnet" {
  vpc_id                  = aws_vpc.my_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-2a"  # Single AZ
  map_public_ip_on_launch = true

  tags = {
    Name = "my-website-subnet"
  }
}

# Create ECS Cluster
resource "aws_ecs_cluster" "my_cluster" {
  name = "my-cluster"
}

# Create ECR Repository
resource "aws_ecr_repository" "my_ecr_repository" {
  name = "my-website-repo"

  tags = {
    Name = "my-website-repo"
  }
}

# Create ECS Task Definition
resource "aws_ecs_task_definition" "my_task" {
  family                   = "my-website-task"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn

  container_definitions = jsonencode([
    {
      name         = "spring-boot-app"
      image        = "${aws_ecr_repository.my_ecr_repository.repository_url}:spring-boot-app"
      essential    = true
      portMappings = [
        {
          containerPort = 8080
          hostPort      = 8080
        }
      ]
      environment = [
        {
          name  = "NEO4J_URI"
          value = "neo4j+s//4093d524.databases.neo4j.io:7687"
        },
        {
          name  = "NEO4J_USERNAME"
          value = "neo4j"
        },
        {
          name  = "NEO4J_PASSWORD"
          value = "X_v0XWz1H3m0HOqHiOPdNxu2ufh6HNbbCvodAB69Zn8"
        }
      ]
    },
    {
      name         = "vite-app"
      image        = "${aws_ecr_repository.my_ecr_repository.repository_url}:vite-app"
      essential    = true
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
        }
      ]
      dependsOn = [
        {
          containerName = "spring-boot-app"
          condition     = "START"
        }
      ]
    }
  ])
}

# Security Group for ECS service
resource "aws_security_group" "ecs_service_sg" {
  name        = "ecs_service_sg"
  description = "Allow HTTP traffic"
  vpc_id      = aws_vpc.my_vpc.id

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Create ECS Service
resource "aws_ecs_service" "my_service" {
  name            = "my-service"
  cluster         = aws_ecs_cluster.my_cluster.id
  task_definition = aws_ecs_task_definition.my_task.arn
  desired_count   = 1

  network_configuration {
    subnets          = [aws_subnet.my_subnet.id]
    security_groups  = [aws_security_group.ecs_service_sg.id]
    assign_public_ip = true
  }
}

# Create Load Balancer
resource "aws_lb" "my_lb" {
  name               = "my-load-balancer"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.ecs_service_sg.id]
  subnets            = [aws_subnet.my_subnet.id]  # Single subnet
}

# Create Listener for Load Balancer
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.my_lb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "forward"
    target_group_arn = aws_lb_target_group.my_target_group.arn
  }
}

# Create Target Group
resource "aws_lb_target_group" "my_target_group" {
  name     = "my-target-group"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.my_vpc.id

  health_check {
    healthy_threshold   = 3
    interval            = 30
    path                = "/"
    timeout             = 5
    unhealthy_threshold = 3
    matcher             = "200"
  }
}

# Outputs for ECS cluster and repository
output "ecs_cluster_name" {
  value = aws_ecs_cluster.my_cluster.name
}

output "ecr_repository_url" {
  value = aws_ecr_repository.my_ecr_repository.repository_url
}
