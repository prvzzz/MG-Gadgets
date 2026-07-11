resource "aws_eks_cluster" "main" {

  name = "${var.project_name}-${var.environment}-eks"

  role_arn = var.cluster_role_arn

  version = var.cluster_version

  enabled_cluster_log_types = [
  	"api",
  	"audit",
  	"authenticator"
]


  vpc_config {

    subnet_ids = var.private_subnet_ids

    endpoint_private_access = true

    endpoint_public_access = true

  }

}


resource "aws_eks_node_group" "main" {

  cluster_name = aws_eks_cluster.main.name

  node_role_arn = var.node_group_role_arn

  subnet_ids = var.private_subnet_ids
  
  instance_types = var.instance_types
  
  ami_type = "AL2023_x86_64_STANDARD"

  capacity_type = "SPOT"

  scaling_config {

  desired_size = var.desired_size

  min_size = var.min_size

  max_size = var.max_size

 }

  depends_on = [
    aws_eks_cluster.main
  ]

}
