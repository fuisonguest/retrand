const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  useremail: {
    type: String,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  address: {
    type: Array,
  },
  price: {
    type: String,
  },
  productpic1: {
    type: String,
  },
  productpic2: {
    type: String,
  },
  productpic3: {
    type: String,
  },
  productpic4: {
    type: String,
  },
  productpic5: {
    type: String,
  },
  productpic6: {
    type: String,
  },
  productpic7: {
    type: String,
  },
  productpic8: {
    type: String,
  },
  productpic9: {
    type: String,
  },
  productpic10: {
    type: String,
  },
  productpic11: {
    type: String,
  },
  productpic12: {
    type: String,
  },
  owner: {
    type: String,
  },
  ownerpicture: {
    type: String,
  },
  catagory: {
    type: String,
    required: true,
  },
  subcatagory: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Set the default value to the current date and time
  },
  isPromoted: {
    type: Boolean,
    default: false,
  },
  promotionStartDate: {
    type: Date,
  },
  promotionEndDate: {
    type: Date,
  },
  promotionPaymentId: {
    type: String,
  },
  promotionOrderId: {
    type: String,
  },
  vehicleData: {
    type: Object,  // Using Object type to store nested vehicle properties
  },
  categoryData: {
    type: Object,  // Using Object type to store nested category-specific properties
  },
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
