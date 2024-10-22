
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
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"  # Choose appropriate SSL policy
  certificate_arn   = aws_acm_certificate.cert.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.my_target_group_vite.arn
  }

  depends_on = [aws_acm_certificate_validation.cert]
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.my_lb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
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