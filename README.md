# DiLog — Diabetic Health Tracker App

A cross-platform, healthcare-focused mobile application for diabetes tracking, analytics, and AI-powered recommendations.

---

## Project Overview

**DiLog** is a cross-functional mobile application designed to help individuals with diabetes monitor, understand, and manage their condition more effectively. The application enables structured logging of glucose levels, meals, medications, and daily activities, combined with analytics and AI-driven meal recommendations to support informed decision-making.

The project follows **industry-standard software engineering practices**, including formal **SRS (Software Requirements Specification)** and **SDD (Software Design Document)** artifacts. Special emphasis is placed on **security, scalability, usability, and healthcare data compliance** (HIPAA/GDPR-aligned design principles).

---

## Team Members

| Name                     | Role                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------ |
| **Salih Mohamed**        | Group Leader, Backend Architecture, API Development & Integration, Quality Assurance |
| **Samuel Tilahun**       | Backend Development, API Development, Database Design, Cloud Infrastructure          |
| **Abdulhameed Ba Hakim** | Frontend Development, UI/UX Design                                                   |
| **Winnie Halm De-Souza** | Frontend Development, Technical Documentation                                        |

---

## Key Features

* **Glucose Monitoring** – Log glucose readings and analyze historical trends
* **Medication Management** – Schedule reminders and track adherence
* **Meal Tracking** – Log meals with nutritional categorization
* **AI Meal Recommendations** – Personalized suggestions based on user data patterns
* **Activity Logging** – Track physical activity and lifestyle habits
* **Data Analytics** – Weekly/monthly insights with visual dashboards
* **Report Exporting** – Generate PDF and CSV reports for medical review
* **Push Notifications** – Timely alerts for medications, meals, and glucose checks
* **User Profile Management** – Health goals, preferences, and personalization
* **Security-First Design** – Encrypted data handling and controlled access

---

## Tech Stack

### Frontend (Mobile)

* React Native (TypeScript)
* iOS & Android support
* Modular component-based UI
* Push Notifications
* (Planned) Apple HealthKit Integration

### Backend

* Spring Boot (Java)
* RESTful API Architecture
* PostgreSQL Database
* Firebase Authentication
* Firebase Cloud Functions (Notifications & Triggers)
* AI/ML Microservice (Python – TensorFlow / PyTorch)

### Tools & Standards

* Layered / Modular Architecture
* ISO 8601 Date & Time Standards
* Secure API Design (JWT / OAuth-based auth)
* HIPAA & GDPR-aligned privacy practices

---

## System Architecture

```
Mobile Client (React Native)
        │
        ▼
Backend API (Spring Boot)
        │
        ▼
Database (PostgreSQL)
        │
        ▼
AI/ML Service (Python)
        │
        ▼
Firebase Services (Auth, Notifications)
```

### Architecture Highlights

* Clear separation of concerns across layers
* Scalable API-driven backend
* Secure communication via TLS
* Encrypted data at rest and in transit
* Microservice-based AI integration

---

## System Modules

### 1. Authentication & User Management

* Firebase Authentication
* Secure session/token handling
* Role-based access control

### 2. Glucose Tracking Module

* Log and view glucose readings
* Trend visualization
* Alerts for abnormal ranges

### 3. Meal Tracking & AI Recommendations

* Nutritional data logging
* Pattern analysis
* AI-powered meal suggestions

### 4. Medication Management

* Reminder scheduling
* Adherence tracking

### 5. Activity Tracking

* Daily activity logging
* (Future) HealthKit integration

### 6. Analytics & Reporting

* Interactive charts and summaries
* PDF/CSV export

### 7. Security & Compliance

* Encrypted storage
* Secure API access
* Healthcare data privacy alignment

### 8. Backend API Services

* REST API endpoints for all modules
* Input validation and sanitization
* Authentication middleware
* Rate limiting and error handling
* Cloud Functions for background tasks

---

## Database Model (ERD Overview)

Core entities include:

* **User**
* **MedicalRecord**
* **MealLog**
* **MedicationSchedule**
* **ActivityLog**
* **ChatSession**
* **AIResponse**

### Key Relationships

* One User → Many MedicalRecords
* One User → Many MealLogs
* One User → Many MedicationSchedules
* One User → Many ActivityLogs
* One ChatSession → Many Messages

---

## Data Flow Summary

```
User → Mobile App → Backend API → Database / AI Service → Backend → App → User
```

* User logs stored securely in PostgreSQL
* AI service processes anonymized data
* Recommendations returned via API
* Reports generated client-side or server-side

---

## Use Cases Overview

* User registration and authentication
* Log glucose levels
* Log meals and activities
* Manage medication reminders
* View analytics dashboards
* Receive AI recommendations
* Export health reports
* Manage user settings
* Offline-first data capture (planned)

---

## Development Roadmap

### Phase 1 – MVP

* Core health logging
* Authentication
* Basic dashboards

### Phase 2 – Intelligence

* AI meal recommendations
* Predictive analytics
* Enhanced reporting

### Phase 3 – Integrations

* HealthKit
* Barcode food scanner
* Push notification optimization

### Phase 4 – Advanced Features

* Real-time alerts
* Caregiver and clinician access
* Administrative dashboards

---

## Repository Structure

```
DiLog/
│── docs/
│   ├── SRS.pdf
│   ├── SDD.pdf
│   ├── architecture-diagram.png
│   └── erd.png
│
│── backend/
│   └── spring-boot-service/
│
│── mobile/
│   └── react-native-app/
│
│── ai-service/
│   └── python-ml-service/
│
└── README.md
```

---

## Contribution Workflow

* Feature-based branching strategy
* Pull requests with reviews
* Adherence to SRS/SDD guidelines
* Mandatory documentation for architectural changes

---

## License

This project is developed for **academic and educational purposes**.
A formal open-source license will be added prior to public release.

---

## End of README
