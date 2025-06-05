# UNI Bank - Banking System Demo

A modern banking system demo application built with React, TypeScript, and Express.js.

## Features

- User account creation and management
- Secure login system
- Dashboard with financial overview
- Transaction management (deposits, withdrawals, transfers)
- Real-time transaction updates
- Modern and responsive UI

## Live Demo

The frontend of this application is automatically deployed to GitHub Pages. You can access it at:
`https://[your-github-username].github.io/banking-system-demo/`

Note: The backend needs to be deployed separately to a cloud platform.

## Deployment

### Frontend (GitHub Pages)

The frontend is automatically deployed to GitHub Pages when you push to the main branch. To set this up:

1. Go to your repository settings
2. Navigate to "Pages" section
3. Under "Build and deployment":
   - Source: "GitHub Actions"
   - Branch: "main"
4. Push your code to the main branch and GitHub Actions will handle the deployment

### Backend (Cloud Options)

You can deploy the backend to any of these free platforms:

1. [Render](https://render.com/):
   - Create a new Web Service
   - Connect your GitHub repository
   - Set build command: `cd server && npm install`
   - Set start command: `cd server && npm start`

2. [Railway](https://railway.app/):
   - Import from GitHub repository
   - Set the root directory to `/server`
   - Deploy

3. [Fly.io](https://fly.io/):
   - Install flyctl
   - Run `fly launch`
   - Deploy with `fly deploy`

After deploying the backend, update the API URL in the frontend configuration.

## Local Development

### Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd banking-system-demo
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd server
npm install
cd ..
```

### Running Locally

Development mode:
```bash
npm run dev:all
```

Production mode:
```bash
npm run start:all
```

## Project Structure

- `/src` - Frontend source code
- `/server` - Backend source code
- `/public` - Static assets
- `/dist` - Production build output

## Technology Stack

- Frontend:
  - React
  - TypeScript
  - Vite
  - Tailwind CSS
  - Shadcn/ui
  - React Router
  - Zustand (State Management)

- Backend:
  - Node.js
  - Express.js
  - CORS

## License

[Your License]
