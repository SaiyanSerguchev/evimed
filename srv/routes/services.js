const express = require('express');
const Service = require('../models/Service');
const router = express.Router();

// Get all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.getAll();
    res.json(services);
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Failed to get services' });
  }
});

// Get services by category
router.get('/category/:categoryId', async (req, res) => {
  try {
    const services = await Service.getByCategory(req.params.categoryId);
    res.json(services);
  } catch (error) {
    console.error('Get services by category error:', error);
    res.status(500).json({ error: 'Failed to get services by category' });
  }
});

// Get service by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ error: 'Failed to get service' });
  }
});

module.exports = router;