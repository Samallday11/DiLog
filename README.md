# DiLog — Diabetic Health Tracker App
A comprehensive iOS application for diabetes tracking, analytics, and AI-powered recommendations.

---

## Project Overview
DiLog is an iOS-based diabetic health tracking application designed to help individuals monitor and manage diabetes effectively. The system enables tracking of glucose levels, meals, medications, and daily activities while providing reminders and personalized AI-generated meal recommendations.

The project follows industry-level software documentation practices, including SRS (Software Requirements Specification) and SDD (Software Design Document), with a focus on security, usability, and healthcare compliance (HIPAA/GDPR).

---

## Team Members

| Name | Role |
|------|------|
| **Salih Mohamed** | Group Leader, API Development & Integration, Quality Assurance |
| **Samuel Tilahun** | Backend Development, **API Development**, Database Design, and Cloud Control |
| **Abdulhameed Ba Hakim** | Front-End Developer & UI/UX Design |
| **Winnie Halm De-Souza** | Front-End Development & Documentation |

---

## Key Features
- **Glucose Monitoring** – Log glucose readings and view historical trends  
- **Meal Tracking** – Log meals and nutritional data  
- **Medication Management** – Set up reminders and track medication schedules  
- **Activity Logging** – Track daily physical activity  
- **AI Meal Recommendations** – Personalized suggestions based on patterns  
- **Data Analytics** – Weekly and monthly charts with trend insights  
- **Reports Export** – Generate PDF/CSV reports  
- **Push Notifications** – Reminders for medications, glucose checks, and meals  
- **User Profile System** – Manage preferences and health goals  
- **HIPAA-Compliant Security Design** – Encrypted storage & secure data handling  

---

## Tech Stack

### Frontend
- Swift  
- SwiftUI  
- Xcode  
- iOS 17+  
- Notification Framework  
- (Future) Apple HealthKit  

### Backend
- Firebase Authentication  
- Firebase Firestore  
- Firebase Cloud Storage  
- Firebase Cloud Functions  
- REST API Endpoints  
- CoreML (AI Meal Recommendation Engine)

### Tools & Standards
- MVC / Modular Architecture  
- ISO 8601 Date Format  
- HIPAA + GDPR Privacy Standards  

---

## System Architecture

```
Presentation Layer (SwiftUI)
        │
        ▼
Application Logic (Modules)
        │
        ▼
Cloud Backend (Firebase Auth, Firestore, Functions, Storage)
```

### Architecture Highlights
- Three-layer modular design  
- Secure communication using TLS  
- Scalable API-driven backend  
- Clear separation of concerns  
- Encrypted data at rest and in transit  

---

## System Modules

### 1. Authentication & User Sessions
- Secure login with Firebase Auth  
- Token/session management  
- Logout & timeout logic  

### 2. Glucose Tracking Module
- Add/view glucose logs  
- Visualize patterns  
- Alerts for abnormal levels  

### 3. Meal Tracking Module
- Log nutritional data  
- Meal categorization  
- AI-based meal suggestions  

### 4. Medication Module
- Scheduling and reminders  
- Tracking adherence  

### 5. Activity Tracking Module
- Track steps, workouts  
- (Future) Integrate HealthKit  

### 6. Analytics & Reporting
- Charts and summaries  
- PDF/CSV export options  

### 7. Security & Compliance
- Encrypted storage  
- Controlled access permissions  
- Healthcare privacy alignment  

### 8. API Development (Backend Services)
- REST API endpoints for all modules  
- Input validation  
- Middleware for authentication  
- Firestore read/write operations  
- API-level rate limiting  
- Cloud Functions for backend logic  

---

## Database Model (ERD Overview)

Main entities include:
- **User**
- **MedicalRecord**
- **ChatSession**
- **Message**
- **AIResponse**

**Key Relationships**
- One User → Many MedicalRecords  
- One User → Many ChatSessions  
- One ChatSession → Many Messages  
- One Message → One AIResponse  

---

## Data Flow Summary

```
User → iOS App → Firebase Auth/Firestore → AI Engine → App → User
```

- Logs sent to Firestore  
- AI module generates recommendations  
- Firestore syncs results to app  
- Reports generated in-app  

---

## Use Cases Overview
- Register / Login  
- Log glucose levels  
- Log meals  
- Set medication reminders  
- View activity logs  
- Receive AI recommendations  
- Generate/export reports  
- Manage user settings  
- Offline-first logging  

---

## Roadmap

### Phase 1 – MVP
- Core logging features  
- User authentication  
- Basic dashboards  

### Phase 2 – Intelligence
- AI meal recommendations  
- Predictive charts  
- Enhanced analytics  

### Phase 3 – Integrations
- HealthKit  
- Barcode food scanner  
- Apple Watch app  

### Phase 4 – Advanced
- Real-time alerting  
- Caregiver access  
- Doctor dashboard  

---

## Repository Structure (Early Stage)

```
DiLog/
│── docs/
│   ├── SRS.pdf
│   ├── SDD.pdf
│   ├── architecture-diagram.png
│   └── erd.png
│
│── src/
│   └── (Swift files here)
│
└── README.md
```

---

## Contribution Workflow
- Use feature branches  
- Submit pull requests  
- Follow SRS/SDD-defined structure  
- Document all architectural changes  

---

## License
This project is intended for academic and educational use.  
A license will be added upon release.

---

## End of README
