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
  }
});

module.exports = mongoose.model("Notebook", notebookSchema);
