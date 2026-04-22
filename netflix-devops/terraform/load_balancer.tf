# Application Load Balancer
resource "aws_lb" "netflix" {
  name               = "netflix-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id

  enable_deletion_protection = true
  enable_http2               = true

  tags = {
    Name = "netflix-alb"
  }
}

# Target Group for Frontend
resource "aws_lb_target_group" "frontend" {
  name        = "netflix-frontend-tg"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.netflix.id
  target_type = "ip"

  health_check {
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 3
    interval            = 30
    path                = "/"
    matcher             = "200-399"
  }

  tags = {
    Name = "netflix-frontend-tg"
  }
}

# Target Group for Backend API
resource "aws_lb_target_group" "backend" {
  name        = "netflix-backend-tg"
  port        = 5000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.netflix.id
  target_type = "ip"

  health_check {
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 3
    interval            = 30
    path                = "/healthz"
    matcher             = "200"
  }

  tags = {
    Name = "netflix-backend-tg"
  }
}

# ALB Listener
resource "aws_lb_listener" "netflix" {
  load_balancer_arn = aws_lb.netflix.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend.arn
  }
}

# Lambda for handling API requests
resource "aws_lb_listener_rule" "api" {
  listener_arn = aws_lb_listener.netflix.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend.arn
  }

  condition {
    path_pattern {
      values = ["/api/*"]
    }
  }
}

# CloudWatch Log Group for ALB
resource "aws_cloudwatch_log_group" "alb" {
  name              = "/aws/alb/netflix"
  retention_in_days = 7

  tags = {
    Name = "netflix-alb-logs"
  }
}
