const express = require("express");
const mongoose = require("mongoose");

//set up express server

const app = express();
app.use(express.json());
app.listen(5000, () => console.log("server on port 5000"));

//set up routers

app.use("/snippet", require("./routers/snippetRouter"));

//mongoose connect

mongoose.connect(
  "mongodb://snippetUser:Belfkih123@snippet-manager-shard-00-00.qghn1.mongodb.net:27017,snippet-manager-shard-00-01.qghn1.mongodb.net:27017,snippet-manager-shard-00-02.qghn1.mongodb.net:27017/main?ssl=true&replicaSet=atlas-14eqss-shard-0&authSource=admin&retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) return console.error(err);
    console.log("connected to mongoDB");
  }
);
