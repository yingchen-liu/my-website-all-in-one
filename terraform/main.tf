provider "aws" {
  region = "us-east-2"
}

variable "neo4j_password" {
  type      = string
  sensitive = true
}
