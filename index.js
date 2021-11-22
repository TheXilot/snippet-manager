const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

//dotenv
dotenv.config();
//set up express server

const app = express();
app.use(express.json());
app.listen(5000, () => console.log("server on port 5000"));

//set up routers

app.use("/snippet", require("./routers/snippetRouter"));

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
