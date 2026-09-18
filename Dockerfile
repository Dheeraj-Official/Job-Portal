# Combined Dockerfile for Render.com deployment
FROM node:18-alpine

WORKDIR /app

# Copy root package files
COPY package*.json ./

# Install root dependencies
RUN npm install

# Copy frontend package files
COPY frontend/package*.json ./frontend/

# Install frontend dependencies
RUN cd frontend && npm install

# Copy frontend source files
COPY frontend/ ./frontend/

# Build frontend
RUN cd frontend && npm run build

# Copy backend source files
COPY backend/ ./backend/

# Set environment variables
ENV PORT=8000

# Expose the port
EXPOSE 8000

# Start the application
CMD ["node", "backend/index.js"]
