output "route53_name_servers" {
  value = aws_route53_zone.my_zone.name_servers
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.my_cluster.name
}

output "ecs_service_name_vite_app" {
  value = aws_ecs_service.web_service.name
}

output "ecs_service_name_spring_boot_app" {
  value = aws_ecs_service.spring_boot_service.name
}