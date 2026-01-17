# Pingnotes - Full Project Documentation

## 🚀 Try It Out

**[Visit Pingnotes](https://pingnotes.vercel.app)** to experience the app live!

## Overview

PingNotes is a cloud-based notes organizer built using the MERN stack. It allows teachers to send notes (PDFs, images, files) directly to students. Files are uploaded to Google Drive and shared via signed URLs.

---

## Features

- User roles: Admin, Teacher, Student
- JWT Authentication (Login / Protected Routes)
- Subjects with nested Topics
- File uploads stored in Google Drive (private by default)
- REST API with Express.js

---

## Folder Structure

```
PingNotes/
├── controllers/
│   ├── admin/
│   ├── user/
│   ├── teacher/
│   ├── subject/
│   ├── topic/
│   └── file/
├── models/
│   ├── admin.model.js
│   ├── user.model.js
│   ├── teacher.model.js
│   ├── subject.model.js
│   ├── topic.model.js
│   └── file.model.js
├── routes/
│   ├── admin.routes.js
│   ├── user.routes.js
│   ├── teacher.routes.js
│   ├── subject.routes.js
│   ├── topic.routes.js
│   └── file.routes.js
├── middleware/
│   └── auth.middleware.js
├── services/
│   └── googleDrive.service.js
├── config/
│   └── db.js
│   └── drive-service-account.json
├── app.js
└── seed.js
```

---

## API Routes

### Admin Routes

| Method | Endpoint         | Description       |
| ------ | ---------------- | ----------------- |
| POST   | /api/admin/login | Login as admin    |
| GET    | /api/admin/      | Get all admins    |
| GET    | /api/admin/:id   | Get admin by ID   |
| POST   | /api/admin/      | Create new admin  |
| PUT    | /api/admin/:id   | Update admin      |
| DELETE | /api/admin/:id   | Soft delete admin |

### File Routes

| Method | Endpoint         | Description            |
| ------ | ---------------- | ---------------------- |
| POST   | /api/file/upload | Upload file to Drive   |
| GET    | /api/file/       | List all files         |
| GET    | /api/file/:id    | Get file by ID         |
| DELETE | /api/file/:id    | Delete file from Drive |

---

## Google Drive Integration

- Service account configured at `config/drive-service-account.json`
- All files private by default
- Temporary signed URLs generated for secure access

---

## Tech Stack

- MongoDB Atlas
- Express.js
- React.js (frontend in progress)
- Node.js
- Google Drive API
