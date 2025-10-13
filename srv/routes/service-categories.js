const express = require('express');
const router = express.Router();
const ServiceCategory = require('../models/ServiceCategory');
const adminAuth = require('../middleware/admin');

// Get all service categories (public)
router.get('/', async (req, res) => {
  try {
    const categories = await ServiceCategory.getAll();
    res.json(categories);
  } catch (error) {
    console.error('Get service categories error:', error);
    res.status(500).json({ error: 'Failed to get service categories' });
  }
});

// Get service category by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const category = await ServiceCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Service category not found' });
    }
    res.json(category);
  } catch (error) {
    console.error('Get service category error:', error);
    res.status(500).json({ error: 'Failed to get service category' });
  }
});

module.exports = router;
