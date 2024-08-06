const getAllBooksController = async (req, res) => {
  res.json({result: "Sending All Books"})
};

module.exports = {
  getAllBooksController
};
