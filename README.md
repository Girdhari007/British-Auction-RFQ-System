# British Auction RFQ System

A full-stack application for managing Request for Quotations (RFQ) in British auction contexts.

## Project Structure

```
british-auction-rfq/
├── backend/          # Node.js/Express backend
│   ├── config/       # Configuration files
│   ├── controllers/   # Route controllers
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   ├── utils/        # Utility functions
│   ├── app.js        # Express app setup
│   ├── server.js     # Server entry point
│   ├── .env          # Environment variables
│   └── package.json
│
├── frontend/         # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── api.js       # API utilities
│   │   ├── App.jsx      # Main app component
│   │   ├── main.jsx     # Entry point
│   │   └── index.css    # Styles
│   ├── public/       # Static assets
│   └── package.json
│
└── README.md
```

## Getting Started

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Technologies

- **Backend**: Node.js, Express.js
- **Frontend**: React, Vite
- **Other**: CORS, dotenv

## License

ISC
