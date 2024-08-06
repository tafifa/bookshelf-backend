const express = require('express');
const router = express.Router();

const {
  getAllUsersController
} = require("../controllers/usersController");

router.get('/users', getAllUsersController);

module.exports = router;
