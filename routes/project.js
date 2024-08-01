const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
  projectName: String,
  startDate: {
    type: String,
    default: 0
  },
  endDate: {
    type: String,
    default: 0
  },
  manager: {
    type: String,
  },
  members: [],
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "taskModel"
    }
  ],
});
module.exports = mongoose.model("projectModel", projectSchema);