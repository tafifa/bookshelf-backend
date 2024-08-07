const {
  getBooks
} = require("../services/booksService");

const getBooksController = async (req, res) => {
  try {
    const { offset, limit, q, sort, fields, ...filters } = req.query;
    const { results, pagination } = await getBooks({ offset, limit, q, sort, fields, ...filters });
    res.json({
      posts: results,
      meta: {
        pagination
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while fetching the books.");
  }
};

module.exports = {
  getBooksController,
};
