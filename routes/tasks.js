const mongoose = require('mongoose');
const generateUniqueTaskNumber = () => {
  return Math.floor(Math.random() * 10000); // Current timestamp + random number
};
const taskSchema = mongoose.Schema({
  taskNumber: {
    type : Number,
    default: generateUniqueTaskNumber
  },
  taskName : String,
  taskStartDate: String,
  taskEndDate : String,
  priority : String, 
  employeeName : String,
  status: {
    type: String,
    default: "Assigned"
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employeeModel"
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "projectModel"
  }
});
module.exports = mongoose.model("taskModel", taskSchema);