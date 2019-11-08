const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  notebooks: [
    {
      type: Schema.Types.ObjectId, // stores list of ids
      ref: "Notebook" // linked to event model
    }
  ]
});

module.exports = mongoose.model("User", userSchema);
