import mongoose from "mongoose";

/**
 * Establishes a persistent connection to MongoDB.
 * Exits the process on failure — there's no point running the server
 * without a database connection in a stateful API like this.
 */
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      // Kept explicit for forward-compatibility across Mongoose major versions
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (err) {
    console.error(`Database connection failed: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
