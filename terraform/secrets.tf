resource "aws_secretsmanager_secret" "neo4j_password" {
  name        = "my-website-neo4j-password"
  description = "Neo4j database password"
}

resource "aws_secretsmanager_secret_version" "neo4j_password_version" {
  secret_id = aws_secretsmanager_secret.neo4j_password.id
  secret_string = var.neo4j_password
}
