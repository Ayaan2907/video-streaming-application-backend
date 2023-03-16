# Authentication_APIs

## Description

This is a `Nodejs ` project that provides APIs for authentication and authorization. It uses `MongoDB` as the database and `JWT` for authentication.

## Working Features

-   [x] User Signup
-   [x] User Signin
-   [x] User Update
-   [x] User Delete
-   [x] Get all users
-   [] User Logout
-   [] User Forgot Password
-   [] User Reset Password

## Installation

1. Clone the repo
2. `cd Authentication_APIs`
3. `npm install`
4. Create a `.env` file in the root directory and add the following environment variables

```
SERVER_PORT

MONGO_USERNAME=
MONGO_PASSWORD=

LOGGING_FLAG=true

JWT_SECRET=
JWT_EXPIRY_TIME=
```

5. `npm run dev`

## Usage

1. `npm run dev` to start the server in development mode
2. `npm run build` to compile into javascript
3. `npm run start` to start the server (dist/ js code) in production mode

## API Endpoints

### Auth

| Method | Endpoint           | Description             | Payload                                                         |
| ------ | ------------------ | ----------------------- | --------------------------------------------------------------- |
| POST   | `/auth/signup`     | User Signup (Public)    | `name, emai (unique), password, role (admin, student, teacher)` |
| POST   | `/auth/signin`     | User Signin (Public)    | `email, password`                                               |
| PUT    | `/auth/update/:id` | User Update             | `_id` (in params), fields to be updated (in body)               |
| DELETE | `/auth/delete/:id` | User Delete             | `_id` (in params)                                               |
| GET    | `/auth/user/:id`   | Get all users           | `_id` (in params),                                              |
| GET    | `/auth/all-users`  | Get all users           |                                                                 |
| GET    | `/video`           | Sample role based route |                                                                 |

## Other features

-   [x] Logging using `chalk` : custome logging (winston etc not used, may be required in future)
-   [x] Organized file structure (routes, controllers, models, services, utils, config)
-   [x] Error handling
