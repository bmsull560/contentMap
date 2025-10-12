# Production Deployment Checklist

## Pre-Deployment

### Infrastructure
- [ ] AWS account configured with appropriate permissions
- [ ] Terraform state bucket created (`contentmap-terraform-state`)
- [ ] DynamoDB table for state locking (`contentmap-terraform-locks`)
- [ ] Domain registered and DNS configured
- [ ] SSL/TLS certificate provisioned in AWS ACM
- [ ] VPC and subnet CIDR ranges planned
- [ ] EKS cluster sizing determined (node types, min/max replicas)

### Security
- [ ] All secrets stored in AWS Secrets Manager
- [ ] IAM roles and policies reviewed
- [ ] Security groups configured with least privilege
- [ ] Network policies defined for Kubernetes
- [ ] Container images scanned for vulnerabilities
- [ ] Secret scanning pipeline operational

### Monitoring & Alerting
- [ ] Prometheus deployed and configured
- [ ] Grafana dashboards created
- [ ] AlertManager rules defined
- [ ] PagerDuty/Opsgenie integration configured
- [ ] SLO/SLI definitions documented
- [ ] On-call rotation established

### Application
- [ ] Environment variables configured
- [ ] Supabase project created and configured
- [ ] Database migrations tested
- [ ] Feature flags configured (if applicable)
- [ ] CDN/CloudFront distribution configured
- [ ] Health check endpoints verified

### CI/CD
- [ ] GitHub Actions workflows tested
- [ ] Container registry configured (GHCR)
- [ ] Deployment environments created (staging, production)
- [ ] Approval gates configured for production
- [ ] Rollback procedures documented and tested

## Deployment Day

### Pre-Flight Checks
- [ ] All CI/CD pipelines green
- [ ] No critical security vulnerabilities
- [ ] Test coverage meets threshold (≥80%)
- [ ] Load tests passing
- [ ] Staging environment validated
- [ ] Change management ticket created
- [ ] Stakeholders notified

### Infrastructure Deployment
```bash
# 1. Terraform Apply
cd infrastructure/terraform
terraform init
terraform plan -var-file=production.tfvars -out=tfplan
terraform apply tfplan

# 2. Configure kubectl
aws eks update-kubeconfig --region us-east-1 --name contentmap-production

# 3. Verify cluster
kubectl cluster-info
kubectl get nodes

# 4. Deploy monitoring stack
kubectl create namespace monitoring
kubectl apply -f infrastructure/monitoring/prometheus-config.yaml
kubectl apply -f infrastructure/monitoring/grafana-dashboards.yaml

# 5. Deploy application namespace
kubectl apply -f infrastructure/kubernetes/namespace.yaml
kubectl apply -f infrastructure/kubernetes/deployment.yaml
kubectl apply -f infrastructure/kubernetes/ingress.yaml
```

### Application Deployment
- [ ] Database migrations executed
- [ ] Secrets synced to Kubernetes
- [ ] Initial deployment triggered
- [ ] Health checks passing
- [ ] Metrics being collected
- [ ] Logs flowing to aggregation system

### Smoke Tests
- [ ] Homepage loads successfully
- [ ] API health check returns 200
- [ ] User authentication works
- [ ] Database connectivity verified
- [ ] Static assets loading from CDN
- [ ] SSL certificate valid

## Post-Deployment

### Immediate (0-1 hour)
- [ ] Monitor error rates in Grafana
- [ ] Check application logs for errors
- [ ] Verify all pods running and healthy
- [ ] Confirm HPA is functioning
- [ ] Test user-facing functionality
- [ ] Monitor response times

### Short-term (1-24 hours)
- [ ] Run load test against production
- [ ] Review cost estimates vs. actuals
- [ ] Analyze performance metrics
- [ ] Check for memory leaks
- [ ] Validate backup processes
- [ ] Update documentation

### Medium-term (1-7 days)
- [ ] Conduct post-deployment review
- [ ] Document lessons learned
- [ ] Optimize resource allocations
- [ ] Fine-tune autoscaling parameters
- [ ] Review and adjust alerts
- [ ] Update runbooks

## Rollback Procedure

If critical issues are detected:

```bash
# Quick rollback
kubectl rollout undo deployment/contentmap-app -n contentmap-production

# Verify rollback
kubectl rollout status deployment/contentmap-app -n contentmap-production

# Check health
kubectl get pods -n contentmap-production
curl https://contentmap.example.com/health
```

## Success Criteria

### Performance
- [ ] p95 response time < 2 seconds
- [ ] Error rate < 1%
- [ ] Uptime > 99.9%
- [ ] Page load time < 3 seconds

### Reliability
- [ ] Zero critical bugs in first 24 hours
- [ ] Successful handling of expected load
- [ ] Automatic recovery from pod failures
- [ ] Database backups completing

### Security
- [ ] No exposed secrets
- [ ] All traffic encrypted (HTTPS)
- [ ] Security headers configured
- [ ] No high/critical vulnerabilities

### Operations
- [ ] Monitoring dashboards populated
- [ ] Alerts firing appropriately
- [ ] Logs searchable and retained
- [ ] Deployment documented

## Contacts

- **DevOps Lead**: [Name/Slack/Email]
- **Security Team**: [Contact Info]
- **On-Call Engineer**: [PagerDuty/Contact]
- **Product Owner**: [Contact Info]

## Resources

- [DEPLOYMENT_PLAN.md](./DEPLOYMENT_PLAN.md)
- [Infrastructure Terraform](./infrastructure/terraform/)
- [Kubernetes Manifests](./infrastructure/kubernetes/)
- [Monitoring Configs](./infrastructure/monitoring/)
- [GitHub Actions](./.github/workflows/)

---

**Checklist Version**: 1.0.0  
**Last Updated**: 2025-10-12  
**Next Review**: Before each production deployment
