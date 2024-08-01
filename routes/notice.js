const mongoose = require('mongoose');

const noticeSchema = mongoose.Schema({
  Heading : String,
  Desc: String,
});
module.exports = mongoose.model("noticeModel", noticeSchema);