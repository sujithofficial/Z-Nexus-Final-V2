# Z-NEXUS 2K26 Symposium Management Platform

A professional full-stack symposium management system for **KGiSL Institute of Technology, Department of CS & BS**.

## Features

### PUBLIC
- **Home**: Dynamic hero section, countdown timer, and symposium highlights.
- **Events**: Explore technical and non-technical events with detailed rules and venue info.
- **Registration**: Smart registration system supporting individual and team entries (dynamic member management).
- **Payment**: UPI QR code payment and proof upload system (Multer).
- **Association & Faculty**: Profiles of student leaders and staff coordinators.
- **Gallery**: Responsive masonry grid for event memories.

### ADMIN
- **Secure Login**: JWT-protected administrative access.
- **Dashboard**: Real-time stats of registrations and events.
- **Event Management**: Full CRUD operations for symposium events.
- **Registration Verification**: View participant details and payment proof to approve/reject entries.
- **Gallery/Staff/Association**: Complete management of all dynamic site content.

## Tech Stack
- **Frontend**: React (Vite), TailwindCSS, Framer Motion, Lucide React.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Authentication**: JWT & Bcrypt.
- **File Upload**: Multer for images and screenshots.

## Getting Started

### Prerequisites
- Node.js installed.
- MongoDB running locally (default: `mongodb://localhost:27017/znexus_2k26`).

### 1. Run Backend
```bash
cd backend
npm install
node server.js
```

### 2. Run Frontend
```bash
cd frontend
npm install
npm run dev
```

### Admin Credentials (Default)
- **Username**: admin
- **Password**: admin123
