const mongoose = require('mongoose');

const attendenceSchema = mongoose.Schema({
  employeeName : String,
  date: {
    type: String,
    default: 0
  },
  login: {
    type: String,
    default: 0
  },
  logout: {
    type: String,
    default: 0
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employeeModel"
  }
});
module.exports = mongoose.model("attendenceModel", attendenceSchema);