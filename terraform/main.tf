provider "aws" {
  region = "us-east-2"
}

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

resource "aws_iam_policy_attachment" "ecs_execution_policy" {
  name       = "ecs-execution-policy-attachment"
  roles      = [aws_iam_role.ecs_execution_role.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_vpc" "my_vpc" {
  cidr_block = "10.0.0.0/16"  # Define the CIDR block for the VPC

  tags = {
    Name = "my-website-vpc"
  }
}

resource "aws_subnet" "my_subnet" {
  vpc_id                  = aws_vpc.my_vpc.id  # Reference the VPC ID
  cidr_block              = "10.0.1.0/24"      # Define the CIDR block for the subnet
  availability_zone       = "us-east-2a"       # Specify the availability zone
  map_public_ip_on_launch = true                # Enable public IP assignment (optional)

  tags = {
    Name = "my-website-subnet"
  }
}

resource "aws_ecr_repository" "my_ecr_repository" {
  name = "my-website-repo"  # Replace with your desired repository name

  tags = {
    Name = "my-website-repo"
  }
}

resource "aws_ecs_cluster" "my_cluster" {
  name = "my-cluster"
}

resource "aws_efs_file_system" "neo4j_data" {
  creation_token = "neo4j-data"
}

resource "aws_efs_mount_target" "neo4j_mount_target" {
  file_system_id = aws_efs_file_system.neo4j_data.id
  subnet_id      = aws_subnet.my_subnet.id
}

resource "aws_ecs_task_definition" "my_task" {
  family                   = "my-website-task"
  requires_compatibilities = ["FARGATE"]
  network_mode            = "awsvpc"
  cpu                     = "256"
  memory                  = "512"
  execution_role_arn      = aws_iam_role.ecs_execution_role.arn  # Reference the IAM role here

  volume {
    name = "neo4j-data"
    efs_volume_configuration {
      file_system_id = aws_efs_file_system.neo4j_data.id
      root_directory = "/"
    }
  }

  container_definitions = jsonencode([
    {
      name         = "neo4j"
      image        = "${aws_ecr_repository.my_ecr_repository.repository_url}:neo4j"
      essential    = true
      portMappings = [
        {
          containerPort = 7474
          hostPort      = 7474
        },
        {
          containerPort = 7687
          hostPort      = 7687
        }
      ]
      environment = [
        {
          name = "NEO4J_AUTH"
          value = "neo4j/your_secure_password"
        }
      ]
      mountPoints = [
        {
          sourceVolume  = "neo4j-data"
          containerPath = "/data"
        }
      ]
    },
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
          value = "bolt://neo4j:7687"
        },
        {
          name  = "NEO4J_USERNAME"
          value = "neo4j"
        },
        {
          name  = "NEO4J_PASSWORD"
          value = "your_secure_password"
        }
      ]
      dependsOn = [
        {
          containerName = "neo4j"
          condition     = "START"
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

resource "aws_security_group" "ecs_service_sg" {
  name        = "ecs_service_sg"
  description = "Allow HTTP traffic"

#   ingress {
#     from_port   = 7474
#     to_port     = 7474
#     protocol    = "tcp"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   ingress {
#     from_port   = 7687
#     to_port     = 7687
#     protocol    = "tcp"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

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

resource "aws_lb" "my_lb" {
  name               = "my-load-balancer"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.ecs_service_sg.id]
  subnets            = [aws_subnet.my_subnet.id]
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.my_lb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "forward"

    target_group_arn = aws_lb_target_group.my_target_group.arn
  }
}

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

output "ecs_cluster_name" {
  value = aws_ecs_cluster.my_cluster.name
}
