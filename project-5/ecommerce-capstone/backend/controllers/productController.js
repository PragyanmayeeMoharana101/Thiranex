import asyncHandler from 'express-async-handler';
import products from '../data/products.js';

export const getProducts = asyncHandler(async (req, res) => {
  res.json(products);
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = products.find((p) => p._id === req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});
