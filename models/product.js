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
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true
  }
});

productSchema.pre('remove', async function (next) {
  const ProductCategory = require('./productCategory');
  const productId = this._id;

  try {
    await ProductCategory.updateMany(
      { 'products.productId': productId },
      { $pull: { products: { productId: productId } } }
    );
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Product', productSchema);
