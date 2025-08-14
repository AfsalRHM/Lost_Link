# <img src="https://github.com/AfsalRHM/Lost_Link/blob/main/frontend/public/Logo-rounded.png" width="40" style="vertical-align: middle; margin-bottom: 50px;"> LostLink - Lost & Found Platform

Lost Link is a full-stack, real-time Lost & Found platform that connects users, admins, and the community to help locate missing items quickly and efficiently.
It centralises lost item reports, enables instant communication, and provides a transparent tracking system.

---

## 💡 Core Problem It Solves

- Finding lost items is often slow, uncoordinated, and scattered across multiple channels. Lost Link solves this by:
- Providing a centralised platform for lost and found requests
- Enabling real-time chat between users and admins
- Offering a tier-based engagement system to encourage community participation

## 🏗 Architecture Diagram
<img src="https://github.com/AfsalRHM/Lost_Link/blob/main/frontend/public/System-Design.png" >

## 🛠 Tech Stack

**Languages & Frameworks**  
- **TypeScript**, **JavaScript**  
- **React**, **Vite**, **Framer Motion**  
- **Node.js**, **Express**  

**Databases & Storage**  
- **MongoDB** (per microservice, hosted on **MongoDB Atlas**)  
- **Cloudinary** (file/image uploads)  

**Messaging & Communication**  
- **RabbitMQ** (message broker)  
- **Socket.IO** (real-time communication)  
- **REST (HTTP)** & **gRPC** (service-to-service communication)  

**Infrastructure & Deployment**  
- **Docker** (containerization)  
- **Kubernetes** (orchestration)  
- **Google Cloud Platform (GCP)** (hosting)  

**Development & CI/CD**  
- **GitHub** (version control)  
- **GitHub Actions** (automation & deployments)  

## 📋 Services Overview

| Service Name | Responsibility | Tech Stack | Communication Methods | Default Port |
|--------------|---------------|------------|-----------------------|--------------|
| **API Gateway** | Entry point for all client requests, routing to appropriate microservices | Node.js, Express, TypeScript | REST (HTTP) | `8000` |
| **Auth Service** | Handles user authentication, registration, and token management | Node.js, Express, TypeScript, MongoDB | REST (via Gateway), gRPC (to other services) | `4000` |
| **User Service** | Manages user profiles, settings, and point/tier system | Node.js, Express, TypeScript, MongoDB, Cloudinary | gRPC (with other services), RabbitMQ (events) | `4001` |
| **Admin Service** | Admin-side management of requests, users, and reports | Node.js, Express, TypeScript, MongoDB | gRPC (with other services), RabbitMQ | `4002` |
| **Chat Service** | Real-time one-to-one chat and video call between users and admin | Node.js, Express, TypeScript, MongoDB, Socket.IO, ZegoCloud | WebSockets, gRPC (with User/Admin services) | `4003` |
| **Notification Service** | Sends real-time notifications to users/admin | Node.js, Express, TypeScript, MongoDB, Socket.IO | RabbitMQ (event-driven), gRPC (with User/Admin services) | `4004` |
| **Request Service** | Handles lost/found item requests, status updates | Node.js, Express, TypeScript, MongoDB | gRPC (with User service), RabbitMQ | `4005` |

## 📂 Folder Structure

This project follows a **monorepo** layout containing multiple backend microservices and a frontend application.

```bash
Lost_Link/
│
├── backend/                      # Backend microservices
│   ├── gateway-service/           # API Gateway - routes requests to respective services
│   │   ├── src/
│   │   │   ├── controllers/       # Request handlers
│   │   │   ├── routes/            # API routes
│   │   │   ├── middlewares/       # Request validation/auth checks
│   │   │   ├── utils/             # Helper functions
│   │   │   ├── config/            # Environment configs
│   │   │   └── app.ts             # Main app entry
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── auth-service/              # Authentication & Authorization service
│   ├── user-service/              # User profile & tier system
│   ├── admin-service/             # Admin panel & management APIs
│   ├── chat-service/              # Real-time chat between admin & users
│   ├── notification-service/      # Push & email notifications
│   ├── request-service/           # Lost/Found request handling
│   │
│   ├── docker-compose.yml         # Local dev orchestration
│   └── package.json
│
├── frontend/                      # React frontend application
│   ├── public/                    # Static assets (images, icons, manifest)
│   ├── src/
│   │   ├── assets/                 # Images, fonts, styles
│   │   ├── components/             # Reusable UI components
│   │   ├── pages/                  # Page-level components
│   │   ├── layouts/                # Shared layouts (navbar, footer, sidebars)
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── services/                # API request logic
│   │   ├── store/                   # Redux state management
│   │   ├── utils/                   # Helper functions
│   │   ├── App.tsx                  # Root component
│   │   └── main.tsx                 # Entry point
│   ├── package.json
│   └── vite.config.ts               # Vite configuration
│
├── .env.example                   # Example environment variables
└── README.md                      # Project overview
```

## 🚀 Getting Started (Local Development)

Follow the steps below to set up and run the LostLink system locally for development.

---

### 📋 Prerequisites

Make sure you have the following installed:

- **[Node.js](https://nodejs.org/)** (v18 or higher recommended)
- **[npm](https://www.npmjs.com/)** or **[yarn](https://yarnpkg.com/)**
- **[Docker](https://www.docker.com/)** and **[Docker Compose](https://docs.docker.com/compose/)**
- **[Git](https://git-scm.com/)**
- MongoDB (if not using Docker) or a cloud DB like **MongoDB Atlas**
- **RabbitMQ** (if not using Docker)

---

### 🛠 Running Locally with Docker Compose

1. **Clone the Repository**
   ```bash
   git clone https://github.com/afsalRHM/Lost_Link.git
   cd Lost_Link
   ```
2. **Installing Dependencies**

  ***Backend Services***
  Each microservice has its own `package.json`. Install dependencies for all services:
  
  ```bash
  cd backend
  
  cd ../gateway && npm install && npm start
  cd ../service/admin-service && npm install && npm start
  cd ../service/auth-service && npm install && npm start
  cd ../service/chat-service && npm install && npm start
  cd ../service/notification-service && npm install && npm start
  cd ../service/request-service && npm install && npm start
  cd ../service/user-service && npm install && npm start
  ```
  
  ### Frontend
  ```bash
  cd frontend
  
  npm install
  npm run dev
  ```

---

## ⚙️ Environment Variables
Each microservice has its own `.env` file.

### Common Variables
- `NODE_ENV` — development or production
- `JWT_SECRET` — secret key for JWT tokens
- `MONGO_URI` — MongoDB connection string
- `RABBITMQ_URL` — RabbitMQ broker URL
- `CLOUDINARY_URL` — Cloudinary API URL

---

## 🔄 Service Communication Flow
- **API Gateway** → Routes HTTP requests to backend microservices.
- **Auth Service** ↔ **User Service** — gRPC calls for user profile data.
- **Request Service** ↔ **User Service** — gRPC calls for point/tier system updates.
- **Chat Service** ↔ **User/Admin Services** — gRPC for user data, WebSockets for messages.
- **Notification Service** — Listens to RabbitMQ events from other services to send real-time notifications.

---

## 🛡️ Security Notes

- Always secure your `.env` and use `.gitignore` to prevent credential leaks.

---

## ❓ Facing Issues?

If you face any problems during setup or usage, raise an issue in the [GitHub Issues](https://github.com/AfsalRHM/Lost_Link/issues) tab.

---

## 🤝 Author

- **Afsal Rahman M**
- [LinkedIn](https://www.linkedin.com/in/afsalrahmanm/)
- [GitHub](https://github.com/AfsalRHM)
