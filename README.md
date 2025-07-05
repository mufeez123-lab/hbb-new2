# Hindustan Bawa Builders

A full-stack construction company website built with React, Node.js, and MongoDB.

## Project Structure

```
hindustan/
├── project/                 # Frontend (React + Vite)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── project/server/          # Backend (Node.js + Express)
│   ├── index.js
│   ├── routes/
│   ├── models/
│   └── package.json
└── render.yaml              # Render deployment config
```

## Deployment Instructions

### Backend (Render)
- **Root Directory**: `project/server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### Frontend (Vercel)
- **Root Directory**: `project`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

## Environment Variables

### Backend (Render)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `CLIENT_URL`: Frontend URL (Vercel)
- `PORT`: 6000

### Frontend (Vercel)
- `VITE_API_URL`: Backend URL (Render)

## Local Development

### Backend
```bash
cd project/server
npm install
npm run dev
```

### Frontend
```bash
cd project
npm install
npm run dev
``` 