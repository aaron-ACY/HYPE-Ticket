# 🎫 HYPE TICKET - Next-Gen Event Ticketing Platform

<p align="center">
  <img src="https://img.shields.io/badge/Spring_Boot-4.x-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 21" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Redis-7.x-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/MySQL-8.x-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" alt="GitHub Actions" />
</p>

---

## 📖 Overview

**HYPE Ticket** is a modern, high-performance online event discovery and ticketing platform designed to deliver seamless digital experiences for **Attendees**, **Event Organizers**, and **System Administrators**.

Built on cutting-edge technologies, the platform integrates immersive **3D interactive visuals (Three.js)**, real-time inventory management, secure check-in mechanics, and high-throughput caching with **Redis**.

---

## ✨ Key Features

### 🧑‍💻 1. Customer & Attendee Experience
- **Event Discovery & Filtering**: Search and filter events across multiple genres (Concerts, Exhibitions, Sports, Conferences), dates, and venues.
- **Interactive 3D Ticket Experience**: Dynamic 3D ticket pass viewer, holographic stage promos, and custom audio ambiance.
- **Tiered Ticketing & Real-time Booking**: Support for multi-tiered tickets (Early Bird, General Admission, VIP) with inventory locking and promo codes.
- **Digital Tickets & QR Check-in**: Automated secure QR code generation for on-site scanning; exportable to PDF and high-res image formats.
- **Order Management & Refund Requests**: Transparent order tracking with integrated refund submission workflows.

### 🎪 2. Organizer Dashboard
- **Event & Venue Management**: Create and configure events, seating setups, schedules, and custom venues.
- **Ticket Tiering & Quota Controls**: Manage pricing batches, quantity limits, and release windows.
- **Real-Time Revenue Analytics**: Interactive financial metrics, sales velocity tracking, and refund monitoring.
- **Organizer Verification (Blue Tick)**: Verified badge application workflow for trusted brands.

### 🛡️ 3. Administrator Console
- **Event Moderation**: Review, approve, or reject submitted events to maintain catalog quality.
- **Violation & Dispute Resolution**: Triage user reports and manage policy violations.
- **Platform Analytics**: Comprehensive insights into user growth, gross merchandise value (GMV), and commission fees.
- **User & Access Management**: Role-based access control (RBAC), account suspensions, and organizer credentials.

---

## 🏗️ Technology Stack & Architecture

### 🔹 Backend (`hype-api`)
- **Framework & Runtime**: Java 21, Spring Boot 4.x
- **Security**: Spring Security 6, Stateless JWT Authentication, Google OAuth2
- **Database & ORM**: MySQL 8.0, Spring Data JPA / Hibernate
- **Caching & Concurrency**: Redis 7 with Lettuce Connection Pooling
- **External Integrations**: Cloudinary (Media assets), JavaMailSender (Email notifications & E-tickets)

### 🔹 Frontend (`hype-fe`)
- **Core Stack**: React 19, TypeScript, Vite
- **Styling & Animations**: Tailwind CSS v4, Framer Motion, Lucide Icons
- **3D & Canvas Graphics**: Three.js, HTML5 Canvas
- **Utilities**: `jspdf`, `html2canvas`, `jsqr` (QR generation & scanning)

### 🔹 DevOps & CI/CD
- **Containerization**: Multi-stage Dockerfile for Backend & Nginx-based Frontend; Docker Compose for local dependencies.
- **Continuous Integration / Continuous Deployment**: GitHub Actions pipeline covering unit tests with ephemeral Redis containers, linting, Vite builds, and Docker packaging.

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- **Java JDK 21+**
- **Node.js 20+** & npm
- **Docker Desktop** (running)
- **MySQL 8.0+**

### Step-by-Step Setup

```bash
# 1. Clone the repository
git clone https://github.com/aaron-ACY/HYPE-Ticket.git
cd HYPE-Ticket

# 2. Start Redis with Docker Compose
docker compose up -d

# 3. Launch the Backend (hype-api)
cd hype-api
./mvnw spring-boot:run
# Backend API will be live at: http://localhost:8080/hype

# 4. Launch the Frontend (hype-fe)
cd ../hype-fe
npm install
npm run dev
# Frontend web app will be live at: http://localhost:5173
```

---

## 📁 Repository Structure

```
HYPE-Ticket/
├── .github/
│   └── workflows/
│       └── ci.yml               # Automated CI/CD pipeline
├── hype-api/                    # Spring Boot REST API (Java 21)
│   ├── src/main/java/com/huudan/hypeapi/
│   │   ├── config/              # Security, Redis, Cloudinary configuration
│   │   ├── controller/          # RESTful API Controllers
│   │   ├── dto/                 # Request/Response Data Transfer Objects
│   │   ├── model/               # JPA Entities
│   │   ├── repository/          # Data Repositories
│   │   ├── security/            # JWT Providers & Filters
│   │   └── service/             # Business Logic Layer
│   ├── Dockerfile               # Production multi-stage Docker build
│   └── pom.xml
├── hype-fe/                     # React Frontend (Vite + TypeScript)
│   ├── src/
│   │   ├── components/          # Reusable UI & 3D Canvas components
│   │   ├── context/             # Authentication & Toast contexts
│   │   ├── pages/               # Application Pages (Admin, Organizer, Client)
│   │   └── routes/              # Client routing configuration
│   ├── Dockerfile               # Production Nginx Dockerfile
│   └── package.json
└── docker-compose.yml           # Local development service orchestrator
```

---

## 📄 License & Attribution
Developed for educational and demonstration purposes. Maintained by [@aaron-ACY](https://github.com/aaron-ACY).
