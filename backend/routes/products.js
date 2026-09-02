const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// Get all products with filters
router.get('/', async (req, res) => {
  try {
    const { category, craftType, region, search } = req.query;
    let query = {};

    if (category && category !== 'all') query.category = category;
    if (craftType && craftType !== 'all') query.craftType = craftType;
    if (region && region !== 'all') query.region = region;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { artisanName: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching products' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('artisanId');
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching product' });
  }
});

// Create product (Artisan listing)
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: 'Error creating product' });
  }
});

module.exports = router;
