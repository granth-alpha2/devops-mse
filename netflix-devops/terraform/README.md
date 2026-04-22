time="2026-04-21T19:58:26+05:30" level=warning msg="C:\\devops mse\\netflix-devops\\docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion"
unable to get image 'grafana/grafana:latest': failed to connect to the docker API at npipe:////./pipe/dockerDesktopLinuxEngine; check if the path is correct and if the daemon is running: open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified.time="2026-04-21T19:58:26+05:30" level=warning msg="C:\\devops mse\\netflix-devops\\docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion"
unable to get image 'grafana/grafana:latest': failed to connect to the docker API at npipe:////./pipe/dockerDesktopLinuxEngine; check if the path is correct and if the daemon is running: open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified.# Terraform Backend Configuration

This directory contains Terraform infrastructure as code (IaC) for deploying Netflix DevOps on AWS.

## Prerequisites

- Terraform >= 1.0
- AWS CLI configured with credentials
- S3 bucket for terraform state (netflix-devops-terraform-state)
- DynamoDB table for state locking (netflix-terraform-locks)

## Structure

- `main.tf` - Provider and backend configuration
- `variables.tf` - Variable definitions
- `vpc.tf` - VPC, subnets, security groups
- `eks.tf` - EKS cluster and node groups
- `rds.tf` - RDS database instance
- `load_balancer.tf` - Application Load Balancer
- `outputs.tf` - Output values
- `terraform.tfvars` - Variable values (create from example)

## Setup

### 1. Create S3 Backend
```bash
aws s3 mb s3://netflix-devops-terraform-state --region us-east-1
aws s3api put-bucket-versioning \
  --bucket netflix-devops-terraform-state \
  --versioning-configuration Status=Enabled
```

### 2. Create DynamoDB Table
```bash
aws dynamodb create-table \
  --table-name netflix-terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
```

### 3. Initialize Terraform
```bash
terraform init
```

### 4. Create terraform.tfvars
```bash
cat > terraform.tfvars <<EOF
aws_region                 = "us-east-1"
environment                = "production"
cluster_name               = "netflix-devops-cluster"
node_group_desired_size    = 3
node_group_min_size        = 1
node_group_max_size        = 10
instance_types             = ["t3.medium"]
rds_allocated_storage      = 20
rds_instance_class         = "db.t3.micro"
EOF
```

## Deployment

### Plan
```bash
terraform plan
```

### Apply
```bash
terraform apply
```

### Destroy
```bash
terraform destroy
```

## Outputs

After deployment, retrieve outputs:
```bash
terraform output
terraform output eks_cluster_endpoint
terraform output alb_dns_name
```

## Configure kubectl

```bash
aws eks update-kubeconfig \
  --region us-east-1 \
  --name netflix-devops-cluster
```

## Cost Estimation

```bash
terraform plan -out=tfplan
terraform show tfplan
# Estimated cost: ~$200-300/month for dev environment
```

## Security Best Practices

- ✅ Encrypted RDS database
- ✅ Private subnets for worker nodes
- ✅ Security groups with minimal permissions
- ✅ Secrets Manager for credentials
- ✅ Multi-AZ for high availability
- ✅ VPC flow logs for monitoring

## Troubleshooting

### State Lock Issues
```bash
terraform force-unlock <LOCK_ID>
```

### Recreate EKS Cluster
```bash
terraform destroy -target=aws_eks_cluster.netflix
terraform destroy -target=aws_eks_node_group.netflix
terraform apply
```
