# Troubleshooting

## ImagePullBackOff

Cause

- ARM64 image deployed to AMD64 EKS nodes

Solution

- Rebuild using Docker Buildx

---

## ALB Not Created

Cause

- Incorrect subnet tags
- Incorrect controller configuration

Solution

- Tag subnets correctly
- Reinstall AWS Load Balancer Controller

---

## HTTPS Certificate Error

Cause

- Application tried to use Let's Encrypt certificates inside the container

Solution

- Terminate TLS at the AWS Application Load Balancer

---

## Target Group Empty

Cause

- Incorrect Service type

Solution

- Use ClusterIP with ALB IP target mode
