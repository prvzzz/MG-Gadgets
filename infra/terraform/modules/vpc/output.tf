output "vpc_id" {
  value = aws_vpc.main.id
}

output "vpc_arn" {
  value = aws_vpc.main.arn
}

output "vpc_cidr" {
  value = aws_vpc.main.cidr_block
}

output "private_subnet_ids" {

  description = "Private Subnet IDs"

  value = [

    aws_subnet.private_subnet_1.id,

    aws_subnet.private_subnet_2.id

  ]

}

output "public_subnet_ids" {

  description = "Public Subnet IDs"

  value = [

    aws_subnet.public_subnet_1.id,

    aws_subnet.public_subnet_2.id

  ]

}
