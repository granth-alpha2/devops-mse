# Security Group for RDS
resource "aws_security_group" "rds" {
  name   = "netflix-rds-sg"
  vpc_id = aws_vpc.netflix.id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    security_groups = [aws_security_group.eks.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "netflix-rds-sg"
  }
}

# RDS Subnet Group
resource "aws_db_subnet_group" "netflix" {
  name       = "netflix-db-subnet-group"
  subnet_ids = aws_subnet.private[*].id

  tags = {
    Name = "netflix-db-subnet-group"
  }
}

# RDS Instance (PostgreSQL)
resource "aws_db_instance" "netflix" {
  identifier     = "netflix-postgres"
  engine         = "postgres"
  engine_version = "14.7"
  instance_class = var.rds_instance_class

  allocated_storage = var.rds_allocated_storage
  storage_encrypted = true

  db_name  = "netflix_db"
  username = "admin"
  password = random_password.rds_password.result

  db_subnet_group_name   = aws_db_subnet_group.netflix.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  backup_retention_period = 7
  backup_window           = "03:00-04:00"
  maintenance_window      = "mon:04:00-mon:05:00"
  multi_az                = false
  publicly_accessible     = false
  skip_final_snapshot     = false
  final_snapshot_identifier = "netflix-postgres-final-snapshot"

  tags = {
    Name = "netflix-postgres"
  }
}

# Random password for RDS
resource "random_password" "rds_password" {
  length  = 16
  special = true
}

# Secrets Manager for RDS credentials
resource "aws_secretsmanager_secret" "rds_credentials" {
  name = "netflix/rds-credentials"
}

resource "aws_secretsmanager_secret_version" "rds_credentials" {
  secret_id = aws_secretsmanager_secret.rds_credentials.id
  secret_string = jsonencode({
    username = "admin"
    password = random_password.rds_password.result
    host     = aws_db_instance.netflix.endpoint
    port     = 5432
    dbname   = "netflix_db"
  })
}
