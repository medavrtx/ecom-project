const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productCategorySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true
  }
});

module.exports = mongoose.model('Product', productCategorySchema);
