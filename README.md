# MG-Gadgets

A production-style cloud-native deployment of the MG-Gadgets Consumer SSR application on Amazon Web Services (AWS).

---

## Architecture

```
Developer
     │
     ▼
GitHub
     │
     ▼
Docker Build
     │
     ▼
Amazon ECR
     │
     ▼
Amazon EKS
     │
     ▼
Deployment
     │
     ▼
Pods
     │
     ▼
Service
     │
     ▼
Ingress (AWS Load Balancer Controller)
     │
     ▼
Application Load Balancer
     │
     ▼
Browser
```

---

## Tech Stack

### Cloud

- AWS
- Amazon EKS
- Amazon ECR
- IAM
- VPC
- ALB

### Infrastructure

- Terraform

### Containers

- Docker
- Kubernetes

### Application

- React SSR
- Node.js
- Express

---

## Repository Structure

```
MG-Gadgets
│
├── apps
│   └── consumer-ssr
│
├── infra
│   ├── terraform
│   ├── k8s
│   └── iam_policy.json
│
├── docs
│
└── README.md
```

---

## Features

- Production-ready Docker image
- Multi-stage Docker build
- Amazon ECR image registry
- Terraform infrastructure
- Amazon EKS deployment
- AWS Application Load Balancer
- Kubernetes Deployment
- Kubernetes Service
- Kubernetes Ingress
- Rolling updates
- Health probes
- Resource requests & limits

---

## Deployment Flow

```
GitHub
   │
   ▼
Docker Image
   │
   ▼
Amazon ECR
   │
   ▼
Amazon EKS
   │
   ▼
Application Load Balancer
   │
   ▼
Users
```

---

## Future Improvements

- GitHub Actions CI
- Argo CD GitOps
- Prometheus
- Grafana
- Horizontal Pod Autoscaler
- AWS ACM
- Route53
- External Secrets
- IRSA
