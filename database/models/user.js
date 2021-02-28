const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  id: String,
  selection: String
});

module.exports = mongoose.model("User", userSchema);