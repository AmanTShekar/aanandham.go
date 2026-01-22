const express = require('express');
const router = express.Router();
const { Sightseeing, TravelStory, SiteContent, PreviousEvent, Guide } = require('../models');

// --- Helper for Content ---
router.get('/content/:key', async (req, res) => {
    try {
        const data = await SiteContent.findOne({ key: req.params.key });
        res.json(data ? data.content : null);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/content/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const { content } = req.body;
        const updated = await SiteContent.findOneAndUpdate(
            { key },
            { content },
            { new: true, upsert: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Sightseeing ---
router.get('/sightseeing', async (req, res) => {
    try {
        const items = await Sightseeing.find().sort({ order: 1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/sightseeing', async (req, res) => {
    try {
        const newItem = new Sightseeing(req.body);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/sightseeing/:id', async (req, res) => {
    try {
        const updated = await Sightseeing.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/sightseeing/:id', async (req, res) => {
    try {
        await Sightseeing.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Travel Stories ---
router.get('/travel-stories', async (req, res) => {
    try {
        const items = await TravelStory.find().sort({ order: 1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/travel-stories', async (req, res) => {
    try {
        const newItem = new TravelStory(req.body);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/travel-stories/:id', async (req, res) => {
    try {
        const updated = await TravelStory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/travel-stories/:id', async (req, res) => {
    try {
        await TravelStory.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Previous Events ---
router.get('/previous-events', async (req, res) => {
    try {
        const items = await PreviousEvent.find().sort({ order: 1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/previous-events', async (req, res) => {
    try {
        const newItem = new PreviousEvent(req.body);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/previous-events/:id', async (req, res) => {
    try {
        const updated = await PreviousEvent.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/previous-events/:id', async (req, res) => {
    try {
        await PreviousEvent.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Guides ---
router.get('/guides', async (req, res) => {
    try {
        const items = await Guide.find().sort({ date: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/guides', async (req, res) => {
    try {
        const newItem = new Guide(req.body);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/guides/:id', async (req, res) => {
    try {
        const updated = await Guide.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/guides/:id', async (req, res) => {
    try {
        await Guide.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
