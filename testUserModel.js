// testUserModel.js
const mongoose = require("mongoose");
const User = require("./app/models/User"); // Đảm bảo đường dẫn đúng đến User.js
const config = require("./app/config");
const MongoDB = require("./app/utils/mongodb.util");
const app = require("./app");

// Chuỗi kết nối MongoDB của bạn
const DB_URI = "mongodb://localhost:27017/QuanLyMuonSach";

// Kết nối MongoDB
async function startServer() {
  try {
    await MongoDB.connect(config.db.uri);
    console.log("Connected to the databases!");

    const PORT = config.app.port;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Cannot connect to the databases!", error);
    process.exit();
  }
}

startServer();

// Hàm kiểm tra model User
async function testUserModel() {
  try {
    // 2. Kiểm tra truy vấn người dùng qua email
    const foundUser = await User.findOne({ email: "Dat@gmail.com" });
    if (foundUser) {
      console.log("User found:", foundUser);
    } else {
      console.log("User not found!");
    }

    // 3. Kiểm tra phương thức comparePassword
    const isPasswordValid = await foundUser.comparePassword("123456789");
    console.log("Password is valid:", isPasswordValid);
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    mongoose.connection.close(); // Đóng kết nối sau khi kiểm tra xong
  }
}

testUserModel();
