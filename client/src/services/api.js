import axios from 'axios';

// Ensure API_URL always ends with /api
let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
if (!API_URL.endsWith('/api')) {
    API_URL = API_URL.replace(/\/$/, '') + '/api';
}

// Get token from localStorage
const getAuthHeader = () => {
    const token = localStorage.getItem('annadnam_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const authAPI = {
    register: async (userData) => {
        const response = await axios.post(`${API_URL}/auth/register`, userData);
        if (response.data.token) {
            localStorage.setItem('annadnam_token', response.data.token);
            localStorage.setItem('annadnam_user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    login: async (credentials) => {
        const response = await axios.post(`${API_URL}/auth/login`, credentials);
        if (response.data.token) {
            localStorage.setItem('annadnam_token', response.data.token);
            localStorage.setItem('annadnam_user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('annadnam_token');
        localStorage.removeItem('annadnam_user');
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('annadnam_user');
        return user ? JSON.parse(user) : null;
    }
};

export const listingsAPI = {
    getAllListings: async (query = '', category = '', filters = {}) => {
        try {
            let url = `${API_URL}/listings`;
            const params = new URLSearchParams();
            if (query) params.append('search', query);
            if (category) params.append('category', category);

            // Add filters
            if (filters.priceRange) {
                params.append('minPrice', filters.priceRange.min);
                params.append('maxPrice', filters.priceRange.max);
            }
            if (filters.type && filters.type !== 'Any') {
                params.append('type', filters.type);
            }
            if (filters.amenities && filters.amenities.length > 0) {
                params.append('amenities', filters.amenities.join(','));
            }
            if (filters.checkIn) params.append('checkIn', filters.checkIn);
            if (filters.checkOut) params.append('checkOut', filters.checkOut);
            if (filters.guests) params.append('guests', filters.guests);

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error('Error fetching listings:', error);
            throw error;
        }
    },

    getListingById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/listings/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching listing:', error);
            throw error;
        }
    },

    createListing: async (listingData) => {
        try {
            const response = await axios.post(`${API_URL}/listings`, listingData);
            return response.data;
        } catch (error) {
            console.error('Error creating listing:', error);
            throw error;
        }
    },

    getListingsByBounds: async (bounds) => {
        try {
            const response = await axios.get(`${API_URL}/listings/search/bounds`, {
                params: {
                    north: bounds.north,
                    south: bounds.south,
                    east: bounds.east,
                    west: bounds.west
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching listings by bounds:', error);
            throw error;
        }
    },

    getMyListings: async () => {
        try {
            const response = await axios.get(`${API_URL}/listings/my-listings`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching my listings:', error);
            throw error;
        }
    }
};

export const bookingsAPI = {
    createBooking: async (bookingData) => {
        const response = await axios.post(`${API_URL}/bookings`, bookingData, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    getUserBookings: async (userId) => {
        const response = await axios.get(`${API_URL}/bookings/user/${userId}`, {
            headers: getAuthHeader()
        });
        return response.data;
    }
};

export const experiencesAPI = {
    getAllExperiences: async (category = '', filters = {}) => {
        let url = `${API_URL}/experiences`;
        const params = new URLSearchParams();

        if (category) params.append('category', category);

        // Add filters
        if (filters.priceRange) {
            params.append('minPrice', filters.priceRange.min);
            params.append('maxPrice', filters.priceRange.max);
        }

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        const response = await axios.get(url);
        return response.data;
    },

    getExperienceById: async (id) => {
        const response = await axios.get(`${API_URL}/experiences/${id}`);
        return response.data;
    },
    createExperience: async (experienceData) => {
        const response = await axios.post(`${API_URL}/experiences`, experienceData);
        return response.data;
    }
};

export const reviewsAPI = {
    getReviews: async (listingId) => {
        const response = await axios.get(`${API_URL}/listings/${listingId}/reviews`);
        return response.data;
    },

    createReview: async (reviewData) => {
        const response = await axios.post(`${API_URL}/reviews`, reviewData, {
            headers: getAuthHeader()
        });
        return response.data;
    }
};

export const adminAPI = {
    getStats: async () => {
        const response = await axios.get(`${API_URL}/admin/stats`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    getAllUsers: async () => {
        const response = await axios.get(`${API_URL}/admin/users`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    updateUserRole: async (userId, role) => {
        const response = await axios.patch(`${API_URL}/admin/users/${userId}/role`,
            { role },
            { headers: getAuthHeader() }
        );
        return response.data;
    },

    deleteUser: async (userId) => {
        const response = await axios.delete(`${API_URL}/admin/users/${userId}`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    getAllListings: async () => {
        const response = await axios.get(`${API_URL}/admin/listings`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    deleteListing: async (listingId) => {
        const response = await axios.delete(`${API_URL}/admin/listings/${listingId}`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    getAllBookings: async () => {
        const response = await axios.get(`${API_URL}/admin/bookings`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    updateBooking: async (bookingId, data) => {
        const response = await axios.patch(`${API_URL}/admin/bookings/${bookingId}`,
            data,
            { headers: getAuthHeader() }
        );
        return response.data;
    },

    deleteExperience: async (experienceId) => {
        const response = await axios.delete(`${API_URL}/admin/experiences/${experienceId}`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    getAllExperiences: async () => {
        const response = await axios.get(`${API_URL}/admin/experiences`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    getAllReviews: async () => {
        const response = await axios.get(`${API_URL}/admin/reviews`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    deleteReview: async (reviewId) => {
        const response = await axios.delete(`${API_URL}/admin/reviews/${reviewId}`, {
            headers: getAuthHeader()
        });
        return response.data;
    }
};

export const wishlistAPI = {
    getWishlists: async () => {
        const response = await axios.get(`${API_URL}/wishlists`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    addToWishlist: async (listingId) => {
        const response = await axios.post(`${API_URL}/wishlists`,
            { listingId },
            { headers: getAuthHeader() }
        );
        return response.data;
    },

    removeFromWishlist: async (listingId) => {
        const response = await axios.delete(`${API_URL}/wishlists/${listingId}`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    checkWishlist: async (listingId) => {
        const response = await axios.get(`${API_URL}/wishlists/check/${listingId}`, {
            headers: getAuthHeader()
        });
        return response.data;
    }
};

export const destinationsAPI = {
    getAllDestinations: async () => {
        const response = await axios.get(`${API_URL}/destinations`);
        return response.data;
    },
    getDestinationById: async (id) => {
        const response = await axios.get(`${API_URL}/destinations/${id}`);
        return response.data;
    }
};

export const packagesAPI = {
    getAllPackages: async () => {
        const response = await axios.get(`${API_URL}/packages`);
        return response.data;
    },
    getPackageById: async (id) => {
        const response = await axios.get(`${API_URL}/packages/${id}`);
        return response.data;
    }
};

export const guidesAPI = {
    getAllGuides: async () => {
        const response = await axios.get(`${API_URL}/guides`);
        return response.data;
    },
    getGuideById: async (id) => {
        const response = await axios.get(`${API_URL}/guides/${id}`);
        return response.data;
    }
};

export const inquiryAPI = {
    submitInquiry: async (inquiryData) => {
        const response = await axios.post(`${API_URL}/inquiries`, inquiryData);
        return response.data;
    },

    getAllInquiries: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.type) params.append('type', filters.type);
        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);

        const url = params.toString() ? `${API_URL}/inquiries?${params.toString()}` : `${API_URL}/inquiries`;
        const response = await axios.get(url, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    getInquiryById: async (id) => {
        const response = await axios.get(`${API_URL}/inquiries/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    updateInquiryStatus: async (id, status) => {
        const response = await axios.patch(`${API_URL}/inquiries/${id}/status`,
            { status },
            { headers: getAuthHeader() }
        );
        return response.data;
    },

    deleteInquiry: async (id) => {
        const response = await axios.delete(`${API_URL}/inquiries/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    getInquiryStats: async () => {
        const response = await axios.get(`${API_URL}/inquiries/stats/overview`, {
            headers: getAuthHeader()
        });
        return response.data;
    }
};

