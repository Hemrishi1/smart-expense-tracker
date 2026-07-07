# Smart Expense Tracker

A full-stack, production-ready MERN application with a glassmorphism UI for managing expenses, tracking income, and monitoring budgets.

## Tech Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, Recharts
- **Backend**: Node.js, Express.js, TypeScript, MongoDB, Mongoose, JWT Auth

## Project Structure
- `/client`: Frontend Vite React app.
- `/server`: Backend Express Node app.

## Quick Start

### 1. Backend Setup
1. `cd server`
2. `npm install`
3. Copy `.env.example` to `.env` and fill in your MongoDB URI and JWT secrets.
4. `npm run dev` (Starts backend on http://localhost:5000)

### 2. Frontend Setup
1. `cd client`
2. `npm install`
3. The `.env` file should contain `VITE_API_URL=http://localhost:5000/api`.
4. `npm run dev` (Starts frontend on http://localhost:5173)

## Features Included
- JWT Authentication (Access/Refresh Tokens)
- Glassmorphism Responsive UI
- Advanced Dashboard with Recharts
- Expense Management (CRUD)
- Income Management (Basic CRUD APIs included)
- Budget Management (Basic CRUD APIs included)
- AI Spending Insights
- CI/CD Configuration (Docker & GitHub Actions ready)

## DevOps & Deployment
- The app is ready to be deployed to Vercel (Frontend) and Render (Backend).
- Use `docker-compose up` to run the stack locally.
