// Hàm để xử lý khi tạo sách mới
exports.create = (req, res) => {
  res.send({ message: "Book created successfully" });
};

// Hàm để lấy danh sách tất cả sách
exports.getAll = (req, res) => {
  res.send({ message: "List of all books" });
};

// Hàm để lấy thông tin chi tiết của một cuốn sách theo ID
exports.getById = (req, res) => {
  const bookId = req.params.id;
  res.send({ message: `Details of book with ID: ${bookId}` });
};

// Hàm để cập nhật thông tin một cuốn sách
exports.update = (req, res) => {
  const bookId = req.params.id;
  res.send({ message: `Book with ID: ${bookId} updated successfully` });
};

// Hàm để xóa một cuốn sách
exports.delete = (req, res) => {
  const bookId = req.params.id;
  res.send({ message: `Book with ID: ${bookId} deleted successfully` });
};
