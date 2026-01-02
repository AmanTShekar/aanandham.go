const express = require('express');
const { Destination } = require('../models');
const router = express.Router();

// Get all destinations
router.get('/', async (req, res) => {
    try {
        const destinations = await Destination.find();
        res.json(destinations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single destination
router.get('/:id', async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);
        if (!destination) return res.status(404).json({ message: 'Destination not found' });
        res.json(destination);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create destination (Admin only - simplified for now)
router.post('/', async (req, res) => {
    try {
        const destination = new Destination(req.body);
        await destination.save();
        res.status(201).json(destination);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
