const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
// const fileupload = require("express-fileupload");
// const multer = require("multer");
//dotenv
dotenv.config();
//set up express server

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/upload", express.static("upload"));
// app.use(fileupload());
app.listen(5000, () => console.log("server on port 5000"));

//set up routers

app.use("/snippet", require("./routers/snippetRouter"));
app.use("/auth", require("./routers/userRouter"));

//mongoose connect

mongoose.connect(
  process.env.MDB_CONNECT_STRING,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) return console.error(err);
    console.log("connected to mongoDB");
  }
);
