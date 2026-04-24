variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "project_name" {
  type    = string
  default = "infra-monitor"
}

variable "environment" {
  type    = string
  default = "dev"
}

variable "owner" {
  type = string
}

variable "instance_type" {
  type    = string
  default = "t3.micro"
}

variable "key_pair_name" {
  type        = string
  description = "AWS key pair for SSH access"
}

variable "ssh_allowed_cidr" {
  type        = string
  description = "Public CIDR allowed to SSH to EC2 (example: 203.0.113.10/32)"
}

variable "alb_certificate_arn" {
  type        = string
  default     = ""
  description = "ACM certificate ARN for HTTPS listener on ALB"
}

variable "db_password" {
  type        = string
  sensitive   = true
  description = "RDS MySQL root password"
}
