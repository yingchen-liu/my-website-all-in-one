provider "aws" {
  region = "us-east-2"
}

terraform {
  backend "s3" {
    bucket         = "my-website-terraform-state-bucket"  # Replace with your bucket name
    key            = "terraform/state.tfstate"      # Specify a key for the state file
    region         = "us-east-2"                    # Replace with your bucket's region
    encrypt        = true                            # Optional: Enable server-side encryption
  }
}

variable "neo4j_password" {
  type      = string
  sensitive = true
}