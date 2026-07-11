output "bucket_name" {

  value = module.terraform_backend_s3.bucket_name

}

output "bucket_arn" {

  value = module.terraform_backend_s3.bucket_arn

}

output "dynamodb_table_name" {

  value = module.terraform_backend_dynamodb.table_name

}
