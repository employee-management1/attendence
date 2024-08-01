const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

mongoose.connect("mongodb+srv://employeemanagement1234:Employee%40123@cluster0.znvg4ci.mongodb.net/management?retryWrites=true&w=majority&appName=Cluster0");

const employeeSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  id: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  contact: {
    type: Number,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  password : {
    type : String,
  },
  leave: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "leaveModel"
    }
  ],
  tasks : [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "taskModel"
    }
  ],
  attendence : [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "attendenceModel"
    }
  ]
});
employeeSchema.plugin(plm);
module.exports = mongoose.model("employeeModel", employeeSchema);
