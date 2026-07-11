variable "project_name" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment"
  type        = string
}

variable "cluster_version" {
  description = "EKS Kubernetes version"
  type        = string
}

variable "cluster_role_arn" {
  description = "EKS Cluster IAM Role ARN"
  type        = string
}

variable "private_subnet_ids" {
  description = "Private subnet IDs"

  type = list(string)
}

variable "node_group_role_arn" {
  description = "EKS Node Group IAM Role ARN"
  type        = string
}

variable "desired_size" {
  description = "Desired number of worker nodes"
  type        = number
}

variable "min_size" {
  description = "Minimum worker nodes"
  type        = number
}

variable "max_size" {
  description = "Maximum worker nodes"
  type        = number
}

variable "instance_types" {
  description = "EC2 instance types"
  type        = list(string)
}

