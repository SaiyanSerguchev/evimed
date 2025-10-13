const express = require('express');
const router = express.Router();
const Advantage = require('../models/Advantage');
const adminAuth = require('../middleware/admin');

// Get all advantages (public)
router.get('/', async (req, res) => {
  try {
    const advantages = await Advantage.getAll();
    res.json(advantages);
  } catch (error) {
    console.error('Get advantages error:', error);
    res.status(500).json({ error: 'Failed to get advantages' });
  }
});

// Get all advantages for admin (with inactive ones)
router.get('/admin', adminAuth, async (req, res) => {
  try {
    const advantages = await Advantage.getAllForAdmin();
    res.json(advantages);
  } catch (error) {
    console.error('Get advantages for admin error:', error);
    res.status(500).json({ error: 'Failed to get advantages' });
  }
});

// Create advantage
router.post('/', adminAuth, async (req, res) => {
  try {
    const { title, description, order } = req.body;
    
    if (!title || !description || !order) {
      return res.status(400).json({ error: 'Title, description and order are required' });
    }

    if (order < 1 || order > 4) {
      return res.status(400).json({ error: 'Order must be between 1 and 4' });
    }

    const advantage = await Advantage.create({ title, description, order });
    res.status(201).json(advantage);
  } catch (error) {
    console.error('Create advantage error:', error);
    if (error.message.includes('Unique constraint')) {
      res.status(400).json({ error: 'Advantage with this order already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create advantage' });
    }
  }
});

// Update advantage
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { title, description, order, isActive } = req.body;
    
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    const advantage = await Advantage.update(req.params.id, updateData);
    res.json(advantage);
  } catch (error) {
    console.error('Update advantage error:', error);
    if (error.message.includes('Unique constraint')) {
      res.status(400).json({ error: 'Advantage with this order already exists' });
    } else if (error.message.includes('not found')) {
      res.status(404).json({ error: 'Advantage not found' });
    } else {
      res.status(500).json({ error: 'Failed to update advantage' });
    }
  }
});

// Toggle advantage active status
router.patch('/:id/toggle', adminAuth, async (req, res) => {
  try {
    const advantage = await Advantage.toggleActive(req.params.id);
    res.json(advantage);
  } catch (error) {
    console.error('Toggle advantage error:', error);
    if (error.message.includes('not found')) {
      res.status(404).json({ error: 'Advantage not found' });
    } else {
      res.status(500).json({ error: 'Failed to toggle advantage' });
    }
  }
});

// Delete advantage
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Advantage.delete(req.params.id);
    res.json({ message: 'Advantage deleted successfully' });
  } catch (error) {
    console.error('Delete advantage error:', error);
    res.status(500).json({ error: 'Failed to delete advantage' });
  }
});

// Swap advantages order
router.post('/swap', adminAuth, async (req, res) => {
  try {
    const { id1, id2 } = req.body;
    
    if (!id1 || !id2) {
      return res.status(400).json({ error: 'Both advantage IDs are required' });
    }

    const advantages = await Advantage.swapOrders(id1, id2);
    res.json(advantages);
  } catch (error) {
    console.error('Swap advantages error:', error);
    if (error.message.includes('not found')) {
      res.status(404).json({ error: 'One or both advantages not found' });
    } else {
      res.status(500).json({ error: 'Failed to swap advantages' });
    }
  }
});

module.exports = router;
