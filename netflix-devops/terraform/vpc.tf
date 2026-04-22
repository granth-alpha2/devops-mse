# VPC
resource "aws_vpc" "netflix" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "netflix-vpc"
  }
}

# Public Subnets
resource "aws_subnet" "public" {
  count                   = 2
  vpc_id                  = aws_vpc.netflix.id
  cidr_block              = "10.0.${count.index + 1}.0/24"
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "netflix-public-subnet-${count.index + 1}"
  }
}

# Private Subnets
resource "aws_subnet" "private" {
  count             = 2
  vpc_id            = aws_vpc.netflix.id
  cidr_block        = "10.0.${count.index + 10}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "netflix-private-subnet-${count.index + 1}"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "netflix" {
  vpc_id = aws_vpc.netflix.id

  tags = {
    Name = "netflix-igw"
  }
}

# Elastic IPs for NAT Gateway
resource "aws_eip" "nat" {
  count  = 2
  domain = "vpc"

  tags = {
    Name = "netflix-nat-eip-${count.index + 1}"
  }

  depends_on = [aws_internet_gateway.netflix]
}

# NAT Gateways
resource "aws_nat_gateway" "netflix" {
  count         = 2
  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id

  tags = {
    Name = "netflix-nat-${count.index + 1}"
  }

  depends_on = [aws_internet_gateway.netflix]
}

# Public Route Table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.netflix.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.netflix.id
  }

  tags = {
    Name = "netflix-public-rt"
  }
}

# Public Route Table Association
resource "aws_route_table_association" "public" {
  count          = 2
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# Private Route Tables
resource "aws_route_table" "private" {
  count  = 2
  vpc_id = aws_vpc.netflix.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.netflix[count.index].id
  }

  tags = {
    Name = "netflix-private-rt-${count.index + 1}"
  }
}

# Private Route Table Association
resource "aws_route_table_association" "private" {
  count          = 2
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private[count.index].id
}

# Data source for availability zones
data "aws_availability_zones" "available" {
  state = "available"
}

# Security Group for ALB
resource "aws_security_group" "alb" {
  name   = "netflix-alb-sg"
  vpc_id = aws_vpc.netflix.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "netflix-alb-sg"
  }
}

# Security Group for EKS
resource "aws_security_group" "eks" {
  name   = "netflix-eks-sg"
  vpc_id = aws_vpc.netflix.id

  ingress {
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "netflix-eks-sg"
  }
}
