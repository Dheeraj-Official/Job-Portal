# JobPortal

Full-stack job portal application built with React, Node.js, and MongoDB. Job seekers can browse and apply for positions, while recruiters can post listings and manage applications.

## Features

**Job Seekers**
- Browse and search jobs by category, location, and skills
- View detailed job descriptions and requirements
- Apply to jobs with resume upload
- Track application status
- Manage user profiles

**Recruiters**
- Post and manage job listings
- View applicant profiles and resumes
- Track application status
- Company profile management

## Tech Stack

**Frontend**
- React 19, Redux Toolkit, React Router
- Tailwind CSS, Radix UI
- Vite, Axios

**Backend**
- Node.js, Express
- MongoDB, Mongoose
- JWT authentication
- Cloudinary for file storage

**DevOps**
- Docker, Docker Compose
- Render.com deployment

## Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/jobportal.git
cd jobportal

# Install dependencies
npm install
cd frontend && npm install && cd ..

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Start application (Windows)
start.bat

# Or start manually
npm run dev
cd frontend && npm run dev
```

Access at:
- Frontend: http://localhost:5173
- Backend: http://localhost:8000

### Docker

```bash
# Using Docker Compose
docker-compose up --build

# Individual containers
cd backend && docker build -t jobportal-backend . && docker run -p 8000:8000 jobportal-backend
cd frontend && docker build -t jobportal-frontend . && docker run -p 3000:80 jobportal-frontend
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Render

1. Push code to GitHub
2. Connect repository to Render.com
3. Set environment variables
4. Deploy automatically using `render.yaml`

## Project Structure

```
jobportal/
├── backend/
│   ├── config/         # Configuration
│   ├── controllers/    # Request handlers
│   ├── db/            # Database connection
│   ├── middlewares/   # Express middleware
│   ├── model/         # Database models
│   ├── routes/        # API routes
│   ├── utils/         # Utility functions
│   └── index.js       # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom hooks
│   │   ├── lib/          # Libraries
│   │   └── assets/       # Static assets
│   └── public/           # Public files
├── Dockerfile           # Combined container
├── docker-compose.yml   # Local development
└── render.yaml          # Render.com config
```

## API Endpoints

**Authentication**
- `POST /api/v1/user/register` - User registration
- `POST /api/v1/user/login` - User login
- `POST /api/v1/user/logout` - User logout

**Jobs**
- `GET /api/v1/job/get` - Get all jobs
- `POST /api/v1/job/post` - Post job (recruiter)
- `GET /api/v1/job/get/:id` - Get job by ID

**Companies**
- `POST /api/v1/company/register` - Register company
- `GET /api/v1/company/get` - Get companies
- `GET /api/v1/company/get/:id` - Get company by ID

**Applications**
- `POST /api/v1/application/apply/:id` - Apply to job
- `GET /api/v1/application/get` - Get applications

## Environment Variables

Copy `.env.example` to `.env` and configure with your actual values. Never commit `.env` to version control.

Required variables:
- `MONGODB_URI` - MongoDB connection string
- `PORT` - Server port
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `JWT_SECRET` - JWT secret key
- `FRONTEND_URL` - Frontend URL for CORS

## License

ISC
