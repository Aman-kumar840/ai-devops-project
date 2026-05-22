# 🚀 AI-Powered DevOps Pipeline

An intelligent, self-healing CI/CD monitor that intercepts failed builds, vectorizes error logs, and leverages Large Language Models (Llama 3) to instantly diagnose root causes and suggest step-by-step fixes.

## 🌟 Overview

When a GitHub Actions build fails, developers typically waste time parsing through hundreds of lines of terminal logs. This project automates that workflow. It catches failed webhooks, generates mathematical embeddings of the error using `pgvector`, searches historical database records for similar past fixes, and uses **Groq (Llama 3)** to generate a plain-English explanation displayed on a real-time React dashboard.

## ✨ Core Features
* **Real-Time Build Interception:** Seamlessly integrates with GitHub Actions to catch `failure()` states instantly.
* **LLM Root-Cause Analysis:** Uses Llama 3 (via Groq API) to read raw, messy logs and output clean, JSON-formatted action plans.
* **Semantic Vector Memory:** Stores past fixes as vector embeddings in PostgreSQL, enabling the AI to "remember" and reference past solutions for recurring bugs.
* **Full-Stack Dashboard:** A Vite/React frontend that visualizes pipeline health and AI diagnostics in real-time.
* **Tunneling Bypass:** Custom headers engineered to pierce through free local tunnel security warnings for seamless local testing.

## 🛠️ Tech Stack
* **Frontend:** React, Vite, Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL, Prisma ORM, `pgvector` extension
* **AI & Machine Learning:** Groq API (Llama 3.1 8B), Vector Embeddings
* **Infrastructure:** GitHub Actions, LocalTunnel

---

## 🏗️ Architecture: How it Works

1. A developer pushes code with a bug (e.g., a syntax error or missing dependency).
2. **GitHub Actions** attempts to build the project, fails, and pipes the final 50 lines of the `build.log` to a secure webhook.
3. **LocalTunnel** routes the cloud webhook directly to the local Node.js backend.
4. The backend generates a vector embedding of the error and queries **PostgreSQL** for historical matches with a >85% similarity.
5. The context is passed to **Llama 3**, which formulates a step-by-step fix.
6. The data is saved via **Prisma** and instantly appears on the **React Dashboard**.

---

## 💻 Local Setup Instructions

### Prerequisites
* Node.js (v20+)
* PostgreSQL running locally (with `pgvector` enabled)
* A free [Groq API Key](https://console.groq.com/)

### 1. Clone the Repository
```bash
git clone [https://github.com/Aman-kumar840/ai-devops-project.git](https://github.com/Aman-kumar840/ai-devops-project.git)
cd ai-devops-project
2. Backend Setup
Bash
cd ai-devops-backend
npm install
Create a .env file in the ai-devops-backend directory:

Code snippet
PORT=3000
DATABASE_URL="postgresql://username:password@localhost:5432/ai_devops?schema=public"
GROQ_API_KEY="your_groq_api_key_here"
Run database migrations and start the server:

Bash
npx prisma generate
npx prisma db push
node src/server.js
3. Frontend Setup
Open a new terminal window:

Bash
cd ai-devops-frontend
npm install
npm run dev
4. Start the Webhook Tunnel
Open a third terminal window to expose your local backend to GitHub:

Bash
npx localtunnel --port 3000
Note: Copy the generated URL and update your .github/workflows/ci-pipeline.yml file with this new URL. Ensure you keep the -H "Bypass-Tunnel-Reminder: true" flag in your curl command.

🧪 Testing the Pipeline
To see the AI in action:

Make an intentional syntax error in ai-devops-frontend/src/App.jsx.

Commit and push the changes to GitHub.

Watch the GitHub Action fail, the backend terminal process the AI prompt, and the React dashboard update with the live diagnosis!

👨‍💻 Author
Aman Kumar

LinkedIn

GitHub