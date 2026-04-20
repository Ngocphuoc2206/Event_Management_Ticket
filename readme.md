# 🎟️ Event Management Ticket System

A fullstack event management and ticketing system built with:

- 🧩 Backend: Java Spring Boot
- 🌐 Frontend: Next.js
- 🐳 Docker & Docker Compose
- ☁️ AWS (EC2, RDS, S3)
- 🔄 CI/CD with GitHub Actions

---

# 📁 Project Structure

```
repo/
├── backend/ # Spring Boot API
├── frontend/ # Next.js UI
├── .github/ # CI/CD workflows
└── README.md
```

---

# 🌿 Branch Strategy

| Branch  | Purpose      |
| ------- | ------------ |
| develop | Staging/Test |
| main    | Production   |

---

# ⚙️ Backend Setup

## 📌 Requirements

- Java 21
- Maven
- MySQL (or AWS RDS)

---

## 🔧 Environment Variables (`backend/.env`)

```env
SPRING_DATASOURCE_URL=jdbc:mysql://<DB_HOST>:3306/event_ticket_db
SPRING_DATASOURCE_USERNAME=<DB_USERNAME>
SPRING_DATASOURCE_PASSWORD=<DB_PASSWORD>

JWT_SECRET=your_secret

AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=your_bucket
```

---

## 🚀 Run Backend with Docker

```bash
cd backend
docker compose up -d --build
```

---

# 🌐 Frontend Setup

## 📌 Requirements

- Node.js 20+

## 🔧 Environment Variables (frontend/.env.production)

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## 🚀 Run Frontend

````

```bash
cd frontend
npm install
npm run dev
````

Frontend runs at: `http://localhost:3000`

# ☁️ AWS Deployment (EC2)

## 🖥️ Server Structure

```
/home/ubuntu/apps/
├── backend
├── frontend
```

## 🚀 Run on EC2

```bash
cd ~/apps/backend
docker compose up -d --build
```

# 🛢️ Database (RDS)

- MySQL hosted on AWS RDS
- Ensure Security Group allows EC2 access on port 3306

# 🔐 AWS S3

## Used for:

- Event images
- Ticket QR codes

# 🔄 CI/CD Pipeline

GitHub Actions is configured to:

- Backend
- Build & test
- Docker build
- Deploy to EC2 (staging/prod)
- Frontend
- Lint & build
- Docker build
- Deploy to EC2

# 🐳 Docker Overview

## Backend

- Spring Boot container
- Connects to RDS

## Frontend (optional)

- Next.js container

🧪 Testing

Use Postman to test API:

```json
http://<EC2_IP>:8080/api/...
```
