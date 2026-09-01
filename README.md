<div align="center">

  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=35&pause=1000&color=38BDF8&center=true&vCenter=true&width=600&lines=%E2%9C%A8+SiteFlow+AI;AI-Powered+Website+Builder;Full+MERN+Stack+%2B+Gemini+AI;Instant+6-Digit+Brevo+OTP+Auth" alt="Typing SVG" />

  <p align="center">
    <strong>Build production-ready, high-converting single page websites in seconds powered by Gemini AI.</strong>
  </p>

  <p align="center">
    <a href="https://site-flow-ai-eight.vercel.app/"><strong>🌐 View Live Demo »</strong></a>
    &nbsp;•&nbsp;
    <a href="https://github.com/ManpreetSinghGrewal/SiteFlow-AI"><strong>⭐ GitHub Repository</strong></a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Gemini_2.5_Flash-8E75B2?style=for-the-badge&logo=google-gemini&logoColor=white" alt="Gemini AI" />
    <img src="https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  </p>

  ---

</div>

## 🌟 Overview

**SiteFlow AI** is a state-of-the-art **MERN Stack** (MongoDB, Express, React, Node.js) web application designed to generate, edit, and publish beautifully styled landing pages on-demand using Google's **Gemini 2.5 Flash** artificial intelligence.

Featuring a dark glassmorphic UI, custom lerp-physics cursor followers, rotating glowing button borders, and a complete end-to-end **Brevo 6-Digit OTP Email Verification system**, SiteFlow AI delivers an unparalleled developer and user experience.

---

## ✨ Core Features

- 🤖 **AI-Powered Code Generation**: Stream custom, responsive single-page HTML/CSS sites generated in under 30 seconds via Gemini AI.
- 🔐 **6-Digit OTP Email Verification**: Secure registration powered by Brevo HTTPS REST API, preventing unverified logins with HTTP 403 enforcement.
- 🗄️ **Native MongoDB Data Persistence**: Real-time project saving, user profile management, and hashed credentials (`bcryptjs`).
- 🎨 **Next-Gen Cyberpunk Glassmorphism UI**:
  - 💫 Pulse animation logo glow
  - ✨ Rotating glowing button borders
  - 🌈 Active link gradient underlines
  - 🎯 Interactive glowing pointer ring follower with lerp physics
  - ⚡ AI "thinking" wave dots indicator
  - 🎞️ Film-grain texture overlay
- 🚀 **Serverless Ready**: Fully configured Express serverless entrypoints (`api/index.ts`) for zero-config Vercel deployment.

---

## 🛠️ Tech Stack

<table>
  <tr>
    <th>Layer</th>
    <th>Technologies Used</th>
  </tr>
  <tr>
    <td><strong>Frontend</strong></td>
    <td>React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Shadcn UI, Sonner Toasts</td>
  </tr>
  <tr>
    <td><strong>Backend</strong></td>
    <td>Node.js, Express.js, TypeScript, JWT Auth (`jsonwebtoken`), `bcryptjs`</td>
  </tr>
  <tr>
    <td><strong>Database</strong></td>
    <td>MongoDB Atlas Native Driver (`mongodb`)</td>
  </tr>
  <tr>
    <td><strong>AI Engine</strong></td>
    <td>Google Gemini 2.5 Flash Model (`@google/genai`)</td>
  </tr>
  <tr>
    <td><strong>Email Delivery</strong></td>
    <td>Brevo HTTPS REST API v3 (Transactional OTP, Welcome & Reset Email Templates)</td>
  </tr>
  <tr>
    <td><strong>Deployment</strong></td>
    <td>Vercel Serverless Functions (`vercel.json`)</td>
  </tr>
</table>

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js `v18+`
- MongoDB Atlas Connection URI
- Gemini API Key ([Google AI Studio](https://aistudio.google.com/))
- Brevo API Key ([Brevo Dashboard](https://app.brevo.com/settings/keys/api))

### 2. Installation & Setup

```bash
# Clone the repository
git clone https://github.com/ManpreetSinghGrewal/SiteFlow-AI.git

# Navigate into the project directory
cd SiteFlow-AI

# Install dependencies
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:

```env
# MongoDB Atlas
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.wgwbmjl.mongodb.net/siteflow?retryWrites=true&w=majority"

# Gemini AI
GEMINI_API_KEY="your-gemini-api-key"

# Brevo Email Delivery
BREVO_API_KEY="xkeysib-your-brevo-api-key"
BREVO_SENDER_EMAIL="manpreetsgrewal5911@gmail.com"
BREVO_SENDER_NAME="SiteFlow AI"

# JWT Secret & Port
JWT_SECRET="your-super-secret-jwt-key-32-chars"
PORT=3001
```

### 4. Run Locally

```bash
# Start both backend server (port 3001) and Vite frontend (port 8080)
npm run dev:all
```

Open `http://localhost:8080` in your browser.

---

## 📡 API Endpoints Architecture

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/signup` | Registers new user & dispatches Brevo 6-digit OTP code | ❌ |
| `POST` | `/api/auth/send-otp` | Generates & sends fresh 6-digit OTP verification email | ❌ |
| `POST` | `/api/auth/verify-email` | Validates 6-digit OTP code, activates account & returns JWT | ❌ |
| `POST` | `/api/auth/resend-verification` | Resends fresh 6-digit OTP code to unverified accounts | ❌ |
| `POST` | `/api/auth/login` | Validates credentials (blocks unverified accounts with HTTP 403) | ❌ |
| `POST` | `/api/auth/forgot-password` | Generates tokenized password reset link via Brevo | ❌ |
| `POST` | `/api/auth/reset-password` | Validates token & updates user password | ❌ |
| `GET` | `/api/auth/me` | Returns current authenticated user info | ✅ |
| `GET` | `/api/profiles/me` | Fetches user profile details | ✅ |
| `PUT` | `/api/profiles/me` | Updates display name & business profile | ✅ |
| `GET` | `/api/projects` | Lists user's saved website projects | ✅ |
| `POST` | `/api/projects` | Saves generated website HTML/CSS code | ✅ |
| `PUT` | `/api/projects/:id` | Updates an existing website project | ✅ |
| `DELETE` | `/api/projects/:id` | Deletes a project from MongoDB | ✅ |
| `POST` | `/api/chat` | Streams Gemini AI website code generation | ✅ |
| `GET` | `/api/health` | Returns server health & MongoDB ping status | ❌ |

---

## 📁 Folder Structure

```
SiteFlow-AI/
├── api/                  # Vercel serverless function entrypoint (index.ts)
├── server/               # Express backend application
│   ├── index.ts          # Server initialization & MongoDB connection
│   ├── brevo.ts          # Brevo REST API email delivery & HTML templates
│   ├── mongodb.ts        # MongoDB Atlas client connection module
│   ├── routes/           # Express router endpoints (auth, chat, profiles, projects)
│   └── types.ts          # Server-side TypeScript models & interfaces
├── src/                  # React Vite frontend application
│   ├── components/       # UI components, Navbar, AuthDialog, GlowingCursor
│   ├── context/          # Auth state provider context
│   ├── lib/              # API fetch utility wrapper & config
│   ├── pages/            # Page views (Index, Builder, Profile, VerifyEmail, ResetPassword)
│   └── index.css         # Keyframes, glowing borders, active links & grain effects
├── vercel.json           # Vercel deployment rewrite rules
└── README.md             # Project documentation
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check the [issues page](https://github.com/ManpreetSinghGrewal/SiteFlow-AI/issues).

---

<div align="center">

  Made with ❤️ by [Manpreet Singh Grewal](https://github.com/ManpreetSinghGrewal)

  &copy; 2026 SiteFlow AI. All rights reserved.

</div>
