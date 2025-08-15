# SplitBuddy – Smart Expense Sharing & Group Settlements

### Author

**Utsah** – Department of Chemical Engineering, IIT Roorkee
Enrollment No.: 22112109
Bhawan: Rajiv Bhawan

**🎉 Technopedia 2025 – Rajiv Bhawan Hackathon**

An intra-bhawan hackathon hosted by Rajiv Bhawan, IIT Roorkee, fostering creativity and problem-solving through AI, analytics, and smart decision-making.  
This project was built under the **Digital Innovation & Design** track.

---

## 📌 Project Overview
SplitBuddy is a **smart expense tracking and settlement platform** designed for groups, friends, and communities. It simplifies **expense logging, debt tracking, and settlements** while providing **insights and analytics** into group spending patterns.  

Whether it’s a trip with friends, monthly rent sharing, or managing club finances — SplitBuddy ensures transparency and accuracy.

---

## 🚀 Key Features
- **Group Expense Tracking** – Log shared expenses with amounts, participants, and currency.
- **Multi-Currency Support** – Track expenses in different currencies using `MoneyField`.
- **Smart Settlement Suggestions** – Automatically calculate who owes whom.
- **Expense Analytics & Graphs** – Category-wise, monthly, and favorite group expense insights.
- **Authentication & Profiles** – Secure user accounts and personalized dashboards.
- **Responsive UI** – Built with Material UI for a clean, modern look.

---

## 📊 Tech Stack

### **Backend**
- **Framework:** Django REST Framework
- **Database:** Sqlite (default), PostgreSQL (production)
- **Libraries:** `djmoney`, `rest_framework_money_field`, DRF serializers

### **Frontend**
- **Framework:** React (Vite setup)
- **Libraries:** Material UI, Recharts

---

## 📈 Highlights
- **Standardized Money Serialization** in JSON (`{"amount": value, "currency": "XYZ"}`).
- **Clean Code Practices** enforced with pre-commit hooks.
- **Modular Architecture** for scalability.

---

## 📂 Repository Structure

```

├── backend/
│   ├── analytics/
│   ├── expenses/
│   ├── groups/
│   ├── splitbuddy/
|   |   ├── settings.py
│   |   ├── urls.py
│   |   └── wsgi.py
│   ├── users/
│   ├── .env
│   ├── db.sqlite3
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── .env
│   ├── index.html
│   ├── eslint.config.js
│   ├── package-lock.json
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── .pre-commit-config.yaml

```

---

## 🔧 Development Setup

### **Backend**

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### **Frontend**

```bash
cd frontend
npm install
npm run dev
```
