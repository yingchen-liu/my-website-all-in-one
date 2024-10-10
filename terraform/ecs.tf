
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
