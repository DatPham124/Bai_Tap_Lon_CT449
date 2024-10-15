exports.create = (req, res) => {
  res.send({ message: "Staff created successfully" });
};

exports.getAll = (req, res) => {
  res.send({ message: "List of all staff" });
};

exports.getById = (req, res) => {
  const staffId = req.params.id;
  res.send({ message: `Details of staff with ID: ${staffId}` });
};

exports.update = (req, res) => {
  const staffId = req.params.id;
  res.send({ message: `Staff with ID: ${staffId} updated successfully` });
};

exports.delete = (req, res) => {
  const staffId = req.params.id;
  res.send({ message: `Staff with ID: ${staffId} deleted successfully` });
};
