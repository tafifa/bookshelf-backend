const express = require('express');
const router = express.Router();

const {
  getAllBooksController
} = require("../controllers/booksController");

router.get('/books', getAllBooksController);

module.exports = router;
