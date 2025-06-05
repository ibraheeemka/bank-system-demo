# UNI Bank - Banking System Demo

A modern banking system demo application built with React, TypeScript, and Express.js.

## 🌐 Live Demo

Try out the live application:
- Frontend: https://ibragimkamalov.github.io/banking-system-demo/
- Backend API: https://bank-system-demo.onrender.com

## ✨ Features

- User account creation and management
- Secure login system
- Dashboard with financial overview
- Transaction management (deposits, withdrawals, transfers)
- Real-time transaction updates
- Modern and responsive UI

## 🚀 Quick Start

1. Visit the [live demo](https://ibragimkamalov.github.io/banking-system-demo/)
2. Create a new account or use these demo credentials:
   - Account ID: `DEMO123456`
   - Password: `demo123`

## 💻 Tech Stack

- Frontend:
  - React with TypeScript
  - Vite for build tooling
  - Tailwind CSS & Shadcn/ui for styling
  - Zustand for state management
  - GitHub Pages for hosting

- Backend:
  - Node.js with Express
  - Render.com for hosting
  - CORS enabled API
  - RESTful architecture

## 🛠️ Development

### Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)

### Local Setup

1. Clone the repository:
```bash
git clone https://github.com/[your-github-username]/banking-system-demo.git
cd banking-system-demo
```

2. Install dependencies:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..
```

3. Start development servers:
```bash
npm run dev:all
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## 📝 API Documentation

### Endpoints

- `POST /api/send-account-id`: Create new account
- `GET /health`: API health check
- `GET /`: API status

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

[Your Name]
- GitHub: [@your-github-username](https://github.com/[your-github-username])

## 🙏 Acknowledgments

- Built with [Shadcn/ui](https://ui.shadcn.com/)
- Hosted on [GitHub Pages](https://pages.github.com/) and [Render](https://render.com/)
