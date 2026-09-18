# Job Portal

A full-stack role-based job portal built with the MERN stack. The platform provides separate workflows for Candidates, Recruiters, and Admins, along with an AI assistant and real-time candidate-recruiter chat.

## Live Demo

- **Frontend:** https://job-portal-umber-alpha-76.vercel.app/
- **Backend:** https://job-portal-backend-mk2d.onrender.com/

---

## Features

### Candidate

- Register and login
- Browse available jobs
- Search jobs
- Filter jobs
- View detailed job information
- Apply for jobs
- Upload resume
- Track application status
- View application details
- Withdraw applications
- Message recruiters in real time
- Use the AI assistant to search jobs and access personal information

### Recruiter

- Register and login
- Create job postings
- View own job postings
- Edit job postings
- Delete job postings
- View applicants for jobs
- Update application status
- View recruiter statistics
- Message candidates in real time
- Use the AI assistant for recruiter-related information

### Admin

- View all users
- View all jobs
- View all applications
- View platform statistics
- Access admin-protected functionality

### AI Assistant

The application includes an AI-powered assistant available to authenticated users.

The assistant supports role-specific tools such as:

- Search jobs
- Get job details
- View personal applications
- View profile information
- View recruiter jobs
- View applicants
- View recruiter statistics
- View platform statistics
- View users
- View all jobs
- View all applications

AI tools are restricted based on the authenticated user's role.

### Real-Time Chat

Candidate-recruiter communication is implemented using Socket.IO.

- Candidates can start conversations with recruiters
- Recruiters can participate in existing conversations
- Real-time message delivery
- Messages are stored in MongoDB
- Previous messages can be loaded
- Conversation access is restricted to participants
- Socket connections are authenticated using JWT

---

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Socket.IO Client
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Socket.IO
- Multer
- ImageKit
- Groq SDK

### Deployment

- Vercel - Frontend
- Render - Backend
- MongoDB Atlas - Database

---

## Application Architecture

```text
                    ┌──────────────────────┐
                    │       Vercel         │
                    │   React + Vite       │
                    └──────────┬───────────┘
                               │
                     REST API / Socket.IO
                               │
                               ▼
                    ┌──────────────────────┐
                    │       Render         │
                    │   Node + Express     │
                    │      Socket.IO       │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    MongoDB Atlas     │
                    │      Database        │
                    └──────────────────────┘
```

---

## Authentication

The application uses access and refresh token authentication.

### Access Token

The access token is sent with protected API requests:

```text
Client
   ↓
Authorization: Bearer <access-token>
   ↓
Authentication Middleware
   ↓
Authorization Middleware
   ↓
Controller
```

### Refresh Token

The refresh token is stored in an HTTP-only cookie and is used to generate a new access token when the access token expires.

Production cookies use:

- `httpOnly`
- `secure`
- `sameSite: "none"`

Axios requests use credentials so the refresh token cookie can be sent with requests.

---

## Role-Based Access Control

The application separates authentication and authorization.

### Authentication

Determines:

> Who is the user?

`authUser`

### Authorization

Determines:

> Is the user allowed to perform this action?

`authorizeRoles("candidate")`
`authorizeRoles("recruiter")`
`authorizeRoles("admin")`

The request flow is:

```text
Request
   ↓
authUser
   ↓
authorizeRoles
   ↓
Controller
```

Supported roles:

- candidate
- recruiter
- admin

---

## Job Workflow

```text
Recruiter
   ↓
Create Job
   ↓
Job Listing
   ↓
Candidate Views Job
   ↓
Candidate Applies
   ↓
Recruiter Views Applicant
   ↓
Recruiter Updates Application Status
   ↓
Candidate Tracks Application
```

Application statuses include:

- applied
- shortlisted
- interview
- selected
- rejected
- withdrawn

---

## Real-Time Chat

Socket.IO is used for real-time candidate-recruiter communication.

```text
Candidate / Recruiter
        │
        ▼
   Socket.IO Client
        │
        ▼
    Socket Server
        │
        ├── JWT Authentication
        │
        ├── Conversation Authorization
        │
        ▼
      MongoDB
        │
        ▼
 Conversation Room
        │
        ▼
 Other Participant
```

Each conversation is associated with:

- Candidate
- Recruiter
- Job

Only candidates can create new conversations. Both candidates and recruiters can participate in an existing conversation.

Messages are persisted in MongoDB and delivered in real time through Socket.IO.

---

## AI Assistant Architecture

The AI assistant uses the Groq API with tool calling.

The AI model does not directly access the database. Instead, it can request specific backend tools.

```text
User
  ↓
AI Assistant
  ↓
Groq
  ↓
Tool Call
  ↓
Backend
  ↓
MongoDB
  ↓
Tool Result
  ↓
Groq
  ↓
AI Response
```

User identity is determined by the authenticated backend request rather than being provided by the AI model.

For example, candidate-specific tools use:

`req.user.id`

to determine which applications or profile information can be accessed.

---

## File Uploads

Resume uploads are handled using Multer and stored through ImageKit.

```text
Candidate
   ↓
Resume Upload
   ↓
Multer
   ↓
Backend
   ↓
ImageKit
   ↓
Resume URL
   ↓
MongoDB
```

The resulting resume URL is associated with the candidate and their applications.

---

## Project Structure

```text
job_portal/
│
├── backend/
│   ├── src/
│   │   ├── app/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── ...
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── protected/
│   │   ├── socket/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   ├── vercel.json
│   └── .env
│
└── README.md
```

---

## Environment Variables

### Backend

Create a `.env` file inside the `backend` directory:

```env
MONGODB_URI=
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
GROQ_API_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_URL_ENDPOINT=
IMAGEKIT_ID=
FRONTEND_URL=
```

### Frontend

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_URL=
VITE_SOCKET_URL=
```

Environment files containing secrets should not be committed to the repository.

---

## Running Locally

### 1. Clone the Repository

```bash
git clone https://github.com/Mustansir-06/job-portal.git
cd job-portal
```

### 2. Start the Backend

```bash
cd backend
npm install
npm start
```

The backend runs locally on:

`http://localhost:3000`

### 3. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs locally on:

`http://localhost:5173`

---

## Local Environment Configuration

### Backend

```env
MONGODB_URI=mongodb://localhost:27017/job_portal
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
GROQ_API_KEY=your_groq_api_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url
IMAGEKIT_ID=your_imagekit_id
FRONTEND_URL=http://localhost:5173
```

### Frontend

```env
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

---

## API Overview

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
```

### Jobs

```text
GET    /api/jobs
GET    /api/jobs/:id
GET    /api/jobs/my
POST   /api/jobs
PATCH  /api/jobs/:id
DELETE /api/jobs/:id
```

### Applications

```text
GET   /api/applications/my
GET   /api/applications/:id
GET   /api/applications/check/:jobId
PATCH /api/applications/:id/withdraw
GET   /api/applications/job/:jobId
PATCH /api/applications/:id/status
```

### Conversations

```text
POST /api/conversations/:jobId
GET  /api/conversations
GET  /api/conversations/:id
```

### Messages

```text
GET /api/messages/:conversationId
```

### AI Assistant

```text
POST /api/ai/chat
```

### Admin

```text
GET /api/admin/users
GET /api/admin/jobs
GET /api/admin/applications
```

---

## Security

The application implements:

- JWT-based authentication
- HTTP-only refresh-token cookies
- Password hashing using bcrypt
- Role-based authorization
- Resource ownership checks
- Protected API routes
- Conversation participant validation
- Authenticated Socket.IO connections
- Environment variables for sensitive credentials
- Server-side identity validation for AI tools
- Protected role-specific AI functionality

---

## Deployment

The project is deployed using:

```text
Frontend  → Vercel
Backend   → Render
Database  → MongoDB Atlas
```

The frontend uses environment variables for the deployed API and Socket.IO URLs.

The backend uses environment variables for the frontend origin, database connection, authentication secrets, AI API key, and ImageKit configuration.

Production communication uses HTTPS.

---

## Future Improvements

Possible future improvements include:

- Typing indicators
- Read receipts
- Online/offline presence
- Email notifications
- Advanced recruiter analytics
- Job recommendations
- Application notifications
- Improved admin management

---

## Author

**Mustansir Dabhiya**

GitHub: https://github.com/Mustansir-06
