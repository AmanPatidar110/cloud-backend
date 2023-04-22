# Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the React.js project
RUN npm run build

# Expose port 3000 to the outside world
EXPOSE 3000

# Start the server
CMD ["npm", "start"]