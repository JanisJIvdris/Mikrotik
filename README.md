# Project Management Tool

A full-stack application for creating and managing projects, tasks, and task templates with user authentication. Built with Node.js, Express, Sequelize, PostgreSQL, and React.

## Overview

This Project Management Tool allows authenticated users to create and manage projects, tasks, and task templates. The entire application is containerized using Docker and Docker Compose for consistent deployment across environments.

## Features

### Backend

- **Authentication:** Secure user registration and login with JWT
- **Project Management:** Create and manage multiple projects
- **Task Management:** Create, update, retrieve, and delete tasks
- **Template Management:** Create reusable task templates to speed up workflow
- **User Management:** View registered users for task assignment

### Frontend

- **Dashboard:** View and manage all tasks with filtering capabilities
- **Template Management:** Create and apply task templates
- **Task Filtering:** Filter tasks by status, priority, and assigned user
- **Responsive Design:** Modular components that work across device sizes
- **Reusable Components:** Includes refactored SVG icons as reusable components
- **Task Tracking Components:** Visual components for tracking current tasks and improving productivity
  - Priority Breakdown: Visual representation of tasks by priority
  - Task Stats Summary: Overview of task completion status
  - Filters: Customizable task filtering options

### Task Fields

Tasks include several useful fields to improve task management:

- Title and description
- Status (New, In Progress, Completed, Overdue)
- Priority (Low, Medium, High, Critical)
- Assigned user
- Due date
- Estimated hours
- Creation and last update timestamps
- Project association

## Tech Stack

- **Backend:** Node.js, Express, Sequelize ORM
- **Database:** PostgreSQL
- **Frontend:** React
- **Containerization:** Docker and Docker Compose

## Directory Structure

```
project-management-tool/
├── backend/
│   ├── config/                # Configuration files
│   ├── controllers/           # API controllers
│   ├── middlewares/           # Middleware functions
│   ├── models/                # Sequelize models
│   ├── routes/                # API route definitions
│   ├── tests/                 # Backend test files
│   ├── app.js                 # Main Express application
│   ├── Dockerfile             # Dockerfile for backend
│   ├── package.json
│   ├── .env                   # Environment variables
│   └── .env.test              # Test environment variables
├── frontend/
│   ├── public/                # Public assets
│   ├── src/
│   │   ├── assets/
│   │   │   └── icons/         # Reusable SVG icon components
│   │   ├── components/        # Reusable React components
│   │   ├── pages/             # Page-level components
│   │   ├── App.js             # Main React application
│   │   └── index.js           # React entry point
│   ├── Dockerfile             # Dockerfile for frontend
│   ├── package.json
│   └── .env                   # Frontend environment variables
├── docker-compose.yml         # Docker Compose for development
├── docker-compose.test.yml    # Docker Compose for testing
└── README.md
```

## API Endpoints

- **Authentication**

  - `POST /auth/register` - Register a new user
  - `POST /auth/login` - Authenticate a user

- **Tasks**

  - `GET /tasks` - Get all tasks
  - `POST /tasks` - Create a new task
  - `PUT /tasks/:id` - Update a task
  - `DELETE /tasks/:id` - Delete a task

- **Templates**

  - `GET /templates` - Get all templates
  - `POST /templates` - Create a new template
  - `PUT /templates/:id` - Update a template
  - `DELETE /templates/:id` - Delete a template
  - `POST /templates/:id/apply` - Apply a template to create a task

- **Projects**

  - `GET /projects` - Get all projects
  - `POST /projects` - Create a new project
  - `PUT /projects/:id` - Update a project
  - `DELETE /projects/:id` - Delete a project

- **Users**
  - `GET /users` - Get all registered users (for task assignment)

## Prerequisites

- Docker and Docker Compose

## Installation & Setup

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/JanisJIvdris/Mikrotik.git
   cd project-management-tool
   ```

2. **Configure Environment Variables:**

   In the backend directory, create a `.env` file with:

   ```
   PORT=3000
   DB_PORT=5432
   DB_HOST=db
   DB_USER=your_db_user
   DB_PASS=your_db_password
   DB_NAME=your_db_name
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```

   In the frontend directory, create a `.env` file if needed:

   ```
   NODE_ENV=development
   ```

3. **Build and Run the Containers:**
   From the project root, run:

   ```bash
   docker-compose up --build
   ```

- The backend uses a fail-fast mechanism. If there’s a critical error during database initialization (such as incorrect environment variables or schema sync issues), the backend logs the error and exits immediately.
- The backend exposes a /health endpoint used by Docker Compose health checks to confirm that the service is operational.

4. **Access the Application:**
   - http://localhost:3000

## Running Tests

**Important:** You must create a `.env.test` file in the backend directory with test-specific environment variables before running tests:

```
PORT=3000
DB_PORT=5432
DB_HOST=db-test
DB_USER=test_user
DB_PASS=test_password
DB_NAME=test_db
JWT_SECRET=test_secret
NODE_ENV=test
```

This file configures the test environment to use a separate database instance to avoid affecting development data.

To run backend tests in an isolated environment:

```bash
cd backend
docker-compose -f docker-compose.test.yml up --build
```

## Implementation Notes

### Registration Page

The registration page is included in this project primarily for ease of testing the functionality. In a production environment where this tool would likely be used internally within an organization, user registration would typically be handled through administrative channels or integrated with existing authentication systems rather than through a public registration page.

### Architectural Decisions

While the current implementation meets all required functionalities, there are several refinements that would be considered for a production-level deployment:

- **Component Modularization:** Some components would strongly benefit from further breaking down into smaller, more focused subcomponents.
- **Template Interface:** A dedicated template editing interface with preview functionality would improve the template creation experience.
- **Drag-and-Drop Interface:** Implementing a drag-and-drop interface for task management would enhance user experience.
- **Notification System:** Adding real-time notifications for task assignments and updates would improve team communication.

### Productivity Enhancements

The frontend includes several components specifically designed to improve productivity:

- Priority breakdown charts to quickly visualize high-priority items
- Task status summaries to track progress at a glance
- Customizable filters to focus on relevant tasks
- Project selector for quick navigation between different projects

# Troubleshooting & Setup Clarifications

- **Database Initialization Failures:** If the database fails to initialize (e.g., due to misconfigured environment variables or schema errors), the backend will log a critical error and exit (fail-fast).
  - Check container logs with `docker-compose logs app` to diagnose the issue.
  - Verify that the `.env` and `.env.test` files have the correct values.
  - The backend health check (via the `/health` endpoint) ensures that the backend is marked as healthy only if it is fully initialized.
- **Service Health Checks:** Docker Compose uses health checks to ensure:
  - The PostgreSQL container is ready before the backend starts (using `pg_isready`).
  - The backend responds on the `/health` endpoint before the frontend starts. If a service fails its health check, dependent services will not start, preventing the website from running in a partially initialized state.

## Future Improvements

- **Component Refactoring:** Break down larger components (e.g., TaskTable.js) into smaller subcomponents
- **Enhanced Error Handling:** Improve error messages and user feedback
- **UI/UX Enhancements:** Refine design, responsiveness, and accessibility
- **Advanced Testing:** Increase test coverage
- **Performance Optimization:** Implement pagination for large datasets
- **Bulk Operations:** Add functionality for bulk task updates and deletions
- **Team Collaboration:** Add comments and activity logs to tasks
- **Time Tracking:** Integrate time tracking functionality for tasks
