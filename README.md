## Young Wow Test - Backend Part

This project is a simple social media app developed with Node.js, Express.js, PostgresQL

Please make sure to also check the frontend part of the test
https://github.com/Koongpao/young-wow-test-frontend

## Features

## Features

- ** User Registration and Authentication **

  - Register with unique username, email, password
  - Log in to receive token for authenticated requests
  - Logging out

- ** Viewing existing posts **
- ** Posting a new post **
  - Require being logged in
- ** Deleting your own post **
  - Require being logged in
- ** Editing your own post **
  - Require being logged in

## API Endpoints

### User Endpoints

- ** GET /users **
    - Get all current users
    - Response
    ```json
    [
    {
        "id": "int",
        "username": "string",
        "email": "string"
    }
    ]
    ```

- ** GET /users/:id **
    - Get user by id
    - Response
    ```json
    [
    {
        "id": "int",
        "username": "string",
        "email": "string"
    }
    ]
    ```

- ** POST /users **
    - Register a user
    - Request
    ```json
    {
        "username": "string",
        "email": "string",
        "password": "string"
    }
    ```

### Auth Endpoints

- ** POST /login **
    - Login a user with email and password credentials
    - Request
    ```json
    {
        "email": "string",
        "password": "string"
    }
    ```
    - Response
    ```json
    {
        "message": "string",
        "data": {
            "token": "string"
        }
    }
    ```

### Post Endpoints

- ** GET /posts **
    - Get all exising posts
    - Response
    ```json
    [
        {
            "id": "int",
            "title": "string",
            "user_id": "int",
            "content": "string",
            "created_at": "string",
            "username": "string"
        }
    ]

- ** GET /posts/:id **
    - Get post by id
    - Response
    ```json
    {
        {
            "id": "int",
            "title": "string",
            "user_id": "int",
            "content": "string",
            "created_at": "string",
            "username": "string"
        }
    }
    ```

- ** POST /posts **
    - Post a new post
    - Require authentication (token)
    - Request
    - Headers - Authorization: token
    ```json
    {
        "title": "string",
        "content": "string"
    }
    ```
    - Response
    ```json
    {
        "message": "string",
        "data": {
            "id": "int",
            "title": "string",
            "user_id": "int",
            "content": "string",
            "created_at": "string"
        }
    }
    ```

- ** PUT /posts/:id **
    - Update an existing post
    - Require authentication (token)
    - Request
    - Headers - Authorization: token
    ```json
    {
        "title": "string",
        "content": "string"
    }
    ```
    - Response
    ```json
    {
        "message": "string",
        "data": {
            "id": "int",
            "title": "string",
            "user_id": "int",
            "content": "string",
            "created_at": "string"
        }
    }
    ```

- ** DELETE /posts/:id **
    - Delete an existing post
    - Require authentication (token)
    - Headers - Authorization: token

## Setup and Installation

### Prerequisites

- Node.js (v14 or later)
- PostgreSQL
- https://www.postgresql.org/download/

1. Clone the repository:
```bash
git clone https://github.com/Koongpao/young-wow-test-backend.git
cd .\young-wow-backend\
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables: Create .env file in root directory

```env
PORT=3001

SECRET_KEY = YOUR_SECRET_KEY

DB_USER=YOUR_POSTGRES_USER (on default it's postgres)
DB_HOST=YOUR_HOST_NAME (on default it's localhost)
DB_DATABASE=young_wow_test_database
DB_PASSWORD=YOUR_POSTGRES_USER_PASWORD
DB_PORT="5432"
```

This assumes your postgres user is allowed to create a new database, otherwise you will need admin user and password
```env
DB_ADMIN_USER=YOUR_POSTGRES_ADMIN_USER
DB_ADMIN_PASSWORD=YOUR_POSTGRES_ADMIN_PASSWORD
```
4. Initialize Database by creating tables
```bash
npm run initdb
```

5. Run unit test to make sure the application is working properly
```bash
npm test
```

6. Start the server
```bash
npm start
```

7. Run in conjunction with frontend app
- Please refer to https://github.com/Koongpao/young-wow-test-frontend

