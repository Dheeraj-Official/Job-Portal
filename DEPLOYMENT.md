# JobPortal Deployment Guide

## Local Development with Docker

### Prerequisites
- Docker and Docker Compose installed
- MongoDB running (optional, included in docker-compose)

### Running with Docker Compose
```bash
# Build and start all services
docker-compose up --build

# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Services
- **Backend**: http://localhost:8000
- **Frontend**: http://localhost:3000
- **MongoDB**: localhost:27017

## Render.com Deployment

### Prerequisites
- Render.com account
- GitHub repository with the code
- Cloudinary account (for image uploads)

### Setup Steps

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Add Docker configuration for deployment"
   git push origin main
   ```

2. **Create Render.com account** at https://render.com

3. **Set up environment variables in Render:**
   - `MONGODB_URI`: Your MongoDB connection string
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
   - `JWT_SECRET`: Your JWT secret key (or let Render generate one)

4. **Deploy using render.yaml:**
   - Connect your GitHub repository to Render
   - Render will automatically detect the `render.yaml` file
   - The deployment will start automatically

5. **Alternative: Manual deployment**
   - Create a new Web Service in Render
   - Select "Docker" as the environment
   - Connect your GitHub repository
   - Set the Docker context to root directory
   - Configure environment variables
   - Deploy

### Deployment Architecture
- Single web service running both backend and frontend
- Backend serves the frontend static files
- Backend API endpoints handle all requests
- MongoDB as the database (either Render MongoDB or external)

### Environment Variables
Required for production:
- `PORT`: Server port (default: 8000)
- `MONGODB_URI`: MongoDB connection string (use Render MongoDB or external MongoDB Atlas)
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret
- `JWT_SECRET`: Secret for JWT token generation

### MongoDB Options
1. **Render MongoDB**: Create a MongoDB database in Render and use its connection string
2. **MongoDB Atlas**: Use MongoDB Atlas free tier and add the connection string as `MONGODB_URI`
3. **Local MongoDB**: For development, use local MongoDB instance

### Troubleshooting
- Check Render logs for build errors
- Ensure all environment variables are set
- Verify MongoDB connection string format
- Check CORS settings in backend/index.js

## Traditional Deployment

### Backend Deployment
```bash
cd backend
npm install
node index.js
```

### Frontend Deployment
```bash
cd frontend
npm install
npm run build
# Serve the dist folder with nginx or any static file server
```

## Development Setup (without Docker)

### Backend
```bash
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Start Both (Windows)
Double-click `start.bat` to run both frontend and backend simultaneously.
