const express = require('express');
const router = express.Router();
const Branch = require('../models/Branch');

// Get all active branches (public)
router.get('/', async (req, res) => {
  try {
    const branches = await Branch.getAll();
    res.json(branches);
  } catch (error) {
    console.error('Get branches error:', error);
    res.status(500).json({ error: 'Failed to get branches' });
  }
});

// Get a single branch by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) {
      return res.status(404).json({ error: 'Branch not found' });
    }
    res.json(branch);
  } catch (error) {
    console.error('Get branch by ID error:', error);
    res.status(500).json({ error: 'Failed to get branch' });
  }
});

module.exports = router;
