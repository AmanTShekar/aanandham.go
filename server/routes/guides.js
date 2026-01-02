const express = require('express');
const { Guide } = require('../models');
const router = express.Router();

// Get all guides
router.get('/', async (req, res) => {
    try {
        const guides = await Guide.find();
        res.json(guides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single guide
router.get('/:id', async (req, res) => {
    try {
        const guide = await Guide.findById(req.params.id);
        if (!guide) return res.status(404).json({ message: 'Guide not found' });
        res.json(guide);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
