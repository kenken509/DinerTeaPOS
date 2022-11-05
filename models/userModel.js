const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    accType: { type: String, required: true },
    image: { type: String, required: false },
    employeeId: { type: String, required: true },
    userId: { type: String, required: true },
    password: { type: String, required: true },
    verified: { type: Boolean, required: true },
  },
  { timestamps: true }
);
const userModel = mongoose.model('users', userSchema);

module.exports = userModel;
