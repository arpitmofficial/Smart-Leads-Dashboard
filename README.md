# 🚀 Smart Leads Dashboard

A full-stack **Lead Management Dashboard** built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring TypeScript, TailwindCSS, JWT authentication, role-based access control, and Docker deployment.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

---

## ✨ Features

### 🔐 Authentication System
- JWT-based authentication with secure token handling
- User registration with role selection (Admin / Sales User)
- Protected routes with auth middleware
- Password hashing with bcrypt (12 salt rounds)

### 👥 Lead Management (CRUD)
- Create, Read, Update, Delete leads
- Lead fields: Name, Email, Status, Source, Created At
- Status options: New, Contacted, Qualified, Lost
- Source options: Website, Instagram, Referral

### 🔍 Advanced Filtering & Search
- Filter by Status
- Filter by Source
- Search by Name or Email (with **debounced search** - 400ms)
- Sort by Latest / Oldest
- **All filters work together simultaneously**

### 📄 Backend Pagination
- 10 records per page (configurable)
- Proper `skip` and `limit` implementation
- Full pagination metadata in API responses

### 🎨 Frontend UI
- **Dark Mode** with system preference detection
- Responsive design (mobile, tablet, desktop)
- Reusable component architecture
- Loading states with skeleton animations
- Empty states with contextual messages
- Error states with retry functionality
- Form validation (client + server side)
- Smooth micro-animations

### 📊 Dashboard Analytics
- Total leads, status breakdown, source distribution
- Visual progress bars for source distribution
- Recent leads quick view

### 📥 CSV Export
- Export leads with current filters applied
- Automatic file download

### 🛡️ Role-Based Access Control
- **Admin**: Full access to all leads
- **Sales User**: Access only to their own leads

### 🐳 Docker Setup
- Multi-container setup with Docker Compose
- MongoDB, Backend API, Frontend services
- Production-ready Nginx configuration

---

## 🏗️ Project Structure

```
Smart-Leads-Dashboard/
├── server/                          # Backend
│   ├── src/
│   │   ├── config/                  # DB connection, environment config
│   │   ├── controllers/             # Route handlers
│   │   ├── interfaces/              # TypeScript interfaces & enums
│   │   ├── middleware/               # Auth, RBAC, error handler, validation
│   │   ├── models/                  # Mongoose schemas
│   │   ├── routes/                  # API route definitions
│   │   ├── utils/                   # ApiError, ApiResponse utilities
│   │   ├── validators/              # Zod validation schemas
│   │   └── index.ts                 # Server entry point
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── client/                          # Frontend
│   ├── src/
│   │   ├── api/                     # Axios instance & API services
│   │   ├── components/
│   │   │   ├── auth/                # ProtectedRoute
│   │   │   ├── common/              # Badge, EmptyState, ErrorState, LoadingSpinner, Modal, Pagination
│   │   │   ├── layout/              # DashboardLayout, Header, Sidebar
│   │   │   └── leads/               # LeadDetail, LeadFilters, LeadForm, LeadTable
│   │   ├── context/                 # AuthContext, ThemeContext
│   │   ├── hooks/                   # useDebounce
│   │   ├── pages/                   # DashboardPage, LeadsPage, LoginPage, RegisterPage
│   │   ├── types/                   # TypeScript types & enums
│   │   ├── App.tsx                  # Root component with routing
│   │   ├── main.tsx                 # Entry point
│   │   └── index.css                # TailwindCSS & custom styles
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.ts
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** >= 18.x
- **MongoDB** >= 6.x (local or Atlas)
- **npm** >= 9.x

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/Smart-Leads-Dashboard.git
cd Smart-Leads-Dashboard
```

### 2. Setup Environment Variables

```bash
# Copy the example env file
cp .env.example server/.env

# Edit the .env file with your settings
# Key variables:
#   MONGODB_URI - Your MongoDB connection string
#   JWT_SECRET  - A strong secret key for JWT
```

### 3. Install Dependencies

```bash
# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### 4. Start Development Servers

```bash
# Terminal 1 - Start Backend (port 5000)
cd server && npm run dev

# Terminal 2 - Start Frontend (port 5173)
cd client && npm run dev
```

### 5. Open in Browser

Visit `http://localhost:5173` and register a new account to get started!

---

## 🐳 Docker Setup

### Run with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Services:
#   Frontend: http://localhost:3000
#   Backend:  http://localhost:5000
#   MongoDB:  localhost:27017
```

### Stop Services

```bash
docker-compose down

# Remove volumes too:
docker-compose down -v
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | Login user | ❌ |
| GET | `/auth/me` | Get current user | ✅ |

### Leads

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/leads` | List leads (paginated, filterable) | ✅ |
| GET | `/leads/:id` | Get single lead | ✅ |
| POST | `/leads` | Create new lead | ✅ |
| PUT | `/leads/:id` | Update lead | ✅ |
| DELETE | `/leads/:id` | Delete lead | ✅ |
| GET | `/leads/export/csv` | Export leads as CSV | ✅ |
| GET | `/leads/stats/overview` | Dashboard statistics | ✅ |

### Query Parameters (GET /leads)

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Records per page (default: 10) |
| `status` | string | Filter by status (New, Contacted, Qualified, Lost) |
| `source` | string | Filter by source (Website, Instagram, Referral) |
| `search` | string | Search by name or email |
| `sortBy` | string | Sort order (latest, oldest) |

### Response Format

```json
{
  "success": true,
  "message": "Leads fetched successfully",
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalRecords": 47,
    "limit": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Please provide a valid email" }
  ]
}
```

---

## 🛡️ Role-Based Access Control

| Feature | Admin | Sales User |
|---------|-------|------------|
| View all leads | ✅ | ❌ (own only) |
| Create leads | ✅ | ✅ |
| Edit any lead | ✅ | ❌ (own only) |
| Delete any lead | ✅ | ❌ (own only) |
| Dashboard stats | ✅ (all) | ✅ (own) |
| CSV Export | ✅ (all) | ✅ (own) |

---

## 🧪 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, TypeScript, TailwindCSS v4, Vite |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Validation | Zod |
| Icons | Lucide React |
| Notifications | React Hot Toast |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Container | Docker, Docker Compose |

---

## 📝 License

This project is built as part of a MERN stack internship assignment.

---

Built with ❤️ using the MERN Stack + TypeScript
