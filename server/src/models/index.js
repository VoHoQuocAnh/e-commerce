// server/src/models/index.js
const sequelize = require('../config/db');
const User = require('./User');
const Address = require('./Address');
const Category = require('./Category');
const Product = require('./Product');
const ProductVariant = require('./ProductVariant');
const ProductImage = require('./ProductImage');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Coupon = require('./Coupon');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Payment = require('./Payment');
const Review = require('./Review');
const Wishlist = require('./Wishlist');
const Banner = require('./Banner');

// User <-> Address
User.hasMany(Address, { foreignKey: 'user_id', as: 'addresses', onDelete: 'CASCADE' });
Address.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Category self-referencing hierarchy
Category.hasMany(Category, { foreignKey: 'parent_id', as: 'children' });
Category.belongsTo(Category, { foreignKey: 'parent_id', as: 'parent' });

// Category <-> Product
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// Product <-> ProductVariant
Product.hasMany(ProductVariant, { foreignKey: 'product_id', as: 'variants', onDelete: 'CASCADE' });
ProductVariant.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Product <-> ProductImage
Product.hasMany(ProductImage, { foreignKey: 'product_id', as: 'images', onDelete: 'CASCADE' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// User <-> Cart
User.hasOne(Cart, { foreignKey: 'user_id', as: 'cart', onDelete: 'CASCADE' });
Cart.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Cart <-> CartItem <-> ProductVariant
Cart.hasMany(CartItem, { foreignKey: 'cart_id', as: 'items', onDelete: 'CASCADE' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_id', as: 'cart' });

ProductVariant.hasMany(CartItem, { foreignKey: 'product_variant_id', as: 'cartItems', onDelete: 'CASCADE' });
CartItem.belongsTo(ProductVariant, { foreignKey: 'product_variant_id', as: 'variant' });

// User <-> Order
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Coupon <-> Order
Coupon.hasMany(Order, { foreignKey: 'coupon_id', as: 'orders' });
Order.belongsTo(Coupon, { foreignKey: 'coupon_id', as: 'coupon' });

// Order <-> OrderItem
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

Product.hasMany(OrderItem, { foreignKey: 'product_id', as: 'orderItems' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

ProductVariant.hasMany(OrderItem, { foreignKey: 'product_variant_id', as: 'orderItems' });
OrderItem.belongsTo(ProductVariant, { foreignKey: 'product_variant_id', as: 'variant' });

// Order <-> Payment
Order.hasMany(Payment, { foreignKey: 'order_id', as: 'payments', onDelete: 'CASCADE' });
Payment.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// Review associations
User.hasMany(Review, { foreignKey: 'user_id', as: 'reviews', onDelete: 'CASCADE' });
Review.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Product.hasMany(Review, { foreignKey: 'product_id', as: 'reviews', onDelete: 'CASCADE' });
Review.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

Order.hasMany(Review, { foreignKey: 'order_id', as: 'reviews' });
Review.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// Wishlist associations
User.hasMany(Wishlist, { foreignKey: 'user_id', as: 'wishlists', onDelete: 'CASCADE' });
Wishlist.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Product.hasMany(Wishlist, { foreignKey: 'product_id', as: 'wishlists', onDelete: 'CASCADE' });
Wishlist.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

module.exports = {
  sequelize,
  User,
  Address,
  Category,
  Product,
  ProductVariant,
  ProductImage,
  Cart,
  CartItem,
  Coupon,
  Order,
  OrderItem,
  Payment,
  Review,
  Wishlist,
  Banner,
};
