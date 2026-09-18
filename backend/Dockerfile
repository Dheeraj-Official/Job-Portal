# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application
COPY . .

# Expose the port
EXPOSE 8000

# Start the application
CMD ["node", "index.js"]
