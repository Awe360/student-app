# 🎓 Student App — CRUD REST API

A full CRUD REST API for managing students built with **Node.js** and **Express.js**. Uses an **in-memory array** as the database (no external DB required). Ships with **Docker** support.

---

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start server (production)
npm start

# Start with auto-reload (development)
npm run dev
```

### Docker

```bash
# Build and run with Docker Compose
docker-compose up --build

# Stop containers
docker-compose down
```

Server will be available at: `http://localhost:3000`

---

## 📋 API Endpoints

Base URL: `http://localhost:3000/api/students`

| Method | Endpoint              | Description         |
|--------|-----------------------|---------------------|
| GET    | `/api/students`       | Get all students    |
| GET    | `/api/students/:id`   | Get student by ID   |
| POST   | `/api/students`       | Create new student  |
| PUT    | `/api/students/:id`   | Update student      |
| DELETE | `/api/students/:id`   | Delete student      |

---

## 📦 Request & Response Examples

### GET /api/students
```json
{
  "success": true,
  "count": 5,
  "data": [
    { "id": 1, "name": "Alice Johnson", "age": 20, "grade": "A", "email": "alice.johnson@university.edu" },
    ...
  ]
}
```

### GET /api/students/:id
```json
{
  "success": true,
  "data": { "id": 1, "name": "Alice Johnson", "age": 20, "grade": "A", "email": "alice.johnson@university.edu" }
}
```

### POST /api/students
**Request Body:**
```json
{
  "name": "John Doe",
  "age": 21,
  "grade": "B",
  "email": "john.doe@university.edu"
}
```
**Response (201):**
```json
{
  "success": true,
  "message": "Student created successfully",
  "data": { "id": 6, "name": "John Doe", "age": 21, "grade": "B", "email": "john.doe@university.edu" }
}
```

### PUT /api/students/:id
**Request Body:**
```json
{
  "name": "John Doe Updated",
  "age": 22,
  "grade": "A",
  "email": "john.updated@university.edu"
}
```
**Response (200):**
```json
{
  "success": true,
  "message": "Student updated successfully",
  "data": { ... }
}
```

### DELETE /api/students/:id
**Response (200):**
```json
{
  "success": true,
  "message": "Student with id 1 deleted successfully",
  "data": { ... }
}
```

---

## 🗂️ Project Structure

```
student-app/
├── src/
│   ├── controllers/
│   │   └── student.controller.js   # CRUD logic
│   ├── models/
│   │   └── student.model.js        # Student factory
│   ├── routes/
│   │   └── student.routes.js       # Express router
│   ├── db.js                       # In-memory database
│   ├── app.js                      # Express app setup
│   └── server.js                   # Entry point
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

---

## 🌱 Sample Initial Data

The app starts with 5 pre-loaded students:

| ID | Name            | Age | Grade | Email                            |
|----|-----------------|-----|-------|----------------------------------|
| 1  | Alice Johnson   | 20  | A     | alice.johnson@university.edu     |
| 2  | Bob Smith       | 22  | B+    | bob.smith@university.edu         |
| 3  | Carol Williams  | 21  | A-    | carol.williams@university.edu    |
| 4  | David Brown     | 23  | C+    | david.brown@university.edu       |
| 5  | Eva Martinez    | 19  | A+    | eva.martinez@university.edu      |

> ⚠️ Data is stored in memory — it resets every time the server restarts.

---

## ⚙️ Environment Variables

| Variable | Default | Description   |
|----------|---------|---------------|
| `PORT`   | `3000`  | Server port   |
