const { ObjectID, ReturnDocument, ObjectId } = require("mongodb");

class Staff_Service {
  constructor(client) {
    this.Staff = client.db().collection("Staffs");
  }

  extractStaffData(payload) {
    const staff = {
      first_name: payload.first_name,
      lasr_name: payload.last_name,
      role: payload.role,
      address: payload.address,
      phone_number: payload.phone_number,
    };
  }
}
