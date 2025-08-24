const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

dotenv.config();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static("static"));
app.use(cors({ credentials: true }));

// Connect to DB
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

app;
app.use("/citius", require("./routes/profile/index"));
app.use("/citius", require("./routes/medicineInventory/index"));

app.listen(1333, () => {
  console.log("server is running on 1333");
});
