import createApiClient from "./api.service";
class BorrowService {
  constructor(baseUrl = "/api/borrow") {
    this.api = createApiClient(baseUrl);
  }
  async getAll() {
    return (await this.api.get("/")).data;
  }

  async create(data) {
    return (await this.api.post("/", data)).data;
  }
  async getById(id) {
    return (await this.api.get(`/${id}`)).data;
  }
  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }
  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }

  async getBorrowsWithDetails(id) {
    return (await this.api.get(`/getBook/${id}`)).data;
  }

  async getBorrowHistoryByUserId(id) {
    return (await this.api.get(`/${id}/history`)).data;
  }
}

export default new BorrowService();
