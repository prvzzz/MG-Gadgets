resource "aws_vpc" "main" {

  cidr_block = var.vpc_cidr

  enable_dns_support = true

  enable_dns_hostnames = true

  tags = {
    Name        = "${var.project_name}-${var.environment}-vpc"
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
   }

}

## aws internet gateway main

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "${var.project_name}-${var.environment}-igw"
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

## AWS public subnet 1

resource "aws_subnet" "public_subnet_1" {

  vpc_id = aws_vpc.main.id

  cidr_block = var.public_subnet_1_cidr

  availability_zone = var.availability_zone_1

  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-${var.environment}-public-subnet-1"

    Project = var.project_name

    Environment = var.environment

    ManagedBy = "Terraform"
  
   "kubernetes.io/role/elb" = "1"
  "kubernetes.io/cluster/${var.project_name}-${var.environment}-eks" = "shared"

  }

}

## AWS public subnet 2

resource "aws_subnet" "public_subnet_2" {

  vpc_id = aws_vpc.main.id

  cidr_block = var.public_subnet_2_cidr

  availability_zone = var.availability_zone_2

  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-${var.environment}-public-subnet-2"

    Project = var.project_name

    Environment = var.environment

    ManagedBy = "Terraform"


  "kubernetes.io/role/elb" = "1"
  "kubernetes.io/cluster/${var.project_name}-${var.environment}-eks" = "shared"
  }

}

## Route table

resource "aws_route_table" "public" {

  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "${var.project_name}-${var.environment}-public-rt"
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }

}

## Create Internet Route

resource "aws_route" "public_internet_access" {

  route_table_id = aws_route_table.public.id

  destination_cidr_block = "0.0.0.0/0"

  gateway_id = aws_internet_gateway.main.id

}

## Associate public subnet 1

resource "aws_route_table_association" "public_subnet_1" {

  subnet_id = aws_subnet.public_subnet_1.id

  route_table_id = aws_route_table.public.id

}

## Associate public subnet2

resource "aws_route_table_association" "public_subnet_2" {

  subnet_id = aws_subnet.public_subnet_2.id

  route_table_id = aws_route_table.public.id

}


## Private subnet 1

resource "aws_subnet" "private_subnet_1" {

  vpc_id = aws_vpc.main.id

  cidr_block = var.private_subnet_1_cidr

  availability_zone = var.availability_zone_1

  map_public_ip_on_launch = false

  tags = {
    Name        = "${var.project_name}-${var.environment}-private-subnet-1"
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
 

  "kubernetes.io/role/internal-elb" = "1"
  "kubernetes.io/cluster/${var.project_name}-${var.environment}-eks" = "shared"
 }

}

## Private subnet 2

resource "aws_subnet" "private_subnet_2" {

  vpc_id = aws_vpc.main.id

  cidr_block = var.private_subnet_2_cidr

  availability_zone = var.availability_zone_2

  map_public_ip_on_launch = false

  tags = {
    Name        = "${var.project_name}-${var.environment}-private-subnet-2"
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"


  "kubernetes.io/role/internal-elb" = "1"
  "kubernetes.io/cluster/${var.project_name}-${var.environment}-eks" = "shared"
  }


}

## Elastic IP for NAT Gateway

resource "aws_eip" "nat" {

  domain = "vpc"

  tags = {
    Name        = "${var.project_name}-${var.environment}-nat-eip"
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }

}

## NAT gateway 

resource "aws_nat_gateway" "main" {

  allocation_id = aws_eip.nat.id

  subnet_id = aws_subnet.public_subnet_1.id

  tags = {
    Name        = "${var.project_name}-${var.environment}-nat"
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }

  depends_on = [
    aws_internet_gateway.main
  ]

}

## Creating private route table
resource "aws_route_table" "private" {

  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "${var.project_name}-${var.environment}-private-rt"
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }

}

## Route to nat gateway

resource "aws_route" "private_nat_access" {

  route_table_id = aws_route_table.private.id

  destination_cidr_block = "0.0.0.0/0"

  nat_gateway_id = aws_nat_gateway.main.id

}

## Associate Private subnet 1

resource "aws_route_table_association" "private_subnet_1" {

  subnet_id = aws_subnet.private_subnet_1.id

  route_table_id = aws_route_table.private.id

}

## Associate private subnet 2

resource "aws_route_table_association" "private_subnet_2" {

  subnet_id = aws_subnet.private_subnet_2.id

  route_table_id = aws_route_table.private.id

}

