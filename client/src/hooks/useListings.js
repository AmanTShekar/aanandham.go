import { useState, useEffect } from 'react';
import { listingsAPI } from '../services/api';

export const useListings = (initialQuery = '') => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchFeatured = async () => {
        try {
            setLoading(true);
            const data = await listingsAPI.getAllListings();

            let featured = [];
            if (data && Array.isArray(data)) {
                featured = data.slice(0, 3);
            } else if (data && data.listings && Array.isArray(data.listings)) {
                featured = data.listings.slice(0, 3);
            }

            // Fallback to empty if nothing found, don't break
            setListings(featured);
        } catch (err) {
            console.error("Failed to fetch listings", err);
            setError(err);
            // Try mock data as fallback if strictly needed
            try {
                const module = await import('../data/mockData.js');
                if (module && module.listings) {
                    setListings(module.listings.slice(0, 3));
                }
            } catch (mockErr) {
                console.error("Mock data fallback failed", mockErr);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeatured();
    }, []);

    return { listings, loading, error, refetch: fetchFeatured };
};

export default useListings;
