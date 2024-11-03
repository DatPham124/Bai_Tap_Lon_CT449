const mongoose = require("mongoose");
const Borrow = require("./app/models/Borrow"); // Đảm bảo đường dẫn đúng đến Borrow.js
const Book = require("./app/models/Book"); // Đảm bảo đường dẫn đúng đến Book.js
const User = require("./app/models/User"); // Đảm bảo đường dẫn đúng đến User.js
const Staff = require("./app/models/Satff.js"); // Đảm bảo đường dẫn đúng đến Staff.js
const config = require("./app/config");
const MongoDB = require("./app/utils/mongodb.util");
const app = require("./app");

// Chuỗi kết nối MongoDB
const DB_URI = "mongodb://localhost:27017/QuanLyMuonSach";

// Kết nối đến MongoDB
async function startServer() {
  try {
    await MongoDB.connect(DB_URI);
    console.log("Connected to the database!");

    // Khởi động server
    const PORT = config.app.port;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Cannot connect to the database!", error);
    process.exit();
  }
}

// Hàm thêm dữ liệu mẫu cho các collection
async function seedData() {
  // Dữ liệu mẫu cho sách
  const bookData = {
    bookName: "Lập Trình Cơ Bản 1",
    bookId: "SACH001",
    author: "Nguyễn Văn A",
    coverImage: "https://example.com/images/sach001.jpg",
    numberOfCopies: 5,
    publicationYear: 2020,
    publisherId: new mongoose.Types.ObjectId(), // Giả định bạn đã tạo một nhà xuất bản
  };

  // Dữ liệu mẫu cho người dùng
  const userData = {
    name: "Le Van A",
    phone_number: "091241204",
    address: "Long Xuyen, An Giang",
  };

  // Dữ liệu mẫu cho nhân viên
  const staffData = {
    name: "Staff Name",
    phone_number: "0901234567",
    address: "An Giang",
  };

  // Thêm dữ liệu vào collection Books
  const book = new Book(bookData);
  await book.save();
  console.log("Book added:", book);

  // Thêm dữ liệu vào collection Users
  const user = new User(userData);
  await user.save();
  console.log("User added:", user);

  // Thêm dữ liệu vào collection Staffs
  const staff = new Staff(staffData);
  await staff.save();
  console.log("Staff added:", staff);

  return { book, user, staff };
}

// Hàm kiểm tra model Borrow
async function testBorrowModel() {
  try {
    // Gọi hàm seedData để thêm dữ liệu mẫu
    const { book, user, staff } = await seedData();

    // Tạo một bản ghi mượn sách mới
    const newBorrow = new Borrow({
      bookId: book._id,
      userId: user._id,
      staffId: staff._id,
      borrowDate: new Date(),
      returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 tuần sau
    });

    // Lưu vào CSDL
    const savedBorrow = await newBorrow.save();
    console.log("Borrow record created:", savedBorrow);

    // Kiểm tra tìm kiếm mượn sách theo ID
    const foundBorrow = await Borrow.findById(savedBorrow._id)
      .populate("bookId")
      .populate("userId")
      .populate("staffId");
    if (foundBorrow) {
      console.log("Borrow record found:", foundBorrow);
    } else {
      console.log("Borrow record not found!");
    }

    // Kiểm tra cập nhật ngày trả sách
    foundBorrow.returnDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // Kéo dài thêm 1 tuần
    await foundBorrow.save();
    console.log("Borrow record updated:", foundBorrow);

    // Kiểm tra xóa bản ghi mượn
  } finally {
    mongoose.connection.close(); // Đóng kết nối sau khi kiểm tra xong
  }
}

// Khởi động server và kiểm tra model Borrow
startServer().then(testBorrowModel);
