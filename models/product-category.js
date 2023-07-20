const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productCategorySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: false
      }
    }
  ]
});

module.exports = mongoose.model('ProductCategory', productCategorySchema);
