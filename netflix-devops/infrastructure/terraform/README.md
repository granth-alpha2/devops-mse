# Terraform Infrastructure

Infrastructure-as-Code for AWS CloudFormation using Terraform.

## Files

- `main.tf` - Terraform configuration
- `variables.tf` - Input variables
- `outputs.tf` - Output values
- `eks.tf` - EKS cluster configuration
- `rds.tf` - RDS database configuration
- `vpc.tf` - VPC and networking
- `load_balancer.tf` - Load balancer configuration

## Quick Start

```bash
terraform init
terraform plan
terraform apply
```

## Variables

Create `terraform.tfvars`:

```hcl
aws_region              = "us-east-1"
cluster_name            = "netflix-prod"
instance_type           = "t3.medium"
desired_capacity        = 3
db_instance_class       = "db.t3.small"
db_allocated_storage    = 20
```

## Deployment

```bash
# Initialize Terraform
terraform init

# Validate configuration
terraform validate

# See what will be created
terraform plan

# Create infrastructure
terraform apply

# View outputs
terraform output

# Destroy infrastructure
terraform destroy
```

## State Management

- Local state: `.terraform/` (development only)
- Remote state: Configure S3 backend for production

Backend configuration:

```hcl
terraform {
  backend "s3" {
    bucket         = "netflix-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}
```

## Resources Created

### Networking
- VPC with public/private subnets
- NAT Gateway for private subnet internet access
- Security groups

### EKS
- EKS Kubernetes cluster
- Worker node groups
- Auto-scaling configuration

### RDS
- MongoDB/PostgreSQL instance
- Multi-AZ deployment
- Backup configuration

### Load Balancing
- Application Load Balancer
- Target groups
- Security group rules

## Monitoring

```bash
# Get cluster info
terraform show

# Get specific resource
terraform state show aws_eks_cluster.netflix

# List all resources
terraform state list
```

## Updating Infrastructure

1. Modify `.tf` files
2. Run `terraform plan` to preview changes
3. Run `terraform apply` to implement

## Production Checklist

- [ ] Use remote state (S3 backend)
- [ ] Enable state encryption
- [ ] Configure state locking
- [ ] Use separate tfvars for environments
- [ ] Set up notifications/alerts
- [ ] Document infrastructure
- [ ] Backup state regularly

## Cost Optimization

- Use spot instances for non-critical workloads
- Schedule scale-down during off-hours
- Right-size instances
- Use reserved instances for predictable load

## Support

For AWS-specific questions, see [AWS Terraform Provider Docs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
