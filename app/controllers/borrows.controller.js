exports.create = (req, res) => {
  res.send({ message: "Borrow transaction created successfully" });
};

exports.getAll = (req, res) => {
  res.send({ message: "List of all borrow transactions" });
};

exports.getById = (req, res) => {
  const borrowId = req.params.id;
  res.send({ message: `Details of borrow transaction with ID: ${borrowId}` });
};

exports.update = (req, res) => {
  const borrowId = req.params.id;
  res.send({
    message: `Borrow transaction with ID: ${borrowId} updated successfully`,
  });
};
