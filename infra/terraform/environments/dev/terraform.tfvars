aws_region = "us-east-1"

project_name = "mg-devops"

environment = "dev"

vpc_cidr = "10.0.0.0/16"

public_subnet_1_cidr = "10.0.1.0/24"
public_subnet_2_cidr = "10.0.2.0/24"

private_subnet_1_cidr = "10.0.11.0/24"
private_subnet_2_cidr = "10.0.12.0/24"

availability_zone_1 = "us-east-1a"
availability_zone_2 = "us-east-1b"

cluster_version = "1.33"

desired_size = 2

min_size = 2

max_size = 2

instance_types = ["t3.medium"]
