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

## High-Level Design (HLD)

### Overview

- Purpose: Provide a simplified RFQ system that supports British Auction-style bidding with automatic time extensions, forced close rules, configurable behavior, and transparent audit logs.
- Key components: Frontend (React/Vite), Backend (Node/Express), Database (MongoDB), Real-time/Extensions controller (server-side scheduler or in-process timer), Activity logging.

### Architecture

```mermaid
graph LR
    Browser[Client (React)] -->|REST / Websockets| API[Express API Server]
    API --> DB[(MongoDB)]
    API --> Scheduler[(Auction Scheduler / Extension Logic)]
    Scheduler --> DB
    API -->|Logs| ActivityDB[(ActivityLog Collection)]
    note right of Scheduler: Monitors active auctions, applies<br/>trigger-window + extension rules
```

### Components

- **Frontend**: pages for Auction Listing and Auction Details, bid forms, activity views.
- **Backend**: REST endpoints for RFQs and Bids, controllers implement business logic including ranking and extension handling.
- **Scheduler/Extension Logic**: monitors auctions nearing their close time, applies extension rules (X trigger window, Y extension duration), ensures forced close not exceeded.
- **Database**: MongoDB collections for RFQs, Bids, Suppliers, ActivityLog.

### Auction Flow

1. Buyer creates RFQ with British Auction configuration (Trigger Window X, Extension Duration Y, Forced Close Time).
2. Suppliers submit bids via frontend -> POST /bids.
3. Bid saved, ranking recalculated; ActivityLog records submission.
4. If a bid or rank change occurs within Trigger Window and forced-close not reached, Scheduler extends Bid Close Time by Y.
5. Scheduler logs each extension with reason; if Bid Close Time reaches Forced Close Time, no further extensions.
6. At forced close or when closing condition met, Scheduler runs closeAuction to accept L1 and reject others.

### Validation Rules

- `forcedCloseTime` > `bidCloseTime` at RFQ creation/update.
- Any extension must not move `bidCloseTime` beyond `forcedCloseTime`.

### Schema Design (Collections)

#### RFQ
- `_id`: ObjectId
- `title`: String
- `description`: String
- `status`: String ('active'|'closed'|'cancelled')
- `startDate`: Date
- `bidCloseDate`: Date
- `forcedCloseDate`: Date
- `triggerWindowMinutes`: Number (X)
- `extensionMinutes`: Number (Y)
- `createdBy`: String
- `budget`: Number

#### Bid
- `_id`: ObjectId
- `rfqId`: ObjectId (ref RFQ)
- `supplierId`: String
- `amount`: Number
- `deliveryDate`: Date
- `validityDays`: Number
- `charges`: Object (freight, origin, destination)
- `status`: String ('pending'|'accepted'|'rejected')
- `rank`: Number
- `createdAt`: Date

#### Supplier
- `_id`: ObjectId
- `name`, `email`, `phone`, `address`
- `rating`: Number
- `totalBids`: Number
- `winCount`: Number

#### ActivityLog
- `_id`: ObjectId
- `rfqId`: ObjectId
- `action`: String (e.g., 'Bid Submitted', 'Auction Extended')
- `details`: String
- `performedBy`: String
- `timestamp`: Date
- `metadata`: Mixed

### API Endpoints

- `GET /rfqs` - list auctions
- `GET /rfqs/:id` - auction details (includes config X/Y and forcedClose)
- `POST /rfqs` - create RFQ (validate forcedClose > bidClose)
- `PUT /rfqs/:id` - update RFQ (validate rules)
- `GET /bids/rfq/:rfqId` - list bids for RFQ
- `POST /bids` - submit bid (re-rank and possibly trigger extension)

### Extension Trigger Logic

Examples:
- If `now >= bidCloseTime - X` and a new bid arrives -> extend by Y (but clamp to forcedCloseTime).
- If ranking changes (e.g., L1 changed) within trigger window -> extend by Y.

### Success Metrics & Deliverables

- Include metrics instrumentation points: bid counts, extension counts, final price vs initial median.
- Deliverables: HLD (this section), schema (above), backend code (in `/backend`), frontend code (in `/frontend`).

### Notes & Next Steps

- Consider using a lightweight scheduler (in-process setTimeouts) for prototypes; move to a job queue (Bull/Redis) for production scale.
- For near-real-time UX, add WebSocket or SSE to push bid/extension events to clients.
