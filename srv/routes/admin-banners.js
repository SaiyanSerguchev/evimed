const express = require('express');
const Banner = require('../models/Banner');
const adminAuth = require('../middleware/admin');
const router = express.Router();

// Get all banners for admin
router.get('/', adminAuth, async (req, res) => {
  try {
    const banners = await Banner.getAllForAdmin();
    res.json(banners);
  } catch (error) {
    console.error('Get banners error:', error);
    res.status(500).json({ error: 'Failed to get banners' });
  }
});

// Create banner
router.post('/', adminAuth, async (req, res) => {
  try {
    const { title, description, order } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const bannerData = { title, description, order };
    const banner = await Banner.create(bannerData);
    res.status(201).json(banner);
  } catch (error) {
    console.error('Create banner error:', error);
    res.status(500).json({ error: 'Failed to create banner' });
  }
});

// Update banner
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { title, description, order, isActive } = req.body;
    const updateData = {};
    
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    const banner = await Banner.update(req.params.id, updateData);
    res.json(banner);
  } catch (error) {
    console.error('Update banner error:', error);
    res.status(500).json({ error: 'Failed to update banner' });
  }
});

// Delete banner
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Banner.delete(req.params.id);
    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Delete banner error:', error);
    res.status(500).json({ error: 'Failed to delete banner' });
  }
});

// Update banners order
router.patch('/order', adminAuth, async (req, res) => {
  try {
    const { banners } = req.body;
    
    if (!Array.isArray(banners)) {
      return res.status(400).json({ error: 'Banners must be an array' });
    }

    await Banner.updateOrder(banners);
    res.json({ message: 'Banners order updated successfully' });
  } catch (error) {
    console.error('Update banners order error:', error);
    res.status(500).json({ error: 'Failed to update banners order' });
  }
});

module.exports = router;

