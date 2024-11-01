const { ObjectId } = require("mongodb");

class Publisher_Service {
  constructor(client) {
    this.Publishers = client.db().collection("Publishers");
  }

  extractPublisherData(payload) {
    const publisher = {
      publisherId: payload.publisherId,
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

    const result = await this.Publishers.findOneAndUpdate(
      { publisherId: publisher.publisherId }, // Sử dụng publisherId thay vì _id
      { $set: publisher },
      { returnDocument: "after", upsert: true }
    );
    return result.value;
  }

  async find(filter) {
    const cursor = await this.Publishers.find(filter);
    return await cursor.toArray();
  }

  async findById(id) {
    if (!ObjectId.isValid(id)) {
      return null; // Trả về null nếu ID không hợp lệ
    }

    // Nếu ID hợp lệ, tiến hành truy vấn MongoDB
    return await this.Publishers.findOne({
      _id: new ObjectId(id),
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractPublisherData(payload);
    const result = await this.Publishers.findOneAndUpdate(
      filter,
      { $set: update },
      { returnOriginal: "after" } // Use this for MongoDB versions < v4.2
    );
    return result;
  }

  async delete(id) {
    const result = await this.Publishers.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }
}

module.exports = Publisher_Service;
