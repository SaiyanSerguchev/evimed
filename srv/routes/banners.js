const express = require('express');
const Banner = require('../models/Banner');
const router = express.Router();

// Get all active banners (public API)
router.get('/', async (req, res) => {
  try {
    const banners = await Banner.getAll();
    res.json(banners);
  } catch (error) {
    console.error('Get banners error:', error);
    res.status(500).json({ error: 'Failed to get banners' });
  }
});

// Get banner by ID (public API)
router.get('/:id', async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ error: 'Banner not found' });
    }
    res.json(banner);
  } catch (error) {
    console.error('Get banner error:', error);
    res.status(500).json({ error: 'Failed to get banner' });
  }
});

module.exports = router;

