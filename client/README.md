# ChefGPT Frontend 🍽✨

The ChefGPT frontend is a React + Vite single-page application that allows users to generate AI-powered recipes, save them, upload images, and interact with a community recipe feed.

## Features

- User authentication (Login / Signup)

- AI recipe generation form

- Recipe display with formatted output

- Personal cookbook management

- Community recipe sharing feed

- Drag-and-drop image upload

- Responsive UI design

## Tech Stack

- React

- Vite

- JavaScript

- CSS

- REST API integration

## Local Setup

### Prerequisites

- Node.js (v18+ recommended)

### Install Dependencies

```
npm install
```

### Run Development Server

```
npm run dev
```

Visit:

👉 http://localhost:5173/

### API Configuration

Ensure backend is running at:

👉 http://localhost:8000

If using environment variables, configure:

VITE_API_BASE_URL=http://localhost:8000

### Image Handling

- Drag-and-drop upload interface

- Images stored via backend → MinIO

- Optional placeholder images
    - disable security warning: 👉 https://placeholders.io/

## Development Tips

- Monitor browser console for API errors

- Ensure backend is running before generating recipes

- Inspect network tab for request/response debugging

- Use React DevTools for component inspection
