# Task 2

A Node.js API for user authentication and organization management using Express, Sequelize, and PostgreSQL.

## Table of Contents

- [Task 2](#task-2)
- [Table of Contents](#table-of-contents)
- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Server](#running-the-server)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Users](#users)
  - [Organisations](#organisations)
- [Testing](#testing)

## Introduction

This project is a Node.js RESTful API designed for managing user authentication and organization data. The API includes user registration, login, JWT authentication, and CRUD operations for users and organizations. It utilizes Express for routing, Sequelize for ORM, and PostgreSQL as the database.

## Features

- User registration and login
- JWT-based authentication
- CRUD operations for users
- Organization management (create, read, update)
- Middleware for authentication and authorization
- Error handling and validation

## Technologies Used

- Node.js
- Express.js
- Sequelize
- PostgreSQL
- JWT (JSON Web Token)
- uuid
- dotenv
- supertest (for testing)

## Project Structure

```
.
├── config/
│   └── config.js          # Configuration file for environment variables and database
├── controllers/
│   ├── authController.js  # Controller for authentication routes
│   ├── orgController.js   # Controller for organization routes
│   └── userController.js  # Controller for user routes
├── middleware/
│   ├── authMiddleware.js  # Middleware for authentication and authorization
├── models/
│   ├── index.js           # Sequelize initialization
│   ├── organisation.js    # Organization model definition
│   └── user.js            # User model definition
├── routes/
│   ├── auth.js            # Routes for authentication
│   ├── organisations.js   # Routes for organizations
│   └── users.js           # Routes for users
├── tests/
│   ├── auth.spec.js       # Tests 
│   └── setup.js           # Test setup file
├── app.js                 # Express application setup
├── server.js              # Server startup script
└── .env                   # Environment variables
```

## Setup Instructions

### Prerequisites

- Node.js (>=12.x)
- PostgreSQL

### Installation

1. **Clone the repository:**
    ```sh
    git clone https://github.com/imperialis/task2.git
    cd task2
    ```

2. **Install dependencies:**
    ```sh
    npm install
    ```

3. **Setup environment variables:**
    Create a `.env` file in the root directory and add the following:
    ```plaintext
    SECRET=yourSecretKey
    JWT_SECRET=yourJWTSecretKey
    DB_USERNAME=yourDatabaseUsername
    DB_PASSWORD=yourDatabasePassword
    DB_NAME=yourDatabaseName
    DB_HOST=yourDatabaseHost
    DB_PORT=yourDatabasePort
    PORT=yourPort
    ```

4. **Setup the database:**
    Ensure you have PostgreSQL running and a database created. Update the `.env` file with your PostgreSQL credentials.

### Running the Server

1. **Start the server:**
    ```sh
    npm start
    ```

2. **The server will be running at:**
    ```
    http://localhost:3000
    ```

## Environment Variables

Ensure you have a `.env` file in your project root with the following variables set:

```plaintext
SECRET=yourSecretKey
JWT_SECRET=yourJWTSecretKey
DB_USERNAME=yourDatabaseUsername
DB_PASSWORD=yourDatabasePassword
DB_NAME=yourDatabaseName
DB_HOST=yourDatabaseHost
DB_PORT=yourDatabasePort
PORT=yourPort
```

## API Endpoints

### Authentication

- **POST /auth/register**
  - Registers a new user.
  - Request body:
    ```json
    {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "password": "password123",
      "phone": "1234567890"
    }
    ```

- **POST /auth/login**
  - Logs in a user.
  - Request body:
    ```json
    {
      "email": "john.doe@example.com",
      "password": "password123"
    }
    ```

### Users

- **GET /api/users/:id**
  - Retrieves a user's information by ID.
  - Requires JWT token in the Authorization header.

### Organisations

- **POST /api/organisations**
  - Creates a new organization.
  - Request body:
    ```json
    {
      "name": "My Organization",
      "description": "Description of my organization"
    }
    ```
  - Requires JWT token in the Authorization header.

- **GET /api/organisations**
  - Retrieves all organizations for the authenticated user.
  - Requires JWT token in the Authorization header.

- **GET /api/organisations/:orgId**
  - Retrieves a specific organization by ID.
  - Requires JWT token in the Authorization header.

- **POST /api/organisations/:orgId/users**
  - Adds a user to an organization.
  - Request body:
    ```json
    {
      "userId": "user-id-to-add"
    }
    ```
  - Requires JWT token in the Authorization header.

## Testing

- **Run tests:**
    ```sh
    npm test
    ```

---

This README provides a clear overview of the project, setup instructions, API endpoints, and other relevant information. Feel free to modify it to fit your specific project details and needs.
