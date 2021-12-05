const mongoose = require("mongoose");
const ObjectID = mongoose.Schema.Types.ObjectID;
const snippetSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    code: { type: String },
    userId: { type: ObjectID, required: true },
  },
  {
    timestamps: true,
  }
);

const Snippet = mongoose.model("snippet", snippetSchema);

module.exports = Snippet;
