# 🚀 AI-Powered DevOps Pipeline

An intelligent, self-healing CI/CD monitor that intercepts failed builds, vectorizes error logs, and leverages Large Language Models (Llama 3) to instantly diagnose root causes and suggest step-by-step fixes.

---

## 🌟 Overview

When a GitHub Actions build fails, developers typically waste time parsing through hundreds of lines of terminal logs. This project automates that workflow.

It captures failed webhook events, generates vector embeddings of error logs using `pgvector`, retrieves semantically similar historical fixes from PostgreSQL, and leverages **Llama 3 (Groq API)** to generate human-readable debugging suggestions displayed on a real-time React dashboard.

---

## ✨ Core Features

- **Real-Time Build Interception:** Integrates with GitHub Actions to instantly capture failed CI/CD workflows.
- **LLM Root-Cause Analysis:** Uses Llama 3 via Groq API to parse raw logs and generate structured debugging suggestions.
- **Semantic Vector Memory:** Stores historical fixes as vector embeddings in PostgreSQL using `pgvector`.
- **Full-Stack Dashboard:** Real-time React dashboard for monitoring pipeline failures and AI diagnostics.
- **Webhook Tunneling:** Uses LocalTunnel for secure local webhook testing during development.

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express.js

### Database
- PostgreSQL
- Prisma ORM
- pgvector

### AI & Infrastructure
- Groq API (Llama 3.1 8B)
- GitHub Actions
- LocalTunnel

---

## 🏗️ Architecture Workflow

1. A developer pushes buggy code to GitHub.
2. GitHub Actions executes the CI pipeline and captures failure logs.
3. Failed logs are sent to a secure webhook endpoint.
4. The backend generates vector embeddings of the logs.
5. PostgreSQL searches for semantically similar historical fixes using `pgvector`.
6. Relevant context is passed to Llama 3 for root-cause analysis.
7. AI-generated diagnostics are stored and displayed on the React dashboard in real time.

---

# 💻 Local Setup Instructions

## Prerequisites

- Node.js (v20+)
- PostgreSQL with `pgvector` enabled
- Groq API Key

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/Aman-kumar840/ai-devops-project.git
cd ai-devops-project
```

---

## 2️⃣ Backend Setup

```bash
cd ai-devops-backend
npm install
```

Create a `.env` file in the `ai-devops-backend` directory:

```env
PORT=3000
DATABASE_URL="postgresql://username:password@localhost:5432/ai_devops?schema=public"
GROQ_API_KEY="your_groq_api_key_here"
```

Run database migrations and start the server:

```bash
npx prisma generate
npx prisma db push
node src/server.js
```

---

## 3️⃣ Frontend Setup

Open a new terminal window:

```bash
cd ai-devops-frontend
npm install
npm run dev
```

---

## 4️⃣ Start the Webhook Tunnel

Open a third terminal window to expose your local backend to GitHub:

```bash
npx localtunnel --port 3000
```

Note: Copy the generated URL and update your `.github/workflows/ci-pipeline.yml` file with this new URL. Ensure you keep the `-H "Bypass-Tunnel-Reminder: true"` flag in your curl command.

---

# 🧪 Testing the Pipeline

To see the AI in action:

1. Make an intentional syntax error in `ai-devops-frontend/src/App.jsx`.
2. Commit and push the changes to GitHub.
3. Watch the GitHub Action fail, the backend terminal process the AI prompt, and the React dashboard update with the live diagnosis!

---

# 👨‍💻 Author

## Aman Kumar

- LinkedIn: https://www.linkedin.com/in/aman-kumar-016927308/
- GitHub: https://github.com/Aman-kumar840