# Use the official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container to /app
WORKDIR /app

# Copy the package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies inside the container
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Make port 3000 available outside the container
EXPOSE 3000

# Send the zone, rack, and server as arguments which come from env variables to the agent.mjs file
CMD ["node", "agent.mjs"]

