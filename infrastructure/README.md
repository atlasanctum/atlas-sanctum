# Atlas Humanitarian Platform - Infrastructure Repository

## Quick Start

```bash
# Clone the repository
git clone https://github.com/atlas-humanitarian/infrastructure.git
cd infrastructure

# Initialize Terraform
terraform init

# Plan infrastructure
terraform plan -var-file=environments/production.tfvars

# Apply infrastructure
terraform apply -var-file=environments/production.tfvars
```

## Directory Structure

```
infrastructure/
├── terraform/
│   ├── main.tf
│   ├── providers.tf
│   ├── variables.tf
│   ├── outputs.tf
│   ├── modules/
│   │   ├── networking/
│   │   ├── compute/
│   │   ├── database/
│   │   ├── storage/
│   │   ├── kubernetes/
│   │   ├── security/
│   │   └── monitoring/
│   └── environments/
│       ├── development.tfvars
│       ├── staging.tfvars
│       └── production.tfvars
├── kubernetes/
│   ├── namespaces.yaml
│   ├── deployments/
│   ├── services/
│   ├── ingresses/
│   ├── configmaps/
│   ├── secrets/
│   ├── hpa.yaml
│   └── pdb.yaml
├── docker/
│   ├── Dockerfile.api
│   ├── Dockerfile.worker
│   └── Dockerfile.frontend
├── .github/
│   └── workflows/
│       ├── ci-cd.yaml
│       ├── infrastructure.yaml
│       └── security-scan.yaml
└── scripts/
    ├── deploy.sh
    ├── migrate.sh
    └── backup.sh
```

## Prerequisites

- Terraform >= 1.5.0
- kubectl >= 1.28
- AWS CLI >= 2.13
- Helm >= 3.12
- Docker >= 24.0

## Configuration

### AWS Authentication

```bash
# Configure AWS credentials
aws configure

# Or use IAM roles (recommended for CI/CD)
aws sts get-caller-identity
```

### Terraform Backend

The state is stored in S3 with DynamoDB for locking:

```hcl
backend "s3" {
  bucket         = "atlas-terraform-state"
  key            = "production/terraform.tfstate"
  region         = "us-east-1"
  encrypt        = true
  dynamodb_table = "terraform-locks"
}
```

## Modules

### Networking (`modules/networking`)

- VPC with public/private subnets
- NAT Gateways
- Security Groups
- Load Balancers
- CloudFront CDN

### Compute (`modules/compute`)

- EKS Cluster
- EC2 Instances
- Lambda Functions
- ECS Tasks

### Database (`modules/database`)

- RDS PostgreSQL
- ElastiCache Redis
- DocumentDB
- Neptune Graph

### Storage (`modules/storage`)

- S3 Buckets
- EFS File Systems
- Backup Configuration

### Kubernetes (`modules/kubernetes`)

- EKS Cluster
- Node Groups
- Addons (ALB Ingress, External DNS)

### Security (`modules/security`)

- IAM Roles/Policies
- KMS Keys
- Secrets Manager
- WAF Rules

### Monitoring (`modules/monitoring`)

- CloudWatch Dashboards
- Prometheus/Grafana
- DataDog Integration
- AlertManager

## Environments

### Development

- SingleAZ deployment
- Spot instances for workers
- Minimal monitoring
- Shared staging environment

### Staging

- MultiAZ deployment
- Mixed spot/on-demand
- Full monitoring
- Isolated environment

### Production

- MultiAZ deployment
- All on-demand
- Full monitoring/alerting
- DR configuration

## Deployment

### Manual Deployment

```bash
# Plan changes
terraform plan -var-file=environments/production.tfvars

# Apply changes
terraform apply -var-file=environments/production.tfvars

# Update Kubernetes
kubectl apply -f kubernetes/
```

### CI/CD Deployment

See `.github/workflows/` for automated deployment pipelines.

## Cost Management

- Reserved Instances for baseline
- Spot instances for variable workloads
- Auto-scaling policies
- Cost allocation tags

## Security

- Encryption at rest and in transit
- Private subnets for sensitive resources
- IAM least privilege
- Regular security scanning

## Compliance

- SOC2 controls
- GDPR data residency
- Audit logging
- Data retention policies

## Support

- Architecture: architecture@atlas.org
- Infrastructure: infra@atlas.org
- Security: security@atlas.org
