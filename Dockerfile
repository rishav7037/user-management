FROM node:20.11.1-alpine AS build
LABEL user-management=build

# Set the working directory inside the container
WORKDIR /app

# Copy necessary files to the working directory
COPY userManagement/package*.json /app/
COPY userManagement/.eslintrc.js /app/
COPY userManagement/tsconfig.json /app/
COPY userManagement/tsconfig.build.json /app/

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY userManagement/ /app/

# Build the application (if applicable)
RUN npm run build

# Expose the port your application will run on
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "start"]
