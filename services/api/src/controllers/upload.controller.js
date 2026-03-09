import cloudinary from "../config/cloudinary.js";
import Product from "../models/Product.js";

export const uploadProductImages = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (product.seller.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not allowed" });
  }

  const uploadPromises = req.files.map((file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "cartify/products" }, (err, result) => {
          if (err) reject(err);
          else resolve(result.secure_url);
        })
        .end(file.buffer);
    });
  });

  const imageUrls = await Promise.all(uploadPromises);

  product.images.push(...imageUrls);
  await product.save();

  res.json({
    message: "Images uploaded successfully",
    images: product.images,
  });
};
