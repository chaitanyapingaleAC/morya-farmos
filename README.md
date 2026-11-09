# Morya FarmCare - Dairy Farm Management System

A simple, full-stack web application built with **React (Vite)**, **Node.js (Express)**, and **MySQL** to manage cattle and farm operational expenses.

---

## 📋 Project Overview & Architecture

This project is organized into a clean 3-tier architecture:
1. **Frontend (`client/`)**: Built using React with Vite. Provides a clean and modern user interface.
2. **Backend (`server/`)**: Built with Node.js and Express REST APIs. Handles business logic and authenticates requests via JWT.
3. **Database (`database/`)**: Relational MySQL database storing users, cattle records, and expenses.

---

## 🌟 Core Modules

### 1. 🐄 Cattle / Cow Management
- Register new cattle with unique Tag/ID, Name, Breed, Date of Birth (exact or estimated), and Notes.
- View, filter, and search herd records.
- In-place Edit and Delete cattle records with real-time updates.

### 2. 💰 Expense Tracking
- Log farm expenditures with Date, Category (Feed, Medicines, Labour, Electricity, etc.), Amount, Payment Mode (Cash, UPI, Bank Transfer, Cheque), and Description.
- Automatically calculate total cumulative expenses.
- Edit and Delete expense entries.

### 3. 📊 Farm Overview Dashboard
- Clean summary cards showing:
  - **Total Cattle** in herd
  - **Total Expenses** formatted in ₹ INR
  - **Expense Records Count**
- Side-by-side quick tables showing the latest registered cows and latest expenses with direct links to full management pages.

### 4. 🔐 Authentication & Security
- Secure token-based authentication (JWT) for login.
- Protected routes ensuring only authenticated farm owners access farm data.

---

## 🗄️ Database Tables (`database/schema.sql`)

1. **`farms`**: Stores farm details (`farm_id`, `farm_name`).
2. **`users`**: Stores user authentication credentials (`user_id`, `email`, `password_hash`, `role`, `farm_id`).
3. **`cows`**: Stores cattle herd details (`cow_id`, `cow_name`, `date_of_birth`, `birth_date_is_estimated`, `breed`, `description`, `farm_id`).
4. **`expenses`**: Stores expense records (`expense_id`, `farm_id`, `expense_date`, `category`, `amount`, `payment_mode`, `description`).

---

## 🚀 How to Run the Project

### 1. Database Setup
Ensure MySQL is running, then import the simplified schema:
```sql
SOURCE database/schema.sql;
```

### 2. Backend Server (`server/`)
```bash
cd server
npm install
npm run dev
```
> Server runs on `http://localhost:5000`

### 3. Frontend Client (`client/`)
```bash
cd client
npm install
npm run dev
```
> Client runs on `http://localhost:5173`

---

## 💡 Quick Talking Points for Teacher Presentation

1. **Why this stack?**
   - **React (Frontend)**: Fast, component-based UI with reactive state updates (`useState`, `useEffect`).
   - **Express (Backend)**: Lightweight, modular RESTful API architecture with clear routes and controllers.
   - **MySQL (Database)**: Relational schema ensuring data integrity and relational queries by `farm_id`.

2. **API Endpoints:**
   - Cattle: `GET /api/cows`, `POST /api/cows`, `PUT /api/cows/:id`, `DELETE /api/cows/:id`
   - Expenses: `GET /api/expenses`, `POST /api/expenses`, `PUT /api/expenses/:id`, `DELETE /api/expenses/:id`
   - Auth: `POST /api/auth/login`, `POST /api/auth/register`
