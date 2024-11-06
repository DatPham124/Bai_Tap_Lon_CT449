const Publisher = require("/home/datpham/CT449-Lab/BTL/app/models/Publisher.js"); // Import mô hình Publisher
const mongoose = require("mongoose"); // Thêm dòng này

class Publisher_Service {
  extractPublisherData(payload) {
    const publisher = {
      publisherName: payload.publisherName,
      publisherAddress: payload.publisherAddress,
    };

    Object.keys(publisher).forEach(
      (key) => publisher[key] === undefined && delete publisher[key]
    );
    return publisher;
  }

  async create(payload) {
    const publisher = this.extractPublisherData(payload);
    const newPublisher = new Publisher(publisher);

    const result = await newPublisher.save(); // Lưu mô hình mới vào cơ sở dữ liệu
    return result;
  }

  async find(filter) {
    return await Publisher.find(filter); // Tìm tất cả nhà xuất bản theo điều kiện
  }

  async findById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null; // Trả về null nếu ID không hợp lệ
    }

    return await Publisher.findById(id); // Tìm nhà xuất bản theo ID
  }

  async update(id, payload) {
    const update = this.extractPublisherData(payload);
    const result = await Publisher.findByIdAndUpdate(id, update, { new: true }); // Cập nhật và trả về tài liệu mới
    return result;
  }

  async delete(id) {
    const result = await Publisher.findByIdAndDelete(id); // Xóa nhà xuất bản theo ID
    return result;
  }
}

module.exports = Publisher_Service;
