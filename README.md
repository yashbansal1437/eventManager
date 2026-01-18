# Event Manager API

A **production-grade Event Management REST API** built with **Node.js, Express, and MongoDB**.  
It supports **user & admin authentication**, **role-based access control (RBAC)**, **event lifecycle management**, **event registrations**, **rate limiting**, **centralized error handling**, and **email notifications**.

---

## Features

- JWT-based Authentication (Users & Admins)
- Role-Based Access Control (Admin / Owner / User)
- Event CRUD (Admin & Owner scoped)
- Event Registration & Deregistration
- Capacity & Time-based Registration Constraints
- Centralized API Response & Error Handling
- MongoDB with Mongoose ODM
- Secure Password Hashing (bcrypt)
- Rate Limiting for API Protection
- Email Notifications via SMTP
- Extensive Unit & Integration Tests

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT
- **Security:** bcrypt, rate-limiting
- **Email:** Nodemailer
- **Testing:** Jest + Supertest
- **Logging:** Custom structured logger

---

## Project Structure

```txt
src/
├── app.js
├── server.js
├── controllers/
├── database/
├── middleware/
├── models/
├── routes/
├── utils/
└── tests/
```

---

## Environment Variables

Create a `.env` file at the root:

```env
PORT=3000
DB_URI=mongodb://localhost:27017/eventManager

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=15m

ADMIN_SECRET=super_admin_secret

SALT_ROUNDS=10
LOG_LEVEL=INFO

SMTP_HOST=smtp.example.com
SMTP_USER=your_email
SMTP_PASS=your_password
SMTP_FROM="Event Manager <noreply@example.com>"
```

---

## Installation

```bash
git clone <repository-url>
cd event-manager-api
npm install
```

---

## Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The API will be available at:

```
http://localhost:3000
```

---

## API Overview

### Health Check
```http
GET /
```

---

### Authentication & Users

| Method | Endpoint | Description |
|------|---------|-------------|
| POST | `/api/users/register` | Register user |
| POST | `/api/users/register-admin` | Register admin |
| POST | `/api/users/login` | Login |
| GET | `/api/users/profile` | Get logged-in user |

---

### Events

| Method | Endpoint | Access |
|------|---------|--------|
| POST | `/api/events` | Admin |
| GET | `/api/events` | Authenticated |
| GET | `/api/events/:id` | Authenticated |
| PUT | `/api/events/:id` | Admin / Owner |
| DELETE | `/api/events/:id` | Admin / Owner |

---

### Event Registration

| Method | Endpoint | Description |
|------|---------|-------------|
| POST | `/api/events/:id/register` | Register for event |
| DELETE | `/api/events/:id/register` | Deregister from event |

---

## Authorization Model

- **Admin**
  - Create, update, delete any event
- **Owner**
  - Modify only events they created
- **User**
  - View events
  - Register / deregister for events

---

## Response Format

All successful responses follow a consistent structure:

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

---

## Error Handling

- Centralized error middleware
- Custom `ApiError` class
- Handles:
  - Validation errors
  - Duplicate keys
  - Auth & permission errors
  - Server errors

---

## Rate Limiting

- 100 requests per IP per 15 minutes
- Applied globally on `/api/*`

---

## Security Practices

- Password hashing with bcrypt
- JWT expiration handling
- Email normalization
- Input validation
- Role-based access checks

---

## Testing

Run all tests:

```bash
npm test
```

Test coverage includes:
- Controllers
- Routes
- Middleware
- Models
- Utilities

---

## Production Readiness Checklist

- ✅ Centralized logging
- ✅ Rate limiting
- ✅ Secure password handling
- ✅ Role-based authorization
- ✅ Clean architecture
- ✅ Extensive test coverage

---

## License

MIT License

---

## Author

**Event Manager API**  
Built with production-grade backend engineering principles.
