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
        required: true
      }
    }
  ]
});

productCategorySchema.methods.addToCategory = function (product) {
  const productIndex = this.products.findIndex((p) => {
    return p.productId.toString() === product._id.toString();
  });

  const updatedProducts = [...this.products];
  if (productIndex >= 0) {
    return console.log('Product already exists in category');
  } else {
    updatedProducts.push({
      productId: product._id
    });
  }

  this.products = updatedProducts;
  return this.save();
};

productCategorySchema.methods.removeFromCategory = function (productId) {
  const updatedProducts = this.products.filter((p) => {
    return p.productId.toString() !== productId.toString();
  });
  this.products = updatedProducts;
  return this.save();
};

module.exports = mongoose.model('ProductCategory', productCategorySchema);
