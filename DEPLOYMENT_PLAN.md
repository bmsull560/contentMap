# Production Deployment Plan - ContentMap

## Overview
This document outlines the comprehensive agent-based production deployment strategy for the contentMap repository. Each agent is a specialized component responsible for specific aspects of the deployment pipeline.

## Agent Architecture

### 1. Code Quality Sentinel 🎯
**Role**: Static Excellence Lead

**Responsibilities**:
- Enforce code quality standards via ESLint, Prettier, and TypeScript
- Run SonarCloud analysis for maintainability metrics
- Block merges that fail quality gates
- Maintain consistent code style across the codebase

**Implementation**:
- `.prettierrc.json` - Code formatting configuration
- `.github/workflows/code-quality.yml` - Automated quality checks
- `sonar-project.properties` - SonarCloud integration

**Success Metrics**:
- ✅ Zero lint errors on main branch
- ✅ SonarCloud quality gate ≥ A
- ✅ TypeScript compilation without errors
- ✅ 100% adherence to formatting standards

---

### 2. Test Assurance Automator 🧪
**Role**: Continuous Validation Engineer

**Responsibilities**:
- Execute unit, integration, and E2E test suites
- Generate and publish code coverage reports
- Maintain test infrastructure and fixtures
- Identify and quarantine flaky tests

**Implementation**:
- `.github/workflows/test-assurance.yml` - Test automation pipeline
- `codecov.yml` - Coverage reporting configuration
- `playwright.config.ts` - E2E test configuration

**Success Metrics**:
- ✅ All tests pass on every PR
- ✅ Code coverage ≥ 80%
- ✅ Test execution time < 8 minutes
- ✅ Flaky test rate < 1%

---

### 3. Security Watchtower 🔒
**Role**: Threat & Compliance Analyst

**Responsibilities**:
- Scan dependencies for vulnerabilities
- Detect secrets and sensitive data leaks
- Perform static application security testing (SAST)
- Validate Infrastructure as Code security

**Implementation**:
- `.github/workflows/security.yml` - Security scanning pipeline
- `.github/dependabot.yml` - Automated dependency updates
- `.gitleaks.toml` - Secret detection configuration

**Success Metrics**:
- ✅ Zero high/critical vulnerabilities before release
- ✅ No exposed secrets or API keys
- ✅ All security scans passing
- ✅ Dependency updates within 7 days

---

### 4. Infra Blueprint Architect 🏗️
**Role**: Environment & IaC Engineer

**Responsibilities**:
- Provision AWS infrastructure via Terraform
- Manage Kubernetes cluster and workloads
- Configure networking, storage, and secrets
- Implement GitOps deployment patterns

**Implementation**:
- `infrastructure/terraform/` - AWS infrastructure as code
  - `main.tf` - Provider and backend configuration
  - `eks.tf` - EKS cluster and VPC setup
  - `storage.tf` - S3, CloudFront, Secrets Manager
  - `variables.tf` - Configurable parameters
  - `outputs.tf` - Infrastructure outputs
- `infrastructure/kubernetes/` - Kubernetes manifests
  - `namespace.yaml` - Namespace and RBAC
  - `deployment.yaml` - Application deployment and HPA
  - `ingress.yaml` - Load balancer and networking

**Success Metrics**:
- ✅ Infrastructure reproducible from code
- ✅ Zero manual configuration drift
- ✅ Terraform plans execute cleanly
- ✅ Kubernetes deployments are declarative

---

### 5. Release Conductor 🚀
**Role**: Progressive Delivery Orchestrator

**Responsibilities**:
- Orchestrate build, test, and deployment pipeline
- Manage staging and production releases
- Implement blue-green deployment strategies
- Coordinate database migrations with app deploys

**Implementation**:
- `.github/workflows/deploy.yml` - Build and deployment pipeline
- `Dockerfile` - Multi-stage production container
- `infrastructure/docker/nginx.conf` - Production web server config

**Success Metrics**:
- ✅ Automated deployments from merge to production
- ✅ Zero-downtime releases
- ✅ Rollback capability tested and working
- ✅ Complete audit trail for all deployments

---

### 6. Monitoring Sentinel 📊
**Role**: Observability & Reliability Steward

**Responsibilities**:
- Collect metrics, logs, and traces
- Configure alerting and on-call rotation
- Run load and performance tests
- Monitor SLOs and error budgets

**Implementation**:
- `infrastructure/monitoring/prometheus-config.yaml` - Metrics collection and alerting
- `infrastructure/monitoring/grafana-dashboards.yaml` - Visualization dashboards
- `infrastructure/monitoring/otel-config.yaml` - OpenTelemetry configuration
- `infrastructure/monitoring/loadtest.sh` - k6 load testing script

**Success Metrics**:
- ✅ SLO dashboards operational with <5min MTTD
- ✅ Load tests passing at 200 concurrent users
- ✅ Alert false positive rate < 5%
- ✅ 99.9% uptime achieved

---

## Workflow Sequence

```
┌─────────────────────────────────────────────────────────────────┐
│                    Developer Pushes Code                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  1. Code Quality Sentinel                                       │
│     - ESLint, Prettier, TypeScript checks                       │
│     - SonarCloud analysis                                       │
└────────────────────────────┬────────────────────────────────────┘
                             │ ✅ Pass
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. Test Assurance Automator                                    │
│     - Unit tests + coverage                                     │
│     - E2E tests (Playwright)                                    │
└────────────────────────────┬────────────────────────────────────┘
                             │ ✅ Pass
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. Security Watchtower                                         │
│     - Dependency scanning (Snyk, Trivy)                         │
│     - Secret detection (Gitleaks)                               │
│     - SAST (CodeQL)                                             │
└────────────────────────────┬────────────────────────────────────┘
                             │ ✅ Pass
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. Infra Blueprint Architect                                   │
│     - Terraform plan validation                                 │
│     - Kubernetes manifest linting                               │
└────────────────────────────┬────────────────────────────────────┘
                             │ ✅ Pass
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  5. Release Conductor                                           │
│     - Build Docker image                                        │
│     - Deploy to staging → manual approval → production          │
│     - Database migrations                                       │
│     - Blue-green cutover                                        │
└────────────────────────────┬────────────────────────────────────┘
                             │ ✅ Deployed
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  6. Monitoring Sentinel                                         │
│     - Health checks                                             │
│     - Metrics collection                                        │
│     - Alert on anomalies                                        │
│     - Feedback to all agents                                    │
└─────────────────────────────────────────────────────────────────┘
```

## Dependencies Between Agents

| Agent | Depends On | Provides To |
|-------|-----------|-------------|
| Code Quality Sentinel | - | Test Assurance Automator, Release Conductor |
| Test Assurance Automator | Code Quality Sentinel | Code Quality Sentinel (coverage), Release Conductor |
| Security Watchtower | - | All agents (security gate) |
| Infra Blueprint Architect | Security Watchtower | Test Assurance Automator, Release Conductor |
| Release Conductor | All preceding agents | Monitoring Sentinel |
| Monitoring Sentinel | Release Conductor | All agents (feedback) |

## Getting Started

### Prerequisites
- AWS Account with appropriate permissions
- GitHub repository with Actions enabled
- Supabase project configured
- Domain name and SSL certificate

### Required Secrets
Configure these in GitHub Settings → Secrets:

```bash
# AWS
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY

# Supabase
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
SUPABASE_DB_PASSWORD

# Security & Monitoring
SONAR_TOKEN
CODECOV_TOKEN
SNYK_TOKEN
```

### Deployment Steps

1. **Infrastructure Setup**
   ```bash
   cd infrastructure/terraform
   terraform init
   terraform plan -var-file=production.tfvars
   terraform apply -var-file=production.tfvars
   ```

2. **Configure kubectl**
   ```bash
   aws eks update-kubeconfig --region us-east-1 --name contentmap-production
   ```

3. **Deploy Kubernetes Resources**
   ```bash
   kubectl apply -f infrastructure/kubernetes/namespace.yaml
   kubectl apply -f infrastructure/kubernetes/deployment.yaml
   kubectl apply -f infrastructure/kubernetes/ingress.yaml
   ```

4. **Setup Monitoring**
   ```bash
   kubectl apply -f infrastructure/monitoring/prometheus-config.yaml
   kubectl apply -f infrastructure/monitoring/grafana-dashboards.yaml
   ```

5. **Trigger First Deployment**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

## Monitoring & Alerts

- **Prometheus**: http://prometheus.contentmap.example.com
- **Grafana**: http://grafana.contentmap.example.com
- **Application**: https://contentmap.example.com

## Rollback Procedures

### Automatic Rollback
The deployment pipeline automatically rolls back on health check failures.

### Manual Rollback
```bash
kubectl rollout undo deployment/contentmap-app -n contentmap-production
kubectl rollout status deployment/contentmap-app -n contentmap-production
```

## Maintenance

- **Weekly**: Review security scan results
- **Monthly**: Optimize infrastructure costs
- **Quarterly**: Load test and capacity planning
- **On-demand**: Incident response and postmortems

## Support & Escalation

For issues, refer to the runbooks in the `docs/runbooks/` directory (to be created).

---

**Last Updated**: 2025-10-12  
**Maintained By**: DevOps Team  
**Version**: 1.0.0
