const crypto = require('crypto');
var slugify = require('slugify');
const { model, Schema, SchemaTypes } = require('mongoose');

const COLLECTION_NAME = 'Products';
const DOCUMENT_NAME = 'Product';

const productSchema = new Schema(
  {
    product_name: {
      type: String,
      require: true,
    },
    product_slug: {
      type: String,
      require: true,
    },
    product_thumb: {
      type: String,
      require: true,
    },
    product_description: {
      type: String,
      require: true,
    },
    product_price: {
      type: Number,
      require: true,
    },
    product_quantity: {
      type: Number,
      require: true,
    },
    product_type: {
      type: String,
      require: true,
      enum: ['Electronic', 'Clothing', 'Furniture'],
    },
    product_shop: {
      type: SchemaTypes.ObjectId,
      ref: 'Shop',
    },
    product_rating_average: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be above 0'],
      max: [0, 'Rating must be under 0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    product_variation: {
      type: Array,
      default: [],
    },
    status: {
      type: String,
      enum: ['Draft', 'Publish'],
      default: 'Draft',
      select: false,
      index: true,
    },
    product_attribute: {
      type: SchemaTypes.Mixed,
      require: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

productSchema.index({ product_name: 'text', product_description: 'text' });

productSchema.pre('save', function (next) {
  this.product_slug = `${slugify(this.product_name)}-${crypto.randomUUID()}`;
  next();
});

const clothingSchema = new Schema(
  {
    brand: {
      type: String,
      require: true,
    },
    size: {
      type: String,
    },
    material: {
      type: String,
    },
    product_shop: {
      type: SchemaTypes.ObjectId,
      ref: 'Shop',
    },
  },
  {
    collections: 'Clothings',
    timestamps: true,
  }
);

const electronicSchema = new Schema(
  {
    manufacture: {
      type: String,
      require: true,
    },
    model: {
      type: String,
    },
    color: {
      type: String,
    },
    product_shop: {
      type: SchemaTypes.ObjectId,
      ref: 'Shop',
    },
  },
  {
    collections: 'Electronics',
    timestamps: true,
  }
);

module.exports = {
  productModel: model(DOCUMENT_NAME, productSchema),
  clothingModel: model('Clothing', clothingSchema),
  electronicModel: model('Electronic', electronicSchema),
};
