const express = require('express');
const { Listing, Experience, Destination } = require('../models');
const router = express.Router();

// Get location suggestions based on query
router.get('/suggestions', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query || query.length < 2) {
            return res.json([]);
        }

        const regex = new RegExp(query, 'i');

        // Fetch distinct locations from Listings, Experiences, and Destinations
        // We use strict regex matching to find locations containing the query
        const [listings, experiences, destinations] = await Promise.all([
            Listing.distinct('location', { location: regex }),
            Experience.distinct('location', { location: regex }),
            Destination.distinct('name', { name: regex })
        ]);

        // Combine and Deduplicate
        const combined = [...listings, ...experiences, ...destinations];
        const uniqueLocations = [...new Set(combined)];

        // Filter and Sort
        // 1. Must match regex (already done by DB, but safe to double check if needed)
        // 2. Sort: Exact matches or startsWith should come first
        const sortedLocations = uniqueLocations.sort((a, b) => {
            const aLower = a.toLowerCase();
            const bLower = b.toLowerCase();
            const qLower = query.toLowerCase();

            const aStarts = aLower.startsWith(qLower);
            const bStarts = bLower.startsWith(qLower);

            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;
            return aLower.localeCompare(bLower);
        });

        // Limit to top 5 results
        res.json(sortedLocations.slice(0, 5));
    } catch (error) {
        console.error('Search suggestion error:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
