const mongoose = require("mongoose");

class MongoDB {
  static async connect(uri) {
    if (this.client) return this.client;

    try {
      this.client = await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to MongoDB with Mongoose!");
      return this.client;
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      throw error;
    }
  }

  static getClient() {
    if (!this.client) {
      throw new Error(
        "Database connection not established. Call connect first."
      );
    }
    return this.client;
  }
}

module.exports = MongoDB;
