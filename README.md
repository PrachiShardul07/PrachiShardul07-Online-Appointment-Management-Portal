🏥 Online Appointment Management Portal

A simple, clean, and modern doctor appointment booking system built with Next.js, MongoDB, TailwindCSS, and NextAuth.

 Overview

This project is a mini full-stack web application that allows users to book appointments with doctors seamlessly. It includes a public booking interface for patients and a secure admin panel with analytics for managing all appointments.

It was built as an assignment / practice project while learning MERN & Next.js, but the structure and codebase follow real-world architecture and can easily be extended into a full system.

 Features
👨‍⚕️ Patient Features

View list of available doctors

See specialization & consultation fee

Book appointments with a 15-minute time-slot selection

Prevents double-booking (conflict check)

Get confirmation email via Nodemailer

Clean & modern UI using TailwindCSS

🔐 Admin Features

Secure login using NextAuth (Credentials Provider)

View all appointments

Cancel/delete appointments

Dashboard with chart showing appointments per doctor

Manage system data from a single place

🧰 Tech Stack
Frontend

Next.js (Pages Router)

React

TypeScript

TailwindCSS

Recharts

Backend

Next.js API Routes

MongoDB Atlas

Mongoose

NextAuth

Nodemailer

📦 Installation & Setup
1️⃣ Clone repository
git clone https://PrachiShardul07/appointment-portal.git
cd appointment-portal

2️⃣ Install dependencies
npm install

3️⃣ Create .env.local

Your environment variables must include:

MONGODB_URI=your_mongodb_uri

NEXTAUTH_SECRET=your_generated_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_password

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_user
SMTP_PASS=your_pass
EMAIL_FROM="Appointment Portal <no-reply@example.com>"


You can generate a NextAuth secret using:

node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

4️⃣ Run the development server
npm run dev

Visit the app at:
👉 http://localhost:3000
http://localhost:3000/admin/signup

5️⃣ Build for production
npm run build
npm start

🗂️ Folder Structure
appointment-portal/
│
├── pages/
│   ├── index.tsx            # doctor list
│   ├── book/[id].tsx        # booking page
│   ├── admin/               # admin pages
│   └── api/                 # backend routes
│
├── components/
│   ├── Navbar.jsx
│   ├── DoctorCard.jsx
│   └── ApptChart.jsx
│
├── models/
│   ├── Doctor.js
│   └── Appointment.js
│
├── lib/
│   ├── mongoose.js
│   └── email.js
│
├── styles/
│   └── globals.css
│
├── .env.local
└── README.md

📊 Admin Dashboard Preview

Features included:

Appointments list

Cancel button

Email details

Bar chart analytics

⏱️ Time Spent

Approx: 10–12 hours

UI and styling – 2 hours

Backend API development – 3 hours

Admin panel + authentication – 2 hours



🚀 Future Improvements

This project can be expanded with:

Doctor login & availability editor

Appointment rescheduling

SMS notifications

Role-based user system

Doctor dashboard for managing patients
