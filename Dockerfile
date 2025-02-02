# Use the official Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --production

# Copy the application code
COPY . .

# Set environment variables (optional, use docker-compose for better management)
ENV NODE_ENV=production

# Run the bot
CMD ["node", "main.js"]
