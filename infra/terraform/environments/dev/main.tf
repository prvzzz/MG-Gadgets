module "vpc" {

  source = "../../modules/vpc"

  project_name = var.project_name
  environment  = var.environment

  vpc_cidr = var.vpc_cidr

  public_subnet_1_cidr = var.public_subnet_1_cidr
  public_subnet_2_cidr = var.public_subnet_2_cidr

  availability_zone_1 = var.availability_zone_1
  availability_zone_2 = var.availability_zone_2

  private_subnet_1_cidr = var.private_subnet_1_cidr
  private_subnet_2_cidr = var.private_subnet_2_cidr
}

module "iam" {

  source = "../../modules/iam"

  project_name = var.project_name

  environment = var.environment

}

module "eks" {

  source = "../../modules/eks"

  project_name = var.project_name

  environment = var.environment

  cluster_version = var.cluster_version

  cluster_role_arn = module.iam.eks_cluster_role_arn

  node_group_role_arn = module.iam.eks_node_group_role_arn

  private_subnet_ids = module.vpc.private_subnet_ids

  desired_size = var.desired_size

  min_size = var.min_size

  max_size = var.max_size

  instance_types = var.instance_types

}

module "ecr" {

  source = "../../modules/ecr"

  project_name = var.project_name
  environment  = var.environment

}
