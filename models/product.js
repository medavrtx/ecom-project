const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: false,
    default: 'Uncategorized',
  },
  bestSeller: {
    type: Number,
    required: false,
    default: null,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
});

module.exports = mongoose.model('Product', productSchema);
