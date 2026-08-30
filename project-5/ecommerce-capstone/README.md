# E-Commerce Product Catalog / Store (Capstone Project)

## Description
This is a modern, modular, full-stack E-commerce Capstone Project built using the MERN stack (MongoDB, Express, React, Node.js). 

## Features
- **Frontend**: Clean architecture with React, React Router for client-side routing, responsive UI with Tailwind CSS.
- **Backend**: Express API with structured controllers, routes, and models.
- **Database**: Mongoose models for User, Product, and Order.
- **Auth**: Passwords hashed with bcrypt; JWT support structure added.

## Tech Stack
- Frontend: React (Vite), React Router DOM, Axios, Tailwind CSS, Lucide Icons
- Backend: Node.js, Express.js, MongoDB (Mongoose), BcryptJS, JWT
- Deployment Configs: Vercel (Frontend), Render (Backend)

## Project Architecture
```text
ecommerce-capstone/
├── backend/
│   ├── config/          # DB config
│   ├── controllers/     # Route logic
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express router setups
│   ├── middleware/      # Auth & Error middlewares
│   └── server.js        # Main backend entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI parts (Navbar, ProductCard)
│   │   ├── pages/       # Route pages (Home, Product, Cart)
│   │   ├── App.jsx      # React Router config
│   │   └── main.jsx     # React entry point
│   └── vercel.json      # Frontend deploy config
```

## Running Locally

### Backend
1. Navigate to `/backend`
2. Run `npm install`
3. Rename `.env.example` to `.env` and add your `MONGO_URI`
4. Run `npm run dev` to start server on port 5000

### Frontend
1. Navigate to `/frontend`
2. Run `npm install`
3. Run `npm run dev` to start Vite development server

## Deployment
This project is configured and prepared for live deployment.
- **Frontend** can be deployed directly to Vercel (uses `vercel.json` and standard Vite build steps).
- **Backend** can be deployed to Render (uses `render.yaml`).

**Manual Steps Remaining**: 
Since I do not have access to your personal Vercel/Render accounts or MongoDB Atlas credentials, you will need to:
1. Create a cluster on MongoDB Atlas and get the connection string.
2. Push this repository to your GitHub account.
3. Import the `frontend` directory into Vercel and set it to framework: Vite.
4. Import the `backend` directory into Render as a Web Service and supply the `MONGO_URI` environment variable.
