# UNI Bank Demo

A modern banking system demo application built with React, TypeScript, and Express.js. This project demonstrates a simple banking interface with features like account creation, money transfers, and transaction history.

## Features

- Modern, responsive UI built with React and shadcn/ui
- Account creation with custom ID generation
- Money transfers between accounts
- Transaction history tracking
- Real-time balance updates
- Dashboard with financial overview

## Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
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

## Running the Application

1. Start the backend server:
```bash
cd server
node index.js
```
The server will start on port 3001.

2. In a new terminal, start the frontend development server:
```bash
npm run dev
```
The frontend will be available at http://localhost:8080

## Project Structure

```
banking-system-demo/
├── src/               # Frontend source code
├── server/            # Backend server code
├── public/           # Static assets
└── package.json      # Project dependencies
```

## Environment Variables

Create a `.env` file in the server directory with the following variables:
```
PORT=3001
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
