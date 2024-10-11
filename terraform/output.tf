output "route53_name_servers" {
  value = aws_route53_zone.my_zone.name_servers
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.your_cluster.name
}

output "ecs_service_name" {
  value = aws_ecs_service.your_service.name
}