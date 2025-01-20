# Document Management System

This project is a **Document Management System** built using **NestJS** and **TypeORM**. The system includes the following features:

- Authentication APIs: User registration, login, logout, and role-based access control (Admin, Editor, Viewer).
- User Management APIs: Admin-only functionality for managing user roles and permissions.
- Document Management APIs: CRUD operations for documents, including the ability to upload.
- Token Validation and Role Validation using Guards.

## Prerequisites

Ensure you have the following installed:

- Node.js (v16 or above)
- npm or yarn
- PostgreSQL
- A package manager like `npm` or `yarn`

## Installation

1. Run Local development mode

- Run in the terminal:
  - Run docker (DB)
    - docker-compose -f docker/docker-compose-dev.yaml up
  - Install global packages
    - npm i -g eslint
    - npm i -g @nestjs/cli
  - Build the service
    - npm run install
    - npm run build
  - Run the services
    - npm run start
- To watch DB tables:
  - Download [Postico](https://postgresapp.com/downloads.html)
  - user + password: root
  - DB name: app_db

2. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

3. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

4. Configure the `.env` file:

   Create a `.env` file in the root directory and add the following environment variables:

   ```env
   PORT=3000
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=your_user
   DATABASE_PASSWORD=your_password
   DATABASE_NAME=your_database
   JWT_SECRET=your_secret_key
   TOKEN_EXPIRATION=3600
   ```

5. Run the database migrations:

   ```bash
   npm run typeorm:migration:run
   ```

## Development Environment

1. Start the application in development mode:

 ```bash
   npm run start:dev
   ```

2. Access the API at http://localhost:<PORT> (default: 3000).

## Production Environment

1. Build the application:

   ```bash
   npm run build
   ```

2. Start the application in production mode:

   ```bash
   npm run start:prod
   ```

Ensure that the .env file contains production-specific configurations such as database credentials and JWT secrets.


## Docker Deployment

1. Build the Docker image:

```bash
docker build -t document-management-system .
   ```

2. Run the container:

```bash
docker run -d --name document-management-system \
  -p 3000:3000 \
  --env-file .env \
  document-management-system
   ```


3. Verify the application is running:

```bash
docker ps
   ```

For scaling and orchestration, consider using Docker Compose or Kubernetes.



## API Endpoints

### Authentication APIs

| Method | Endpoint         | Description                              |
| ------ | ---------------- | ---------------------------------------- |
| POST   | `/auth/register` | Register a new user                      |
| POST   | `/auth/login`    | Authenticate user and return a JWT token |
| POST   | `/auth/logout`   | Invalidate the current user’s token      |

### User Management APIs

| Method | Endpoint                 | Description                          |
| ------ | ------------------------ | ------------------------------------ |
| GET    | `/users`                 | Get a list of all users              |
| GET    | `/users/getById/:id`     | Get a user by id                     |
| GET    | `/users/getByName/:name` | Get a user by name                   |
| PATCH  | `/users/:id/role`        | Update a user’s role (Admin only)    |
| POST   | `/users`                 | Creates a new user (Admin only)      |
| DELETE | `/users/:id`             | Delete a user by id (Admin & Editor) |

### Document Management APIs

| Method | Endpoint            | Description                 |
| ------ | ------------------- | --------------------------- |
| POST   | `/documents/upload` | Upload or create a document |
| GET    | `/documents`        | Get a list of all documents |
| GET    | `/documents/:id`    | Get a document              |
| DELETE | `/documents/:id`    | Delete a specific document  |

### Ingestion Management APIs

| Method | Endpoint             | Description                         |
| ------ | -------------------- | ----------------------------------- |
| POST   | `/ingestion/trigger` | Trigger a ingestion (Admin only)    |
| GET    | `/ingestion`         | Get a list of all ingestion         |
| GET    | `/ingestion/:id`     | Get a ingestion                     |
| Patch  | `/ingestion/:id`     | Update a ingestion (Admin & Editor) |

## Key Features

1. **Authentication with JWT**:

   - Secure endpoints with JWT-based authentication.
   - Role-based access control with roles (`Admin`, `Editor`, `Viewer`).

2. **Document Management**:

   - Upload and store documents directly in the File system.

3. **User Management**:

   - Admin-only APIs for managing user roles and permissions.

4. **Database Migrations**:

   - Migrations are automatically executed to ensure the database schema is up-to-date.

5. **Validation and Guards**:
   - Token validation and role-based access control are implemented using NestJS guards.

## Running Tests

Run unit and integration tests with the following command:

```bash
npm run test
```

## Known Issues and Limitations

- Storing files in the File system. can lead to performance issues for large files or high volumes of uploads. Consider switching to a file storage solution like AWS S3 for scalability.
