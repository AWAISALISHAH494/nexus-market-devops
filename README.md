# NexusMarket — Cloud-Native Microservices Marketplace

**NexusMarket** is a production-style multi-vendor online marketplace built using a **polyglot microservices architecture** with Django, Django REST Framework, Node.js, and React.

The project is designed not only to implement marketplace functionality, but also to provide a practical environment for applying modern **DevOps, containerization, CI/CD, Kubernetes, and AWS cloud practices**.

The system is progressively developed from local development with Docker to automated CI/CD pipelines, Kubernetes orchestration, and AWS deployment using services such as **Amazon ECR, EC2, and EKS**.

---

## Architecture

```text
                         ┌──────────────────┐
                         │   React Frontend │
                         │  Vite + Tailwind │
                         └────────┬─────────┘
                                  │
                                  ▼
                 ┌────────────────────────────────┐
                 │       Microservices Layer       │
                 │                                │
                 │  ┌──────────────────────────┐  │
                 │  │ Auth Service             │  │
                 │  │ Django + DRF             │  │
                 │  └──────────────────────────┘  │
                 │                                │
                 │  ┌──────────────────────────┐  │
                 │  │ Catalog Service          │  │
                 │  │ Django + DRF             │  │
                 │  └──────────────────────────┘  │
                 │                                │
                 │  ┌──────────────────────────┐  │
                 │  │ Order Service            │  │
                 │  │ Node.js + Express        │  │
                 │  └──────────────────────────┘  │
                 │                                │
                 │  ┌──────────────────────────┐  │
                 │  │ Payment Service           │  │
                 │  │ Node.js + Express        │  │
                 │  └──────────────────────────┘  │
                 │                                │
                 │  ┌──────────────────────────┐  │
                 │  │ Notification Service     │  │
                 │  │ Node.js + BullMQ         │  │
                 │  └──────────────────────────┘  │
                 └───────────────┬────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
             ┌──────────────┐          ┌──────────────┐
             │ PostgreSQL   │          │    Redis     │
             │   Database   │          │ Cache / Queue│
             └──────────────┘          └──────────────┘
```

---

## Core Features

### Authentication & Authorization

- JWT-based authentication
- Role-based access control
- Buyer, Seller, and Admin roles
- Protected service endpoints
- User management

### Product & Inventory Management

- Product catalog
- Product creation and management
- Seller-specific products
- Inventory tracking
- Product availability management

### Shopping & Orders

- Shopping cart
- Order creation
- Order status management
- Complete order lifecycle
- Seller order management

### Payments

- Mock payment service
- Payment processing workflow
- Order-payment integration
- Payment status tracking

### Notifications

- Asynchronous notification processing
- Email notification workflow
- Redis-backed job queue
- BullMQ-based background processing

### Dashboards

- Seller dashboard
- Admin dashboard
- Marketplace management functionality

---

## DevOps & Cloud Objectives

NexusMarket is intentionally designed as a **DevOps-focused portfolio project**.

The project demonstrates the complete journey from local development to cloud deployment:

```text
Development
     │
     ▼
Docker
     │
     ▼
Docker Compose
     │
     ▼
GitHub Actions
     │
     ▼
Container Registry
     │
     ▼
Amazon ECR
     │
     ▼
Kubernetes
     │
     ├───────────────┐
     ▼               ▼
   EC2              EKS
     │               │
     └───────┬───────┘
             ▼
       AWS Cloud Deployment
```

### DevOps Practices

- Multi-stage Docker builds
- Containerized microservices
- Docker Compose for local orchestration
- GitHub Actions CI/CD
- Automated testing
- Docker image building
- Container image tagging
- Amazon ECR integration
- Kubernetes deployments
- Kubernetes services
- ConfigMaps and Secrets
- Kubernetes health checks
- Horizontal scaling
- AWS deployment
- Infrastructure and deployment automation
- Centralized environment configuration

---

## Project Structure

```text
nexus-market/
│
├── frontend/
│   └── React + Vite + Tailwind CSS
│
├── services/
│   │
│   ├── auth-service/
│   │   └── Django + Django REST Framework
│   │
│   ├── catalog-service/
│   │   └── Django + Django REST Framework
│   │
│   ├── order-service/
│   │   └── Node.js + Express + TypeScript
│   │
│   ├── payment-service/
│   │   └── Node.js + Express
│   │
│   └── notification-service/
│       └── Node.js + BullMQ
│
├── k8s/
│   └── Kubernetes manifests
│
├── .github/
│   └── workflows/
│       └── CI/CD pipelines
│
├── docker-compose.yml
├── README.md
└── ...
```

---

## Technology Stack

| Layer                | Technology                    |
| -------------------- | ----------------------------- |
| Frontend             | React, Vite, Tailwind CSS     |
| Authentication       | JWT                           |
| Auth Service         | Django, Django REST Framework |
| Catalog Service      | Django, Django REST Framework |
| Order Service        | Node.js, Express, TypeScript  |
| Payment Service      | Node.js, Express              |
| Notification Service | Node.js, BullMQ               |
| Database             | PostgreSQL                    |
| Cache                | Redis                         |
| Message Queue        | Redis + BullMQ                |
| Containerization     | Docker, Docker Compose        |
| CI/CD                | GitHub Actions                |
| Container Registry   | Amazon ECR                    |
| Orchestration        | Kubernetes                    |
| Cloud                | AWS                           |
| Compute              | Amazon EC2 / Amazon EKS       |

---

# Local Development

## Prerequisites

Make sure the following are installed:

- Git
- Docker
- Docker Compose

Optional for Kubernetes development:

- kubectl
- Minikube
- AWS CLI

---

## Clone the Repository

```bash
git clone https://github.com/your-username/nexus-market-devops.git

cd nexus-market-devops
```

---

## Start the Application

Build and start all services using Docker Compose:

```bash
docker compose up --build
```

Run in detached mode:

```bash
docker compose up -d --build
```

Check running containers:

```bash
docker compose ps
```

Stop the application:

```bash
docker compose down
```

---

# Service Endpoints

| Service              | URL                                            |
| -------------------- | ---------------------------------------------- |
| Frontend             | [http://localhost:3000](http://localhost:3000) |
| Auth Service         | [http://localhost:8001](http://localhost:8001) |
| Catalog Service      | [http://localhost:8002](http://localhost:8002) |
| Order Service        | [http://localhost:3001](http://localhost:3001) |
| Payment Service      | [http://localhost:3002](http://localhost:3002) |
| Notification Service | [http://localhost:3003](http://localhost:3003) |

> Port mappings may change as the project evolves. Check `docker-compose.yml` for the current configuration.

---

# CI/CD Pipeline

The project uses **GitHub Actions** to automate the software delivery process.

The intended pipeline follows:

```text
Git Push
   │
   ▼
GitHub Actions
   │
   ├── Code Quality Checks
   │
   ├── Automated Tests
   │
   ├── Docker Build
   │
   ├── Docker Image Tagging
   │
   ├── Push Images to Amazon ECR
   │
   └── Deploy
          │
          ▼
      AWS / Kubernetes
```

The pipeline is designed to reduce manual deployment work and provide a repeatable delivery process.

---

# Kubernetes Deployment

The application is designed to run as a collection of independent Kubernetes workloads.

Each microservice can be deployed and scaled independently.

Example architecture:

```text
                   Kubernetes Cluster
                          │
          ┌───────────────┼────────────────┐
          │               │                │
          ▼               ▼                ▼
     Auth Service    Catalog Service   Order Service
          │               │                │
          └───────────────┼────────────────┘
                          │
                 ┌────────┴────────┐
                 ▼                 ▼
             PostgreSQL          Redis
                 │                 │
                 └────────┬────────┘
                          ▼
                 Notification Service
```

Planned Kubernetes resources include:

- Deployments
- Services
- ConfigMaps
- Secrets
- Persistent storage
- Liveness probes
- Readiness probes
- Resource requests and limits
- Horizontal scaling

---

# AWS Deployment

The project is designed to integrate with AWS for cloud deployment.

### Amazon ECR

Docker images are built and pushed to **Amazon Elastic Container Registry (ECR)**.

```text
Source Code
     │
     ▼
GitHub Actions
     │
     ▼
Docker Build
     │
     ▼
Amazon ECR
```

### EC2

EC2 can be used for a simpler container-based deployment and as a practical environment for learning cloud infrastructure and deployment automation.

### EKS

For Kubernetes-based cloud deployment, the project can be deployed to **Amazon Elastic Kubernetes Service (EKS)**.

```text
GitHub
   │
   ▼
GitHub Actions
   │
   ▼
Amazon ECR
   │
   ▼
Amazon EKS
   │
   ├── Auth Service
   ├── Catalog Service
   ├── Order Service
   ├── Payment Service
   └── Notification Service
```

---

# Development Roadmap

The project is being developed incrementally to cover the complete DevOps lifecycle.

### Phase 1 — Application Development

- [x] Project architecture
- [x] Authentication service
- [x] Catalog service
- [x] Order service
- [x] Payment service
- [x] Notification service
- [x] React frontend
- [x] PostgreSQL integration
- [x] Redis integration

### Phase 2 — Containerization

- [x] Dockerfile for each service
- [ ] Multi-stage Docker builds
- [x] Docker Compose
- [ ] Service networking
- [ ] Environment-based configuration
- [ ] Production-oriented container configuration

### Phase 3 — CI/CD

- [x] GitHub Actions workflows
- [ ] Automated testing
- [ ] Code quality checks
- [ ] Docker image builds
- [ ] Image tagging
- [ ] Amazon ECR integration
- [ ] Automated deployment

### Phase 4 — Kubernetes

- [ ] Kubernetes Deployments
- [ ] Kubernetes Services
- [ ] ConfigMaps
- [ ] Secrets
- [ ] Health checks
- [ ] Resource limits
- [ ] Persistent storage
- [ ] Horizontal scaling
- [ ] Minikube/local Kubernetes deployment

### Phase 5 — AWS

- [ ] AWS IAM configuration
- [ ] Amazon ECR
- [ ] EC2 deployment
- [ ] Amazon EKS
- [ ] AWS networking
- [ ] Production-style Kubernetes deployment
- [ ] CI/CD to AWS

---

# Project Goals

The primary goal of NexusMarket is to build a realistic application while gaining hands-on experience with modern DevOps practices.

The project focuses on:

- Microservices architecture
- Polyglot application development
- Containerization
- CI/CD automation
- Kubernetes orchestration
- Cloud infrastructure
- AWS services
- Application scalability
- Service isolation
- Automated deployments
- Production-oriented engineering practices

---

# Why NexusMarket?

Instead of building a simple monolithic application and adding DevOps tools afterward, NexusMarket is designed with **deployment and operations in mind from the beginning**.

Each service can be:

- Developed independently
- Containerized independently
- Tested independently
- Built independently
- Deployed independently
- Scaled independently

This makes the project a practical demonstration of how a modern application can move from **source code → containers → CI/CD → Kubernetes → cloud infrastructure**.

---

# Status

**Active Development**

NexusMarket is being developed as a hands-on **Cloud & DevOps engineering portfolio project**, with the architecture and tooling evolving toward a production-style deployment on AWS Kubernetes.

---

## License

This project is intended for educational and portfolio purposes.
