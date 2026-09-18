# JobPortal Project - Complete Explanation Guide

## 📌 PROJECT OVERVIEW
**JobPortal** is a full-stack MERN (MongoDB, Express, React, Node.js) web application where:
- **Students** can browse jobs, apply for positions, and manage their profiles
- **Recruiters** can create companies, post jobs, and view applications
- Both roles have different dashboards and functionalities

---

## 🏗️ ARCHITECTURE

```
JobPortal
├── Backend (Node.js + Express) → REST API
├── Frontend (React + Vite) → UI Interface
└── Database (MongoDB) → Data Storage
```

---

## 🔧 BACKEND EXPLANATION

### **1. ENTRY POINT: `backend/index.js`**

```
What it does:
- Initializes Express server on PORT 8000
- Connects database (MongoDB)
- Registers middleware (CORS, JSON parser, Cookie parser)
- Defines API routes
- Serves the React frontend (dist folder)
```

**Key Setup:**
- **CORS**: Allows requests from frontend (http://localhost:8000, production URL)
- **Middleware**: 
  - `express.json()` - Parse JSON requests
  - `cookieParser()` - Handle cookies (JWT tokens)
  - `express.static()` - Serve static files

**API Routes:**
- `/api/v1/user` → User authentication, profile
- `/api/v1/company` → Company management
- `/api/v1/job` → Job listings
- `/api/v1/application` → Job applications

---

### **2. DATABASE CONNECTION: `backend/db/index.js`**

```
What it does:
- Connects to MongoDB using MONGO_URI from .env
- Uses Mongoose ODM (Object Data Modeling)
```

---

### **3. DATA MODELS (Schemas)**

#### **A) USER MODEL** (`backend/model/user.model.js`)
```
Stores user information with TWO roles:

Fields:
├── fullName (String) - User's full name
├── email (String, unique) - Unique email
├── phoneNumber (Number, unique) - Contact number
├── password (String) - Hashed password
├── role (Enum) - 'student' OR 'recruiter'
└── profile (Object)
    ├── bio (String)
    ├── skills (Array of strings)
    ├── resume (URL)
    ├── company (Reference to Company model)
    └── profilePhoto (URL)

Timestamps: createdAt, updatedAt automatically added
```

**Why two roles?**
- Students: Apply for jobs, view profiles
- Recruiters: Post jobs, manage companies

---

#### **B) JOB MODEL** (`backend/model/job.model.js`)
```
Stores job listings:

Fields:
├── title (String) - Job title
├── description (String) - Job description
├── requirement (Array) - List of requirements
├── salary (Number) - Salary amount
├── location (String) - Job location
├── jobType (String) - Full-time, Part-time, Contract
├── experience (Number) - Years of experience needed
├── position (String) - Job position/title
├── company (Reference) → Points to Company
├── created_by (Reference) → Points to User (Recruiter)
└── applications (Array of References) → Points to Applications

Example:
{
  title: "Senior Developer",
  description: "Build amazing apps",
  salary: 100000,
  location: "New York",
  company: ObjectId("123..."),
  created_by: ObjectId("456...")
}
```

---

#### **C) COMPANY MODEL** (`backend/model/company.model.js`)
```
Stores company information:

Fields:
├── name (String, unique)
├── description (String)
├── website (String)
├── logo (URL)
└── userId (Reference) → Points to User (Recruiter owner)
```

---

#### **D) APPLICATION MODEL** (`backend/model/application.model.js`)
```
Stores job applications:

Fields:
├── job (Reference) → Points to Job
├── applicant (Reference) → Points to User (Student)
├── status (Enum) - pending, accepted, rejected
└── timestamps - When applied
```

---

### **4. CONTROLLERS (Business Logic)**

Controllers handle the logic for each feature:

#### **`user.controllers.js`** - User Management
```
Functions:
├── register() → Create new user account
├── login() → Authenticate user, issue JWT token
├── updateProfile() → Update user profile
├── logout() → Clear JWT cookie
└── getUserById() → Fetch user details
```

**Authentication Flow:**
1. User enters email + password → Send to `/api/v1/user/register`
2. Password hashed using **bcryptjs** (library: `bcryptjs`)
3. User saved to MongoDB
4. On login: Password verified, JWT token created (library: `jsonwebtoken`)
5. JWT stored in cookie for subsequent requests

---

#### **`company.controllers.js`** - Company Management
```
Functions:
├── registerCompany() → Create company
├── getCompany() → Fetch all companies
├── getCompanyById() → Fetch specific company
└── updateCompany() → Update company details
```

**Access:** Only Recruiters can create/edit companies

---

#### **`job.controllers.js`** - Job Management
```
Functions:
├── postJob() → Recruiter posts new job
├── getAllJob() → Get all jobs (for browsing)
├── getJobById() → Get job details
├── getAdminJobs() → Get recruiter's own jobs
└── getJobsCreatedByUser() → Filter jobs by recruiter
```

---

#### **`application.controllers.js`** - Application Management
```
Functions:
├── applyJob() → Student applies for job
├── getAppliedJobs() → Get student's applications
├── getApplicants() → Get applicants for a job (Recruiter)
├── updateStatus() → Recruiter accepts/rejects application
```

---

### **5. ROUTES (API Endpoints)**

#### **User Routes** (`backend/routes/user.routes.js`)
```
POST   /api/v1/user/register → User signup
POST   /api/v1/user/login → User login
GET    /api/v1/user/profile → Get logged-in user profile
POST   /api/v1/user/profile/update → Update profile
GET    /api/v1/user/logout → Logout
```

#### **Company Routes** (`backend/routes/company.routes.js`)
```
POST   /api/v1/company/register → Create company
GET    /api/v1/company/get → Get all companies
GET    /api/v1/company/get/:id → Get company by ID
PUT    /api/v1/company/update/:id → Update company
```

#### **Job Routes** (`backend/routes/job.routes.js`)
```
POST   /api/v1/job/post → Post new job (Recruiter)
GET    /api/v1/job/get → Get all jobs
GET    /api/v1/job/get/:id → Get job by ID
GET    /api/v1/job/getadminjobs → Get recruiter's jobs
```

#### **Application Routes** (`backend/routes/application.routes.js`)
```
GET    /api/v1/application/apply/:id → Apply for job
GET    /api/v1/application/get → Get user's applications
GET    /api/v1/application/applicants/:id → Get job applicants
POST   /api/v1/application/status/:id/update → Update status
```

---

### **6. MIDDLEWARES (Request Processors)**

#### **`middlewares/isAuthenticated.js`** - Authentication Check
```
What it does:
- Checks if user has valid JWT token in cookies
- Verifies token signature
- Extracts user ID and attaches to request object
- If no token: Return 401 Unauthorized

Flow:
Request → Middleware checks JWT → User data attached → Next handler
```

**Example:**
```javascript
// Protected route usage
app.get('/api/v1/user/profile', isAuthenticated, getUserProfile)
// Only authenticated users can access
```

#### **`middlewares/multer.js`** - File Upload Handler
```
What it does:
- Handles file uploads (resume, profile photos)
- Converts files to DataURI format
- Uses storage: `memory` (stores in RAM temporarily)

Libraries:
├── multer - File upload
└── datauri - Convert files to URL format
```

---

### **7. UTILITIES**

#### **`utils/cloudinary.js`** - Image Upload to Cloud
```
What it does:
- Uploads images to Cloudinary (cloud storage)
- Returns image URL
- Used for: Profile photos, company logos
```

#### **`utils/datauri.js`** - Convert Files to URI
```
What it does:
- Converts file buffer to DataURI format
- Example: file → "data:image/png;base64,..."
- Used with multer for file handling
```

---

## 🎨 FRONTEND EXPLANATION

### **1. PROJECT STRUCTURE: Vite + React**

```
Vite = Fast build tool (faster than Create React App)
React = UI library
Redux = State management
```

---

### **2. ENTRY POINT: `frontend/src/main.jsx`**

```javascript
Initializes React application:
1. Renders App component
2. Mounts to DOM element #root
```

---

### **3. MAIN APP: `frontend/src/App.jsx`**

```
Uses React Router (createBrowserRouter):

Routes Mapping:
├── / → Home page
├── /login → Login page
├── /signup → Signup page
├── /jobs → Browse all jobs
├── /description/:id → Job detail page
├── /browse → Search/filter jobs
├── /profile → User profile
│
└── ADMIN ROUTES (Protected):
    ├── /admin/companies → List companies
    ├── /admin/companies/create → Create company
    ├── /admin/companies/:id → Edit company
    ├── /admin/jobs → List jobs posted
    ├── /admin/jobs/create → Post new job
    └── /admin/jobs/:id/applicants → View applicants
```

**ProtectedRoute Component:**
- Only recruiters can access admin routes
- Checks user role before rendering

---

### **4. REDUX STATE MANAGEMENT**

**Location:** `frontend/src/components/redux/`

#### **What is Redux?**
- Centralized state management
- All data stored in one place
- Components can access without prop drilling

#### **Redux Files:**

**`store.js`** - Creates Redux store
```
Central repository for all app state
```

**`authSlice.js`** - Authentication state
```
Stores:
├── user (current logged-in user)
├── isAuthenticated (boolean)
└── loading (for API calls)

Actions: login, logout, setUser
```

**`jobSlice.js`** - Job listings state
```
Stores:
├── allJobs (all available jobs)
├── singleJob (selected job details)
└── searchJobByText
```

**`companySlice.js`** - Company state
```
Stores:
├── companies (list of companies)
└── singleCompany (selected company)
```

**`applicationSlice.js`** - Application state
```
Stores:
├── appliedJobs (jobs student applied for)
└── applicants (applications for recruiter's job)
```

---

### **5. COMPONENTS (UI Building Blocks)**

#### **Shared Components** (`shared/`)
```
├── Navbar.jsx - Navigation header
├── Footer.jsx - Footer
├── HeroSection.jsx - Landing page hero
├── LatestJob.jsx - Show latest jobs
├── CategoryCarousel.jsx - Job categories slider
├── FilterCard.jsx - Filter jobs by type
├── Job.jsx - Single job card
└── AppliedJobTable.jsx - Table of applied jobs
```

#### **Auth Components** (`auth/`)
```
├── Login.jsx - Login form
└── Signup.jsx - Signup form with role selection

Process:
1. User fills form
2. Validates input
3. Sends POST request to backend
4. Backend returns JWT
5. Store JWT in cookie
6. Redirect to home/dashboard
```

#### **Main Pages** (Root level)
```
├── Home.jsx - Landing page
├── Jobs.jsx - Browse all jobs with search
├── Browse.jsx - Search jobs with filters
├── Profile.jsx - User profile (edit bio, skills, resume)
├── JobDescription.jsx - Detailed job view + Apply button
└── UpdateProfileDialog.jsx - Modal to update profile
```

#### **Admin Components** (`admin/`)
```
├── Companies.jsx - List all companies
├── CompanyCreate.jsx - Form to create company
├── CompanySetup.jsx - Edit company details
├── AdminJobs.jsx - Recruiter's job listings
├── AdminJobsTable.jsx - Table format of jobs
├── PostJob.jsx - Form to post new job
├── Applicants.jsx - View applicants for a job
├── ApplicantsTable.jsx - Table of applicants
└── ProtectedRoute.jsx - Route guard (role check)
```

---

### **6. HOOKS (Data Fetching)**

**Location:** `frontend/src/hooks/`

```
Custom React Hooks for API calls:

├── useGetAllJobs.jsx → Fetch all jobs
├── useGetAllCompanies.jsx → Fetch all companies
├── useGetCompanyById.jsx → Fetch specific company
├── useGetAllAdminJobs.jsx → Fetch recruiter's jobs
└── useGetAppliedJobs.jsx → Fetch student's applications

How they work:
1. useEffect() calls API
2. Stores data in Redux
3. Components access from Redux store
```

---

### **7. UI COMPONENTS** (`ui/`)

Pre-built Shadcn UI components:
```
├── button.jsx - Button component
├── input.jsx - Input field
├── dialog.jsx - Modal dialog
├── select.jsx - Dropdown
├── table.jsx - Data table
├── badge.jsx - Status badge
├── avatar.jsx - User avatar
├── carousel.jsx - Image carousel
├── radio-group.jsx - Radio buttons
├── label.jsx - Form label
├── popover.jsx - Tooltip
└── sonner.jsx - Toast notifications
```

---

## 🔄 DATA FLOW (End-to-End)

### **User Registration & Login Flow:**

```
1. USER SIGNUP
   ├── Student clicks /signup
   ├── Fills form (name, email, password, role)
   ├── Submits → POST /api/v1/user/register
   ├── Backend:
   │  ├── Validates input
   │  ├── Hashes password with bcryptjs
   │  ├── Creates User document in MongoDB
   │  └── Returns success message
   ├── Frontend:
   │  ├── Receives response
   │  ├── Stores user in Redux (authSlice)
   │  └── Redirects to /profile or /jobs

2. USER LOGIN
   ├── Clicks /login
   ├── Fills email + password
   ├── Submits → POST /api/v1/user/login
   ├── Backend:
   │  ├── Finds user by email
   │  ├── Compares password with hash
   │  ├── Creates JWT token
   │  ├── Sets JWT in cookie (HTTP-only)
   │  └── Returns user data + token
   ├── Frontend:
   │  ├── Stores JWT in cookie (automatic)
   │  ├── Sets user in Redux
   │  └── Redirect to dashboard
```

---

### **Job Posting & Application Flow:**

```
1. RECRUITER POSTS JOB
   ├── Recruiter goes to /admin/jobs/create
   ├── Fills form (title, salary, location, etc)
   ├── Submits → POST /api/v1/job/post
   ├── Backend:
   │  ├── Verifies user role = 'recruiter'
   │  ├── Checks authentication (isAuthenticated middleware)
   │  ├── Creates Job document
   │  ├── Links to Company & User (created_by)
   │  └── Returns job details
   ├── Frontend:
   │  ├── Gets success message
   │  ├── Adds job to Redux (jobSlice)
   │  └── Redirects to admin dashboard

2. STUDENT APPLIES FOR JOB
   ├── Student views job at /description/:id
   ├── Clicks "Apply" button
   ├── Backend:
   │  ├── Verifies user role = 'student'
   │  ├── Creates Application document
   │  ├── Adds to job.applications array
   │  └── Returns success
   ├── Frontend:
   │  ├── Shows "Applied" status
   │  ├── Adds to appliedJobs (Redux)
   │  └── Updates UI

3. RECRUITER VIEWS APPLICANTS
   ├── Goes to /admin/jobs/:id/applicants
   ├── Backend:
   │  ├── Queries Application collection
   │  ├── Filters by job._id
   │  ├── Populates applicant details
   │  └── Returns list
   ├── Frontend displays:
   │  ├── Applicant name, email, resume
   │  ├── Current status badge
   │  └── Accept/Reject buttons

4. RECRUITER UPDATES APPLICATION STATUS
   ├── Clicks Accept/Reject
   ├── Submits → POST /api/v1/application/status/:id/update
   ├── Backend:
   │  ├── Updates Application.status
   │  └── Returns updated data
   ├── Frontend:
   │  ├── Updates applicant row
   │  └── Shows toast notification
```

---

## 🔐 KEY FEATURES & SECURITY

### **Authentication:**
- JWT Tokens (JSON Web Tokens)
- Bcrypt password hashing (never store plain passwords)
- Role-based access (student vs recruiter)

### **File Uploads:**
- Resume upload → Stored as URL
- Profile photos → Uploaded to Cloudinary
- Multer middleware handles file parsing

### **CORS Security:**
- Only allows requests from frontend URL
- Credentials (cookies) allowed

---

## 🚀 TECHNOLOGIES USED

**Backend:**
```
├── Express.js - Web framework
├── MongoDB - Database
├── Mongoose - ODM (Object mapping)
├── JWT - Authentication
├── Bcryptjs - Password hashing
├── Multer - File uploads
├── Cloudinary - Cloud storage
├── CORS - Cross-origin requests
└── Dotenv - Environment variables
```

**Frontend:**
```
├── React - UI library
├── Redux Toolkit - State management
├── React Router - Navigation
├── Vite - Build tool
├── Shadcn UI - Pre-built components
├── Tailwind CSS - Styling
└── Axios/Fetch - API calls
```

---

## 📊 Database Schema Relationships

```
USER (1) ──── (Many) APPLICATION
 ↓
PROFILE

COMPANY (1) ──── (Many) JOB
 ↓
RECRUITER (User)

JOB (1) ──── (Many) APPLICATION
 ↓
Recruiter (created_by)

STUDENT (User) ──── (Many) APPLICATION
```

---

## 🎯 Key Interview Points

1. **Architecture**: MERN stack with clear separation of concerns
2. **Authentication**: JWT + Bcrypt implementation
3. **Role-based Access**: Different features for students vs recruiters
4. **State Management**: Redux for centralized state
5. **API Design**: RESTful endpoints organized by resource
6. **Database**: Mongoose schemas with proper relationships
7. **Security**: CORS, middleware validation, password hashing
8. **File Handling**: Multer + Cloudinary for uploads

---

## 🔥 QUICK SUMMARY FOR INTERVIEW

**"This is a job portal built with MERN stack where:**
- **Students** can browse jobs, apply, and manage their profiles
- **Recruiters** can create companies, post jobs, and manage applications
- **Backend**: Node.js/Express with MongoDB
- **Frontend**: React with Redux for state management
- **Authentication**: JWT tokens with role-based access
- **Key Features**: Job posting, applications, resume uploads, search/filter"**

Good luck with your interview! 🚀
