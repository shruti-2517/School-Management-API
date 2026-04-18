# School Management API

A simple REST API built with **Node.js**, **Express**, and **MySQL** that allows you to add schools and retrieve them sorted by proximity to a given location.

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MySQL
- **Validation**: express-validator

---

## Project Structure

```
├── src/
│   ├── server.js              # Entry point
│   ├── app.js                 # Express app setup
│   ├── config/
│   │   ├── db.js              # MySQL connection pool
│   │   └── setupDatabase.js   # Creates tables and seeds sample data
│   ├── controllers/
│   │   └── schoolController.js
│   ├── middleware/
│   │   ├── validators.js      # Request validation rules
│   │   └── errorHandler.js    # 404 and global error handler
│   └── routes/
│       └── schoolRoutes.js
├── postman/                   # Postman collection and environments
├── .env.example               # Environment variable template
└── package.json
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your MySQL credentials:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=school_management
```

### 4. Set up the database

This creates the database, the `schools` table, and seeds 5 sample schools:

```bash
npm run setup-db
```

### 5. Start the server

```bash
# Development (auto-restarts on file changes)
npm run dev

# Production
npm start
```

The server will be running at `http://localhost:3000`.

---

## API Endpoints

### Health Check

```
GET /health
```

**Response**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

---

### Add a School

```
POST /addSchool
Content-Type: application/json
```

**Request Body**

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | ✅ | School name (max 255 chars) |
| `address` | string | ✅ | School address (max 500 chars) |
| `latitude` | float | ✅ | Between -90 and 90 |
| `longitude` | float | ✅ | Between -180 and 180 |

**Example Request**
```json
{
  "name": "Delhi Public School",
  "address": "Mathura Road, New Delhi, Delhi 110003",
  "latitude": 28.5450,
  "longitude": 77.2590
}
```

**Success Response** `201 Created`
```json
{
  "status": "success",
  "message": "School added successfully",
  "data": {
    "id": 6,
    "name": "Delhi Public School",
    "address": "Mathura Road, New Delhi, Delhi 110003",
    "latitude": 28.545,
    "longitude": 77.259
  }
}
```

**Validation Error Response** `422 Unprocessable Entity`
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    { "field": "name", "message": "Name is required" }
  ]
}
```

---

### List Schools by Proximity

```
GET /listSchools?latitude=<lat>&longitude=<lon>
```

Returns all schools sorted by distance (nearest first) from the provided coordinates.

**Query Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `latitude` | float | ✅ | Between -90 and 90 |
| `longitude` | float | ✅ | Between -180 and 180 |

**Example Request**
```
GET /listSchools?latitude=28.6139&longitude=77.2090
```

**Success Response** `200 OK`
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Delhi Public School",
      "address": "Mathura Road, New Delhi, Delhi 110003",
      "latitude": 28.545,
      "longitude": 77.259,
      "distance": 8.14
    },
    {
      "id": 2,
      "name": "The Doon School",
      "address": "Mall Road, Dehradun, Uttarakhand 248001",
      "latitude": 30.3204,
      "longitude": 78.0297,
      "distance": 234.57
    }
  ]
}
```

> Distance is in **kilometres**, calculated using the Haversine formula.

---

## Postman Collection

A ready-to-use Postman collection is included in the `postman/` folder with pre-built requests for all endpoints including validation error cases.

See [`postman/README.md`](postman/README.md) for import instructions.

---

## Error Handling

All errors follow a consistent format:

```json
{
  "status": "error",
  "message": "Description of what went wrong"
}
```

| Status Code | Meaning |
|---|---|
| `201` | School created successfully |
| `200` | Request successful |
| `422` | Validation failed (bad input) |
| `404` | Route not found |
| `500` | Internal server error |
