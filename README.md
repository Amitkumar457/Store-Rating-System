# Store Rating System

A full-stack store rating application with role-based access for admins, normal users, and store owners.

## Features

- User registration and login with JWT authentication
- Role-based access control for admin, user, and store owner accounts
- Admin dashboard for managing users and stores
- Store listing and rating submission for logged-in users
- Store owner dashboard for viewing store ratings
- Password update support for users and store owners

## Tech Stack

### Backend

- Node.js
- Express
- MySQL
- JWT
- bcrypt

### Frontend

- React
- Vite
- React Router
- Axios

## Project Structure

```text
Store-Rating-System/
+-- Backend/
|   +-- src/
|   |   +-- config/
|   |   +-- controllers/
|   |   +-- middlewares/
|   |   +-- routes/
|   |   +-- services/
|   |   +-- app.js
|   |   +-- server.js
|   +-- package.json
+-- Frontend/
|   +-- src/
|   |   +-- components/
|   |   +-- context/
|   |   +-- hooks/
|   |   +-- layouts/
|   |   +-- pages/
|   |   +-- routes/
|   |   +-- services/
|   +-- package.json
+-- README.md
```

## Prerequisites

- Node.js
- npm
- MySQL

## Backend Setup

1. Go to the backend folder:

```bash
cd Backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the `Backend` folder:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=store_rating_system
DB_PORT=3306
```

4. Start the backend server:

```bash
npm run dev
```

The backend runs on `http://localhost:5000` by default.

## Frontend Setup

1. Go to the frontend folder:

```bash
cd Frontend
```

2. Install dependencies:

```bash
npm install
```

3. Optional: create a `.env` file in the `Frontend` folder if your API URL is different:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

4. Start the frontend development server:

```bash
npm run dev
```

## Available Scripts

### Backend

- `npm run dev` - start the backend with nodemon
- `npm start` - start the backend with Node

### Frontend

- `npm run dev` - start the Vite development server
- `npm run build` - create a production build
- `npm run lint` - run ESLint
- `npm run preview` - preview the production build

## API Routes

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Admin

- `GET /api/admin/dashboard`
- `GET /api/admin/users`
- `POST /api/admin/users`
- `GET /api/admin/stores`
- `POST /api/admin/create-store`

### User

- `GET /api/users/stores`
- `POST /api/users/rate`
- `PUT /api/users/update-password`

### Store Owner

- `GET /api/owners/dashboard`
- `GET /api/owners/ratings`
- `PUT /api/owners/update-password`

## Notes

- Backend routes that manage protected resources require a valid JWT token.
- Admin routes require the `admin` role.
- Store owner routes require the `store_owner` role.
- Make sure the MySQL database and tables exist before starting the backend.
