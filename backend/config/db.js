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
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
