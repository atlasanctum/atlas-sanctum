# Blue/Green Deployment Guide

This document provides a simple pattern for performing blue/green deployments.

1. Build immutable artifacts (container images) and tag with a version.
2. Push images to a registry.
3. Deploy new image to the idle environment (blue or green).
4. Run smoke tests and health checks against the idle environment.
5. Switch the load balancer or DNS to route traffic to the new environment.
6. Monitor metrics and alerts (Prometheus/Grafana). Roll back if errors.

Use `deploy-blue-green.sh` as a starting point; replace placeholder commands with
your cloud provider's CLI (Azure CLI, kubectl, etc.).

Smoke tests
- The `deploy-blue-green.sh` script will attempt to hit a health endpoint after
	switching traffic. Set `HEALTH_URL` to your service health endpoint (default http://localhost:3001/health).
	Example:

	```bash
	HEALTH_URL=https://myapp.example.com/health ./deploy-blue-green.sh green
	```

If the health check fails after retries, the script exits with non-zero status
and you should perform the rollback steps described above.
