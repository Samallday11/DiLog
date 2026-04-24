# 🧠 DiLog — Health Tracking & AI Support Platform

DiLog is a full-stack health tracking application that allows users to log and monitor key daily metrics such as glucose levels, medication intake, and daily activities. It also includes an AI-powered assistant for basic interaction and insight generation.

> ⚠️ **AI Disclaimer:** The AI assistant is not a medical professional and may make mistakes. Always consult a qualified healthcare provider for medical advice.

---

## 🚀 Features

### 📊 Health Tracking
- Log glucose levels
- Record medication intake
- Track daily activities
- View recent logs in real-time
- Access glucose history

### 🤖 AI Integration
- **AI Chat:** Simple chatbot powered by a locally hosted GPT-2 model
- **AI Insights:** Generates basic feedback based on user data (glucose, activity, medication)

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Mobile/Web Frontend | React Native (Expo) |
| HTTP Client | Axios |
| Backend | Spring Boot (Java) |
| Database | PostgreSQL |
| Authentication | Firebase |
| AI Service | Python, FastAPI, Hugging Face Transformers (GPT-2) |

---

## ⚙️ System Architecture

```
Mobile/Web Frontend (Expo React Native)
        ↓
Spring Boot Backend (Java) — REST API
        ↓
Python FastAPI Service (GPT-2)
        ↓
PostgreSQL Database
```

---

## 🌐 Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend (Web) | Vercel | [di-log.vercel.app](https://di-log.vercel.app) |
| Backend | Railway | Configured via Railway service |

### Frontend (Vercel)
- **Root Directory:** `mobile`
- **Build Command:** `npx expo export --platform web`
- **Output Directory:** `dist`
- Auto-deploys on push to `main`

### Backend (Railway)
- **Root Directory:** `backend`
- **Build Command:** `./mvnw clean package -DskipTests`
- **Start Command:** `java -jar target/*.jar`
- Auto-deploys on push to `main`

---

## 🧪 Getting Started (Local Development)

### 1. Clone the Repository

```bash
git clone https://github.com/Samallday11/DiLog.git
cd DiLog
```

### 2. Backend Setup (Spring Boot)

Configure `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/dilog_db
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

Run the backend:

```bash
cd backend
./mvnw spring-boot:run
```

### 3. Database

- Ensure PostgreSQL is running locally
- Tables will be auto-created on first run:
  - `medications`
  - `activities`
  - `glucose_logs`

### 4. AI Service Setup (GPT-2)

Install dependencies:

```bash
pip install transformers torch fastapi uvicorn
```

Run the AI service:

```bash
uvicorn gpt2_service:app --reload --port 8000
```

Test the API docs at `http://localhost:8000/docs`

> **Note:** First run may take a few minutes as the GPT-2 model downloads locally. No API key required.

### 5. Frontend Setup

```bash
cd mobile
npm install
npm start
```

---

## 🔌 API Endpoints

### Backend (Spring Boot)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/chat` | AI chat |
| POST | `/insight` | AI-generated insights |
| POST | `/medications` | Log medication |
| GET | `/medications` | Fetch medications |
| POST | `/activities` | Log activity |
| GET | `/activities` | Fetch activities |

### AI Service (FastAPI)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/chat` | Chat with GPT-2 |
| POST | `/insight` | Generate health insights |

---

## 📌 Future Improvements

- [ ] Upgrade to more advanced AI models (e.g., LLaMA)
- [ ] Improve AI insight accuracy
- [ ] Add data visualizations (charts & trends)
- [ ] Enhance UI/UX design
- [ ] Add push notifications for medication reminders
- [ ] iOS & Android app store releases via EAS Build

---

## 👨‍💻 Authors

- **Salih Mohamed**
- **Samuel Tilahun**

---

## 📄 License

This project is for educational purposes only.
