const { MongoClient } = require("mongodb");

class MongoDB {
  static connect = async (uri) => {
    if (this.client) return this.client;
    this.client = await MongoClient.connect(uri);
    return this.client;
  };

  static getClient = () => {
    if (!this.client) {
      throw new Error(
        "Database connection not established. Call connect first."
      );
    }
    return this.client; // Trả về client nếu đã kết nối
  };
}

module.exports = MongoDB;
