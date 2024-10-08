provider "aws" {
  region = "us-east-2"
}

variable "neo4j_password" {
  type      = string
  sensitive = true
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

resource "aws_secretsmanager_secret" "neo4j_password" {
  name        = "my-website-neo4j-password"
  description = "Neo4j database password"
}

resource "aws_secretsmanager_secret_version" "neo4j_password_version" {
  secret_id = aws_secretsmanager_secret.neo4j_password.id
  secret_string = var.neo4j_password
}

# Create VPC
resource "aws_vpc" "my_vpc" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "my-website-vpc"
  }
}

# Create an Internet Gateway
resource "aws_internet_gateway" "my_igw" {
  vpc_id = aws_vpc.my_vpc.id

  tags = {
    Name = "my-website-igw"
  }
}

# Create a route table
resource "aws_route_table" "my_route_table" {
  vpc_id = aws_vpc.my_vpc.id

  route {
    cidr_block = "0.0.0.0/0"  # This allows all internet traffic
    gateway_id = aws_internet_gateway.my_igw.id
  }

  tags = {
    Name = "my-website-route-table"
  }
}

# Associate the route table with the subnet
resource "aws_route_table_association" "my_route_table_association" {
  subnet_id      = aws_subnet.my_subnet_1.id
  route_table_id = aws_route_table.my_route_table.id
}

resource "aws_route_table_association" "my_route_table_association_2" {
  subnet_id      = aws_subnet.my_subnet_2.id  # If you have a second subnet
  route_table_id = aws_route_table.my_route_table.id
}

# Create Subnet 1 in Availability Zone us-east-2a
resource "aws_subnet" "my_subnet_1" {
  vpc_id                  = aws_vpc.my_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-2a"  
  map_public_ip_on_launch = true

  tags = {
    Name = "my-website-subnet-1"
  }
}

# Create Subnet 2 in Availability Zone us-east-2b
resource "aws_subnet" "my_subnet_2" {
  vpc_id                  = aws_vpc.my_vpc.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "us-east-2b"
  map_public_ip_on_launch = true

  tags = {
    Name = "my-website-subnet-2"
  }
}

# Create ECS Cluster
resource "aws_ecs_cluster" "my_cluster" {
  name = "my-website-cluster"
}

# Create ECR Repository
resource "aws_ecr_repository" "my_ecr_repository" {
  name = "my-website-repo"

  tags = {
    Name = "my-website-repo"
  }
}

resource "aws_cloudwatch_log_group" "my_website_log_group" {
  name              = "/ecs/my-website-logs"
  retention_in_days = 7  # Retain logs for 7 days; adjust as needed
}

# Create ECS Task Definition
resource "aws_ecs_task_definition" "my_task_spring_boot" {
  family                   = "my-website-spring-boot-task"
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
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.my_website_log_group.name # Reference log group here
          "awslogs-region"       = "us-east-2"                     # Your AWS region
          "awslogs-stream-prefix" = "spring-boot-app"               # Log stream prefix
        }
      }
      portMappings = [
        {
          containerPort = 8080
          hostPort      = 8080
        }
      ]
      environment = [
        {
          name  = "NEO4J_URI"
          value = "neo4j+s://4093d524.databases.neo4j.io:7687"
        },
        {
          name  = "NEO4J_USERNAME"
          value = "neo4j"
        },
        {
          name  = "NEO4J_PASSWORD"
          valueFrom = aws_secretsmanager_secret.neo4j_password.arn
        }
      ]
    }
  ])
}

resource "aws_ecs_task_definition" "my_task_vite" {
  family                   = "my-website-vite-task"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn

  container_definitions = jsonencode([
    {
      name         = "vite-app"
      image        = "${aws_ecr_repository.my_ecr_repository.repository_url}:vite-app"
      essential    = true
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.my_website_log_group.name # Reference log group here
          "awslogs-region"       = "us-east-2"                     # Your AWS region
          "awslogs-stream-prefix" = "vite-app"                      # Log stream prefix
        }
      }
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
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
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
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

# Create an Application Load Balancer
resource "aws_lb" "my_lb" {
  name               = "my-website-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.ecs_service_sg.id]
  subnets            = [aws_subnet.my_subnet_1.id, aws_subnet.my_subnet_2.id]

  tags = {
    Name = "my-website-lb"
  }
}

# Create Listener for the ALB
resource "aws_lb_listener" "my_lb_listener" {
  load_balancer_arn = aws_lb.my_lb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.my_target_group_vite.arn
  }
}

# Create Target Group for Vite App
resource "aws_lb_target_group" "my_target_group_vite" {
  name     = "my-website-vite-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.my_vpc.id
  target_type = "ip"

  health_check {
    healthy_threshold   = 2
    interval            = 30
    path                = "/"
    timeout             = 5
    unhealthy_threshold = 3
    matcher             = "200"
  }
}

# Create a Listener Rule to forward /api/* requests to Spring Boot
resource "aws_lb_listener_rule" "my_listener_rule" {
  listener_arn = aws_lb_listener.my_lb_listener.arn
  priority     = 100  # Priority should be lower for more specific rules

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.spring_boot_target_group.arn
  }

  condition {
    path_pattern {
      values = ["/api/*"]
    }
  }
}

# Create Target Group for Spring Boot App
resource "aws_lb_target_group" "spring_boot_target_group" {
  name     = "my-website-spring-boot-tg"
  port     = 8080
  protocol = "HTTP"
  vpc_id   = aws_vpc.my_vpc.id
  target_type = "ip"

  health_check {
    healthy_threshold   = 2
    interval            = 60
    path                = "/api/nodes/root"
    timeout             = 10
    unhealthy_threshold = 3
    matcher             = "200"
  }
}

# Create ECS Service for Vite App
resource "aws_ecs_service" "web_service" {
  name            = "my-website-vite-service"
  cluster         = aws_ecs_cluster.my_cluster.id
  task_definition = aws_ecs_task_definition.my_task_vite.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.my_subnet_1.id, aws_subnet.my_subnet_2.id]
    security_groups  = [aws_security_group.ecs_service_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.my_target_group_vite.arn
    container_name   = "vite-app"
    container_port   = 80
  }

  depends_on = [aws_lb_listener.my_lb_listener]
}

# Create ECS Service for Spring Boot App
resource "aws_ecs_service" "spring_boot_service" {
  name            = "my-website-spring-boot-service"
  cluster         = aws_ecs_cluster.my_cluster.id
  task_definition = aws_ecs_task_definition.my_task_spring_boot.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.my_subnet_1.id, aws_subnet.my_subnet_2.id]
    security_groups  = [aws_security_group.ecs_service_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.spring_boot_target_group.arn
    container_name   = "spring-boot-app"
    container_port   = 8080
  }

  depends_on = [aws_lb_listener_rule.my_listener_rule]
}
