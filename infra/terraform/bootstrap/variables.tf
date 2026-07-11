variable "aws_region" {
  description = "AWS Region"
  type        = string
}

variable "project_name" {
  description = "Project Name"
  type        = string
}

variable "environment" {
  description = "Environment"
  type        = string
}

variable "bucket_name" {
  description = "Terraform Backend Bucket Name"
  type        = string
}

variable "table_name" {
  description = "Terraform Lock Table Name"
  type        = string
}
