# Use an official Node.js runtime as a parent image
FROM node:20.11.0

# Set the working directory to /app
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to /app
COPY package*.json ./

# Install all dependencies (including devDependencies) for development
RUN npm i -f

# Copy the source code
COPY . .

# Expose the necessary port
EXPOSE 3060

# Default command (can be overridden when running the container) 
CMD ["npm", "start"]
