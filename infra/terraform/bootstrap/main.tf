module "terraform_backend_s3" {

  source = "../modules/s3"

  bucket_name = var.bucket_name

  project_name = var.project_name

  environment = var.environment

}

module "terraform_backend_dynamodb" {

  source = "../modules/dynamodb"

  table_name = var.table_name

  project_name = var.project_name

  environment = var.environment

}
