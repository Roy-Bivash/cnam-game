# Use a Node image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port for the React development server
EXPOSE 5173

# Start the React app in development mode with hot-reload
CMD ["npm", "run", "dev"]
