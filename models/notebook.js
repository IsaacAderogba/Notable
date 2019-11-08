const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notebookSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date, // up to us to convert
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId, 
    ref: "User",
    required: true
  },
  authors: [
    {
      type: Schema.Types.ObjectId, // stores list of ids
      ref: "User" // linked to event model
    }
  ]
});

module.exports = mongoose.model("Notebook", notebookSchema);
