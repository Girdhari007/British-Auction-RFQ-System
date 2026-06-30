const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const dbURI = process.env.DATABASE_URL || 'mongodb://localhost:27017/british-auction-rfq';

    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('Database connection error:', error.message);
    console.log('Starting backend without a database. Connect MongoDB to store RFQs and bids.');
    return null;
  }
};

module.exports = connectDB;
