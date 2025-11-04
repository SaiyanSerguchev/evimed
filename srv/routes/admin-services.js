const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const adminAuth = require('../middleware/admin');

// Get all services for admin
router.get('/', adminAuth, async (req, res) => {
  try {
    const services = await Service.getAllForAdmin();
    res.json(services);
  } catch (error) {
    console.error('Get services for admin error:', error);
    res.status(500).json({ error: 'Failed to get services' });
  }
});

// Create a new service
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, description, price, duration, preparation, categoryId, order } = req.body;
    
    if (!name || !price || !categoryId) {
      return res.status(400).json({ error: 'Name, price and categoryId are required' });
    }

    const service = await Service.create({ 
      name, 
      description, 
      price, 
      duration, 
      preparation, 
      categoryId, 
      order 
    });
    res.status(201).json(service);
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

// Update a service
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { name, description, price, duration, preparation, categoryId, order, isActive } = req.body;
    const updateData = {};
    
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (duration !== undefined) updateData.duration = duration;
    if (preparation !== undefined) updateData.preparation = preparation;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    const service = await Service.update(req.params.id, updateData);
    res.json(service);
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

// Delete a service (hard delete)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Service.delete(req.params.id);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

module.exports = router;
