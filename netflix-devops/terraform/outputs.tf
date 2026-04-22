output "eks_cluster_name" {
  description = "EKS Cluster Name"
  value       = aws_eks_cluster.netflix.name
}

output "eks_cluster_endpoint" {
  description = "EKS Cluster Endpoint"
  value       = aws_eks_cluster.netflix.endpoint
}

output "eks_cluster_security_group_id" {
  description = "EKS Cluster Security Group ID"
  value       = aws_eks_cluster.netflix.vpc_config[0].cluster_security_group_id
}

output "eks_cluster_iam_role_arn" {
  description = "EKS Cluster IAM Role ARN"
  value       = aws_eks_cluster.netflix.role_arn
}

output "eks_node_group_id" {
  description = "EKS Node Group ID"
  value       = aws_eks_node_group.netflix.id
}

output "rds_endpoint" {
  description = "RDS Database Endpoint"
  value       = aws_db_instance.netflix.endpoint
  sensitive   = true
}

output "rds_database_name" {
  description = "RDS Database Name"
  value       = aws_db_instance.netflix.db_name
}

output "alb_dns_name" {
  description = "Application Load Balancer DNS Name"
  value       = aws_lb.netflix.dns_name
}

output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.netflix.id
}

output "rds_credentials_secret_arn" {
  description = "RDS Credentials Secret ARN"
  value       = aws_secretsmanager_secret.rds_credentials.arn
}
