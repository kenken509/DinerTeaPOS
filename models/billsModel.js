const mongoose = require('mongoose');

const billsSchema = mongoose.Schema(
  {
    customerName: { type: String, required: false },
    customerPhoneNumber: { type: Number, required: false },
    cartItems: { type: Array, required: true },
    subTotalBeforeTax: { type: Number, required: true },
    subTotalAfterTax: { type: Number, required: true },
    tax: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

const billsModel = mongoose.model('bills', billsSchema);
module.exports = billsModel;
