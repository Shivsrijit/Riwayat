# Riwayat - Indian Cultural Heritage Platform

A modern web application showcasing India's rich cultural heritage through an interactive platform that connects artisans, cultural enthusiasts, and learners. Built with React, Node.js, and MongoDB to preserve and celebrate India's diverse cultural traditions.

## Features

### Frontend Features
- **Interactive Cultural Map**: Explore cultural events and activities across different parts of India
- **Artisan Marketplace**: Browse and purchase authentic handcrafted products directly from artisans
- **Creator Hub**: Platform for artists and cultural practitioners to share their work
- **Learning Modules**: Access to workshops and educational content about traditional arts
- **Community Engagement**: Connect with other cultural enthusiasts and practitioners
- **Modern Luxury UI**: Dark theme with gold typography and glassmorphic panels
- **Category-Based Navigation**: Interactive icons linking to different cultural aspects

### Backend Features
- **RESTful APIs**: Complete CRUD operations for events, stories, destinations, workshops, forum, and artists
- **User Authentication**: JWT-based secure authentication system
- **Content Management**: Protected dashboard for content creators
- **Database Integration**: MongoDB with structured schemas for all content types
- **Real-time Data**: Dynamic content fetching from backend APIs

---

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API communication
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcrypt** for password hashing

---

## Getting Started

### 1. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.

### 2. Run Backend

```bash
cd backend
npm install
npm start
```

Runs on `http://localhost:4000`.

---

## Project Structure

```
riwayat/
├── frontend/               # React + TypeScript + Vite web app
│   ├── src/
│   │   ├── components/     # Header, Footer, AuthModal, CartDrawer, InteractiveMap, Marketplace
│   │   ├── pages/          # Home, Stories, Workshops, Forum, Destinations, RecentEvents, Artists, Dashboard
│   │   ├── services/       # Centralized API client with fallback datasets
│   │   ├── contexts/       # AuthContext and Shopping Cart state
│   │   └── index.css       # Custom design system & animations
│   └── package.json
├── backend/                # Node.js Express REST API server
│   ├── models/             # Mongoose Schemas (User, FeaturedStory, Product, Artist, Workshop, ForumPost, etc.)
│   ├── routes/             # API routes
│   ├── app.js              # Express app
│   ├── seed.js             # Database seeder script
│   └── package.json
├── Riwayat.pdf             # Project Pitch Deck
├── propmpt.txt             # Design System Reference
└── README.md
```

---

**RIWAYAT** - Preserving India's Cultural Legacy for Future Generations
