# AWS Secrets Manager for sensitive configuration
resource "aws_secretsmanager_secret" "supabase_credentials" {
  name = "${var.project_name}-${var.environment}-supabase-credentials"
  
  tags = merge(
    var.tags,
    {
      Name = "${var.project_name}-${var.environment}-supabase"
    }
  )
}

resource "aws_secretsmanager_secret_version" "supabase_credentials" {
  secret_id = aws_secretsmanager_secret.supabase_credentials.id
  
  secret_string = jsonencode({
    VITE_SUPABASE_URL      = "https://${var.supabase_project_ref}.supabase.co"
    VITE_SUPABASE_ANON_KEY = var.supabase_anon_key
    SUPABASE_DB_PASSWORD   = var.supabase_db_password
  })
}

# IAM role for external secrets operator
resource "aws_iam_role" "external_secrets" {
  name = "${var.project_name}-${var.environment}-external-secrets"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRoleWithWebIdentity"
        Effect = "Allow"
        Principal = {
          Federated = module.eks.oidc_provider_arn
        }
        Condition = {
          StringEquals = {
            "${module.eks.oidc_provider}:sub" = "system:serviceaccount:external-secrets:external-secrets"
          }
        }
      }
    ]
  })

  tags = var.tags
}

resource "aws_iam_role_policy" "external_secrets" {
  name = "secrets-access"
  role = aws_iam_role.external_secrets.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Effect = "Allow"
        Resource = [
          aws_secretsmanager_secret.supabase_credentials.arn
        ]
      }
    ]
  })
}

# S3 bucket for static assets and backups
resource "aws_s3_bucket" "assets" {
  bucket = "${var.project_name}-${var.environment}-assets"

  tags = merge(
    var.tags,
    {
      Name = "${var.project_name}-${var.environment}-assets"
    }
  )
}

resource "aws_s3_bucket_versioning" "assets" {
  bucket = aws_s3_bucket.assets.id

  versioning_configuration {
    status = var.enable_backup ? "Enabled" : "Suspended"
  }
}

resource "aws_s3_bucket_encryption" "assets" {
  bucket = aws_s3_bucket.assets.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "assets" {
  bucket = aws_s3_bucket.assets.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# CloudFront distribution for CDN
resource "aws_cloudfront_distribution" "cdn" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "${var.project_name} ${var.environment} CDN"
  default_root_object = "index.html"
  price_class         = "PriceClass_100"

  origin {
    domain_name = aws_s3_bucket.assets.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.assets.id}"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.cdn.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${aws_s3_bucket.assets.id}"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = 3600
    max_ttl     = 86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = var.tags
}

resource "aws_cloudfront_origin_access_identity" "cdn" {
  comment = "${var.project_name}-${var.environment}"
}
