# JobPortal - Quick Visual Reference

## 🎯 ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────┐
│                    JOBPORTAL APPLICATION                     │
└─────────────────────────────────────────────────────────────┘

        ┌──────────────────────────────────────────────────┐
        │         FRONTEND (React + Vite + Redux)          │
        │                                                  │
        │  Pages: Home, Login, Jobs, Profile, Admin       │
        │  State: authSlice, jobSlice, companySlice       │
        │  Routing: 11+ routes with role protection       │
        └────────────────┬─────────────────────────────────┘
                         │ HTTP Requests (REST API)
                         │
        ┌────────────────▼──────────────────────────────────┐
        │        BACKEND (Express.js + Node.js)             │
        │                                                  │
        │  Routes:                                         │
        │  ├── /api/v1/user (auth, profile)                │
        │  ├── /api/v1/company (CRUD)                      │
        │  ├── /api/v1/job (CRUD)                          │
        │  └── /api/v1/application (apply, status)         │
        │                                                  │
        │  Middleware:                                     │
        │  ├── isAuthenticated (JWT check)                 │
        │  ├── multer (file upload)                        │
        │  └── CORS (security)                             │
        └────────────────┬──────────────────────────────────┘
                         │ Mongoose Queries
                         │
        ┌────────────────▼──────────────────────────────────┐
        │           DATABASE (MongoDB)                      │
        │                                                  │
        │  Collections:                                    │
        │  ├── users (students + recruiters)               │
        │  ├── companies                                   │
        │  ├── jobs                                        │
        │  └── applications                                │
        └──────────────────────────────────────────────────┘
```

---

## 🔄 USER FLOW DIAGRAM

```
NEW USER → SIGNUP FORM → Fill Details → Choose Role (Student/Recruiter)
    ↓
    └→ POST /api/v1/user/register
       ├→ Backend: Hash Password + Save to DB
       ├→ Return JWT Token (cookie)
       └→ Frontend: Store in Redux + Redirect

RETURNING USER → LOGIN FORM → Enter Email + Password
    ↓
    └→ POST /api/v1/user/login
       ├→ Backend: Verify Password + Create JWT
       ├→ Return JWT Token (cookie)
       └→ Frontend: Redirect to Dashboard
```

---

## 👨‍💼 STUDENT WORKFLOW

```
┌────────────────────────────────┐
│    STUDENT DASHBOARD           │
└────────────────────────────────┘
         ↓
    BROWSE JOBS (/jobs)
    ├─→ View all available jobs
    ├─→ Search by keywords
    ├─→ Filter by location/salary
    └─→ View job details (/description/:id)
         ↓
    APPLY FOR JOB
    └─→ POST /api/v1/application/apply/:id
        ├─→ Backend: Create Application record
        ├─→ Link to Job + Applicant
        └─→ Frontend: Show "Applied" badge
         ↓
    CHECK APPLIED JOBS
    └─→ GET /api/v1/application/get
        └─→ View status: Pending/Accepted/Rejected
         ↓
    MANAGE PROFILE (/profile)
    ├─→ Update bio, skills
    ├─→ Upload resume
    ├─→ Upload profile photo
    └─→ PUT /api/v1/user/profile/update
```

---

## 💼 RECRUITER WORKFLOW

```
┌────────────────────────────────┐
│   RECRUITER DASHBOARD          │
└────────────────────────────────┘
         ↓
    CREATE COMPANY (/admin/companies/create)
    ├─→ POST /api/v1/company/register
    ├─→ Set company name, logo, website
    └─→ Backend: Create Company + Link to User
         ↓
    SETUP COMPANY (/admin/companies/:id)
    ├─→ Edit company details
    ├─→ Upload company logo
    └─→ PUT /api/v1/company/update/:id
         ↓
    POST JOB (/admin/jobs/create)
    ├─→ POST /api/v1/job/post
    ├─→ Set title, salary, location, requirements
    └─→ Backend: Link Job to Company + Recruiter
         ↓
    MANAGE JOBS (/admin/jobs)
    ├─→ GET /api/v1/job/getadminjobs
    ├─→ View all posted jobs
    └─→ Edit or delete jobs
         ↓
    VIEW APPLICANTS (/admin/jobs/:id/applicants)
    ├─→ GET /api/v1/application/applicants/:id
    ├─→ See all applications for job
    └─→ View resume + profile
         ↓
    ACCEPT/REJECT (/api/v1/application/status/:id/update)
    └─→ Change status: accepted/rejected
        └─→ Backend: Update Application + Notify Student
```

---

## 🗄️ DATABASE STRUCTURE

```
USER Collection:
┌─────────────────────────────────┐
│ _id (ObjectId)                  │
│ fullName (String)               │
│ email (String, unique)          │
│ phoneNumber (Number, unique)    │
│ password (Hashed)               │
│ role (Enum: student/recruiter)  │
│ profile:                        │
│   ├─ bio                        │
│   ├─ skills (Array)             │
│   ├─ resume (URL)               │
│   ├─ company (Ref → Company)    │
│   └─ profilePhoto (URL)         │
│ createdAt / updatedAt           │
└─────────────────────────────────┘
            ↓ (Relationship)
COMPANY Collection:
┌─────────────────────────────────┐
│ _id (ObjectId)                  │
│ name (String)                   │
│ description                     │
│ website (URL)                   │
│ logo (URL to Cloudinary)        │
│ userId (Ref → User/Recruiter)   │
│ createdAt / updatedAt           │
└─────────────────────────────────┘
            ↓ (Relationship)
JOB Collection:
┌─────────────────────────────────┐
│ _id (ObjectId)                  │
│ title (String)                  │
│ description                     │
│ requirement (Array)             │
│ salary (Number)                 │
│ location (String)               │
│ jobType (String)                │
│ experience (Number)             │
│ position (String)               │
│ company (Ref → Company)         │
│ created_by (Ref → User)         │
│ applications (Array of Ref)     │
│ createdAt / updatedAt           │
└─────────────────────────────────┘
            ↓ (Relationship)
APPLICATION Collection:
┌─────────────────────────────────┐
│ _id (ObjectId)                  │
│ job (Ref → Job)                 │
│ applicant (Ref → User/Student)  │
│ status (Enum: pending/accepted/ │
│         rejected)                │
│ createdAt / updatedAt           │
└─────────────────────────────────┘
```

---

## 🛣️ API ENDPOINTS CHEAT SHEET

### USER ENDPOINTS
```
POST   /api/v1/user/register      Create account
POST   /api/v1/user/login         Login (get JWT)
GET    /api/v1/user/profile       Get user profile (protected)
POST   /api/v1/user/profile/update Update profile (protected)
GET    /api/v1/user/logout        Logout
```

### COMPANY ENDPOINTS
```
POST   /api/v1/company/register   Create company (protected)
GET    /api/v1/company/get        List all companies
GET    /api/v1/company/get/:id    Get company details
PUT    /api/v1/company/update/:id Update company (protected)
```

### JOB ENDPOINTS
```
POST   /api/v1/job/post           Post new job (protected)
GET    /api/v1/job/get            Get all jobs
GET    /api/v1/job/get/:id        Get job details
GET    /api/v1/job/getadminjobs   Get recruiter's jobs (protected)
```

### APPLICATION ENDPOINTS
```
GET    /api/v1/application/apply/:id       Apply for job (protected)
GET    /api/v1/application/get             Get applied jobs (protected)
GET    /api/v1/application/applicants/:id  Get job applicants (protected)
POST   /api/v1/application/status/:id/update Update status (protected)
```

---

## 🔒 AUTHENTICATION & SECURITY

```
PASSWORD SECURITY:
User enters password
    ↓
Hash with Bcryptjs (one-way encryption)
    ↓
Store hashed version in database
    ↓
On login: Compare input password with hash (no plain text comparison)


JWT AUTHENTICATION:
User logs in successfully
    ↓
Server creates JWT token (encode user._id + expiration)
    ↓
Store in HTTP-only cookie (automatic with browser)
    ↓
Browser auto-sends cookie with every request
    ↓
isAuthenticated middleware verifies token
    ↓
If valid: Allow request | If invalid: Return 401
```

---

## 📁 FOLDER STRUCTURE EXPLAINED

```
JobPortal/
├── backend/                           # Node.js Server
│   ├── index.js                       # Main entry point + server setup
│   ├── config/                        # Configuration files
│   ├── db/
│   │   └── index.js                   # MongoDB connection
│   ├── model/                         # Data schemas
│   │   ├── user.model.js
│   │   ├── job.model.js
│   │   ├── company.model.js
│   │   └── application.model.js
│   ├── controllers/                   # Business logic
│   │   ├── user.controllers.js
│   │   ├── job.controllers.js
│   │   ├── company.controllers.js
│   │   └── application.controllers.js
│   ├── routes/                        # API endpoints
│   │   ├── user.routes.js
│   │   ├── job.routes.js
│   │   ├── company.routes.js
│   │   └── application.routes.js
│   ├── middlewares/                   # Request processors
│   │   ├── isAuthenticated.js         # JWT verification
│   │   └── multer.js                  # File upload handling
│   └── utils/                         # Helper functions
│       ├── cloudinary.js              # Cloud image upload
│       └── datauri.js                 # File to URI conversion
│
└── frontend/                          # React Application
    ├── src/
    │   ├── App.jsx                    # Main component + routing
    │   ├── main.jsx                   # Entry point
    │   ├── components/
    │   │   ├── Home.jsx
    │   │   ├── Jobs.jsx
    │   │   ├── Profile.jsx
    │   │   ├── JobDescription.jsx
    │   │   ├── Browse.jsx
    │   │   ├── auth/
    │   │   │   ├── Login.jsx
    │   │   │   └── Signup.jsx
    │   │   ├── admin/                 # Recruiter only
    │   │   │   ├── Companies.jsx
    │   │   │   ├── AdminJobs.jsx
    │   │   │   ├── PostJob.jsx
    │   │   │   └── Applicants.jsx
    │   │   ├── shared/                # Reusable components
    │   │   │   ├── Navbar.jsx
    │   │   │   ├── Footer.jsx
    │   │   │   ├── Job.jsx
    │   │   │   └── FilterCard.jsx
    │   │   ├── ui/                    # Shadcn UI components
    │   │   │   ├── button.jsx
    │   │   │   ├── dialog.jsx
    │   │   │   ├── input.jsx
    │   │   │   └── ...
    │   │   └── redux/                 # State management
    │   │       ├── store.js           # Redux store
    │   │       ├── authSlice.js       # User auth state
    │   │       ├── jobSlice.js        # Jobs state
    │   │       ├── companySlice.js    # Companies state
    │   │       └── applicationSlice.js # Applications state
    │   ├── hooks/                     # Data fetching
    │   │   ├── useGetAllJobs.jsx
    │   │   ├── useGetAllCompanies.jsx
    │   │   └── useGetAppliedJobs.jsx
    │   └── lib/
    │       └── utils.js               # Utility functions
    ├── package.json                   # Frontend dependencies
    ├── vite.config.js                 # Vite configuration
    └── index.html                     # HTML entry point
```

---

## ⚡ KEY CONCEPTS TO REMEMBER

| Concept | Explanation |
|---------|-------------|
| **JWT** | Token for authentication (passed in cookies) |
| **Bcryptjs** | Password hashing (one-way encryption) |
| **Middleware** | Functions that process requests before handlers |
| **Redux** | Centralized state management (like global variables) |
| **Mongoose** | ODM library to interact with MongoDB |
| **Multer** | Middleware for file uploads |
| **Cloudinary** | Cloud service for storing images |
| **CORS** | Security policy for cross-origin requests |
| **Protected Routes** | Routes that only authenticated users can access |
| **Role-based Access** | Different permissions for students vs recruiters |

---

## 💡 COMMON INTERVIEW QUESTIONS & ANSWERS

**Q: What is the tech stack?**  
A: MERN - MongoDB, Express.js, React, Node.js with Vite as build tool and Redux for state management.

**Q: How does authentication work?**  
A: Using JWT tokens stored in HTTP-only cookies. When user logs in, backend creates a token with user ID, which is verified on subsequent requests by the isAuthenticated middleware.

**Q: How are students and recruiters differentiated?**  
A: By the `role` field in the User model (enum: 'student' or 'recruiter'). Protected routes check this role before allowing access.

**Q: How do job applications work?**  
A: Students click "Apply", which creates an Application document linking the Job and Student. Recruiters can view applicants and change status to accepted/rejected.

**Q: How are files handled?**  
A: Multer middleware parses files, DataURI converts to base64, and Cloudinary stores images in the cloud. URLs are saved in the database.

**Q: What's the database relationship structure?**  
A: User ←→ Application ←→ Job ←→ Company. Users can be students (apply to jobs) or recruiters (create jobs).

---

## 🎓 STUDY TIPS FOR INTERVIEW

1. **Understand the flow**: How data moves from frontend → backend → database
2. **Know the models**: User, Job, Company, Application schemas
3. **Understand middleware**: How isAuthenticated protects routes
4. **Redux flow**: How state is managed and components access data
5. **Authentication**: JWT, Bcrypt, cookies, tokens
6. **Role-based access**: Different features for different user types
7. **API design**: RESTful endpoints organized by resources
8. **File handling**: Multer → DataURI → Cloudinary

Good luck! 🚀
