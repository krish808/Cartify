import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../src/models/User.js";
import Product from "../src/models/Product.js";
import Cart from "../src/models/Cart.js";
import Order from "../src/models/Order.js";
import Payment from "../src/models/Payment.js";

const confirmed = process.argv.includes("--yes");
const includeOrders = process.argv.includes("--include-orders");

const findOrCreateSeller = async (name, email) => {
  let seller = await User.findOne({ email });
  if (!seller) {
    seller = await User.create({
      name,
      email,
      password: await bcrypt.hash("password123", 10),
      role: "seller",
    });
  }
  return seller;
};

const img = (label) =>
  `https://placehold.co/400x400?text=${encodeURIComponent(label)}`;

const catalog = [
  {
    seller: { name: "TechHub Seller", email: "techhub@test.com" },
    category: "Electronics",
    products: [
      ["Wireless Headphones", 1500, 25],
      ["Bluetooth Speaker", 2200, 15],
      ["Power Bank 10000mAh", 1200, 40],
      ["Smart Watch", 3500, 2], // low stock on purpose, to test the stock check
      ["USB-C Cable", 300, 100],
    ],
  },
  {
    seller: { name: "PaperTrail Seller", email: "papertrail@test.com" },
    category: "Books & Stationery",
    products: [
      ["Ruled Notebook", 200, 60],
      ["Fountain Pen", 450, 30],
      ["Hardcover Journal", 350, 45],
      ["Sketchbook A4", 275, 35],
      ["Desk Organizer", 650, 20],
    ],
  },
  {
    seller: { name: "HomeNest Seller", email: "homenest@test.com" },
    category: "Home & Kitchen",
    products: [
      ["Steel Water Bottle", 600, 50],
      ["Ceramic Mug Set", 800, 25],
      ["Non-stick Pan", 1400, 18],
      ["Kitchen Knife Set", 1800, 12],
      ["LED Desk Lamp", 900, 30],
    ],
  },
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const { host, name } = mongoose.connection;

  const productCount = await Product.countDocuments();
  const cartCount = await Cart.countDocuments();
  const orderCount = await Order.countDocuments();
  const paymentCount = await Payment.countDocuments();

  console.log(`Connected to database "${name}" on host ${host}`);
  console.log(
    `Found: ${productCount} products, ${cartCount} carts, ${orderCount} orders, ${paymentCount} payments`,
  );

  if (!confirmed) {
    console.log("\nDRY RUN: nothing was changed.");
    console.log("Re-run with --yes to delete products + carts and reseed.");
    console.log("Add --include-orders to also delete orders + payments.");
    await mongoose.disconnect();
    return;
  }

  await Product.deleteMany({});
  await Cart.deleteMany({});
  if (includeOrders) {
    await Order.deleteMany({});
    await Payment.deleteMany({});
  }

  let created = 0;
  for (const group of catalog) {
    const seller = await findOrCreateSeller(
      group.seller.name,
      group.seller.email,
    );

    for (const [productName, price, stock] of group.products) {
      await Product.create({
        name: productName,
        description: `${productName} (seeded test product)`,
        price,
        stock,
        category: group.category,
        seller: seller._id,
        images: [img(productName)],
      });
      created++;
    }
  }

  console.log(`\nDone. Created ${created} products across ${catalog.length} sellers.`);
  console.log("Seller logins: techhub@test.com, papertrail@test.com, homenest@test.com (password: password123)");
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});