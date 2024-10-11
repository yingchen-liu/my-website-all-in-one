resource "aws_route53_zone" "my_zone" {
  name = "yingchenliu.com"
}

resource "aws_route53_record" "my_a_record" {
  zone_id = aws_route53_zone.my_zone.zone_id  # Your Route 53 Hosted Zone ID
  name    = "yingchenliu.com"  # The domain you want to point to the load balancer
  type    = "A"

  alias {
    name                   = aws_lb.my_lb.dns_name  # ALB DNS Name
    zone_id                = aws_lb.my_lb.zone_id   # ALB Hosted Zone ID
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "mx" {
  zone_id = aws_route53_zone.my_zone.zone_id
  name    = "yingchenliu.com"
  type    = "MX"
  ttl     = 1800
  records = [
    "1 smtp.google.com",
  ]
}