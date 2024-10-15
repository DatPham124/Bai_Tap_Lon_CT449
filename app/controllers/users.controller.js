// Hàm để xử lý khi tạo độc giả mới
exports.create = (req, res) => {
  res.send({ message: "User created successfully" });
};

// Hàm để lấy danh sách tất cả độc giả
exports.getAll = (req, res) => {
  res.send({ message: "List of all users" });
};

// Hàm để lấy thông tin chi tiết của một độc giả theo ID
exports.getById = (req, res) => {
  const userId = req.params.id; // Sửa từ bookId thành userId
  res.send({ message: `Details of user with ID: ${userId}` });
};

// Hàm để cập nhật thông tin một độc giả theo ID
exports.update = (req, res) => {
  const userId = req.params.id; // Sửa từ bookId thành userId
  res.send({ message: `User with ID: ${userId} updated successfully` });
};

// Hàm để xóa một độc giả theo ID
exports.delete = (req, res) => {
  const userId = req.params.id; // Sửa từ bookId thành userId
  res.send({ message: `User with ID: ${userId} deleted successfully` });
};
