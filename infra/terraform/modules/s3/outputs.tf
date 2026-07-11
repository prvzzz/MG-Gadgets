output "bucket_id" {

  value = aws_s3_bucket.terraform_backend_state.id

}

output "bucket_arn" {

  value = aws_s3_bucket.terraform_backend_state.arn

}

output "bucket_name" {

  value = aws_s3_bucket.terraform_backend_state.bucket

}
