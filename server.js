const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const api = require("./routes/api");
const { mongoose } = require("mongoose");
const app = express();

app.use(cors());
dotenv.config();
app.use(express.json());
app.use("/api", api);

// ! Connection
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.DB_NAME,
  })
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(process.env.PORT, function () {
  console.log(`Server Running On PORT: ${process.env.PORT}`);
});
