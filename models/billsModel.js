const mongoose = require('mongoose');

const billsSchema = mongoose.Schema(
  {
    customerName: { type: String, required: true },
    customerPhoneNumber: { type: Number, required: true },
    paymentMode: { type: String, required: true },
    cartItems: { type: Array, required: true },
    subTotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

const billsModel = mongoose.model('bills', billsSchema);
module.exports = billsModel;
