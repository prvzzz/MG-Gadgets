# Deployment

## Build Docker Image

```bash
docker build -t mg-consumer-ssr:v1 .
```

## Push to ECR

```bash
docker push <repository>:v1
```

## Deploy

```bash
kubectl apply -f infra/k8s/
```

## Verify

```bash
kubectl get pods
kubectl get svc
kubectl get ingress
```
