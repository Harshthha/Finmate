<h1 align="center">💰 FinMate</h1>
<h3 align="center">Your Smart Personal Finance & Subscription Companion</h3>

<p align="center">
A simple, powerful, AI-assisted finance manager that helps you control spending,
track subscriptions, avoid surprise renewals, and build better money habits.
</p>

---

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen" />
  <img src="https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-orange" />
  <img src="https://img.shields.io/badge/AI-Gemini-blue" />
  <img src="https://img.shields.io/badge/UI-Clean%20%26%20Minimal-black" />
</p>

---

## ✨ What is FinMate?

Most people lose track of their daily spending, forget subscriptions, and overspend unintentionally.  
**FinMate helps you stay in control** by managing expenses, monitoring subscriptions, warning you when money behaviour becomes risky, and even giving AI-powered financial insights.

---

## 🚀 Features

### 🔐 Secure Authentication
✔ Firebase Email Authentication  
✔ User-specific encrypted storage

---

### 💵 Expense Manager
✔ Add expenses  
✔ Categorize (Food, Travel, Rent, Shopping etc.)  
✔ Tag as **Need** or **Want**  
✔ Delete anytime  
✔ Auto total calculation  

---

### 📅 Subscription Manager
✔ Add subscriptions with:  
- Monthly Cost  
- Start Date  
- Duration (months)  
- Category (OTT / Fitness / Education / Productivity)  
- Need vs Want

✔ Smart Renewal System  
✔ Next renewal calculation  
✔ Upcoming renewal highlight  

---

### 📊 Smart Dashboard
✔ Total Expenses  
✔ Total Subscription Burn (Monthly)
✔ Remaining Monthly Balance  
✔ Renewal Alerts Count  
✔ Intelligent Spending Advice

---

## 🤖 AI Financial Analyst (Gemini Powered)

FinMate’s AI acts like your **personal finance coach**:
- Understands spending nature
- Evaluates Needs vs Wants
- Reviews subscription health
- Checks risk level
- Suggests improvement actions
- Clean professional tone (not messy AI markdown)

---

## 🔔 Smart Notifications System
Stored per user in Firebase
- ⚠ Budget 80% Warning  
- ❌ Overspent Alert  
- 🚨 Savings Breach Alert  
- 📅 Subscription Alerts  
  - Renew Today  
  - Renew Tomorrow  
  - Renew in 7 days  

✨ **No duplicate notifications in a day**

---

## 🛠 Tech Stack

| Layer | Technology |
|------|------------|
| UI | HTML, CSS, JavaScript |
| Backend | Firebase Firestore |
| Auth | Firebase Authentication |
| Hosting | Firebase Hosting |
| AI | Google Gemini API |

---

## 📂 Project Structure

FinMate/
├── index.html
├── charts.html
├── settings.html
├── ai.html
├── style.css
├── app.js
├── firebaseConfig.js
└── geminiConfig.js


---

## ⚙️ Setup

### 1️⃣ Clone Repo
```bash
git clone <your-repo-url>
cd FinMate
```
2️⃣ Firebase Setup

Create file:
```
firebaseConfig.js
```
Add:
```
const firebaseConfig = {
 apiKey: "",
 authDomain: "",
 projectId: "",
 storageBucket: "",
 messagingSenderId: "",
 appId: ""
};
```

Create file:
```
geminiConfig.js
```
Add:
```
const GEMINI_API_KEY = "YOUR_KEY";
```



<p align="center">
  🚀 <a href="https://finmate-a31f7.web.app" target="_blank"><b>Live Demo – Try FinMate Now</b></a>
</p>
