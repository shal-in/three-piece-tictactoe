# Use the official Node.js image as base
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set the PORT environment variable
# Comment in for local testing
ENV PORT 8080

# Command to run the application
CMD ["node", "server/server.js"]
