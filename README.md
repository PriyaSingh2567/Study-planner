
# StudyFlow - Smart Study Planner

A full-stack web application that helps students organize, track, and manage their study tasks with user authentication, priority management, and real-time progress tracking.

## Features

- User registration and login with JWT authentication
- Add study tasks with subject, topic, deadline, and priority level
- Mark tasks as completed and track overall progress
- Dashboard with statistics (total, completed, pending, overdue tasks)
- Filter tasks by status (all, pending, completed, overdue)
- Upcoming deadlines view
- Responsive design for mobile and desktop

## Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** bcryptjs, JSON Web Tokens (JWT)
- **Containerization:** Docker with multi-stage builds
- **Orchestration:** Kubernetes (Minikube)

## Project Structure

```
study-planner/
├── backend/
│   ├── server.js          # Express server entry point
│   ├── models/
│   │   ├── User.js        # User schema and model
│   │   └── Task.js        # Task schema and model
│   ├── routes/
│   │   ├── auth.js        # Authentication routes (login/register)
│   │   └── tasks.js       # CRUD routes for tasks
│   ├── middleware/
│   │   └── auth.js        # JWT authentication middleware
│   └── package.json       # Node.js dependencies
├── frontend/
│   ├── index.html         # Main HTML file
│   ├── css/
│   │   └── style.css      # Application styles
│   └── js/
│       └── script.js      # Frontend JavaScript
├── devops/
│   ├── Dockerfile             # Multi-stage Docker build
│   ├── docker-compose.yml     # Local multi-container setup
│   └── k8s/
│       ├── app-deployment.yaml    # App deployment (2 replicas)
│       ├── app-service.yaml       # NodePort service
│       ├── mongo-deployment.yaml  # MongoDB deployment
│       └── mongo-service.yaml     # MongoDB ClusterIP service
└── .dockerignore          # Docker build exclusions
```

## Getting Started

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Minikube and kubectl (for Kubernetes deployment)

### Local Development

```bash
cd backend
npm install
npm start
```

### Docker Deployment

```bash
# Build and run with Docker Compose
cd devops
docker-compose up --build

# Access the app at http://localhost:3000
```

### Kubernetes Deployment (Minikube)

```bash
# Start Minikube
minikube start

# Use Minikube's Docker daemon
eval $(minikube docker-env)

# Build the Docker image
docker build -t study-planner-app:latest -f devops/Dockerfile .

# Apply Kubernetes manifests
kubectl apply -f devops/k8s/mongo-deployment.yaml
kubectl apply -f devops/k8s/mongo-service.yaml
kubectl apply -f devops/k8s/app-deployment.yaml
kubectl apply -f devops/k8s/app-service.yaml

# Verify pods are running
kubectl get pods

# Access the application
minikube service study-planner-service
```
=======
# Study-planner

