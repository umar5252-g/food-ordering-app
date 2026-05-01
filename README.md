# Flavor Point - Food Ordering App

A modern MERN stack food ordering application with JWT authentication, built with React, Express, MongoDB, and styled with Tailwind CSS.

## Features

- 🔐 JWT Authentication (Register/Login with access & refresh tokens)
- 🛒 Shopping Cart with local storage persistence
- 🍕 Product catalog with category filtering
- 🎨 Modern UI with KFC-style red (#E4002B) and white branding
- 📱 Responsive design for all devices
- 🔄 Automatic token refresh
- 🛡️ Protected routes with middleware

## Tech Stack

### Frontend

- **React 19** with Vite
- **React Router v6** for routing
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Context API** for state management

### Backend

- **Express.js** with Node.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcrypt** for password hashing
- **CORS** for cross-origin requests

## Project Structure

```
food-brand-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/           # Axios configuration
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React contexts (Auth, Cart)
│   │   ├── pages/         # Page components
│   │   └── ...
├── server/                 # Express backend
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   └── ...
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd food-brand-app
   ```

2. **Backend Setup**

   ```bash
   cd server
   npm install
   ```

   Create a `.env` file in the server directory:

   ```env
   MONGO_URI=mongodb://localhost:27017/flavor-point
   PORT=5000
   JWT_SECRET=your_access_token_secret_here
   JWT_REFRESH_SECRET=your_refresh_token_secret_here
   ACCESS_TOKEN_EXPIRES_IN=15m
   REFRESH_TOKEN_EXPIRES_IN=7d
   ```

   Start the backend:

   ```bash
   npm run dev
   ```

3. **Frontend Setup**

   ```bash
   cd ../client
   npm install
   ```

   The client already has a `.env` file configured for the default backend URL.

   Start the frontend:

   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Products

- `GET /api/products` - Get all products (with optional filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (protected)
- `PUT /api/products/:id` - Update product (protected)
- `DELETE /api/products/:id` - Delete product (protected)

## Environment Variables

### Backend (.env)

```env
MONGO_URI=mongodb://localhost:27017/flavor-point
PORT=5000
JWT_SECRET=your_access_token_secret_here
JWT_REFRESH_SECRET=your_refresh_token_secret_here
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Available Scripts

### Backend

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the ISC License.
