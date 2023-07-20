const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  bestSeller: {
    type: Number,
    required: false,
    default: null
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'ProductCategory',
    required: false
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true
  }
});

module.exports = mongoose.model('Product', productSchema);
