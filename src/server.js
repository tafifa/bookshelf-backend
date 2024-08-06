const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());

const bookRoutes = require("./routes/booksRoutes");
const userRoutes = require("./routes/usersRoutes");

app.use(bookRoutes);
app.use(userRoutes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
