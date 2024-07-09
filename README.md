###Task 2###
A comprehensive Node.js API for user authentication and organization management using Express, Sequelize, and PostgreSQL.

##Table of Contents##
Project Title
Table of Contents
Introduction
Features
Technologies Used
Project Structure
Setup Instructions
Prerequisites
Installation
Running the Server
Environment Variables
API Endpoints
Authentication
Users
Organisations
Testing


#Introduction#
This project is a Node.js RESTful API designed for managing user authentication and organization data. The API includes user registration, login, JWT authentication, and CRUD operations for users and organizations. It utilizes Express for routing, Sequelize for ORM, and PostgreSQL as the database.


#Features#
User registration and login
JWT-based authentication
CRUD operations for users
Organization management (create, read, update)
Middleware for authentication and authorization
Error handling and validation
Technologies Used
Node.js
Express.js
Sequelize
PostgreSQL
JWT (JSON Web Token)
uuid
dotenv
supertest (for testing)

#Project Structure#
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
│   ├── auth.spec.js       # Tests for authentication
│   └── setup.js           # Test setup file
├── app.js                 # Express application setup
├── server.js              # Server startup script
└── .env                   # Environment variables
##Setup Instructions##
#Prerequisites#
Node.js (>=12.x)
PostgreSQL

#Installation#
Clone the repository:
git clone https://github.com/imperialis/task2.git
cd yourproject
#Install dependencies:#
npm install
#Setup environment variables:#
Create a .env file in the root directory and add the following:
SECRET=yourSecretKey
JWT_SECRET=yourJWTSecretKey
DB_USERNAME=yourDatabaseUsername
DB_PASSWORD=yourDatabasePassword
DB_NAME=yourDatabaseName
DB_HOST=yourDatabaseHost
DB_PORT=yourDatabasePort
PORT=yourPort
#Setup the database:#
Ensure you have PostgreSQL running and a database created. Update the .env file with your PostgreSQL credentials.

#Running the Server#
#Start the server:#
npm start
The server will be running at:
http://localhost:3000

#Environment Variables#
Ensure you have a .env file in your project root with the following variables set:
SECRET=yourSecretKey
JWT_SECRET=yourJWTSecretKey
DB_USERNAME=yourDatabaseUsername
DB_PASSWORD=yourDatabasePassword
DB_NAME=yourDatabaseName
DB_HOST=yourDatabaseHost
DB_PORT=yourDatabasePort
PORT=yourPort


##API Endpoints##
#Authentication#
POST /auth/register

#Registers a new user.#
Request body:
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "phone": "1234567890"
}
POST /auth/login

#Logs in a user.#
Request body:
{
  "email": "john.doe@example.com",
  "password": "password123"
}
#Users#
GET /api/users/
Retrieves a user's information by ID.
Requires JWT token in the Authorization header.

#Organisations#
POST /api/organisations
#Creates a new organization#.
Request body:
{
  "name": "My Organization",
  "description": "Description of my organization"
}
Requires JWT token in the Authorization header.

GET /api/organisations

Retrieves all organizations for the authenticated user.
Requires JWT token in the Authorization header.

GET /api/organisations/

Retrieves a specific organization by ID.
Requires JWT token in the Authorization header.

POST /api/organisations/
/users
#Adds a user to an organization.#
Request body:
{
  "userId": "user-id-to-add"
}
Requires JWT token in the Authorization header.

#Testing#
Run tests:
npm test

This README provides a clear overview of the project, setup instructions, API endpoints, and other relevant information. Feel free to modify it to fit your specific project details and needs.

