# 🎓 Student App — CRUD REST API

Full CRUD REST API built with **Node.js + Express**, containerized with **Docker**, and deployed on **Kubernetes (Minikube)** with **NGINX Ingress**.

---

## 📁 Project Structure

```
student-app/
├── k8s/
│   ├── namespace.yaml       # K8s namespace
│   ├── configmap.yaml       # Environment variables
│   ├── deployment.yaml      # 2-replica Deployment with health probes
│   ├── service.yaml         # ClusterIP Service
│   └── ingress.yaml         # NGINX Ingress (student-app.local)
├── src/
│   ├── controllers/
│   │   └── student.controller.js
│   ├── models/
│   │   └── student.model.js
│   ├── routes/
│   │   └── student.routes.js
│   ├── db.js                # In-memory database (5 sample students)
│   ├── app.js               # Express app (CORS + routes)
│   └── server.js            # Entry point
├── .env.example
├── .gitignore
├── Dockerfile               # Multi-stage build
├── docker-compose.yml
└── README.md
```

---

## 🌱 Sample Initial Data

| ID | Name           | Age | Grade | Email                         |
|----|----------------|-----|-------|-------------------------------|
| 1  | Alice Johnson  | 20  | A     | alice.johnson@university.edu  |
| 2  | Bob Smith      | 22  | B+    | bob.smith@university.edu      |
| 3  | Carol Williams | 21  | A-    | carol.williams@university.edu |
| 4  | David Brown    | 23  | C+    | david.brown@university.edu    |
| 5  | Eva Martinez   | 19  | A+    | eva.martinez@university.edu   |

> ⚠️ Data is in-memory — it resets on every server restart.

---

## 📋 API Endpoints

Base URL (local): `http://localhost:3333`  
Base URL (K8s): `http://student-app.local`

| Method | Endpoint              | Description        | Body Required                          |
|--------|-----------------------|--------------------|----------------------------------------|
| GET    | `/health`             | Health check       | —                                      |
| GET    | `/api/students`       | Get all students   | —                                      |
| GET    | `/api/students/:id`   | Get by ID          | —                                      |
| POST   | `/api/students`       | Create student     | `{ name, age, grade, email }`          |
| PUT    | `/api/students/:id`   | Update student     | `{ name, age, grade, email }`          |
| DELETE | `/api/students/:id`   | Delete student     | —                                      |

### Response Format
All responses follow this consistent structure:
```json
{
  "success": true,
  "data": { ... }
}
```

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+

```bash
# Install dependencies
npm install

# Copy env file
cp .env.example .env

# Start development server (with auto-reload)
npm run dev

# Start production server
npm start
```

API available at: `http://localhost:3333`

---

## 🐳 Running with Docker

### Prerequisites
- Docker Desktop

```bash
# Build and run
docker-compose up --build

# Stop
docker-compose down
```

API available at: `http://localhost:3333`

---

## ☸️ Kubernetes Deployment (Minikube on Windows)

### Prerequisites
- [Minikube](https://minikube.sigs.k8s.io/docs/start/) installed
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/) installed
- Docker Desktop running

---

### Step 1 — Start Minikube

```powershell
minikube start --driver=docker
```

Verify it's running:
```powershell
minikube status
```

---

### Step 2 — Enable NGINX Ingress Addon

```powershell
minikube addons enable ingress
```

Wait for the ingress controller pod to be ready:
```powershell
kubectl get pods -n ingress-nginx
# Wait until STATUS = Running
```

---

### Step 3 — Build Image Inside Minikube's Docker Daemon

> This is the most important step for Minikube. You must build the image **inside Minikube's Docker environment** so Kubernetes can find it locally (imagePullPolicy: Never).

```powershell
# Point PowerShell to Minikube's Docker daemon
& minikube -p minikube docker-env --shell powershell | Invoke-Expression

# Verify you are now in Minikube's Docker context
docker info | Select-String "Name"

# Build the image (run from the project root)
docker build -t student-app:latest .
```

> ⚠️ **Important**: This `docker build` command must be run in the same terminal session where you ran the `minikube docker-env` command.

---

### Step 4 — Deploy to Kubernetes

Apply all manifests **in order**:

```powershell
# 1. Create the namespace first
kubectl apply -f k8s/namespace.yaml

# 2. Create the ConfigMap (env variables)
kubectl apply -f k8s/configmap.yaml

# 3. Deploy the application
kubectl apply -f k8s/deployment.yaml

# 4. Create the Service
kubectl apply -f k8s/service.yaml

# 5. Create the Ingress
kubectl apply -f k8s/ingress.yaml
```

Or apply all at once (order-safe because namespace exists):
```powershell
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/
```

---

### Step 5 — Verify Deployment

```powershell
# Check pods are Running (2/2)
kubectl get pods -n student-app

# Check service
kubectl get svc -n student-app

# Check ingress and get the ADDRESS
kubectl get ingress -n student-app

# View logs of a pod
kubectl logs -n student-app deployment/student-app
```

Expected output for pods:
```
NAME                           READY   STATUS    RESTARTS
student-app-xxxx-yyyy          2/2     Running   0
student-app-xxxx-zzzz          2/2     Running   0
```

---

### Step 6 — Fix Networking (Required for Docker Driver on Windows)

When using the `docker` driver, the Minikube IP is not directly reachable. You **must** run a tunnel and map the domain to `127.0.0.1`.

1.  **Start the Minikube Tunnel** (Run this in a **new** PowerShell window and keep it open):
    ```powershell
    minikube tunnel
    ```

2.  **Add Hosts Entry** (Run PowerShell as **Administrator**):
    ```powershell
    Add-Content -Path "C:\Windows\System32\drivers\etc\hosts" -Value "`n127.0.0.1    student-app.local"
    ```

3.  **Flush DNS**:
    ```powershell
    ipconfig /flushdns
    ```

---

### Step 7 — Access the API

Once the tunnel is running, open your browser:

```
http://student-app.local/api/students
http://student-app.local/health
```

---

## 🖥️ Frontend Integration

### CORS
CORS is configured at **both the Express app level** and the **Ingress level**.

To allow your frontend to call the API, update the `ALLOWED_ORIGINS` in `k8s/configmap.yaml`:
```yaml
ALLOWED_ORIGINS: "http://your-frontend-url.com,http://localhost:5173"
```

Then reapply:
```powershell
kubectl apply -f k8s/configmap.yaml
kubectl rollout restart deployment/student-app -n student-app
```

### Example: Fetch from React/Vue/etc.
```javascript
const API_BASE = 'http://student-app.local/api/students';

// Get all students
const res = await fetch(API_BASE);
const { data } = await res.json();

// Create a student
await fetch(API_BASE, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Jane', age: 20, grade: 'A', email: 'jane@mail.com' }),
});
```

---

## 📱 Access from Other Devices (LAN)

To access the API from a phone, tablet, or another computer on your Wi-Fi:

### 1. Identify your LAN IP
On your Windows machine, run:
```powershell
ipconfig
```
Look for `IPv4 Address` under your active adapter (e.g., `172.20.85.90`).

### 2. Run Port-Forward on all interfaces
The standard tunnel only works on your local machine. To expose it to the network, use:
```powershell
kubectl port-forward --address 0.0.0.0 -n student-app service/student-app-service 80:3333
```
*(Note: If port 80 is blocked by Windows, use `8080:3333` instead).*

### 3. Access from other devices
On your phone/other device, use your Windows LAN IP:
- `http://172.20.85.90/api/students` (if you used port 80)
- `http://172.20.85.90:8080/api/students` (if you used port 8080)

> **Pro Tip**: If you want to use `http://student-app.local` on your phone, you would need to edit the phone's hosts file or use a custom DNS server like Pi-hole. For quick testing, using the IP address is recommended.

---

## 🛠️ Jenkins CI/CD Setup

The project includes a `Jenkinsfile` for automated deployments.

### Prerequisites in Jenkins:
1.  **Plugins**: Install `Docker Pipeline` and `Config File Provider` plugins.
2.  **Credentials**:
    -   `docker-hub-credentials`: Add your Docker Hub username/password.
    -   `kubeconfig`: Use "Config File Provider" to upload your `~/.kube/config` file.
3.  **kubectl**: Ensure the Jenkins agent has `kubectl` installed and `docker` daemon access.

### Creating the Job:
1.  Create a "Pipeline" job in Jenkins.
2.  Select "Pipeline script from SCM".
3.  Point to your Git repository and set the script path to `Jenkinsfile`.
4.  Save and "Build Now"!

---

## 🔧 Useful kubectl Commands

```powershell
# Watch pods in real time
kubectl get pods -n student-app -w

# Describe a pod (useful for debugging)
kubectl describe pod -n student-app <pod-name>

# Scale up/down replicas
kubectl scale deployment student-app --replicas=3 -n student-app

# Rolling restart (e.g., after ConfigMap update)
kubectl rollout restart deployment/student-app -n student-app

# Rollout status
kubectl rollout status deployment/student-app -n student-app

# Tear everything down
kubectl delete -f k8s/
```

---

## ⚙️ Environment Variables

| Variable          | Default     | Description                            |
|-------------------|-------------|----------------------------------------|
| `PORT`            | `3333`      | Server port                            |
| `NODE_ENV`        | `development` | Node environment                     |
| `ALLOWED_ORIGINS` | `*`         | Comma-separated CORS allowed origins   |
