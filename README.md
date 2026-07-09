# SmartX - Personal Finance & Expense Tracker 🚀

[![Live Demo](https://img.shields.io/badge/Live_Demo-Click_Here-blue?style=for-the-badge)](https://expense-tracker-client-9eoj.onrender.com)

![SmartX Banner](https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200&auto=format&fit=crop)

SmartX is a beautiful, highly interactive, full-stack Personal Finance application designed to help users track expenses, manage budgets, and gain insights into their financial health. 

Built with a premium **Glassmorphism** UI, animated backgrounds, and robust backend architecture, SmartX takes personal finance tracking to the next level.

---

## ✨ Key Features

- **🔒 Secure Authentication:** JWT-based login/signup with secure password hashing and Nodemailer-powered forgot/reset password flows.
- **📊 Interactive Dashboard:** Visualize your finances with dynamic charts (powered by Recharts) showing income, expenses, and savings at a glance.
- **🖼️ Cloud Avatar Storage:** Lightning-fast user profile picture uploads powered by **Supabase Storage**.
- **🤖 Smart Advice Chatbot:** An integrated AI-like companion that gives you randomized, helpful life advice on demand (powered by the public Advice Slip API).
- **📥 CSV Exporting:** Easily download your recent transaction history to a CSV file with one click.
- **🎨 Premium UI/UX:** A stunning, animated "breathing" space background built with Framer Motion and modern glassmorphism utility classes.
- **📱 Fully Responsive:** Beautifully designed to work seamlessly across desktops, tablets, and mobile devices.

---

## 🛠️ Tech Stack

**Frontend (Client)**
- React 19 (Vite)
- TypeScript
- Tailwind CSS
- Framer Motion (Animations)
- Recharts (Data Visualization)
- Lucide React (Icons)
- React Query (Data Fetching)

**Backend (Server)**
- Node.js & Express.js
- TypeScript
- MongoDB (Mongoose ORM)
- JWT (JSON Web Tokens)
- Nodemailer (Email services)
- @supabase/supabase-js (Cloud Storage)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v22+ recommended) and [npm](https://www.npmjs.com/) installed.

### 1. Clone the repository
```bash
git clone https://github.com/Hemrishi1/smart-expense-tracker.git
cd smart-expense-tracker
```

### 2. Environment Variables
Create a `.env` file in the `server` directory and add the following variables:
```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d

# Email Services (For Password Reset)
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password

# Supabase Storage (For Avatars)
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_secret_service_role_key
```

### 3. Install Dependencies & Run

**Backend:**
```bash
cd server
npm install
npm run dev
```

**Frontend:**
```bash
cd client
npm install
npm run dev
```

The application will be running at `http://localhost:5173`.

---

## ☁️ Deployment

SmartX is optimized for modern cloud hosting platforms:
- **Frontend:** Deployed natively on [Render](https://render.com/) (Static Site). Client-side routing is handled via Render Rewrite rules (`/*` -> `/index.html`).
- **Backend:** Deployed as a Web Service on Render, securely connected to MongoDB Atlas.

---

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).

---
*Built with ❤️ and TypeScript.*
