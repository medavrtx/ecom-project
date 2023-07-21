const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bestSellerSchema = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  order: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('BestSeller', bestSellerSchema);
