# barytech_assessment_backend# Expense Tracker Backend (MERN Stack)

This is the backend API server for the **Expense Tracker App**, built with **Node.js**, **Express**, and **MongoDB**.  
It handles authentication, role-based access, budgeting, transaction tracking, and data access for parents and children.

---

## 🚀 Features

- JWT-based authentication
- Role-based access: `parent` and `child`
- Budget management (general + per-child)
- Transaction tracking
- MongoDB data storage
- Built to work with a local Dockerized MongoDB instance

---

## 🧑‍💻 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **JWT (jsonwebtoken)**
- **Docker + Docker Compose** (for MongoDB)

---

## 🛠️ Setup Instructions

### 📦 Prerequisites

- [Node.js](https://nodejs.org/) installed
- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed

---

### 🧱 Step 1: Setup MongoDB using Docker

1. Create a folder anywhere on your system:
   ```bash
   mkdir expense-tracker-env && cd expense-tracker-env
   ```
2. Create a file named docker-compose.yml and paste the following content:

```version: '3.8'

services:
  mongo:
    image: mongo:6.0
    container_name: expense_mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example

volumes:
  mongo-data:
```

3.Start the MongoDB container by running:

```
docker-compose up -d
```

### 🧱 Step 2: Clone and Set Up Backend

1. Clone the backend repository inside the same folder:

```
git clone https://github.com/Gyash2112/barytech_assessment_backend.git
cd expense-tracker-backend
```

2. Create a .env file and add the following content:

```
PORT=5000
MONGO_URI=mongodb://root:example@localhost:27017/expense_tracker?authSource=admin
JWT_SECRET=supersecretkey
```

3. Install Dependencies

```
npm install
```

4. Start the backend server in development mode:

```
npm run dev
```
