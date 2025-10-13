const express = require('express');
const router = express.Router();
const Branch = require('../models/Branch');
const adminAuth = require('../middleware/admin');

// Get all branches for admin
router.get('/', adminAuth, async (req, res) => {
  try {
    const branches = await Branch.getAllForAdmin();
    res.json(branches);
  } catch (error) {
    console.error('Get branches for admin error:', error);
    res.status(500).json({ error: 'Failed to get branches' });
  }
});

// Create a new branch
router.post('/', adminAuth, async (req, res) => {
  try {
    const { title, address, phone, email, workingHours, order } = req.body;

    if (!title || !address) {
      return res.status(400).json({ error: 'Title and address are required' });
    }

    const branch = await Branch.create({ title, address, phone, email, workingHours, order });
    res.status(201).json(branch);
  } catch (error) {
    console.error('Create branch error:', error);
    res.status(500).json({ error: 'Failed to create branch' });
  }
});

// Update a branch
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { title, address, phone, email, workingHours, order } = req.body;
    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (address !== undefined) updateData.address = address;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (workingHours !== undefined) updateData.workingHours = workingHours;
    if (order !== undefined) updateData.order = parseInt(order);

    const branch = await Branch.update(req.params.id, updateData);
    res.json(branch);
  } catch (error) {
    console.error('Update branch error:', error);
    res.status(500).json({ error: 'Failed to update branch' });
  }
});

// Delete a branch (hard delete)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Branch.delete(req.params.id);
    res.json({ message: 'Branch deleted successfully' });
  } catch (error) {
    console.error('Delete branch error:', error);
    res.status(500).json({ error: 'Failed to delete branch' });
  }
});

module.exports = router;
