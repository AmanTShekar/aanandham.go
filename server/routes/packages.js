const express = require('express');
const { Package } = require('../models');
const router = express.Router();

// Get all packages
router.get('/', async (req, res) => {
    try {
        const packages = await Package.find();
        res.json(packages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single package
router.get('/:id', async (req, res) => {
    try {
        const pkg = await Package.findById(req.params.id);
        if (!pkg) return res.status(404).json({ message: 'Package not found' });
        res.json(pkg);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
