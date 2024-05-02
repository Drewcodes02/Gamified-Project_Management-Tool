# API Documentation for my final year project 

This document is for my API endpoints available in my project. 

## Authentication

### Register
- **Endpoint**: `/api/auth/register`
- **Method**: POST
- **Body**:
  - `username`: String (required)
  - `password`: String (required)
- **Description**: Registers a new user with a username and password.
- **Success Response**: HTTP 200 OK, `{ message: "User registered successfully" }`
- **Error Response**: HTTP 400 Bad Request, `{ error: "Username already exists" }`

### Login
- **Endpoint**: `/api/auth/login`
- **Method**: POST
- **Body**:
  - `username`: String (required)
  - `password`: String (required)
- **Description**: Authenticates a user and returns a JWT token.
- **Success Response**: HTTP 200 OK, `{ token: "JWT_TOKEN" }`
- **Error Response**: HTTP 401 Unauthorised, `{ error: "Invalid credentials" }`

## Tasks

### Create Task
- **Endpoint**: `/api/tasks`
- **Method**: POST
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Body**:
  - `title`: String (required)
  - `description`: String
  - `assignedTo`: String
  - `startDate`: Date
  - `dueDate`: Date
  - `progress`: Number
- **Description**: Creates a new task.
- **Success Response**: HTTP 201 Created, `{ message: "Task created successfully", task: TASK_OBJECT }`
- **Error Response**: HTTP 400 Bad Request, `{ error: "Error message" }`

### Update Task
- **Endpoint**: `/api/tasks/:id`
- **Method**: PUT
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Body**:
  - `title`: String
  - `description`: String
  - `assignedTo`: String
  - `startDate`: Date
  - `dueDate`: Date
  - `progress`: Number
- **Description**: Updates an existing task.
- **Success Response**: HTTP 200 OK, `{ message: "Task updated successfully" }`
- **Error Response**: HTTP 404 Not Found, `{ error: "Task not found" }`

### Delete Task
- **Endpoint**: `/api/tasks/:id`
- **Method**: DELETE
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Description**: Deletes a task.
- **Success Response**: HTTP 200 OK, `{ message: "Task deleted successfully" }`
- **Error Response**: HTTP 404 Not Found, `{ error: "Task not found" }`

## Gamification

### Get User Points and Achievements
- **Endpoint**: `/api/gamification`
- **Method**: GET
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Description**: Retrieves the points and achievements for the logged-in user.
- **Success Response**: HTTP 200 OK, `{ points: NUMBER, achievements: [ACHIEVEMENTS_ARRAY] }`
- **Error Response**: HTTP 401 Unauthorised, `{ error: "Unauthorised" }`

## Real-Time Chat

### Send Message
- **Endpoint**: `/api/chat`
- **Method**: POST
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Body**:
  - `message`: String (required)
  - `receiverId`: String (required)
- **Description**: Sends a message to another user.
- **Success Response**: HTTP 200 OK, `{ message: "Message sent successfully" }`
- **Error Response**: HTTP 400 Bad Request, `{ error: "Error message" }`

## Analytics

### Get Task Progress Analytics
- **Endpoint**: `/api/analytics/tasksProgress`
- **Method**: GET
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Description**: Retrieves analytics on task progress.
- **Success Response**: HTTP 200 OK, `{ inProgress: NUMBER, completed: NUMBER }`
- **Error Response**: HTTP 401 Unauthorised, `{ error: "Unauthorised" }`

All endpoints need authentication with a valid JWT token replace ‘JWT_TOKEN’ with the token you get from registering/logging in
