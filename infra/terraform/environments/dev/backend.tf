terraform {
  backend "s3" {
    bucket         = "mg-devops-tf-state-prvz-149828426205"
    key            = "dev/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "mg-devops-tf-lock"
    encrypt        = true
  }
}
