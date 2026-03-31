import mongoose from 'mongoose';

export async function connectDB(mongoUri) {
  if (!mongoUri) {
    throw new Error('MONGODB_URI is required');
  }
  
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.warn('⚠️ MongoDB connection failed, continuing without database:', error.message);
    // Don't throw the error, just log it and continue
    // This allows the server to start for testing purposes
  }
}
