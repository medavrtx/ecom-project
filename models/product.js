const db = require('../util/database');
const fs = require('fs');
const path = require('path');
const Cart = require('./cart');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, price, description, image, colorOptions, sizeOptions) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.description = description;
    this.image = image;
    this.colorOptions = colorOptions;
    this.sizeOptions = sizeOptions;
  }

  save() {
    if (this.id) {
      return db.execute(
        'UPDATE products SET title = ?, price = ?, description = ?, image = ? WHERE products.id = ?',
        [this.title, this.price, this.description, this.image, this.id]
      );
    } else {
      return db.execute(
        'INSERT INTO products (title, price, description, image) VALUES (?, ?, ?, ?)',
        [this.title, this.price, this.description, this.image]
      );
    }
  }

  static deleteById(id) {
    return db.execute('DELETE FROM products WHERE products.id = ?', [id]);
  }

  static fetchAll(cb) {
    return db.execute('SELECT * FROM products');
  }

  static findById(id) {
    return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
  }
};
