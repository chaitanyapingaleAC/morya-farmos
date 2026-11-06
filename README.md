# Morya FarmOS (FarmCare Dairy Management)

A collaborative, multi-farm dairy operating platform built with **React 19**, **Vite**, **Express**, and **MySQL**.

---

## 🌟 Modules & Features

1. **🥛 Milk Production & Sales (NEW)**
   - Daily Milking Logs: Record Morning 🌅 and Evening 🌙 milk yield (Litres).
   - Track quality (Fat %) and selling rate (₹/Litre) with auto-computed session revenues.
   - Flexible tracking: log individual cow yield or whole-farm bulk milk batches.
   - Quick search & session filters with metrics summary (Today's Litres, Monthly Yield, Est. Revenue, Avg Fat %).

2. **🐄 Cow Management**
   - Register cows with unique Cow ID, breed, estimated/exact birth dates, and notes.
   - Search, edit, and manage active herd records.

3. **🧬 Breeding Records**
   - Record artificial insemination dates, track pregnancy confirmation status (`Pending`, `Confirmed`, `Not Pregnant`), and anticipated calving dates.

4. **💰 Expense Tracking**
   - Record feed, veterinary, medicine, and labor costs with payment modes (Cash, UPI, Bank).

5. **📊 Enhanced Dashboard**
   - Real-time summary cards: Total Cattle, Today's Milk Collection, Est. Milk Revenue, and Total Expenses.
   - One-click **Quick Action** buttons (*Log Milk*, *Register Cow*, *Add Expense*).
   - Side-by-side recent milking and recent expense activity tables.

6. **🔒 TopBar & User Navigation**
   - Application-wide top header showing date, role indicator, and a 1-click **Logout** button.

---

## 🚀 Setup & Running

### 1. Database Setup
Ensure MySQL is running, then run the schema in MySQL Workbench or CLI:
```sql
SOURCE database/schema.sql;
```

### 2. Backend Server (`server/`)
```powershell
cd server
npm.cmd install
npm.cmd run dev
```
The server will run at: `http://localhost:5000`

### 3. Frontend Client (`client/`)
```powershell
cd client
npm.cmd install
npm.cmd run dev
```
The client will run at: `http://localhost:5173`
