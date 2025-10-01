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

// Create service (admin only)
router.post('/', async (req, res) => {
  try {
    const { name, description, price, duration, category } = req.body;
    
    const serviceData = { name, description, price, duration, category };
    const service = await Service.create(serviceData);
    res.status(201).json(service);
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

// Update service (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { name, description, price, duration, category } = req.body;
    const updateData = {};
    
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price) updateData.price = price;
    if (duration) updateData.duration = duration;
    if (category) updateData.category = category;

    const service = await Service.update(req.params.id, updateData);
    res.json(service);
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

// Delete service (admin only)
router.delete('/:id', async (req, res) => {
  try {
    await Service.delete(req.params.id);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

module.exports = router;
