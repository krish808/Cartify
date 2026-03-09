import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import AppError from "../utils/AppError.js";

// 🔥 Helper: Recalculate Cart Total
const recalculateTotal = async (cart) => {
  const productIds = cart.items.map((item) => item.product);

  const products = await Product.find({
    _id: { $in: productIds },
  });

  let total = 0;

  for (const item of cart.items) {
    const matchedProduct = products.find(
      (p) => String(p._id) === String(item.product),
    );

    if (matchedProduct) {
      total += matchedProduct.price * item.quantity;
    }
  }

  cart.totalAmount = total;
};

// 🟢 ADD TO CART
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId) {
    throw new AppError("Product ID is required", 400);
  }

  const qty = quantity && quantity > 0 ? quantity : 1;

  const product = await Product.findById(productId);
  if (!product) throw new AppError("Product not found", 404);

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      seller: product.seller,
      items: [],
      totalAmount: 0,
    });
  }

  // 🔥 Enforce single seller rule
  if (String(cart.seller) !== String(product.seller)) {
    throw new AppError(
      "You can only add products from one seller per order",
      400,
    );
  }

  const itemIndex = cart.items.findIndex(
    (i) => String(i.product) === String(productId),
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += qty;
  } else {
    cart.items.push({ product: productId, quantity: qty });
  }

  await recalculateTotal(cart);
  await cart.save();

  res.status(200).json(cart);
};

// 🟢 GET CART
export const getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
    "name price",
  );

  if (!cart) {
    return res.json({ items: [], totalAmount: 0 });
  }

  res.json(cart);
};

// 🟢 REMOVE FROM CART
export const removeFromCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new AppError("Cart not found", 404);

  cart.items = cart.items.filter(
    (item) => String(item.product) !== String(req.params.productId),
  );

  if (cart.items.length === 0) {
    await cart.deleteOne();
    return res.json({ items: [], totalAmount: 0 });
  }

  await recalculateTotal(cart);
  await cart.save();

  res.json(cart);
};

// 🟢 CLEAR CART
export const clearCart = async (req, res) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.json({ items: [], totalAmount: 0 });
};

// 🟢 MERGE CART (🔥 NEW)
export const mergeCart = async (req, res) => {
  const guestItems = req.body.items;

  if (!guestItems || guestItems.length === 0) {
    return res.json({ message: "Nothing to merge" });
  }

  let cart = await Cart.findOne({ user: req.user._id });

  for (const item of guestItems) {
    const product = await Product.findById(item.productId);
    if (!product) continue;

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        seller: product.seller,
        items: [],
        totalAmount: 0,
      });
    }

    // 🔥 Single seller enforcement during merge
    if (String(cart.seller) !== String(product.seller)) {
      continue; // skip products from different seller
    }

    const existingIndex = cart.items.findIndex(
      (i) => String(i.product) === String(item.productId),
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += item.quantity;
    } else {
      cart.items.push({
        product: item.productId,
        quantity: item.quantity,
      });
    }
  }

  await recalculateTotal(cart);
  await cart.save();

  res.json(cart);
};
