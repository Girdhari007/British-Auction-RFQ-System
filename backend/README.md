# British Auction RFQ - Backend

A Node.js/Express backend for managing Request for Quotations (RFQ) in British auction contexts.

## Features

- RFQ Management (Create, Read, Update, Delete)
- Bid Management
- Supplier Management
- Activity Logging
- Bid Ranking and Scoring
- Auction Statistics

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Environment**: dotenv

## Project Structure

```
backend/
├── config/          # Database and configuration
├── controllers/     # Business logic
├── models/          # MongoDB schemas
├── routes/          # API routes
├── utils/           # Helper functions
├── app.js           # Express app setup
├── server.js        # Server entry point
├── package.json
├── .env
└── README.md
```

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root:

```
PORT=5000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/british-auction-rfq
API_KEY=your_api_key_here
```

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## API Endpoints

### RFQs
- `GET /rfqs` - Get all RFQs
- `GET /rfqs/:id` - Get RFQ by ID
- `POST /rfqs` - Create new RFQ
- `PUT /rfqs/:id` - Update RFQ
- `DELETE /rfqs/:id` - Delete RFQ

### Bids
- `GET /bids/rfq/:rfqId` - Get bids for RFQ
- `GET /bids/:id` - Get bid by ID
- `POST /bids` - Submit new bid
- `PUT /bids/:id` - Update bid
- `DELETE /bids/:id` - Delete bid

## Database Models

### RFQ
- Title, Description, Status
- Budget, Start Date, End Date
- Created By timestamp

### Bid
- RFQ Reference, Supplier ID
- Amount, Delivery Date
- Status, Rank, Notes

### Supplier
- Name, Email, Contact Info
- Rating, Total Bids, Win Count
- Status

### ActivityLog
- RFQ Reference, Action, Details
- Performed By, Timestamp, Metadata

## License

ISC
