# Use the official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container to /app
WORKDIR /app

# Copy the package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies inside the container
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Make port 3001 available outside the container
EXPOSE 3001

# Run the application when the container launches
CMD ["node", "worker.js"]
