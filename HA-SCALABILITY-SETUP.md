# High Availability and Scalability Setup

## Overview
This document describes the high availability (HA) and scalability configuration for the MERN application on Google Kubernetes Engine (GKE).

## Current Architecture Analysis

### Issues Identified
1. **Single-zone cluster**: Cluster running only in `europe-west1-b` (no HA)
2. **Single replica deployments**: Backend and frontend running 1 replica each instead of configured 2
3. **Single MongoDB instance**: No replica set (single point of failure)
4. **No autoscaling**: No HPA or Cluster Autoscaler configured
5. **Image location inconsistency**: YAML files referenced `us-central1` but images in `europe-west1`

## HA and Scalability Solutions Implemented

### 1. Multi-Zone Cluster Configuration
**File**: `gke-cluster-upgrade.sh`

Upgrades the cluster from single-zone to regional (multi-zone):
- **Zones**: `europe-west1-b`, `europe-west1-c`, `europe-west1-d`
- **Autoscaling**: 2-6 nodes per zone
- **Benefit**: If one zone fails, traffic automatically routes to other zones

### 2. Horizontal Pod Autoscaler (HPA)
**Files**: 
- `k8s/backend/hpa.yaml`
- `k8s/frontend/hpa.yaml`

Configures automatic scaling of pods based on CPU and memory usage:
- **Backend**: 2-10 replicas
- **Frontend**: 2-10 replicas
- **CPU threshold**: 70% utilization
- **Memory threshold**: 80% utilization
- **Scale-up policy**: Up to 100% or 2 pods per 30 seconds
- **Scale-down policy**: 50% per 60 seconds with 300s stabilization

### 3. Pod Disruption Budgets (PDB)
**Files**:
- `k8s/backend/pdb.yaml`
- `k8s/frontend/pdb.yaml`

Ensures minimum availability during node maintenance:
- **Minimum available**: 1 replica
- **Benefit**: Kubernetes won't terminate all pods during node upgrades

### 4. Cluster Autoscaler
**Configuration**: Applied via `gke-cluster-upgrade.sh`

Enables node pool autoscaling:
- **Minimum nodes**: 2
- **Maximum nodes**: 6
- **Benefit**: Automatically adds/removes nodes based on pod resource requests

### 5. Configuration Updates
**Files Updated**:
- `k8s/backend/deployment.yaml` - Fixed image reference to `europe-west1`
- `k8s/frontend/deployment.yaml` - Fixed image reference to `europe-west1`

## Deployment Steps

### Step 1: Enable Node Pool Autoscaling (Immediate Improvement)
```bash
./gke-cluster-scaling.sh
```

This command:
- ✅ **COMPLETED**: Enables autoscaling on existing node pool
- ✅ **COMPLETED**: Configures 2-6 nodes scaling
- ✅ **COMPLETED**: Improves scalability within current single-zone setup
- ⏱️ **Duration**: ~2 minutes

### Step 2 (Optional): Create Regional Cluster for True Multi-Zone HA
```bash
./create-regional-cluster.sh
```

This command:
- Creates a new regional cluster (mern-cluster-ha)
- Distributes nodes across 3 zones (europe-west1-b,c,d)
- Enables multi-zone high availability
- ⏱️ **Duration**: ~10-15 minutes

### Step 3 (Optional): Migrate to Regional Cluster
```bash
./migrate-to-regional-cluster.sh
```

This command:
- Migrates all workloads to the new regional cluster
- Preserves configurations and data
- Updates DNS and CI/CD pipelines
- ⏱️ **Duration**: ~5-10 minutes

### Step 4: Apply HA Configurations (Already Completed)
```bash
./deploy-ha-config.sh
```

This command:
- ✅ **COMPLETED**: Applied HPA configurations
- ✅ **COMPLETED**: Applied Pod Disruption Budgets
- ✅ **COMPLETED**: Scaled deployments to minimum replicas
- ✅ **COMPLETED**: Updated deployment configurations

## Verification Commands

### Check Cluster Status
```bash
gcloud container clusters describe mern-cluster --region=europe-west1 --project=alex-496108
```

### Check Node Pool Autoscaling
```bash
gcloud container node-pools describe default-pool --cluster=mern-cluster --region=europe-west1 --project=alex-496108
```

### Check HPA Status
```bash
kubectl get hpa -n mern-app
kubectl describe hpa backend-hpa -n mern-app
kubectl describe hpa frontend-hpa -n mern-app
```

### Check Pod Disruption Budgets
```bash
kubectl get pdb -n mern-app
kubectl describe pdb backend-pdb -n mern-app
```

### Check Deployment Status
```bash
kubectl get deployments -n mern-app
kubectl describe deployment backend -n mern-app
kubectl describe deployment frontend -n mern-app
```

### Check Pod Distribution Across Zones
```bash
kubectl get pods -n mern-app -o wide
```

## Testing HA and Scalability

### Test HPA
1. Generate load on the application:
```bash
# Install Apache Bench if not available
sudo apt-get install apache2-utils

# Test backend endpoint
ab -n 1000 -c 50 https://your-domain/api/users

# Watch HPA scale up
kubectl get hpa -n mern-app -w
```

### Test Multi-Zone HA
1. Check current pod distribution:
```bash
kubectl get pods -n mern-app -o wide
```

2. Simulate node failure (optional - for testing only):
```bash
# Cordon a node to simulate failure
kubectl cordon <node-name>
kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data
```

3. Verify pods are rescheduled to other zones

### Test Cluster Autoscaler
1. Deploy additional workloads to consume resources
2. Monitor node addition:
```bash
kubectl get nodes -w
```

## MongoDB High Availability

### Current State
- Single MongoDB replica (StatefulSet with 1 replica)
- Single point of failure

### Recommended Solutions

#### Option 1: MongoDB Replica Set (Recommended for Production)
Update `k8s/mongodb/statefulset.yaml`:
```yaml
replicas: 3  # Change from 1 to 3
```

Add replica set initialization configuration.

#### Option 2: Cloud SQL for MongoDB (Managed Service)
Migrate to Google Cloud SQL for MongoDB for:
- Automated backups
- Built-in HA
- Managed maintenance
- Point-in-time recovery

#### Option 3: Cloud Memorystore (if using Redis)
Consider using Redis for caching with MongoDB as primary database.

## Monitoring and Alerting

### Recommended Metrics to Monitor
1. **Cluster Level**:
   - Node count per zone
   - Cluster autoscaling events
   - Resource utilization (CPU, Memory, Storage)

2. **Pod Level**:
   - Replica count per deployment
   - HPA scale events
   - Pod restarts
   - Resource usage

3. **Application Level**:
   - Request latency
   - Error rates
   - Throughput

### Cloud Monitoring Setup
```bash
# Install Cloud Monitoring agents
kubectl apply -f https://raw.githubusercontent.com/GoogleCloudPlatform/k8s-stackdriver/master/custom-metrics-stackdriver-adapter/deploy/production/adapter_new_resource_model.yaml
```

## Cost Optimization

### Right-Sizing Resources
Current resource requests/limits are conservative. Monitor actual usage and adjust:

**Backend**:
- Current: 128Mi/256Mi RAM, 100m/300m CPU
- Monitor with: `kubectl top pods -n mern-app`

**Frontend**:
- Current: 64Mi/128Mi RAM, 50m/100m CPU
- Monitor with: `kubectl top pods -n mern-app`

### Autoscaling Cost Control
- HPA min replicas: 2 (ensures HA)
- HPA max replicas: 10 (limits cost)
- Cluster min nodes: 2 (baseline capacity)
- Cluster max nodes: 6 (limits infrastructure cost)

## Disaster Recovery

### Backup Strategy
1. **MongoDB Backups**: Configure regular snapshots
2. **Configuration Backups**: Git repository for all Kubernetes manifests
3. **Disaster Recovery Plan**: Documented procedures for cluster recreation

### Recovery Steps
1. Restore cluster from backup
2. Apply configurations from Git
3. Restore MongoDB data
4. Verify application functionality

## Security Considerations

1. **Network Policies**: Implement to restrict pod-to-pod communication
2. **Secrets Management**: Use External Secrets Operator or GCP Secret Manager
3. **RBAC**: Ensure proper role-based access control
4. **Image Security**: Scan images for vulnerabilities (use Container Analysis)

## Current Status (2025-05-15)

### ✅ Completed Improvements
1. **Horizontal Pod Autoscaler (HPA)**: Configured and active
   - Backend: 2-10 replicas (CPU: 6%, Memory: 28%)
   - Frontend: 2-10 replicas (CPU: 1%, Memory: 5%)

2. **Pod Disruption Budgets (PDB)**: Applied and active
   - Backend: 1 minimum available
   - Frontend: 1 minimum available

3. **Node Pool Autoscaling**: Enabled and active
   - Cluster: mern-cluster (europe-west1-b)
   - Node pool: default-pool
   - Autoscaling: 2-6 nodes
   - Location policy: BALANCED

4. **Deployment Replicas**: Corrected to 2 replicas each
   - Backend: 2/2 replicas ✅
   - Frontend: 2/2 replicas ✅

5. **Configuration Fixes**: Applied
   - Image references corrected to europe-west1
   - YAML files updated

### ⏳ Remaining Improvements (Optional)
1. **Multi-Zone High Availability**: Create regional cluster
   - Current: Single-zone (europe-west1-b)
   - Recommended: Regional cluster with 3 zones
   - Scripts provided: `create-regional-cluster.sh` + `migrate-to-regional-cluster.sh`

2. **MongoDB High Availability**: Configure replica set
   - Current: Single instance (SPOF)
   - Recommended: 3-node replica set or managed service

3. **Monitoring and Alerting**: Set up comprehensive monitoring
   - Cloud Monitoring integration
   - Custom dashboards
   - Alert policies

4. **Backup Strategy**: Implement automated backups
   - MongoDB snapshots
   - Configuration backups
   - Disaster recovery procedures

## Next Steps

1. ✅ **COMPLETED**: Node pool autoscaling enabled
2. ✅ **COMPLETED**: HPA configurations applied
3. ✅ **COMPLETED**: PDB configurations applied
4. ✅ **COMPLETED**: Deployment replicas corrected
5. ⏳ **OPTIONAL**: Monitor HPA and autoscaling behavior for 24-48 hours
6. ⏳ **OPTIONAL**: Create regional cluster for multi-zone HA
7. ⏳ **RECOMMENDED**: Implement MongoDB replica set or migrate to managed service
8. ⏳ **RECOMMENDED**: Set up monitoring and alerting
9. ⏳ **RECOMMENDED**: Configure automated backups
10. ⏳ **RECOMMENDED**: Test disaster recovery procedures

## Troubleshooting

### HPA Not Scaling
```bash
# Check if metrics server is working
kubectl top pods -n mern-app

# Check HPA events
kubectl describe hpa backend-hpa -n mern-app
```

### Pods Not Distributing Across Zones
```bash
# Check node topology
kubectl get nodes -o wide

# Verify cluster is regional
gcloud container clusters describe mern-cluster --region=europe-west1
```

### Cluster Autoscaler Not Working
```bash
# Check autoscaler logs
kubectl logs -n kube-system -l k8s-app=cluster-autoscaler

# Check events
kubectl get events -n kube-system --sort-by='.lastTimestamp'
```

## Contact and Support
- **GCP Project**: alex-496108
- **Cluster**: mern-cluster
- **Region**: europe-west1
- **GitHub Repository**: TRACKbest/mern-users-gke
- **Branch**: main