const mongoose = require('mongoose');
function getLeaveNumber(){
  return Math.floor(Math.random() * 10000);
}
const leaveSchema = mongoose.Schema({
  leaveNumber: {
    type: Number,
    default: getLeaveNumber,
  },
  employeeName : String,
  startDate: String,
  enddate: String,
  Reason: String,
  status: {
    type: String,
    default: "Submitted"
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employeeModel"
  }
});
module.exports = mongoose.model("leaveModel", leaveSchema);