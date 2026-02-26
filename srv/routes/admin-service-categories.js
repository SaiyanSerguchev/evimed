const express = require('express');
const router = express.Router();
const ServiceCategory = require('../models/ServiceCategory');
const adminAuth = require('../middleware/admin');

// Get all service categories for admin
router.get('/', adminAuth, async (req, res) => {
  try {
    const categories = await ServiceCategory.getAllForAdmin();
    res.json(categories);
  } catch (error) {
    console.error('Get service categories for admin error:', error);
    res.status(500).json({ error: 'Failed to get service categories' });
  }
});

// Create a new service category
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, description, order, parentId, imageUrl } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const category = await ServiceCategory.create({ name, description, order, parentId, imageUrl });
    res.status(201).json(category);
  } catch (error) {
    console.error('Create service category error:', error);
    res.status(500).json({ error: 'Failed to create service category' });
  }
});

// Update a service category
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { name, description, order, isActive, parentId, imageUrl } = req.body;
    console.error('PUT category req.body.imageUrl', req.body.imageUrl);
    const updateData = {};
    
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (order !== undefined) updateData.order = parseInt(order);
    if (isActive !== undefined) updateData.isActive = isActive;
    if (parentId !== undefined) updateData.parentId = parentId === '' ? null : parseInt(parentId);
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

    console.error('PUT category updateData.imageUrl', updateData.imageUrl);
    const category = await ServiceCategory.update(req.params.id, updateData);
    console.error('PUT category result imageUrl', category?.imageUrl);
    res.json(category);
  } catch (error) {
    console.error('Update service category error:', error);
    res.status(500).json({ error: 'Failed to update service category' });
  }
});

// Delete a service category (hard delete)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await ServiceCategory.delete(req.params.id);
    res.json({ message: 'Service category deleted successfully' });
  } catch (error) {
    console.error('Delete service category error:', error);
    res.status(500).json({ error: 'Failed to delete service category' });
  }
});

module.exports = router;
