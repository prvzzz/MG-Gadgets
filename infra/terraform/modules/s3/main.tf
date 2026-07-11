resource "aws_s3_bucket" "terraform_backend_state" {

  bucket = var.bucket_name

  force_destroy = false

  tags = {
    Name        = var.bucket_name
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }

}

resource "aws_s3_bucket_versioning" "terraform_backend_state" {

  bucket = aws_s3_bucket.terraform_backend_state.id

  versioning_configuration {

    status = "Enabled"

  }

}
resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_backend_state" {

  bucket = aws_s3_bucket.terraform_backend_state.id

  rule {

    apply_server_side_encryption_by_default {

      sse_algorithm = "AES256"

    }

  }

}

resource "aws_s3_bucket_public_access_block" "terraform_backend_state" {

  bucket = aws_s3_bucket.terraform_backend_state.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true

}
