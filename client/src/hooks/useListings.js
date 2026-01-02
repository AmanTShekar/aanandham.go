import { useState, useEffect } from 'react';
import { listingsAPI } from '../services/api';
import { topSeoListings } from '../data/siteContent';

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

            if (featured.length === 0) {
                console.warn("API returned no listings, using static SEO content.");
                setListings(topSeoListings);
            } else {
                setListings(featured);
            }
        } catch (err) {
            console.error("Failed to fetch listings, using SEO fallback", err);
            setError(null);
            setListings(topSeoListings);
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
