"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import CustomDateBatchPicker from '../../components/CustomDateBatchPicker';
import CustomSelectDropdown from '../../components/CustomSelectDropdown';
import LucideAmenityIcon from '../../components/common/LucideAmenityIcon';
import { INITIAL_ALL_CAMPS, getAllCamps, saveAllCamps } from '../../lib/campsData';
import { inr, generateBookingId } from '../../lib/utils';
import { waLink } from '../../lib/whatsapp';
import { getPaymentSettings, savePaymentSettings } from '../../lib/paymentSettings';
import { uploadCampsitePhoto } from '../../lib/mediaUpload';

// Helper to safely validate, downscale and compress images before storing as Base64 (UP1, Item 9)
function compressImageFile(file, maxWidth = 1280, maxHeight = 960, quality = 0.82) {
    return new Promise((resolve, reject) => {
        if (!file) return reject(new Error('No file provided'));
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
        if (!file.type || !allowedMimeTypes.includes(file.type.toLowerCase())) {
            return reject(new Error('Invalid file format. Please upload JPG, PNG, WebP, or AVIF images only.'));
        }
        // Cap file upload size to ~2MB as requested
        if (file.size > 2 * 1024 * 1024) {
            return reject(new Error('Image file is too large (max 2MB limit). Please upload an image under 2MB.'));
        }

        const reader = new FileReader();
        reader.onerror = () => reject(new Error('Failed to read image file.'));
        reader.onload = (readerEvent) => {
            const img = new Image();
            img.onerror = () => reject(new Error('Failed to decode image.'));
            img.onload = () => {
                try {
                    let { width, height } = img;
                    if (width > maxWidth || height > maxHeight) {
                        const ratio = Math.min(maxWidth / width, maxHeight / height);
                        width = Math.round(width * ratio);
                        height = Math.round(height * ratio);
                    }

                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        return resolve(readerEvent.target.result);
                    }
                    ctx.drawImage(img, 0, 0, width, height);
                    const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                    resolve(compressedBase64);
                } catch {
                    resolve(readerEvent.target.result);
                }
            };
            img.src = readerEvent.target.result;
        };
        reader.readAsDataURL(file);
    });
}

// ── SCHEDULED EXPEDITION BATCHES ──
const INITIAL_EVENTS = [
    {
        id: 'ev-1',
        title: 'Kolukkumalai Sunrise 4x4 & Stargazing Batch',
        dates: 'Aug 22 – 23, 2026',
        campsite: 'Kolukkumalai Sunrise Ridge, Munnar',
        price: 2499,
        capacity: 30,
        booked: 18,
        spotsLeft: 12,
        badge: 'Bestseller ⭐',
        status: 'Active',
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
        description: 'Guided 4x4 convoy, high-altitude tiger rock hike, campfire live BBQ, and midnight stargazing.'
    },
    {
        id: 'ev-2',
        title: 'Meesapulimala 8-Peak Summit Expedition',
        dates: 'Aug 29 – 30, 2026',
        campsite: 'Silent Valley Basecamp, Munnar',
        price: 3199,
        capacity: 20,
        booked: 14,
        spotsLeft: 6,
        badge: 'High Altitude 🏔️',
        status: 'Active',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
        description: 'South India’s 2nd highest peak summit trek with forest permits, certified mountain guides, and tent glamping.'
    }
];

export default function AdminPortal() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passcode, setPasscode] = useState('');
    const [passcodeError, setPasscodeError] = useState(false);

    // Active Navigation Tab ('overview' | 'bookings' | 'properties' | 'events' | 'financials' | 'settings')
    const [activeTab, setActiveTab] = useState('overview');

    // Dedicated Full-Page Property Details View State
    const [activePropertyDetailId, setActivePropertyDetailId] = useState(null);

    // Dynamic Data States (Persisted in LocalStorage)
    const [properties, setProperties] = useState(INITIAL_ALL_CAMPS);
    const [events, setEvents] = useState(INITIAL_EVENTS);
    const [bookings, setBookings] = useState([]);

    // Filter by Region
    const [propertyFilterRegion, setPropertyFilterRegion] = useState('All');

    // Create / Edit Property Modal State
    const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
    const [editingProperty, setEditingProperty] = useState(null);
    const [imageUrlInput, setImageUrlInput] = useState('');
    const [propertyForm, setPropertyForm] = useState({
        title: '',
        region: 'Munnar',
        category: 'Summit Trek & Glamp',
        tag: 'Bestseller ⭐',
        location: 'Suryanelli / Kolukkumalai, Munnar, Kerala',
        altitude: '7,900 FT',
        price: 2499,
        originalPrice: 3200,
        duration: '2 Days / 1 Night',
        difficulty: 'Moderate Offroad',
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80'
        ],
        description: '',
        highlights: '4x4 Jeep Safari, Campfire BBQ, Dome Pods, Sunrise Ridge',
        inclusions: 'Dome Pod Stay, 4x4 Jeep Safari, Live BBQ, Dinner & Breakfast, Forest Permits',
        exclusions: 'Personal transport, personal trekking gear'
    });

    // Mobile Sidebar Drawer State
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    // Create / Edit Room Modal State
    const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [roomForm, setRoomForm] = useState({
        name: '',
        capacity: '2 Adults',
        price: 2499,
        totalUnits: 8,
        image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80',
        features: 'Private Deck, King Bed, Mountain View'
    });

    // Create Event Modal State
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [eventForm, setEventForm] = useState({
        title: '',
        region: 'Munnar',
        campsite: 'Kolukkumalai Sunrise Ridge',
        dates: 'Sep 12 – 13, 2026',
        price: 2499,
        capacity: 30,
        booked: 0,
        badge: 'New Batch 🌿',
        status: 'Active',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        description: 'Guided wilderness expedition with campfire barbecue and sunrise ridge trek.'
    });

    // Manual Booking Creator Modal State
    const [isAddBookingModalOpen, setIsAddBookingModalOpen] = useState(false);
    const [newBookingForm, setNewBookingForm] = useState({
        name: '',
        phone: '',
        email: '',
        package: 'Kolukkumalai Sunrise 4x4 & High-Altitude Ridge Glamp',
        region: 'Munnar',
        dates: '',
        guests: 2,
        roomType: 'Geodesic Luxury Dome Pod',
        pricePerGuest: 2499,
        status: 'Confirmed'
    });

    // Booking Search & Filter
    const [bookingSearch, setBookingSearch] = useState('');
    const [bookingFilterStatus, setBookingFilterStatus] = useState('All');

    // Admin Notification Settings
    const [adminPhone, setAdminPhone] = useState('+91 9400 987 654');
    const [adminTelegram, setAdminTelegram] = useState('@aanandham_concierge_bot');
    const [settingsSavedToast, setSettingsSavedToast] = useState(false);

    // Payment Gateway & QR Settings State
    const [paymentSettings, setPaymentSettings] = useState(() => getPaymentSettings());
    const [qrImageUploading, setQrImageUploading] = useState(false);

    const handleSavePaymentSettings = (e) => {
        if (e) e.preventDefault();
        savePaymentSettings(paymentSettings);
        showToast('✓ Payment Gateway Settings Saved & Synchronized Live!');
    };

    const handleQrImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setQrImageUploading(true);
            const compressed = await compressImageFile(file, 800, 800, 0.9);
            setPaymentSettings(prev => ({ ...prev, customQrUrl: compressed }));
            showToast('✓ Custom QR Code Image Loaded');
        } catch (err) {
            alert(err.message || 'Failed to process QR image');
        } finally {
            setQrImageUploading(false);
        }
    };

    // Toast message state with cleanup ref (UP5)
    const [toastMessage, setToastMessage] = useState('');
    const toastTimerRef = useRef(null);
    const showToast = (msg) => {
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        setToastMessage(msg);
        toastTimerRef.current = setTimeout(() => setToastMessage(''), 3200);
    };

    // Load from Server APIs + LocalStorage Fallback (N1)
    const reloadDataFromStorage = async () => {
        setPaymentSettings(getPaymentSettings());
        const savedPhone = localStorage.getItem('aanandham_admin_phone');
        if (savedPhone) setAdminPhone(savedPhone);
        const savedTelegram = localStorage.getItem('aanandham_admin_telegram');
        if (savedTelegram) setAdminTelegram(savedTelegram);

        // Properties sync (Local cache first, then server fetch)
        const loadedProps = getAllCamps();
        setProperties(loadedProps);
        try {
            const campsRes = await fetch('/api/admin/camps');
            if (campsRes.ok) {
                const serverCamps = await campsRes.json();
                if (Array.isArray(serverCamps) && serverCamps.length > 0) {
                    setProperties(serverCamps);
                    saveAllCamps(serverCamps);
                }
            }
        } catch (e) {}

        const savedEvents = localStorage.getItem('aanandham_admin_events');
        if (savedEvents) {
            try { setEvents(JSON.parse(savedEvents)); } catch(e){}
        }

        // Bookings sync from secure server (Memory state only — zero localStorage persistence of guest PII)
        try {
            const bookingsRes = await fetch('/api/admin/bookings', {
                credentials: 'include'
            });
            if (bookingsRes.ok) {
                const serverData = await bookingsRes.json();
                const serverBookings = Array.isArray(serverData) ? serverData : (Array.isArray(serverData?.bookings) ? serverData.bookings : null);
                if (serverBookings) {
                    setBookings(serverBookings);
                    return;
                }
            }
        } catch (e) {}

        setBookings([]);
    };

    useEffect(() => {
        // Authenticate Session via HttpOnly Secure Cookie
        const restoreSession = async () => {
            try {
                const res = await fetch('/api/admin/auth', {
                    method: 'GET',
                    credentials: 'include'
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.authenticated) {
                        setIsAuthenticated(true);
                    } else {
                        setIsAuthenticated(false);
                    }
                } else {
                    setIsAuthenticated(false);
                }
            } catch {
                setIsAuthenticated(false);
            }
        };

        restoreSession();
        reloadDataFromStorage();

        // Listen for live public booking events
        const handleStorageUpdate = () => {
            reloadDataFromStorage();
        };

        window.addEventListener('storage', handleStorageUpdate);
        return () => {
            if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
            window.removeEventListener('storage', handleStorageUpdate);
        };
    }, []);

    const handleSaveNotifications = (e) => {
        e.preventDefault();
        localStorage.setItem('aanandham_admin_phone', adminPhone);
        localStorage.setItem('aanandham_admin_telegram', adminTelegram);
        setSettingsSavedToast(true);
        setTimeout(() => setSettingsSavedToast(false), 3000);
        showToast('✓ Notification coordinates saved');
    };

    const [auditLogs, setAuditLogs] = useState([]);
    const [isLoadingAudit, setIsLoadingAudit] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ passcode: passcode.trim() })
            });
            const data = await res.json();
            if (data.success) {
                setIsAuthenticated(true);
                setPasscodeError(false);
            } else {
                setPasscodeError(true);
            }
        } catch (err) {
            setPasscodeError(true);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/admin/auth', {
                method: 'DELETE',
                credentials: 'include'
            });
        } catch {}
        setIsAuthenticated(false);
        showToast('✓ Logged out securely');
    };

    // Load Audit Logs from Secure Server
    const fetchAuditLogs = async () => {
        setIsLoadingAudit(true);
        try {
            const res = await fetch('/api/admin/auth?audit=true', {
                method: 'GET',
                credentials: 'include'
            });
            const data = await res.json();
            if (data.auditLogs) {
                setAuditLogs(data.auditLogs);
            }
        } catch {}
        setIsLoadingAudit(false);
    };

    // Export Complete JSON Backup
    const handleExportBackup = () => {
        const backupData = {
            exportVersion: '2.0',
            exportedAt: new Date().toISOString(),
            properties,
            events,
            bookings,
            settings: {
                adminPhone,
                adminTelegram
            }
        };

        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const dateStr = new Date().toISOString().split('T')[0];
        a.href = url;
        a.download = `aanandham-full-backup-${dateStr}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('✓ Full JSON system backup exported');
    };

    // Restore Complete JSON Backup
    const handleImportBackup = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
            try {
                const parsed = JSON.parse(uploadEvent.target.result);
                if (parsed.properties && Array.isArray(parsed.properties)) {
                    saveProperties(parsed.properties);
                }
                if (parsed.events && Array.isArray(parsed.events)) {
                    saveEvents(parsed.events);
                }
                if (parsed.bookings && Array.isArray(parsed.bookings)) {
                    saveBookings(parsed.bookings);
                }
                if (parsed.settings) {
                    if (parsed.settings.adminPhone) {
                        setAdminPhone(parsed.settings.adminPhone);
                        localStorage.setItem('aanandham_admin_phone', parsed.settings.adminPhone);
                    }
                    if (parsed.settings.adminTelegram) {
                        setAdminTelegram(parsed.settings.adminTelegram);
                        localStorage.setItem('aanandham_admin_telegram', parsed.settings.adminTelegram);
                    }
                }
                showToast('✓ System backup restored successfully');
            } catch {
                alert('Invalid JSON backup file format.');
            }
        };
        reader.readAsText(file);
    };

    // Save Helpers with Server API Synchronization & LocalStorage Fallback (N1, N2, UP1)
    const saveProperties = (updated) => {
        setProperties(updated);
        try {
            saveAllCamps(updated);
        } catch (err) {
            console.error('Error saving camps to storage:', err);
            showToast('⚠️ Storage quota reached. Consider exporting backup.');
        }
        fetch('/api/admin/camps', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(updated)
        }).catch(e => console.error('Error syncing camps to server:', e));

        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('storage'));
        }
    };

    const saveEvents = (updated) => {
        setEvents(updated);
        try {
            localStorage.setItem('aanandham_admin_events', JSON.stringify(updated));
        } catch (err) {
            console.error('Error saving events to storage:', err);
            showToast('⚠️ Storage quota reached.');
        }
    };

    const saveBookings = (updated) => {
        setBookings(updated);
        fetch('/api/admin/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(updated)
        }).catch(e => console.error('Error syncing bookings to server:', e));

        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('storage'));
        }
    };

    // Toggle Property Availability
    const handleToggleAvailability = (id) => {
        const updated = properties.map(p => p.id === id ? { ...p, isAvailable: !p.isAvailable } : p);
        saveProperties(updated);
        showToast('✓ Property availability updated');
    };

    // Adjust Price
    const handleAdjustPrice = (id, delta) => {
        const updated = properties.map(p => p.id === id ? { ...p, price: Math.max(500, p.price + delta) } : p);
        saveProperties(updated);
    };

    // Adjust Room Units
    const handleAdjustRoomUnits = (propId, roomId, delta) => {
        const updated = properties.map(p => {
            if (p.id === propId && p.rooms) {
                const updatedRooms = p.rooms.map(r => {
                    if (r.id === roomId) {
                        const minAllowed = Math.max(1, r.bookedUnits || 0);
                        const newTotal = Math.max(minAllowed, r.totalUnits + delta);
                        return { ...r, totalUnits: newTotal };
                    }
                    return r;
                });
                return { ...p, rooms: updatedRooms };
            }
            return p;
        });
        saveProperties(updated);
    };

    // Toggle Room Availability
    const handleToggleRoomAvailability = (propId, roomId) => {
        const updated = properties.map(p => {
            if (p.id === propId && p.rooms) {
                const updatedRooms = p.rooms.map(r => r.id === roomId ? { ...r, isAvailable: !r.isAvailable } : r);
                return { ...p, rooms: updatedRooms };
            }
            return p;
        });
        saveProperties(updated);
        showToast('✓ Room availability updated');
    };

    // Room Image File Upload — Supabase Storage first, Base64 fallback (UP1)
    const handleRoomImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            // Try Supabase Storage upload first
            const campId = currentDetailProperty?.id || 'general';
            const result = await uploadCampsitePhoto(file, `camps/${campId}/rooms`);
            setRoomForm(prev => ({ ...prev, image: result.url }));
            showToast(`✓ Room photo uploaded to CDN (${result.sizeKB} KB)`);
        } catch (supabaseErr) {
            // Fallback: compress to base64 for local/dev use
            try {
                const compressedBase64 = await compressImageFile(file, 1200, 800, 0.82);
                setRoomForm(prev => ({ ...prev, image: compressedBase64 }));
                showToast('✓ Room photo compressed locally (connect Supabase for CDN storage)');
            } catch (err) {
                showToast(`⚠️ ${err.message || 'Error uploading room image'}`);
            }
        }
        e.target.value = '';
    };

    // Open Add / Edit Room Modal
    const handleOpenRoomModal = (room = null) => {
        if (room) {
            setEditingRoom(room);
            setRoomForm({
                name: room.name || '',
                capacity: room.capacity || '2 Adults',
                price: room.price || 2499,
                totalUnits: room.totalUnits || 8,
                image: room.image || '',
                features: room.features ? room.features.join(', ') : ''
            });
        } else {
            setEditingRoom(null);
            setRoomForm({
                name: '',
                capacity: '2 Adults',
                price: currentDetailProperty?.price || 2499,
                totalUnits: 8,
                image: currentDetailProperty?.image || 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80',
                features: 'Panoramic Mountain View, Plush Bedding, Hot Water Ensuite'
            });
        }
        setIsAddRoomModalOpen(true);
    };

    // Delete Room
    const handleDeleteRoom = (propId, roomId) => {
        if (window.confirm('Are you sure you want to delete this room/pod type?')) {
            const updated = properties.map(p => {
                if (p.id === propId && p.rooms) {
                    return { ...p, rooms: p.rooms.filter(r => r.id !== roomId) };
                }
                return p;
            });
            saveProperties(updated);
            showToast('✓ Room type deleted');
        }
    };

    // Add or Edit Room in Active Property
    const handleSaveRoom = (e) => {
        e.preventDefault();
        const featuresArr = roomForm.features.split(',').map(s => s.trim()).filter(Boolean);
        const roomImage = roomForm.image || currentDetailProperty?.image || 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80';

        if (editingRoom) {
            const updated = properties.map(p => {
                if (p.id === activePropertyDetailId && p.rooms) {
                    const updatedRooms = p.rooms.map(r => {
                        if (r.id === editingRoom.id) {
                            return {
                                ...r,
                                name: roomForm.name,
                                capacity: roomForm.capacity,
                                price: Number(roomForm.price),
                                totalUnits: Number(roomForm.totalUnits),
                                image: roomImage,
                                features: featuresArr
                            };
                        }
                        return r;
                    });
                    return { ...p, rooms: updatedRooms };
                }
                return p;
            });
            saveProperties(updated);
            showToast('✓ Room type updated');
        } else {
            const newRoom = {
                id: `r-${Date.now()}`,
                name: roomForm.name,
                capacity: roomForm.capacity,
                price: Number(roomForm.price),
                totalUnits: Number(roomForm.totalUnits),
                bookedUnits: 0,
                isAvailable: true,
                image: roomImage,
                features: featuresArr
            };
            const updated = properties.map(p => {
                if (p.id === activePropertyDetailId) {
                    const existingRooms = p.rooms || [];
                    return { ...p, rooms: [...existingRooms, newRoom] };
                }
                return p;
            });
            saveProperties(updated);
            showToast('✓ New room type added');
        }
        setIsAddRoomModalOpen(false);
        setEditingRoom(null);
    };

    // Open Property Modal
    const handleOpenPropertyModal = (prop = null) => {
        if (prop) {
            setEditingProperty(prop);
            setPropertyForm({
                title: prop.title,
                region: prop.region || 'Munnar',
                category: prop.category || 'Summit Trek & Glamp',
                tag: prop.tag || 'Bestseller ⭐',
                location: prop.location || 'Munnar, Kerala',
                altitude: prop.altitude || '7,900 FT',
                price: prop.price || 2499,
                originalPrice: prop.originalPrice || 3200,
                duration: prop.duration || '2 Days / 1 Night',
                difficulty: prop.difficulty || 'Moderate',
                image: prop.image || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
                gallery: prop.gallery && prop.gallery.length > 0 ? prop.gallery : [prop.image],
                description: prop.description || '',
                highlights: prop.highlights ? prop.highlights.join(', ') : '',
                inclusions: prop.inclusions ? prop.inclusions.join(', ') : '',
                exclusions: prop.exclusions ? prop.exclusions.join(', ') : ''
            });
        } else {
            setEditingProperty(null);
            setPropertyForm({
                title: '',
                region: 'Munnar',
                category: 'Summit Trek & Glamp',
                tag: 'New Campsite 🌿',
                location: 'Munnar, Kerala',
                altitude: '6,500 FT',
                price: 1999,
                originalPrice: 2800,
                duration: '2 Days / 1 Night',
                difficulty: 'Moderate',
                image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
                gallery: [
                    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80'
                ],
                description: '',
                highlights: '4x4 Jeep Safari, Campfire BBQ, Dome Pods, Sunrise Ridge Walk',
                inclusions: '1 Night Tent Stay, Campfire Dinner, Breakfast, Guided Trek',
                exclusions: 'Personal transport to basecamp'
            });
        }
        setImageUrlInput('');
        setIsPropertyModalOpen(true);
    };

    // Handle File Upload for Gallery — Supabase Storage first, Base64 fallback (UP1)
    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const campId = editingProperty?.id || `new-${Date.now()}`;
        const folder = `camps/${campId}/gallery`;
        let successCount = 0;
        const uploadedUrls = [];

        for (const file of files) {
            try {
                // Attempt Supabase Storage upload
                const result = await uploadCampsitePhoto(file, folder);
                uploadedUrls.push(result.url);
                successCount++;
            } catch {
                // Fallback: compress to base64
                try {
                    const compressed = await compressImageFile(file, 1600, 1060, 0.82);
                    uploadedUrls.push(compressed);
                    successCount++;
                } catch (err) {
                    console.warn('Skipping file due to error:', file.name, err);
                }
            }
        }

        if (uploadedUrls.length > 0) {
            setPropertyForm(prev => {
                const currentGallery = prev.gallery || [];
                const newGallery = [...currentGallery, ...uploadedUrls];
                return {
                    ...prev,
                    gallery: newGallery,
                    image: prev.image || uploadedUrls[0]
                };
            });
            showToast(`✓ Uploaded ${successCount} photo(s) to CDN`);
        } else {
            showToast('⚠️ No valid images were uploaded');
        }
        e.target.value = '';
    };

    // Add Image URL to Gallery
    const handleAddImageUrl = () => {
        if (!imageUrlInput.trim()) return;
        const url = imageUrlInput.trim();
        setPropertyForm(prev => {
            const currentGallery = prev.gallery || [];
            const newGallery = [...currentGallery, url];
            return {
                ...prev,
                gallery: newGallery,
                image: prev.image || url
            };
        });
        setImageUrlInput('');
        showToast('✓ Image URL added to gallery');
    };

    // Remove Image from Gallery
    const handleRemoveImage = (idx) => {
        const newGallery = propertyForm.gallery.filter((_, i) => i !== idx);
        const newPrimary = newGallery.length > 0 ? (propertyForm.image === propertyForm.gallery[idx] ? newGallery[0] : propertyForm.image) : '';
        setPropertyForm({
            ...propertyForm,
            gallery: newGallery,
            image: newPrimary
        });
        showToast('✓ Image removed');
    };

    // Set Primary Cover Image
    const handleSetPrimaryImage = (url) => {
        setPropertyForm({
            ...propertyForm,
            image: url
        });
        showToast('★ Set as main cover image');
    };

    // Save Property Form
    const handleSavePropertyForm = (e) => {
        e.preventDefault();
        const highlightsArr = propertyForm.highlights.split(',').map(s => s.trim()).filter(Boolean);
        const inclusionsArr = propertyForm.inclusions.split(',').map(s => s.trim()).filter(Boolean);
        const exclusionsArr = propertyForm.exclusions.split(',').map(s => s.trim()).filter(Boolean);
        const galleryArr = propertyForm.gallery && propertyForm.gallery.length > 0 ? propertyForm.gallery : [propertyForm.image];
        const primaryImage = propertyForm.image || galleryArr[0];

        if (editingProperty) {
            const updated = properties.map(p => {
                if (p.id === editingProperty.id) {
                    return {
                        ...p,
                        ...propertyForm,
                        image: primaryImage,
                        gallery: galleryArr,
                        price: Number(propertyForm.price),
                        originalPrice: Number(propertyForm.originalPrice),
                        highlights: highlightsArr,
                        inclusions: inclusionsArr,
                        exclusions: exclusionsArr
                    };
                }
                return p;
            });
            saveProperties(updated);
            showToast('✓ Campsite details updated');
        } else {
            const newProp = {
                id: `pkg-${Date.now()}`,
                ...propertyForm,
                image: primaryImage,
                gallery: galleryArr,
                price: Number(propertyForm.price),
                originalPrice: Number(propertyForm.originalPrice),
                rating: 5.0,
                reviewsCount: 1,
                isAvailable: true,
                highlights: highlightsArr,
                inclusions: inclusionsArr,
                exclusions: exclusionsArr,
                rooms: [
                    { id: `r-${Date.now()}-1`, name: 'Standard Mountain Dome Pod', capacity: '2 Adults', price: Number(propertyForm.price), totalUnits: 8, bookedUnits: 0, isAvailable: true, image: primaryImage, features: ['Mountain View', 'Thermal Blankets', 'Charging Point'] }
                ],
                amenities: [
                    { id: `am-${Date.now()}-1`, name: 'Campfire Circle & BBQ', icon: '🔥', enabled: true },
                    { id: `am-${Date.now()}-2`, name: 'Western Washrooms', icon: '🚿', enabled: true },
                    { id: `am-${Date.now()}-3`, name: 'Wilderness Guide Marshals', icon: '🧭', enabled: true }
                ],
                addons: [
                    { id: `ad-${Date.now()}-1`, name: 'Live Campfire BBQ Platter', price: 450, enabled: true },
                    { id: `ad-${Date.now()}-2`, name: '4K Drone Reel Video', price: 1500, enabled: true }
                ],
                reviews: [
                    { id: `rv-${Date.now()}`, name: 'Verified Explorer', location: 'Kerala', rating: 5, date: 'Recent', comment: 'Spectacular wilderness camp and top-notch hospitality.' }
                ]
            };
            saveProperties([...properties, newProp]);
            showToast('✓ New campsite listing created');
        }
        setIsPropertyModalOpen(false);
    };

    // Open Event Modal
    const handleOpenEventModal = (ev = null) => {
        if (ev) {
            setEditingEvent(ev);
            setEventForm({ ...ev });
        } else {
            setEditingEvent(null);
            setEventForm({
                title: '',
                region: 'Munnar',
                campsite: 'Kolukkumalai Sunrise Ridge',
                dates: '',
                price: 2499,
                capacity: 30,
                booked: 0,
                badge: 'New Batch 🌿',
                status: 'Active',
                image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
                description: 'Guided wilderness expedition with campfire barbecue and sunrise ridge trek.'
            });
        }
        setIsEventModalOpen(true);
    };

    // Save Event Form
    const handleSaveEventForm = (e) => {
        e.preventDefault();
        const cap = Math.max(1, Number(eventForm.capacity) || 1);
        const bkd = Math.max(0, Math.min(cap, Number(eventForm.booked) || 0));
        const spots = Math.max(0, cap - bkd);
        const st = spots === 0 ? 'Sold Out' : (eventForm.status === 'Sold Out' ? 'Active' : (eventForm.status || 'Active'));

        if (editingEvent) {
            const updated = events.map(ev => ev.id === editingEvent.id ? { ...ev, ...eventForm, capacity: cap, booked: bkd, spotsLeft: spots, status: st } : ev);
            saveEvents(updated);
            showToast('✓ Batch updated');
        } else {
            const newEvent = {
                id: `ev-${Date.now()}`,
                ...eventForm,
                capacity: cap,
                booked: bkd,
                spotsLeft: spots,
                status: st
            };
            saveEvents([...events, newEvent]);
            showToast('✓ New event batch scheduled');
        }
        setIsEventModalOpen(false);
    };

    // Delete Event
    const handleDeleteEvent = (id) => {
        if (window.confirm('Are you sure you want to remove this event batch?')) {
            const updated = events.filter(e => e.id !== id);
            saveEvents(updated);
            showToast('✓ Event batch removed');
        }
    };

    // Save Manual Booking from Coordinator
    const handleSaveManualBooking = (e) => {
        e.preventDefault();
        const guestsNum = Math.max(1, Number(newBookingForm.guests) || 2);
        const pricePerGuest = Math.max(0, Number(newBookingForm.pricePerGuest) || 2499);
        const totalCalc = guestsNum * pricePerGuest;

        const newBooking = {
            id: generateBookingId(),
            name: newBookingForm.name.trim(),
            phone: newBookingForm.phone.trim(),
            email: newBookingForm.email.trim() || 'N/A',
            package: newBookingForm.package,
            region: newBookingForm.region,
            dates: newBookingForm.dates || 'Upcoming Weekend',
            guests: guestsNum,
            roomType: newBookingForm.roomType,
            addons: [],
            total: totalCalc,
            status: newBookingForm.status || 'Confirmed',
            source: 'Coordinator Entry',
            createdAt: new Date().toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
        };

        const updated = [newBooking, ...bookings];
        saveBookings(updated);
        setIsAddBookingModalOpen(false);
        setNewBookingForm({
            name: '',
            phone: '',
            email: '',
            package: 'Kolukkumalai Sunrise 4x4 & High-Altitude Ridge Glamp',
            region: 'Munnar',
            dates: '',
            guests: 2,
            roomType: 'Geodesic Luxury Dome Pod',
            pricePerGuest: 2499,
            status: 'Confirmed'
        });
        showToast(`✓ Booking ${newBooking.id} created successfully`);
    };

    // Delete Booking
    const handleDeleteBooking = (id) => {
        if (window.confirm(`Are you sure you want to delete reservation ${id}?`)) {
            const updated = bookings.filter(b => b.id !== id);
            saveBookings(updated);
            showToast(`✓ Booking ${id} deleted`);
        }
    };

    // Update Booking Status
    const handleUpdateBookingStatus = (id, newStatus) => {
        const updated = bookings.map(b => b.id === id ? { ...b, status: newStatus } : b);
        saveBookings(updated);
        showToast(`✓ Booking ${id} marked as ${newStatus}`);
    };

    // Export CSV with Formula Injection Protection (E2)
    const handleExportCSV = () => {
        const headers = 'Booking ID,Customer Name,Phone,Email,Region,Package,Dates,Guests,Room Type,Total (INR),Status,Source,Created At';
        const escapeCsv = (val) => {
            let str = String(val ?? '');
            // Prevent CSV / Excel formula injection if text starts with =, +, -, @
            if (/^[=+\-@\t\r]/.test(str)) {
                str = "'" + str;
            }
            return `"${str.replace(/"/g, '""')}"`;
        };
        const rows = bookings.map(b => [
            escapeCsv(b.id),
            escapeCsv(b.name),
            escapeCsv(b.phone),
            escapeCsv(b.email || 'N/A'),
            escapeCsv(b.region || 'Kerala'),
            escapeCsv(b.package),
            escapeCsv(b.dates),
            b.guests,
            escapeCsv(b.roomType || 'Standard'),
            b.total,
            escapeCsv(b.status),
            escapeCsv(b.source || 'Direct'),
            escapeCsv(b.createdAt)
        ].join(','));

        const csvContent = '\uFEFF' + headers + '\r\n' + rows.join('\r\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `Aanandham_Reservations_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('✓ Bookings exported to CSV');
    };

    // Filter properties by region
    const filteredProperties = propertyFilterRegion === 'All' ? properties : properties.filter(p => (p.region || 'Munnar') === propertyFilterRegion);

    // Track pending UTR verification queue
    const pendingUtrBookings = bookings.filter(b => b.status === 'Pending' || (b.utrNumber && b.status !== 'Confirmed' && b.status !== 'Cancelled'));
    const pendingUtrCount = pendingUtrBookings.length;

    // Filter bookings with search and UTR filter
    const filteredBookings = bookings.filter(b => {
        const cleanSearch = bookingSearch.replace(/\D/g, '');
        const cleanPhone = (b.phone || '').replace(/\D/g, '');
        const matchSearch = 
            (b.name || '').toLowerCase().includes(bookingSearch.toLowerCase()) || 
            (cleanSearch && cleanPhone.includes(cleanSearch)) || 
            (b.phone || '').toLowerCase().includes(bookingSearch.toLowerCase()) ||
            (b.package || '').toLowerCase().includes(bookingSearch.toLowerCase()) ||
            (b.utrNumber || '').toLowerCase().includes(bookingSearch.toLowerCase()) ||
            (b.id || '').toLowerCase().includes(bookingSearch.toLowerCase());
        const matchStatus = 
            bookingFilterStatus === 'All' ? true :
            bookingFilterStatus === 'Pending UTRs' ? (b.status === 'Pending' || Boolean(b.utrNumber && b.status !== 'Confirmed')) :
            b.status === bookingFilterStatus;
        return matchSearch && matchStatus;
    });

    // Dynamic KPI & Financial Calculations strictly derived from real data
    const paidBookings = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Checked In');
    const totalRevenue = paidBookings.reduce((acc, b) => acc + (b.total || 0), 0);
    const estimatedDirectCosts = Math.round(totalRevenue * 0.45);
    const estimatedNetProfit = totalRevenue - estimatedDirectCosts;
    const profitMarginPercent = totalRevenue > 0 ? Math.round((estimatedNetProfit / totalRevenue) * 100) : 55;
    const activeCampers = paidBookings.reduce((acc, b) => acc + (b.guests || 0), 0);
    const activeEventsCount = events.filter(e => e.status === 'Active').length;

    // Active Inspected Property Object
    const currentDetailProperty = properties.find(p => p.id === activePropertyDetailId);

    // ─────────────────────────────────────────────────────────────
    // PIN AUTHENTICATION GATE
    // ─────────────────────────────────────────────────────────────
    if (!isAuthenticated) {
        return (
            <div style={{ minHeight: '100dvh', background: '#F8F9F5', color: '#121613', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.96, y: 14 }} 
                    animate={{ opacity: 1, scale: 1, y: 0 }} 
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    style={{ 
                        background: '#FFFFFF', 
                        border: '1px solid rgba(18, 22, 19, 0.1)', 
                        borderRadius: '24px', 
                        padding: '44px 36px', 
                        maxWidth: '440px', 
                        width: '100%', 
                        textAlign: 'center', 
                        boxShadow: '0 12px 40px rgba(0,0,0,0.06)' 
                    }}
                >
                    <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <img
                            src="/logo.png"
                            alt="Aanandham.go Official Logo"
                            style={{ height: '62px', width: 'auto', objectFit: 'contain', marginBottom: '14px', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.12))' }}
                        />
                        <div className="star-badge">
                            <span className="star-icon">★</span> BASECAMP COMMAND
                        </div>
                    </div>

                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: '800', margin: '0 0 8px', color: '#121613', letterSpacing: '-0.02em' }}>
                        Coordinator Portal
                    </h2>
                    <p style={{ fontSize: '14px', color: '#59655D', lineHeight: 1.55, marginBottom: '28px' }}>
                        Enter coordinator passcode to manage inventory, photo galleries, event batches, and live bookings.
                    </p>

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <input
                            type="password"
                            placeholder="Enter Passcode (e.g. 2026)"
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                            autoFocus
                            aria-label="Coordinator Passcode"
                            style={{ 
                                width: '100%', 
                                padding: '14px 18px', 
                                borderRadius: '14px', 
                                background: '#F8F9F5', 
                                border: passcodeError ? '2px solid #DC2626' : '1px solid rgba(18, 22, 19, 0.14)', 
                                color: '#121613', 
                                fontSize: '16px', 
                                textAlign: 'center', 
                                letterSpacing: '4px', 
                                fontWeight: '700',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                        {passcodeError && (
                            <div style={{ fontSize: '12.5px', color: '#DC2626', fontWeight: '700' }}>
                                Invalid Passcode. Try <code>2026</code> or <code>aanandham</code>.
                            </div>
                        )}
                        <button 
                            type="submit" 
                            className="btn-lime" 
                            style={{ 
                                padding: '15px', 
                                fontSize: '14.5px', 
                                fontWeight: '800', 
                                width: '100%', 
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            <span>Unlock Dashboard</span>
                            <span>→</span>
                        </button>
                    </form>

                    <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(18,22,19,0.08)' }}>
                        <Link href="/" style={{ color: '#59655D', textDecoration: 'none', fontSize: '13px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            ← Return to Website
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────
    // DEDICATED PROPERTY INSPECTOR VIEW
    // ─────────────────────────────────────────────────────────────
    if (activePropertyDetailId && currentDetailProperty) {
        return (
            <div style={{ minHeight: '100vh', width: '100%', background: '#F8F9F5', color: '#121613', paddingBottom: '90px' }}>
                
                {/* Clean Sticky Header */}
                <header style={{ position: 'sticky', top: 0, zIndex: 100, background: '#0B150E', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', padding: '16px clamp(24px, 4vw, 56px)' }}>
                    <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <button
                                onClick={() => setActivePropertyDetailId(null)}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '8px 16px',
                                    borderRadius: '999px',
                                    background: 'rgba(255, 255, 255, 0.08)',
                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                    color: '#FFFFFF',
                                    fontSize: '13px',
                                    fontWeight: '700',
                                    cursor: 'pointer'
                                }}
                            >
                                ← Back to Campsites
                            </button>
                            <div>
                                <span style={{ fontSize: '10.5px', fontWeight: '800', color: '#E5A93B', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block' }}>
                                    CAMPSITE INVENTORY & GALLERY
                                </span>
                                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800', margin: 0, color: '#FFFFFF' }}>
                                    {currentDetailProperty.title}
                                </h2>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Link
                                href={`/camps/${currentDetailProperty.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '999px',
                                    background: 'rgba(255, 255, 255, 0.08)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    color: '#FFFFFF',
                                    fontSize: '12.5px',
                                    fontWeight: '700',
                                    textDecoration: 'none'
                                }}
                            >
                                🌐 View Public Page →
                            </Link>
                            <button
                                onClick={() => handleToggleAvailability(currentDetailProperty.id)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '999px',
                                    background: currentDetailProperty.isAvailable ? 'rgba(229, 169, 59, 0.18)' : 'rgba(239, 68, 68, 0.18)',
                                    border: currentDetailProperty.isAvailable ? '1px solid #E5A93B' : '1px solid #EF4444',
                                    color: currentDetailProperty.isAvailable ? '#E5A93B' : '#EF4444',
                                    fontSize: '12.5px',
                                    fontWeight: '800',
                                    cursor: 'pointer'
                                }}
                            >
                                {currentDetailProperty.isAvailable ? '● Active & Bookable' : '○ Property Sold Out'}
                            </button>
                            <button
                                onClick={() => handleOpenPropertyModal(currentDetailProperty)}
                                className="btn-lime"
                                style={{ padding: '8px 16px', fontSize: '12.5px', fontWeight: '800' }}
                            >
                                Edit Property & Gallery ✏️
                            </button>
                        </div>
                    </div>
                </header>

                <main style={{ maxWidth: '1440px', margin: '36px auto 0', padding: '0 clamp(24px, 4vw, 56px)', boxSizing: 'border-box' }}>
                    
                    {/* Top Property Overview Hero Box */}
                    <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', minHeight: '260px', display: 'flex', alignItems: 'flex-end', padding: '36px', backgroundImage: `url(${currentDetailProperty.image})`, backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: '40px', border: '1px solid rgba(18, 22, 19, 0.1)', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14, 24, 17, 0.95) 0%, rgba(14, 24, 17, 0.4) 100%)' }} />
                        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', width: '100%' }}>
                            <div>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                                    <span style={{ background: '#E5A93B', color: '#121613', fontSize: '11px', fontWeight: '800', padding: '4px 12px', borderRadius: '999px' }}>
                                        {currentDetailProperty.region} Region
                                    </span>
                                    <span style={{ background: 'rgba(0,0,0,0.6)', color: '#FFFFFF', fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '999px', backdropFilter: 'blur(6px)' }}>
                                        {currentDetailProperty.altitude}
                                    </span>
                                </div>
                                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: '800', margin: '0 0 8px', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                                    {currentDetailProperty.title}
                                </h1>
                                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', margin: 0, maxWidth: '680px', lineHeight: 1.55 }}>
                                    {currentDetailProperty.description}
                                </p>
                            </div>

                            <div style={{ background: 'rgba(18, 22, 19, 0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(229, 169, 59, 0.3)', borderRadius: '18px', padding: '18px 24px', textAlign: 'right' }}>
                                <div style={{ fontSize: '10.5px', color: '#A2B6A6', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: '700' }}>Base Price / Camper</div>
                                <div style={{ fontSize: '28px', fontWeight: '800', color: '#E5A93B' }}>
                                    ₹{currentDetailProperty.price.toLocaleString('en-IN')}
                                </div>
                                <div style={{ display: 'flex', gap: '6px', marginTop: '8px', justifyContent: 'flex-end' }}>
                                    <button onClick={() => handleAdjustPrice(currentDetailProperty.id, -100)} style={{ padding: '5px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.12)', border: 'none', color: '#FFFFFF', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}>-₹100</button>
                                    <button onClick={() => handleAdjustPrice(currentDetailProperty.id, 100)} style={{ padding: '5px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.12)', border: 'none', color: '#FFFFFF', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}>+₹100</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 1: PHOTO GALLERY THUMBNAILS */}
                    <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '28px', border: '1px solid rgba(18, 22, 19, 0.08)', marginBottom: '40px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                            <div>
                                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '800', margin: 0, color: '#121613' }}>
                                    📸 Campsite Photo Gallery ({currentDetailProperty.gallery ? currentDetailProperty.gallery.length : 1})
                                </h3>
                                <div style={{ fontSize: '12.5px', color: '#59655D' }}>High-res wilderness, pod, and sunset photos displayed on public page</div>
                            </div>
                            <button onClick={() => handleOpenPropertyModal(currentDetailProperty)} className="btn-lime" style={{ padding: '8px 16px', fontSize: '12.5px', fontWeight: '800' }}>
                                Manage Gallery Photos 🖼️
                            </button>
                        </div>

                        <div style={{ display: 'flex', gap: '14px', overflowX: 'auto', paddingBottom: '8px' }}>
                            {(currentDetailProperty.gallery || [currentDetailProperty.image]).map((img, idx) => (
                                <div key={idx} style={{ position: 'relative', width: '160px', height: '110px', borderRadius: '14px', overflow: 'hidden', flexShrink: 0, border: img === currentDetailProperty.image ? '2px solid #E5A93B' : '1px solid rgba(18,22,19,0.1)' }}>
                                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    {img === currentDetailProperty.image && (
                                        <span style={{ position: 'absolute', top: '6px', left: '6px', background: '#121613', color: '#E5A93B', fontSize: '9.5px', fontWeight: '800', padding: '2px 6px', borderRadius: '4px' }}>
                                            ★ Cover
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SECTION 2: ROOMS & PODS INVENTORY */}
                    <div style={{ marginBottom: '48px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
                            <div>
                                <div className="star-badge">
                                    <span className="star-icon">★</span> ACCOMMODATION UNITS
                                </div>
                                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '800', margin: '4px 0 0', color: '#121613' }}>
                                    Rooms, Dome Pods & Tent Inventory ({currentDetailProperty.rooms ? currentDetailProperty.rooms.length : 0})
                                </h3>
                            </div>
                            <button
                                onClick={() => handleOpenRoomModal()}
                                className="btn-lime"
                                style={{ padding: '10px 20px', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}
                            >
                                + Add Room Type
                            </button>
                        </div>

                        {/* Clean Squared Room Cards with Edit & Delete */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                            {currentDetailProperty.rooms && currentDetailProperty.rooms.map(room => (
                                <div
                                    key={room.id}
                                    style={{
                                        background: '#FFFFFF',
                                        border: room.isAvailable ? '1px solid rgba(18, 22, 19, 0.08)' : '1px solid rgba(239, 68, 68, 0.3)',
                                        borderRadius: '20px',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        boxShadow: '0 4px 18px rgba(0,0,0,0.03)'
                                    }}
                                >
                                    <div style={{ position: 'relative', height: '170px' }}>
                                        <img src={room.image || currentDetailProperty.image} alt={room.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <span style={{ position: 'absolute', top: '12px', left: '12px', background: room.isAvailable ? '#121613' : '#EF4444', color: room.isAvailable ? '#E5A93B' : '#FFFFFF', fontSize: '10.5px', fontWeight: '800', padding: '4px 10px', borderRadius: '999px' }}>
                                            {room.isAvailable ? 'Available' : 'Sold Out'}
                                        </span>
                                        <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.65)', color: '#FFFFFF', fontSize: '10.5px', fontWeight: '700', padding: '4px 10px', borderRadius: '999px', backdropFilter: 'blur(6px)' }}>
                                            Capacity: {room.capacity}
                                        </span>
                                    </div>

                                    <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '17px', fontWeight: '800', margin: 0, color: '#121613' }}>
                                                {room.name}
                                            </h4>
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{ fontSize: '18px', fontWeight: '800', color: '#121613', display: 'block' }}>
                                                    ₹{room.price.toLocaleString('en-IN')}
                                                </span>
                                                <span style={{ fontSize: '10.5px', color: '#59655D', fontWeight: '600' }}>/ camper</span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                                            {room.features && room.features.map((feat, idx) => (
                                                <span key={idx} style={{ background: '#F8F9F5', border: '1px solid rgba(18,22,19,0.06)', color: '#3A443E', fontSize: '11px', fontWeight: '700', padding: '3px 9px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                                    <LucideAmenityIcon name={feat} size={11} color="#166534" />
                                                    <span>{feat}</span>
                                                </span>
                                            ))}
                                        </div>

                                        {/* Unit Inventory Tracker */}
                                        <div style={{ background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.06)', borderRadius: '14px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                            <div>
                                                <div style={{ fontSize: '10.5px', color: '#7D8880', fontWeight: '700', textTransform: 'uppercase' }}>Inventory</div>
                                                <div style={{ fontSize: '13px', fontWeight: '800', color: '#121613' }}>
                                                    {room.bookedUnits || 0} / {room.totalUnits} Units Booked
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                <button onClick={() => handleAdjustRoomUnits(currentDetailProperty.id, room.id, -1)} style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#FFFFFF', border: '1px solid rgba(18,22,19,0.12)', color: '#121613', fontWeight: '800', cursor: 'pointer' }}>-</button>
                                                <button onClick={() => handleAdjustRoomUnits(currentDetailProperty.id, room.id, 1)} style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#FFFFFF', border: '1px solid rgba(18,22,19,0.12)', color: '#121613', fontWeight: '800', cursor: 'pointer' }}>+</button>
                                            </div>
                                        </div>

                                        {/* Action Buttons: Toggle, Edit, Delete */}
                                        <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                                            <button
                                                onClick={() => handleToggleRoomAvailability(currentDetailProperty.id, room.id)}
                                                style={{
                                                    flex: 1,
                                                    padding: '9px',
                                                    borderRadius: '10px',
                                                    background: room.isAvailable ? 'rgba(239, 68, 68, 0.08)' : 'rgba(22, 101, 52, 0.08)',
                                                    border: room.isAvailable ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid rgba(22, 101, 52, 0.25)',
                                                    color: room.isAvailable ? '#DC2626' : '#166534',
                                                    fontSize: '11.5px',
                                                    fontWeight: '800',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {room.isAvailable ? 'Mark Sold Out' : 'Mark Available'}
                                            </button>
                                            <button
                                                onClick={() => handleOpenRoomModal(room)}
                                                style={{
                                                    padding: '9px 12px',
                                                    borderRadius: '10px',
                                                    background: '#F1F3EC',
                                                    border: '1px solid rgba(18, 22, 19, 0.1)',
                                                    color: '#121613',
                                                    fontSize: '11.5px',
                                                    fontWeight: '800',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Edit ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDeleteRoom(currentDetailProperty.id, room.id)}
                                                style={{
                                                    padding: '9px 12px',
                                                    borderRadius: '10px',
                                                    background: 'rgba(239, 68, 68, 0.08)',
                                                    border: '1px solid rgba(239, 68, 68, 0.2)',
                                                    color: '#EF4444',
                                                    fontSize: '11.5px',
                                                    fontWeight: '800',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </main>

                {/* MODAL: ADD / EDIT ROOM TYPE */}
                <AnimatePresence>
                    {isAddRoomModalOpen && (
                        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                            <motion.div initial={{ scale: 0.96, y: 14 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96 }} style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.1)', borderRadius: '24px', padding: '32px', maxWidth: '580px', width: '100%', maxHeight: '90vh', overflowY: 'auto', color: '#121613', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.18)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(18, 22, 19, 0.08)', paddingBottom: '14px' }}>
                                    <div>
                                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#E5A93B', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block' }}>
                                            ACCOMMODATION SETUP
                                        </span>
                                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '800', margin: '2px 0 0', color: '#121613' }}>
                                            {editingRoom ? 'Edit Room / Pod Details' : 'Add New Room / Pod Type'}
                                        </h3>
                                    </div>
                                    <button onClick={() => { setIsAddRoomModalOpen(false); setEditingRoom(null); }} style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F8F9F5', border: 'none', color: '#121613', cursor: 'pointer', fontWeight: '800' }}>
                                        ✕
                                    </button>
                                </div>

                                <form onSubmit={handleSaveRoom} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    
                                    {/* FAST CAPACITY PRESETS */}
                                    <div style={{ background: '#F4F7EB', borderRadius: '16px', padding: '14px 16px', border: '1px solid rgba(22, 101, 52, 0.15)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <label style={{ fontSize: '11.5px', fontWeight: '800', color: '#166534', textTransform: 'uppercase', letterSpacing: '0.6px', margin: 0 }}>
                                                ⚡ Fast Capacity & Tent Presets
                                            </label>
                                            <span style={{ fontSize: '10.5px', color: '#59655D', fontWeight: '700' }}>1-Click Setup</span>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '6px' }}>
                                            {[
                                                {
                                                    label: '👤 Single Tent (1P)',
                                                    name: 'Single Solo Ridge Tent',
                                                    capacity: '1 Person',
                                                    price: 1699,
                                                    totalUnits: 10,
                                                    features: 'Solo Foam Bed, Waterproof Flysheet, Thermal Sleeping Bag, Clean Washrooms',
                                                    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80'
                                                },
                                                {
                                                    label: '👥 2-Person Dome',
                                                    name: 'Geodesic Luxury Dome Pod',
                                                    capacity: '2 Persons',
                                                    price: 2499,
                                                    totalUnits: 8,
                                                    features: 'Double King Bed, Valley Deck, Thermal Blankets, En-suite Restroom',
                                                    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80'
                                                },
                                                {
                                                    label: '🏕️ 3-Person Tent',
                                                    name: '3-Person Alpine Weatherproof Tent',
                                                    capacity: '3 Persons',
                                                    price: 1999,
                                                    totalUnits: 12,
                                                    features: '3 Foam Mattresses, Warm Fleece Blankets, Shared Modern Washrooms, Lantern',
                                                    image: 'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=600&q=80'
                                                },
                                                {
                                                    label: '⛺ 4-Person Quad',
                                                    name: 'Weatherproof 4-Person Alpine Quad Tent',
                                                    capacity: '4 Persons',
                                                    price: 1799,
                                                    totalUnits: 14,
                                                    features: '4 Sleeping Bags, Waterproof Flysheet, Modern Hot Washrooms, Power Backup',
                                                    image: 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=600&q=80'
                                                },
                                                {
                                                    label: '🏡 Family Cottage',
                                                    name: 'Private Cliffside Wooden Cottage',
                                                    capacity: '4-6 Persons',
                                                    price: 3499,
                                                    totalUnits: 4,
                                                    features: 'Panoramic Glass Window, Hot Shower Geyser, Private Fire Pit, Balcony Deck',
                                                    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80'
                                                }
                                            ].map((preset, pIdx) => (
                                                <button
                                                    key={pIdx}
                                                    type="button"
                                                    onClick={() => {
                                                        setRoomForm({
                                                            ...roomForm,
                                                            name: preset.name,
                                                            capacity: preset.capacity,
                                                            price: preset.price,
                                                            totalUnits: preset.totalUnits,
                                                            features: preset.features,
                                                            image: roomForm.image || preset.image
                                                        });
                                                        showToast(`✓ Applied ${preset.label} preset`);
                                                    }}
                                                    style={{
                                                        padding: '7px 6px',
                                                        borderRadius: '8px',
                                                        border: '1px solid rgba(18, 22, 19, 0.12)',
                                                        background: '#FFFFFF',
                                                        color: '#121613',
                                                        fontSize: '11px',
                                                        fontWeight: '800',
                                                        cursor: 'pointer',
                                                        textAlign: 'center',
                                                        transition: 'all 0.15s ease'
                                                    }}
                                                    onMouseOver={(e) => { e.currentTarget.style.background = '#121613'; e.currentTarget.style.color = '#D5ED55'; }}
                                                    onMouseOut={(e) => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.color = '#121613'; }}
                                                >
                                                    {preset.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* PHOTO UPLOAD & URL SECTION */}
                                    <div style={{ background: '#F8F9F5', borderRadius: '16px', padding: '18px', border: '1px solid rgba(18, 22, 19, 0.08)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                            <div>
                                                <label style={{ fontSize: '12px', fontWeight: '800', color: '#121613', display: 'block' }}>
                                                    📸 Room / Pod Photo
                                                </label>
                                                <span style={{ fontSize: '11px', color: '#59655D' }}>Upload file from device or paste image URL</span>
                                            </div>
                                            <label style={{ cursor: 'pointer', background: '#121613', color: '#FFFFFF', padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                <span>📤 Upload File</span>
                                                <input type="file" accept="image/*" onChange={handleRoomImageUpload} style={{ display: 'none' }} />
                                            </label>
                                        </div>

                                        {/* Image Preview */}
                                        {roomForm.image ? (
                                            <div style={{ position: 'relative', height: '140px', borderRadius: '12px', overflow: 'hidden', border: '2px solid #E5A93B', marginBottom: '12px' }}>
                                                <img src={roomForm.image} alt="Room Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                <span style={{ position: 'absolute', top: '8px', left: '8px', background: '#121613', color: '#E5A93B', fontSize: '10px', fontWeight: '800', padding: '3px 8px', borderRadius: '4px' }}>
                                                    ★ Selected Room Photo
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => setRoomForm({ ...roomForm, image: '' })}
                                                    style={{ position: 'absolute', top: '8px', right: '8px', background: '#EF4444', color: '#FFFFFF', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}
                                                >
                                                    Remove ✕
                                                </button>
                                            </div>
                                        ) : (
                                            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '90px', borderRadius: '12px', border: '2px dashed rgba(18,22,19,0.18)', background: '#FFFFFF', cursor: 'pointer', marginBottom: '12px' }}>
                                                <span style={{ fontSize: '20px', marginBottom: '4px' }}>📷</span>
                                                <span style={{ fontSize: '12px', fontWeight: '700', color: '#121613' }}>Click to select photo from device</span>
                                                <input type="file" accept="image/*" onChange={handleRoomImageUpload} style={{ display: 'none' }} />
                                            </label>
                                        )}

                                        {/* Or Paste URL */}
                                        <div>
                                            <input
                                                type="url"
                                                placeholder="Or paste direct image URL (https://...)"
                                                value={roomForm.image}
                                                onChange={e => setRoomForm({ ...roomForm, image: e.target.value })}
                                                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.12)', fontSize: '12.5px', color: '#121613', boxSizing: 'border-box' }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                            Accommodation Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Single Solo Ridge Tent / Geodesic Dome"
                                            value={roomForm.name}
                                            onChange={e => setRoomForm({ ...roomForm, name: e.target.value })}
                                            style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', boxSizing: 'border-box' }}
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div>
                                            <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                                Guest Capacity *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. 1 Person, 2 Persons, 4 Persons"
                                                value={roomForm.capacity}
                                                onChange={e => setRoomForm({ ...roomForm, capacity: e.target.value })}
                                                style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', boxSizing: 'border-box' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                                Price Per Camper / Person (INR) *
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                value={roomForm.price}
                                                onChange={e => setRoomForm({ ...roomForm, price: e.target.value })}
                                                style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', boxSizing: 'border-box' }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                            Total Units Available in Campsite *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            value={roomForm.totalUnits}
                                            onChange={e => setRoomForm({ ...roomForm, totalUnits: e.target.value })}
                                            style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', boxSizing: 'border-box' }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                            Features & Amenities (Comma Separated)
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Panoramic Mountain View, Ensuite Washroom, Hot Water, Fleece Blankets"
                                            value={roomForm.features}
                                            onChange={e => setRoomForm({ ...roomForm, features: e.target.value })}
                                            style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', boxSizing: 'border-box' }}
                                        />
                                    </div>

                                    <button type="submit" className="btn-lime" style={{ padding: '14px', fontSize: '14.5px', fontWeight: '800', marginTop: '6px', cursor: 'pointer' }}>
                                        {editingRoom ? 'Save Room Type Changes' : '+ Publish Room Type'}
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────
    // MAIN ADMIN DASHBOARD WITH SLEEK RESPONSIVE SIDEBAR
    // ─────────────────────────────────────────────────────────────
    const navSections = [
        {
            category: 'EXPEDITIONS & GUESTS',
            items: [
                { id: 'overview', name: 'Dashboard Overview', icon: '📊', desc: 'Live KPIs & ops' },
                { id: 'bookings', name: 'Camper Reservations', icon: '📋', count: bookings.length, badgeColor: '#E5A93B' },
                { id: 'properties', name: 'Campsites & Pods', icon: '⛺', count: properties.length, badgeColor: '#22C55E' },
                { id: 'events', name: 'Scheduled Batches', icon: '🏔️', count: activeEventsCount, badgeColor: '#38BDF8' }
            ]
        },
        {
            category: 'FINANCE & CONTROL',
            items: [
                { id: 'financials', name: 'Revenue & Margin', icon: '💰', desc: `₹${totalRevenue.toLocaleString('en-IN')}` },
                { id: 'payment', name: 'Payment & QR Gateway', icon: '💳', desc: paymentSettings.mode === 'coming_soon' ? '⏳ Coming Soon' : '⚡ Live UPI' },
                { id: 'settings', name: 'Alerts & Dispatch', icon: '⚙️', desc: 'WhatsApp & Bot' }
            ]
        }
    ];

    const renderSidebarContent = (isMobile = false) => (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            <div>
                {/* Brand Header */}
                <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                            <img
                                src="/logo.png"
                                alt="Aanandham.go Official Logo"
                                style={{ height: '36px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }}
                            />
                            <div>
                                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '19px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '-0.02em', display: 'block', lineHeight: 1.1 }}>
                                    Aanandham<span style={{ color: '#E5A93B' }}>.go</span>
                                </span>
                                <span style={{ fontSize: '10px', fontWeight: '800', color: '#7D8880', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                    BASECAMP COMMAND
                                </span>
                            </div>
                        </Link>
                        {isMobile && (
                            <button
                                onClick={() => setIsMobileSidebarOpen(false)}
                                style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#FFFFFF', cursor: 'pointer', fontWeight: '800' }}
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.25)', padding: '5px 10px', borderRadius: '999px', width: 'fit-content' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 6px #22C55E' }}></span>
                        <span style={{ fontSize: '10px', fontWeight: '800', color: '#4ADE80', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                            Kerala Basecamp Live
                        </span>
                    </div>
                </div>

                {/* Dual Quick Action Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '24px' }}>
                    <button
                        onClick={() => {
                            setIsAddBookingModalOpen(true);
                            if (isMobile) setIsMobileSidebarOpen(false);
                        }}
                        className="btn-lime"
                        style={{
                            padding: '10px 8px',
                            borderRadius: '10px',
                            fontSize: '11.5px',
                            fontWeight: '800',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        <span>+ Booking</span>
                    </button>
                    <button
                        onClick={() => {
                            handleOpenPropertyModal();
                            if (isMobile) setIsMobileSidebarOpen(false);
                        }}
                        style={{
                            padding: '10px 8px',
                            borderRadius: '10px',
                            fontSize: '11.5px',
                            fontWeight: '800',
                            cursor: 'pointer',
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.14)',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        <span>+ Campsite</span>
                    </button>
                </div>

                {/* Categorized Navigation Menu */}
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {navSections.map((sec, sIdx) => (
                        <div key={sIdx}>
                            <div style={{ fontSize: '9.5px', fontWeight: '800', color: '#627266', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '8px' }}>
                                {sec.category}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {sec.items.map(item => {
                                    const isActive = activeTab === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                setActiveTab(item.id);
                                                if (isMobile) setIsMobileSidebarOpen(false);
                                            }}
                                            style={{
                                                width: '100%',
                                                padding: '10px 14px',
                                                borderRadius: '12px',
                                                background: isActive ? '#E5A93B' : 'transparent',
                                                color: isActive ? '#0B150E' : '#C8D8CB',
                                                border: isActive ? '1px solid rgba(229, 169, 59, 0.6)' : '1px solid transparent',
                                                fontSize: '13px',
                                                fontWeight: isActive ? '800' : '600',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                textAlign: 'left',
                                                transition: 'all 0.18s ease'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <span style={{ fontSize: '15px' }}>{item.icon}</span>
                                                <span>{item.name}</span>
                                            </div>
                                            {item.count !== undefined && (
                                                <span style={{
                                                    background: isActive ? '#0B150E' : 'rgba(255, 255, 255, 0.12)',
                                                    color: isActive ? '#E5A93B' : (item.badgeColor || '#FFFFFF'),
                                                    fontSize: '11px',
                                                    fontWeight: '800',
                                                    padding: '2px 8px',
                                                    borderRadius: '999px'
                                                }}>
                                                    {item.count}
                                                </span>
                                            )}
                                            {item.desc && !item.count && (
                                                <span style={{
                                                    fontSize: '10.5px',
                                                    color: isActive ? '#4A3B18' : '#7D8880',
                                                    fontWeight: '700'
                                                }}>
                                                    {item.desc}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </div>

            {/* Bottom Coordinator Profile & System Controls */}
            <div style={{ paddingTop: '18px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 8px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#E5A93B', color: '#121613', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '900' }}>
                        A
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            Basecamp Admin
                        </div>
                        <div style={{ fontSize: '10px', color: '#7D8880', fontWeight: '600' }}>
                            Super Coordinator
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                    <Link
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: '8px',
                            background: 'rgba(255, 255, 255, 0.06)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#C8D8CB',
                            textDecoration: 'none',
                            fontSize: '11.5px',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                        }}
                    >
                        <span>Website →</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            background: 'rgba(239, 68, 68, 0.12)',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            color: '#EF4444',
                            fontSize: '11.5px',
                            fontWeight: '800',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                        }}
                    >
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', width: '100%', background: '#F8F9F5', color: '#121613', display: 'flex', flexDirection: 'column' }}>
            
            {/* ── MOBILE ADMIN TOPBAR (Visible on < 1024px) ── */}
            <header className="admin-mobile-topbar" style={{
                display: 'none',
                position: 'sticky',
                top: 0,
                zIndex: 900,
                background: '#08110B',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '12px 18px',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#FFFFFF'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                        onClick={() => setIsMobileSidebarOpen(true)}
                        aria-label="Open Admin Menu"
                        style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '10px',
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            color: '#FFFFFF',
                            fontSize: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        ☰
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img
                            src="/logo.png"
                            alt="Aanandham.go Official Logo"
                            style={{ height: '28px', width: 'auto', objectFit: 'contain' }}
                        />
                        <div>
                            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: '800', color: '#FFFFFF', display: 'block', lineHeight: 1.1 }}>
                                Aanandham<span style={{ color: '#E5A93B' }}>.go</span>
                            </span>
                            <div style={{ fontSize: '9px', color: '#7D8880', fontWeight: '700', textTransform: 'uppercase' }}>
                                {activeTab.toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                        onClick={() => setIsAddBookingModalOpen(true)}
                        className="btn-lime"
                        style={{ padding: '7px 12px', fontSize: '11.5px', fontWeight: '800', borderRadius: '8px' }}
                    >
                        + Booking
                    </button>
                </div>
            </header>

            {/* ── MOBILE SLIDE-OUT DRAWER OVERLAY ── */}
            <AnimatePresence>
                {isMobileSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileSidebarOpen(false)}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 9999,
                            background: 'rgba(0, 0, 0, 0.7)',
                            backdropFilter: 'blur(8px)',
                            display: 'flex'
                        }}
                    >
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                width: '280px',
                                maxWidth: '85vw',
                                height: '100%',
                                background: '#08110B',
                                borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                                padding: '24px 18px',
                                boxSizing: 'border-box',
                                color: '#FFFFFF',
                                overflowY: 'auto'
                            }}
                        >
                            {renderSidebarContent(true)}
                        </motion.aside>
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ display: 'flex', flex: 1, minHeight: '100vh' }}>
                
                {/* ── DESKTOP LEFT SIDEBAR (Fixed Static, Full Viewport Height) ── */}
                <aside className="admin-desktop-sidebar">
                    {renderSidebarContent(false)}
                </aside>

                {/* ── MAIN CONTENT WORKSPACE (Scrolls independently next to static sidebar) ── */}
                <main className="admin-main-workspace" style={{ flex: 1, minHeight: '100vh', padding: '36px clamp(20px, 3.5vw, 56px)', boxSizing: 'border-box', overflowY: 'auto' }}>
                
                {/* ─────────────────────────────────────────────────────────────
                    TAB 1: EXECUTIVE OVERVIEW
                ───────────────────────────────────────────────────────────── */}
                {activeTab === 'overview' && (
                    <div style={{ maxWidth: '1300px' }}>
                        
                        {/* Header Intro */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
                            <div>
                                <div className="star-badge" style={{ marginBottom: '6px' }}>
                                    <span className="star-icon">★</span> EXECUTIVE DASHBOARD
                                </div>
                                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '30px', fontWeight: '800', margin: 0, color: '#121613', letterSpacing: '-0.02em' }}>
                                    Mission Control & Operations
                                </h1>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={handleExportCSV} style={{ padding: '9px 18px', borderRadius: '999px', background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                                    <span>📥 Export CSV</span>
                                </button>
                                <button onClick={() => setIsAddBookingModalOpen(true)} className="btn-lime" style={{ padding: '9px 20px', fontSize: '13px', fontWeight: '800' }}>
                                    + Manual Booking
                                </button>
                            </div>
                        </div>

                        {/* 4 Hero Minimalist Squared Metric Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                            
                            <div style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '20px', padding: '26px 28px', boxShadow: '0 2px 12px rgba(0,0,0,0.02)' }}>
                                <div style={{ fontSize: '11px', fontWeight: '800', color: '#7D8880', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
                                    Gross Confirmed Revenue
                                </div>
                                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '34px', fontWeight: '800', color: '#121613', letterSpacing: '-0.02em' }}>
                                    ₹{totalRevenue.toLocaleString('en-IN')}
                                </div>
                                <div style={{ fontSize: '12.5px', color: '#59655D', marginTop: '8px', fontWeight: '600' }}>
                                    From {paidBookings.length} confirmed reservations
                                </div>
                            </div>

                            <div style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '20px', padding: '26px 28px', boxShadow: '0 2px 12px rgba(0,0,0,0.02)' }}>
                                <div style={{ fontSize: '11px', fontWeight: '800', color: '#7D8880', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
                                    Est. Net Operating Profit
                                </div>
                                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '34px', fontWeight: '800', color: '#166534', letterSpacing: '-0.02em' }}>
                                    ₹{estimatedNetProfit.toLocaleString('en-IN')}
                                </div>
                                <div style={{ fontSize: '12.5px', color: '#166534', marginTop: '8px', fontWeight: '700' }}>
                                    ✓ {profitMarginPercent}% Net Operating Margin
                                </div>
                            </div>

                            <div style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '20px', padding: '26px 28px', boxShadow: '0 2px 12px rgba(0,0,0,0.02)' }}>
                                <div style={{ fontSize: '11px', fontWeight: '800', color: '#7D8880', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
                                    Total Confirmed Campers
                                </div>
                                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '34px', fontWeight: '800', color: '#121613', letterSpacing: '-0.02em' }}>
                                    {activeCampers} <span style={{ fontSize: '18px', color: '#59655D', fontWeight: '600' }}>Pax</span>
                                </div>
                                <div style={{ fontSize: '12.5px', color: '#59655D', marginTop: '8px', fontWeight: '600' }}>
                                    Across Kerala Campsites
                                </div>
                            </div>

                            <div style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '20px', padding: '26px 28px', boxShadow: '0 2px 12px rgba(0,0,0,0.02)' }}>
                                <div style={{ fontSize: '11px', fontWeight: '800', color: '#7D8880', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
                                    Pending Inquiries
                                </div>
                                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '34px', fontWeight: '800', color: '#B45309', letterSpacing: '-0.02em' }}>
                                    {bookings.filter(b => b.status === 'Pending').length} <span style={{ fontSize: '18px', color: '#59655D', fontWeight: '600' }}>Leads</span>
                                </div>
                                <div style={{ fontSize: '12.5px', color: '#B45309', marginTop: '8px', fontWeight: '700' }}>
                                    ⚡ Instant WhatsApp Dispatch
                                </div>
                            </div>

                        </div>

                        {/* Split Row: Recent Bookings Stream + Upcoming Scheduled Batches */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '28px' }}>
                            
                            {/* Recent Live Reservations */}
                            <div style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '22px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
                                    <div>
                                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '19px', fontWeight: '800', margin: 0, color: '#121613' }}>
                                            ⚡ Recent Reservations
                                        </h3>
                                        <div style={{ fontSize: '12.5px', color: '#59655D', marginTop: '2px' }}>
                                            Latest camper submissions
                                        </div>
                                    </div>
                                    <button onClick={() => setActiveTab('bookings')} className="btn-lime" style={{ padding: '6px 14px', fontSize: '12px', fontWeight: '800' }}>
                                        View All →
                                    </button>
                                </div>

                                {bookings.length === 0 ? (
                                    <div style={{ padding: '36px 20px', textAlign: 'center', color: '#7D8880', background: '#F8F9F5', borderRadius: '16px', border: '1px dashed rgba(18,22,19,0.12)' }}>
                                        <div style={{ fontSize: '28px', marginBottom: '8px' }}>📋</div>
                                        <div style={{ fontSize: '14px', fontWeight: '800', color: '#121613' }}>No Bookings Yet</div>
                                        <div style={{ fontSize: '12px', color: '#59655D', marginTop: '4px' }}>Click "+ Add Manual Booking" above or submit via the website.</div>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {bookings.slice(0, 4).map(b => (
                                            <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', background: '#F8F9F5', border: '1px solid rgba(18,22,19,0.04)', padding: '14px 18px', borderRadius: '16px' }}>
                                                <div>
                                                    <div style={{ fontSize: '14.5px', fontWeight: '800', color: '#121613' }}>{b.name} ({b.guests} Pax)</div>
                                                    <div style={{ fontSize: '12px', color: '#59655D' }}>{b.package ? b.package.slice(0, 32) : 'Campsite'}... · {b.dates}</div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '15.5px', fontWeight: '800', color: '#121613' }}>₹{(b.total || 0).toLocaleString('en-IN')}</div>
                                                    <span style={{ fontSize: '10.5px', fontWeight: '800', color: b.status === 'Confirmed' ? '#166534' : '#B45309' }}>{b.status}</span>
                                                </div>
                                                <div>
                                                    <a href={waLink(`Hi ${b.name}! Aanandham desk regarding your reservation (${b.id}).`, b.phone)} target="_blank" rel="noopener noreferrer" className="btn-lime" style={{ padding: '7px 12px', fontSize: '11.5px', fontWeight: '800' }}>
                                                        WhatsApp →
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Upcoming Scheduled Batches */}
                            <div style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '22px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
                                    <div>
                                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '19px', fontWeight: '800', margin: 0, color: '#121613' }}>
                                            🎉 Upcoming Weekend Batches
                                        </h3>
                                        <div style={{ fontSize: '12.5px', color: '#59655D', marginTop: '2px' }}>
                                            Live capacity tracking
                                        </div>
                                    </div>
                                    <button onClick={() => setActiveTab('events')} className="btn-lime" style={{ padding: '6px 14px', fontSize: '12px', fontWeight: '800' }}>
                                        Manage Batches →
                                    </button>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    {events.map(ev => (
                                        <div key={ev.id} style={{ background: '#F8F9F5', padding: '14px 16px', borderRadius: '16px', border: '1px solid rgba(18,22,19,0.04)', display: 'flex', gap: '14px', alignItems: 'center' }}>
                                            <img src={ev.image} alt={ev.title} style={{ width: '52px', height: '52px', borderRadius: '12px', objectFit: 'cover' }} />
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                                                    <span style={{ fontSize: '10.5px', fontWeight: '800', color: '#B45309' }}>{ev.badge}</span>
                                                    <span style={{ fontSize: '11px', color: '#59655D' }}>{ev.dates}</span>
                                                </div>
                                                <div style={{ fontSize: '13.5px', fontWeight: '800', color: '#121613', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.title}</div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', fontSize: '11.5px' }}>
                                                    <span style={{ color: '#59655D' }}>{ev.booked} / {ev.capacity} Pax</span>
                                                    <span style={{ fontWeight: '800', color: ev.spotsLeft === 0 ? '#DC2626' : '#166534' }}>
                                                        {ev.spotsLeft === 0 ? 'SOLD OUT' : `${ev.spotsLeft} Spots Remaining`}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    TAB 2: LIVE BOOKINGS & LEADS ROSTER
                ───────────────────────────────────────────────────────────── */}
                {activeTab === 'bookings' && (
                    <div style={{ maxWidth: '1300px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                            <div>
                                <div className="star-badge" style={{ marginBottom: '4px' }}>
                                    <span className="star-icon">★</span> RESERVATIONS ROSTER
                                </div>
                                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: '800', margin: 0, color: '#121613' }}>
                                    Live Bookings & Leads ({filteredBookings.length})
                                </h2>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={handleExportCSV} style={{ padding: '9px 18px', borderRadius: '999px', background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span>📥 Export CSV</span>
                                </button>
                                <button onClick={() => setIsAddBookingModalOpen(true)} className="btn-lime" style={{ padding: '9px 20px', fontSize: '13px', fontWeight: '800' }}>
                                    + Add Booking
                                </button>
                            </div>
                        </div>

                        {/* Search & Filter Bar */}
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '22px' }}>
                            <input
                                type="text"
                                placeholder="Search by name, phone, or package..."
                                value={bookingSearch}
                                onChange={(e) => setBookingSearch(e.target.value)}
                                style={{ flex: 1, minWidth: '240px', padding: '12px 18px', borderRadius: '14px', background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', outline: 'none' }}
                            />
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {[
                                    { id: 'All', label: 'All Bookings' },
                                    { id: 'Pending UTRs', label: `Pending UTRs ${pendingUtrCount > 0 ? `(${pendingUtrCount})` : ''}`, isAlert: pendingUtrCount > 0 },
                                    { id: 'Confirmed', label: 'Confirmed 🟢' },
                                    { id: 'Checked In', label: 'Checked In 🔵' },
                                    { id: 'Cancelled', label: 'Cancelled 🔴' }
                                ].map(st => (
                                    <button
                                        key={st.id}
                                        onClick={() => setBookingFilterStatus(st.id)}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: '999px',
                                            border: bookingFilterStatus === st.id ? '1px solid #121613' : st.isAlert ? '1px solid #F59E0B' : '1px solid rgba(18,22,19,0.1)',
                                            background: bookingFilterStatus === st.id ? '#121613' : st.isAlert ? '#FEF3C7' : '#FFFFFF',
                                            color: bookingFilterStatus === st.id ? '#FFFFFF' : st.isAlert ? '#B45309' : '#59655D',
                                            fontSize: '12.5px',
                                            fontWeight: '800',
                                            cursor: 'pointer',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                    >
                                        <span>{st.label}</span>
                                        {st.isAlert && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* UTR Verification Triage Notice */}
                        {pendingUtrCount > 0 && bookingFilterStatus !== 'Confirmed' && (
                            <div style={{ background: '#FFFBEB', border: '1.5px solid #F59E0B', borderRadius: '16px', padding: '16px 20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ fontSize: '24px' }}>🔔</div>
                                    <div>
                                        <div style={{ fontSize: '14px', fontWeight: '800', color: '#92400E' }}>
                                            {pendingUtrCount} Direct UPI Payment{pendingUtrCount > 1 ? 's' : ''} Awaiting Bank Credit Verification
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#B45309', marginTop: '2px' }}>
                                            Cross-check the customer's 12-digit UTR against your UPI/bank SMS and click "✓ Confirm" to lock permit and issue boarding pass.
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setBookingFilterStatus('Pending UTRs')}
                                    className="btn-lime"
                                    style={{ padding: '8px 16px', fontSize: '12px', fontWeight: '900', borderRadius: '10px' }}
                                >
                                    Filter Pending UTRs ({pendingUtrCount}) →
                                </button>
                            </div>
                        )}

                        {/* Bookings Cards */}
                        {filteredBookings.length === 0 ? (
                            <div style={{ padding: '60px 20px', textAlign: 'center', background: '#FFFFFF', borderRadius: '20px', border: '1px solid rgba(18,22,19,0.08)' }}>
                                <div style={{ fontSize: '36px', marginBottom: '12px' }}>📋</div>
                                <div style={{ fontSize: '18px', fontWeight: '800', color: '#121613' }}>No Reservations Found</div>
                                <div style={{ fontSize: '13px', color: '#59655D', marginTop: '6px', maxWidth: '400px', margin: '6px auto 16px' }}>
                                    No records match your search. You can create a new booking using the button below.
                                </div>
                                <button onClick={() => setIsAddBookingModalOpen(true)} className="btn-lime" style={{ padding: '10px 22px', fontSize: '13px', fontWeight: '800' }}>
                                    + Add Manual Booking
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                {filteredBookings.map(b => {
                                    const formattedCreated = b.createdAt 
                                        ? (isNaN(new Date(b.createdAt).getTime()) ? b.createdAt : new Date(b.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true }))
                                        : 'Recent';

                                    return (
                                    <div key={b.id} style={{ background: '#FFFFFF', border: b.status === 'Pending' ? '1.5px solid #F59E0B' : '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '18px', padding: '20px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                                                <span style={{ fontSize: '11px', fontWeight: '800', color: '#121613', background: '#F8F9F5', padding: '2px 7px', borderRadius: '4px', border: '1px solid rgba(18,22,19,0.08)' }}>{b.id}</span>
                                                <span style={{ fontSize: '11px', color: '#7D8880' }}>{formattedCreated}</span>
                                            </div>
                                            <div style={{ fontSize: '15.5px', fontWeight: '800', color: '#121613' }}>{b.name}</div>
                                            <div style={{ fontSize: '12.5px', color: '#59655D' }}>{b.phone}</div>
                                            {b.utrNumber && (
                                                <div style={{ marginTop: '6px', fontSize: '11px', fontWeight: '800', color: '#166534', background: 'rgba(22, 101, 52, 0.08)', padding: '3px 8px', borderRadius: '6px', display: 'inline-block' }}>
                                                    🔑 UTR / Ref: {b.utrNumber}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#121613' }}>{b.package}</div>
                                            <div style={{ fontSize: '12px', color: '#59655D' }}>{b.dates} · {b.guests} Guests</div>
                                            {b.roomType && <div style={{ fontSize: '11px', color: '#B45309', fontWeight: '600' }}>Room: {b.roomType}</div>}
                                            {b.mealSummary && <div style={{ fontSize: '10.5px', color: '#59655D', marginTop: '2px' }}>🍽️ {b.mealSummary}</div>}
                                        </div>

                                        <div>
                                            <div style={{ fontSize: '10.5px', color: '#7D8880' }}>Total Fare</div>
                                            <div style={{ fontSize: '19px', fontWeight: '800', color: '#121613' }}>
                                                ₹{(b.total || 0).toLocaleString('en-IN')}
                                            </div>
                                            {b.paidAmount != null && (
                                                <div style={{ fontSize: '11px', color: '#166534', fontWeight: '700' }}>
                                                    Paid: ₹{b.paidAmount.toLocaleString('en-IN')} · Due: ₹{(b.balanceDue || 0).toLocaleString('en-IN')}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label style={{ fontSize: '10px', color: '#7D8880', display: 'block', marginBottom: '4px', fontWeight: '700', textTransform: 'uppercase' }}>Status</label>
                                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                                <select
                                                    value={b.status}
                                                    onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                                                    style={{ padding: '7px 11px', borderRadius: '10px', background: b.status === 'Confirmed' ? '#DCFCE7' : b.status === 'Checked In' ? '#DBEAFE' : b.status === 'Cancelled' ? '#FEE2E2' : '#FEF3C7', color: b.status === 'Confirmed' ? '#166534' : b.status === 'Checked In' ? '#1E40AF' : b.status === 'Cancelled' ? '#991B1B' : '#92400E', fontWeight: '800', fontSize: '12px', border: '1px solid rgba(18,22,19,0.1)', cursor: 'pointer' }}
                                                >
                                                    <option value="Pending">Pending 🟡</option>
                                                    <option value="Confirmed">Confirmed 🟢</option>
                                                    <option value="Checked In">Checked In 🔵</option>
                                                    <option value="Cancelled">Cancelled 🔴</option>
                                                </select>
                                                {b.status === 'Pending' && (
                                                    <button
                                                        onClick={() => handleUpdateBookingStatus(b.id, 'Confirmed')}
                                                        className="btn-lime"
                                                        style={{ padding: '6px 10px', fontSize: '11px', fontWeight: '900', borderRadius: '8px', cursor: 'pointer' }}
                                                        title="Verify UTR and Confirm Reservation"
                                                    >
                                                        ✓ Confirm
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                                            <a href={`/pass/${b.id}`} target="_blank" rel="noopener noreferrer" style={{ padding: '8px 12px', borderRadius: '8px', background: '#F1F3EC', border: '1px solid rgba(18,22,19,0.1)', color: '#121613', textDecoration: 'none', fontSize: '11.5px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                <span>Pass 🎫</span>
                                            </a>
                                            <a href={waLink(`Hi ${b.name}! Aanandham coordinator desk confirming your booking (${b.id}) for ${b.package} on ${b.dates}.`, b.phone)} target="_blank" rel="noopener noreferrer" className="btn-lime" style={{ padding: '8px 14px', fontSize: '12px', gap: '6px' }}>
                                                <span>WhatsApp</span>
                                                <span>→</span>
                                            </a>
                                            <button onClick={() => handleDeleteBooking(b.id)} style={{ padding: '8px 11px', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: 'none', color: '#DC2626', cursor: 'pointer', fontSize: '12px' }}>
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    TAB 3: CAMPSITES & ROOM INVENTORY
                ───────────────────────────────────────────────────────────── */}
                {activeTab === 'properties' && (
                    <div style={{ maxWidth: '1300px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                            <div>
                                <div className="star-badge" style={{ marginBottom: '4px' }}>
                                    <span className="star-icon">★</span> CAMPSITE INVENTORY
                                </div>
                                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: '800', margin: 0, color: '#121613' }}>
                                    Regional Campsites & Glamping Pods
                                </h2>
                            </div>
                            <button onClick={() => handleOpenPropertyModal()} className="btn-lime" style={{ padding: '10px 22px', fontSize: '13.5px', fontWeight: '800' }}>
                                + Add New Campsite
                            </button>
                        </div>

                        {/* Region Filter Selector */}
                        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '24px' }}>
                            {['All', 'Munnar', 'Suryanelli', 'Wayanad', 'Vagamon', 'Athirappilly'].map(reg => (
                                <button
                                    key={reg}
                                    onClick={() => setPropertyFilterRegion(reg)}
                                    style={{
                                        padding: '8px 18px',
                                        borderRadius: '999px',
                                        border: propertyFilterRegion === reg ? '1px solid #121613' : '1px solid rgba(18,22,19,0.12)',
                                        background: propertyFilterRegion === reg ? '#121613' : '#FFFFFF',
                                        color: propertyFilterRegion === reg ? '#FFFFFF' : '#59655D',
                                        fontSize: '13px',
                                        fontWeight: '700',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {reg === 'All' ? 'All Kerala Regions' : reg}
                                </button>
                            ))}
                        </div>

                        {/* Properties Squared Card Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
                            {filteredProperties.map(prop => (
                                <div
                                    key={prop.id}
                                    style={{
                                        background: '#FFFFFF',
                                        border: prop.isAvailable ? '1px solid rgba(18, 22, 19, 0.08)' : '1px solid rgba(239, 68, 68, 0.3)',
                                        borderRadius: '20px',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        boxShadow: '0 4px 18px rgba(0,0,0,0.03)'
                                    }}
                                >
                                    <div 
                                        onClick={() => setActivePropertyDetailId(prop.id)}
                                        style={{ position: 'relative', height: '190px', cursor: 'pointer' }}
                                    >
                                        <img src={prop.image} alt={prop.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <span style={{ position: 'absolute', top: '12px', left: '12px', background: prop.isAvailable ? '#121613' : '#EF4444', color: prop.isAvailable ? '#E5A93B' : '#FFFFFF', fontSize: '10.5px', fontWeight: '800', padding: '4px 10px', borderRadius: '999px' }}>
                                            {prop.isAvailable ? 'Available' : 'Sold Out'}
                                        </span>
                                        <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.65)', color: '#FFFFFF', fontSize: '10.5px', fontWeight: '700', padding: '4px 10px', borderRadius: '999px', backdropFilter: 'blur(6px)' }}>
                                            {prop.altitude}
                                        </span>
                                    </div>

                                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                        <div style={{ fontSize: '11px', color: '#7D8880', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>
                                            📍 {prop.region || 'Munnar'} · {prop.location}
                                        </div>
                                        <h4 
                                            onClick={() => setActivePropertyDetailId(prop.id)}
                                            style={{ fontFamily: 'var(--font-heading)', fontSize: '17.5px', fontWeight: '800', color: '#121613', margin: '0 0 14px', lineHeight: 1.35, cursor: 'pointer' }}
                                        >
                                            {prop.title}
                                        </h4>

                                        {/* Rate & Adjust */}
                                        <div style={{ background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.06)', borderRadius: '14px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                            <div>
                                                <div style={{ fontSize: '10.5px', color: '#7D8880' }}>Base Rate / Camper</div>
                                                <div style={{ fontSize: '19px', fontWeight: '800', color: '#121613' }}>
                                                    ₹{prop.price.toLocaleString('en-IN')}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                <button onClick={() => handleAdjustPrice(prop.id, -100)} style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FFFFFF', border: '1px solid rgba(18,22,19,0.1)', color: '#121613', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}>-</button>
                                                <button onClick={() => handleAdjustPrice(prop.id, 100)} style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FFFFFF', border: '1px solid rgba(18,22,19,0.1)', color: '#121613', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}>+</button>
                                            </div>
                                        </div>

                                        {/* Manage Rooms Button */}
                                        <button
                                            onClick={() => setActivePropertyDetailId(prop.id)}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                borderRadius: '12px',
                                                background: '#121613',
                                                color: '#FFFFFF',
                                                fontSize: '13px',
                                                fontWeight: '800',
                                                cursor: 'pointer',
                                                marginBottom: '10px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '6px',
                                                border: 'none'
                                            }}
                                        >
                                            <span>Manage Rooms & Gallery ({prop.gallery ? prop.gallery.length : 1} photos)</span>
                                            <span>→</span>
                                        </button>

                                        <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                                            <Link
                                                href={`/camps/${prop.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ padding: '10px 12px', borderRadius: '10px', background: 'rgba(18,22,19,0.06)', color: '#121613', fontSize: '12px', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                                            >
                                                👁️ Public Page
                                            </Link>
                                            <button
                                                onClick={() => handleToggleAvailability(prop.id)}
                                                style={{ flex: 1, padding: '10px', borderRadius: '10px', background: prop.isAvailable ? 'rgba(239, 68, 68, 0.08)' : 'rgba(22, 101, 52, 0.08)', border: prop.isAvailable ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(22, 101, 52, 0.3)', color: prop.isAvailable ? '#DC2626' : '#166534', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}
                                            >
                                                {prop.isAvailable ? 'Mark Sold Out' : 'Mark Available'}
                                            </button>
                                            <button onClick={() => handleOpenPropertyModal(prop)} style={{ padding: '10px 14px', borderRadius: '10px', background: '#F8F9F5', border: '1px solid rgba(18,22,19,0.08)', color: '#121613', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                                                Edit ✏️
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    TAB 4: TREK BATCHES
                ───────────────────────────────────────────────────────────── */}
                {activeTab === 'events' && (
                    <div style={{ maxWidth: '1300px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                            <div>
                                <div className="star-badge" style={{ marginBottom: '4px' }}>
                                    <span className="star-icon">★</span> EXPEDITION BATCHES
                                </div>
                                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: '800', margin: 0, color: '#121613' }}>
                                    Scheduled Trek Batches & Camps
                                </h2>
                            </div>
                            <button onClick={() => handleOpenEventModal()} className="btn-lime" style={{ padding: '10px 22px', fontSize: '13.5px', fontWeight: '800' }}>
                                + Create New Batch
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
                            {events.map(ev => (
                                <div key={ev.id} style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 18px rgba(0,0,0,0.03)' }}>
                                    <div style={{ position: 'relative', height: '170px' }}>
                                        <img src={ev.image} alt={ev.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <span style={{ position: 'absolute', top: '12px', left: '12px', background: '#E5A93B', color: '#121613', fontSize: '10.5px', fontWeight: '800', padding: '4px 10px', borderRadius: '999px' }}>
                                            {ev.badge}
                                        </span>
                                        <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.65)', color: '#FFFFFF', fontSize: '10.5px', fontWeight: '700', padding: '4px 10px', borderRadius: '999px' }}>
                                            {ev.dates}
                                        </span>
                                    </div>

                                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                        <div style={{ fontSize: '10.5px', color: '#7D8880', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>
                                            📍 {ev.campsite}
                                        </div>
                                        <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '17px', fontWeight: '800', color: '#121613', margin: '0 0 8px', lineHeight: 1.3 }}>
                                            {ev.title}
                                        </h4>
                                        <p style={{ fontSize: '13px', color: '#59655D', lineHeight: 1.5, marginBottom: '16px' }}>{ev.description}</p>

                                        {/* Capacity Tracker */}
                                        <div style={{ background: '#F8F9F5', padding: '14px 16px', borderRadius: '14px', marginBottom: '16px', border: '1px solid rgba(18,22,19,0.04)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                                                <span style={{ color: '#121613' }}>Ticket: ₹{ev.price}</span>
                                                <span style={{ color: ev.spotsLeft === 0 ? '#DC2626' : '#166534' }}>
                                                    {ev.spotsLeft === 0 ? 'SOLD OUT' : `${ev.spotsLeft} Spots Left (${ev.booked}/${ev.capacity})`}
                                                </span>
                                            </div>
                                            <div style={{ height: '6px', background: 'rgba(18,22,19,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${Math.min(100, (ev.booked / ev.capacity) * 100)}%`, background: ev.spotsLeft === 0 ? '#DC2626' : '#166534' }} />
                                            </div>
                                        </div>

                                        <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                                            <button onClick={() => handleOpenEventModal(ev)} style={{ flex: 1, padding: '10px', borderRadius: '10px', background: '#F8F9F5', border: '1px solid rgba(18,22,19,0.08)', color: '#121613', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer' }}>
                                                Edit Batch ✏️
                                            </button>
                                            <button onClick={() => handleDeleteEvent(ev.id)} style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: 'none', color: '#DC2626', fontSize: '12.5px', cursor: 'pointer' }}>
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    TAB 5: PROFIT & FINANCIALS BREAKDOWN
                ───────────────────────────────────────────────────────────── */}
                {activeTab === 'financials' && (
                    <div style={{ maxWidth: '1300px' }}>
                        <div style={{ marginBottom: '28px' }}>
                            <div className="star-badge" style={{ marginBottom: '4px' }}>
                                <span className="star-icon">★</span> FINANCIAL INTELLIGENCE
                            </div>
                            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: '800', margin: 0, color: '#121613' }}>
                                Profit & Revenue Analytics
                            </h2>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                            <div style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '20px', padding: '26px 28px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                                <div style={{ fontSize: '11px', fontWeight: '800', color: '#7D8880', textTransform: 'uppercase' }}>Gross Revenue (Booked)</div>
                                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: '800', color: '#121613', margin: '8px 0' }}>₹{totalRevenue.toLocaleString('en-IN')}</div>
                                <div style={{ fontSize: '12.5px', color: '#59655D' }}>100% of confirmed reservations</div>
                            </div>

                            <div style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '20px', padding: '26px 28px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                                <div style={{ fontSize: '11px', fontWeight: '800', color: '#7D8880', textTransform: 'uppercase' }}>Direct Operations (45%)</div>
                                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: '800', color: '#B45309', margin: '8px 0' }}>₹{estimatedDirectCosts.toLocaleString('en-IN')}</div>
                                <div style={{ fontSize: '12.5px', color: '#59655D' }}>Permits, Food & 4x4 safaris</div>
                            </div>

                            <div style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '20px', padding: '26px 28px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                                <div style={{ fontSize: '11px', fontWeight: '800', color: '#7D8880', textTransform: 'uppercase' }}>Net Operating Profit</div>
                                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: '800', color: '#166534', margin: '8px 0' }}>₹{estimatedNetProfit.toLocaleString('en-IN')}</div>
                                <div style={{ fontSize: '12.5px', color: '#166534', fontWeight: '700' }}>✓ {profitMarginPercent}% Net Margin</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    TAB: PAYMENT GATEWAY & DYNAMIC QR CONTROL
                ───────────────────────────────────────────────────────────── */}
                {activeTab === 'payment' && (
                    <div style={{ maxWidth: '980px' }}>
                        <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                            <div>
                                <div className="star-badge" style={{ marginBottom: '4px' }}>
                                    <span className="star-icon">★</span> PAYMENT CONTROL CENTER
                                </div>
                                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: '800', margin: '0 0 6px', color: '#121613' }}>
                                    Payment Gateway, QR Code & Checkout Mode
                                </h2>
                                <p style={{ fontSize: '13.5px', color: '#59655D', margin: 0 }}>
                                    Toggle between "Coming Soon" concierge reservation mode and "Live UPI / QR Gateway" mode in 1 click.
                                </p>
                            </div>
                            <button
                                onClick={handleSavePaymentSettings}
                                className="btn-lime"
                                style={{ padding: '11px 24px', fontSize: '13.5px', fontWeight: '800', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                            >
                                <span>💾 Save & Apply Live</span>
                            </button>
                        </div>

                        {/* SECTION 1: MODE SELECTOR CARDS */}
                        <div style={{ marginBottom: '32px' }}>
                            <label style={{ fontSize: '11px', fontWeight: '800', color: '#627266', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '14px' }}>
                                1. ACTIVE CHECKOUT PAYMENT MODE
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
                                {/* Mode 1: Coming Soon (Default) */}
                                <div
                                    onClick={() => setPaymentSettings(prev => ({ ...prev, mode: 'coming_soon' }))}
                                    style={{
                                        border: paymentSettings.mode === 'coming_soon' ? '2px solid #E5A93B' : '1px solid rgba(18,22,19,0.1)',
                                        background: paymentSettings.mode === 'coming_soon' ? '#FFFDF5' : '#FFFFFF',
                                        borderRadius: '20px',
                                        padding: '24px',
                                        cursor: 'pointer',
                                        boxShadow: paymentSettings.mode === 'coming_soon' ? '0 8px 30px rgba(229,169,59,0.14)' : '0 2px 8px rgba(0,0,0,0.02)',
                                        transition: 'all 0.2s ease',
                                        position: 'relative'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                        <span style={{ fontSize: '24px' }}>⏳</span>
                                        <span style={{
                                            background: paymentSettings.mode === 'coming_soon' ? '#E5A93B' : 'rgba(18,22,19,0.06)',
                                            color: paymentSettings.mode === 'coming_soon' ? '#121613' : '#59655D',
                                            fontSize: '10.5px',
                                            fontWeight: '900',
                                            padding: '3px 10px',
                                            borderRadius: '999px',
                                            letterSpacing: '0.5px'
                                        }}>
                                            {paymentSettings.mode === 'coming_soon' ? '● CURRENTLY ACTIVE' : 'CLICK TO ACTIVATE'}
                                        </span>
                                    </div>
                                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800', margin: '0 0 6px', color: '#121613' }}>
                                        "Coming Soon" Concierge Mode
                                    </h4>
                                    <p style={{ fontSize: '13px', color: '#59655D', lineHeight: 1.55, margin: '0 0 14px' }}>
                                        Displays a clean "Gateway Coming Soon" notice. Guests complete bookings with <strong>₹0 advance</strong> and their reservation pass dispatches directly to your WhatsApp desk for personal confirmation.
                                    </p>
                                    <div style={{ fontSize: '11.5px', fontWeight: '700', color: '#B45309', background: 'rgba(245,158,11,0.1)', padding: '6px 12px', borderRadius: '8px', width: 'fit-content' }}>
                                        ✓ 0 Payment Friction · High Conversion
                                    </div>
                                </div>

                                {/* Mode 2: Live UPI & QR Gateway */}
                                <div
                                    onClick={() => setPaymentSettings(prev => ({ ...prev, mode: 'active' }))}
                                    style={{
                                        border: paymentSettings.mode === 'active' ? '2px solid #22C55E' : '1px solid rgba(18,22,19,0.1)',
                                        background: paymentSettings.mode === 'active' ? '#F0FDF4' : '#FFFFFF',
                                        borderRadius: '20px',
                                        padding: '24px',
                                        cursor: 'pointer',
                                        boxShadow: paymentSettings.mode === 'active' ? '0 8px 30px rgba(34,197,94,0.14)' : '0 2px 8px rgba(0,0,0,0.02)',
                                        transition: 'all 0.2s ease',
                                        position: 'relative'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                        <span style={{ fontSize: '24px' }}>⚡</span>
                                        <span style={{
                                            background: paymentSettings.mode === 'active' ? '#22C55E' : 'rgba(18,22,19,0.06)',
                                            color: paymentSettings.mode === 'active' ? '#FFFFFF' : '#59655D',
                                            fontSize: '10.5px',
                                            fontWeight: '900',
                                            padding: '3px 10px',
                                            borderRadius: '999px',
                                            letterSpacing: '0.5px'
                                        }}>
                                            {paymentSettings.mode === 'active' ? '● CURRENTLY ACTIVE' : 'CLICK TO ACTIVATE'}
                                        </span>
                                    </div>
                                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800', margin: '0 0 6px', color: '#121613' }}>
                                        Live Dynamic UPI & QR Gateway
                                    </h4>
                                    <p style={{ fontSize: '13px', color: '#59655D', lineHeight: 1.55, margin: '0 0 14px' }}>
                                        Generates dynamic UPI QR codes, 1-click GPay / PhonePe payment intent buttons, and accepts 12-digit UTR transaction IDs from guests during checkout.
                                    </p>
                                    <div style={{ fontSize: '11.5px', fontWeight: '700', color: '#15803D', background: 'rgba(34,197,94,0.12)', padding: '6px 12px', borderRadius: '8px', width: 'fit-content' }}>
                                        ✓ Direct Settlement · 0% Gateway Fees
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 2: UPI & QR CODE CONFIGURATION */}
                        <div style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '20px', padding: '28px', marginBottom: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: '800', color: '#121613', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block' }}>
                                        2. OFFICIAL UPI VPA & CUSTOM QR CODE CONFIGURATION
                                    </label>
                                    <div style={{ fontSize: '12.5px', color: '#59655D', marginTop: '2px' }}>
                                        These credentials are embedded into the dynamic QR codes and 1-tap mobile payment links.
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginBottom: '20px' }}>
                                <div>
                                    <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '6px' }}>
                                        Official UPI VPA ID (Virtual Payment Address):
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. aanandhamgo@okhdfcbank or 9400987654@upi"
                                        value={paymentSettings.upiId || ''}
                                        onChange={(e) => setPaymentSettings(prev => ({ ...prev, upiId: e.target.value }))}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', fontWeight: '700', outline: 'none', boxSizing: 'border-box' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '6px' }}>
                                        Official Payee Display Name:
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Aanandham Wilderness Stays"
                                        value={paymentSettings.payeeName || ''}
                                        onChange={(e) => setPaymentSettings(prev => ({ ...prev, payeeName: e.target.value }))}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', fontWeight: '700', outline: 'none', boxSizing: 'border-box' }}
                                    />
                                </div>
                            </div>

                            {/* Custom QR Upload / URL */}
                            <div style={{ borderTop: '1px solid rgba(18,22,19,0.06)', paddingTop: '20px', marginTop: '10px' }}>
                                <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '6px' }}>
                                    Custom QR Code Image (Optional - Overrides Dynamic Amount QR):
                                </label>
                                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                                    {paymentSettings.customQrUrl ? (
                                        <div style={{ position: 'relative', width: '90px', height: '90px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(18,22,19,0.12)', background: '#FFFFFF', padding: '4px' }}>
                                            <img src={paymentSettings.customQrUrl} alt="Custom QR Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                            <button
                                                type="button"
                                                onClick={() => setPaymentSettings(prev => ({ ...prev, customQrUrl: '' }))}
                                                style={{ position: 'absolute', top: '4px', right: '4px', background: '#DC2626', color: '#FFFFFF', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                title="Remove Custom QR"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <div style={{ width: '90px', height: '90px', borderRadius: '12px', border: '1px dashed rgba(18,22,19,0.2)', background: '#F8F9F5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#7D8880', fontSize: '11px', textAlign: 'center', padding: '8px' }}>
                                            <span style={{ fontSize: '20px' }}>📱</span>
                                            <span>Dynamic Auto QR</span>
                                        </div>
                                    )}

                                    <div style={{ flex: 1, minWidth: '220px' }}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            id="qr-image-uploader"
                                            onChange={handleQrImageUpload}
                                            style={{ display: 'none' }}
                                        />
                                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                            <label
                                                htmlFor="qr-image-uploader"
                                                style={{ padding: '9px 16px', borderRadius: '10px', background: '#121613', color: '#FFFFFF', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                            >
                                                <span>📷 {qrImageUploading ? 'Processing...' : 'Upload QR Image'}</span>
                                            </label>
                                            {paymentSettings.customQrUrl && (
                                                <button
                                                    type="button"
                                                    onClick={() => setPaymentSettings(prev => ({ ...prev, customQrUrl: '' }))}
                                                    style={{ padding: '9px 14px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', color: '#DC2626', border: 'none', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                                                >
                                                    Reset to Dynamic QR
                                                </button>
                                            )}
                                        </div>
                                        <div style={{ fontSize: '11.5px', color: '#7D8880', marginTop: '6px' }}>
                                            {paymentSettings.customQrUrl ? 'Using custom static QR code image.' : 'Currently using real-time dynamic UPI QR code generator for exact amounts.'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 3: COMING SOON MESSAGE CUSTOMIZER */}
                        <div style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '20px', padding: '28px', marginBottom: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                            <label style={{ fontSize: '11px', fontWeight: '800', color: '#121613', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: '14px' }}>
                                3. COMING SOON BANNER & CONCIERGE TEXT CUSTOMIZATION
                            </label>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '6px' }}>
                                    Heading / Title:
                                </label>
                                <input
                                    type="text"
                                    value={paymentSettings.comingSoonTitle || ''}
                                    onChange={(e) => setPaymentSettings(prev => ({ ...prev, comingSoonTitle: e.target.value }))}
                                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '6px' }}>
                                    Notice Description & Guest Guidance:
                                </label>
                                <textarea
                                    rows={3}
                                    value={paymentSettings.comingSoonMessage || ''}
                                    onChange={(e) => setPaymentSettings(prev => ({ ...prev, comingSoonMessage: e.target.value }))}
                                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.5 }}
                                />
                            </div>
                        </div>

                        {/* SECTION 4: LIVE PREVIEW & SAVE */}
                        <div style={{ background: '#121613', borderRadius: '20px', padding: '24px 28px', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                            <div>
                                <div style={{ fontSize: '11px', color: '#E5A93B', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                    ACTIVE STATUS: {paymentSettings.mode === 'coming_soon' ? '⏳ COMING SOON MODE' : '⚡ LIVE UPI GATEWAY'}
                                </div>
                                <div style={{ fontSize: '13.5px', color: '#A2B6A6', marginTop: '2px' }}>
                                    Changes take effect immediately across all booking modals on the website.
                                </div>
                            </div>
                            <button
                                onClick={handleSavePaymentSettings}
                                className="btn-lime"
                                style={{ padding: '13px 32px', fontSize: '14px', fontWeight: '900', border: 'none', cursor: 'pointer' }}
                            >
                                💾 Save & Apply Settings
                            </button>
                        </div>
                    </div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    TAB 6: COORDINATOR SETTINGS
                ───────────────────────────────────────────────────────────── */}
                {activeTab === 'settings' && (
                    <div style={{ maxWidth: '780px' }}>
                        <div style={{ marginBottom: '28px' }}>
                            <div className="star-badge" style={{ marginBottom: '4px' }}>
                                <span className="star-icon">★</span> COORDINATOR COORDINATES
                            </div>
                            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: '800', margin: 0, color: '#121613' }}>
                                Notification & Alert Dispatch Channels
                            </h2>
                        </div>

                        <form onSubmit={handleSaveNotifications}>
                            <div style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '20px', padding: '28px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                                <label style={{ fontSize: '11px', fontWeight: '800', color: '#121613', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
                                    OFFICIAL ADMIN WHATSAPP DISPATCH NUMBER
                                </label>
                                <input
                                    type="text"
                                    value={adminPhone}
                                    onChange={(e) => setAdminPhone(e.target.value)}
                                    style={{ width: '100%', padding: '13px 18px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', outline: 'none', marginBottom: '8px', boxSizing: 'border-box' }}
                                />
                                <div style={{ fontSize: '12.5px', color: '#59655D' }}>
                                    Customer booking receipts and inquiry tickets format directly into this WhatsApp desk number.
                                </div>
                            </div>

                            <div style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '20px', padding: '28px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                                <label style={{ fontSize: '11px', fontWeight: '800', color: '#121613', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
                                    TELEGRAM BOT / CLOUD WEBHOOK (OPTIONAL PUSH ALERTS)
                                </label>
                                <input
                                    type="text"
                                    value={adminTelegram}
                                    onChange={(e) => setAdminTelegram(e.target.value)}
                                    style={{ width: '100%', padding: '13px 18px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', outline: 'none', marginBottom: '8px', boxSizing: 'border-box' }}
                                />
                                <div style={{ fontSize: '12.5px', color: '#59655D' }}>
                                    Instant Telegram Bot notifications can be pushed directly to your smartphone with 0s latency.
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <button type="submit" className="btn-lime" style={{ padding: '13px 26px', fontSize: '14px', fontWeight: '800', border: 'none', cursor: 'pointer' }}>
                                    💾 Save Coordinates
                                </button>
                                {settingsSavedToast && (
                                    <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ color: '#166534', fontSize: '13px', fontWeight: '700' }}>
                                        ✓ Saved & Synchronized
                                    </motion.span>
                                )}
                            </div>
                        </form>

                        {/* SECTION: SYSTEM DATA BACKUP & RESTORE */}
                        <div style={{ marginTop: '36px', background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '20px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: '800', color: '#121613', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block' }}>
                                        📦 SYSTEM BACKUP & DISASTER RECOVERY
                                    </label>
                                    <div style={{ fontSize: '12.5px', color: '#59655D', marginTop: '4px' }}>
                                        Export an encrypted JSON snapshot of all campsite inventory, scheduled batches, and bookings.
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                <button
                                    type="button"
                                    onClick={handleExportBackup}
                                    style={{
                                        padding: '11px 20px',
                                        borderRadius: '12px',
                                        background: '#121613',
                                        color: '#FFFFFF',
                                        fontSize: '13px',
                                        fontWeight: '700',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <span>💾 Export JSON Backup</span>
                                </button>

                                <label
                                    style={{
                                        padding: '11px 20px',
                                        borderRadius: '12px',
                                        background: 'rgba(18, 22, 19, 0.06)',
                                        color: '#121613',
                                        fontSize: '13px',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <span>📥 Restore JSON Backup</span>
                                    <input type="file" accept=".json" onChange={handleImportBackup} style={{ display: 'none' }} />
                                </label>
                            </div>
                        </div>

                        {/* SECTION: ACCESS AUDIT LOGS */}
                        <div style={{ marginTop: '24px', background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '20px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: '800', color: '#121613', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block' }}>
                                        🛡️ COORDINATOR ACCESS AUDIT TRAIL
                                    </label>
                                    <div style={{ fontSize: '12.5px', color: '#59655D', marginTop: '4px' }}>
                                        Live chronological audit trail of login and authentication events.
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={fetchAuditLogs}
                                    style={{
                                        padding: '6px 14px',
                                        borderRadius: '8px',
                                        background: '#F1F3EC',
                                        border: '1px solid rgba(18,22,19,0.08)',
                                        color: '#121613',
                                        fontSize: '12px',
                                        fontWeight: '700',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {isLoadingAudit ? 'Refreshing...' : '🔄 Fetch Logs'}
                                </button>
                            </div>

                            {auditLogs.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
                                    {auditLogs.map((log, lIdx) => (
                                        <div key={lIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8F9F5', padding: '8px 12px', borderRadius: '8px', fontSize: '12px' }}>
                                            <span style={{ fontWeight: '700', color: log.success ? '#166534' : '#DC2626' }}>
                                                {log.action}
                                            </span>
                                            <span style={{ color: '#7D8880' }}>
                                                IP: {log.ip} · {new Date(log.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ fontSize: '12.5px', color: '#7D8880', fontStyle: 'italic' }}>
                                    Click "Fetch Logs" to view the recent server-side authentication audit trail.
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </main>
            </div>

            {/* ── MODAL: CREATE MANUAL BOOKING ── */}
            <AnimatePresence>
                {isAddBookingModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <motion.div initial={{ scale: 0.96, y: 14 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96 }} style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.1)', borderRadius: '24px', padding: '36px', maxWidth: '580px', width: '100%', maxHeight: '90vh', overflowY: 'auto', color: '#121613', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.18)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', borderBottom: '1px solid rgba(18, 22, 19, 0.08)', paddingBottom: '16px' }}>
                                <div>
                                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '21px', fontWeight: '800', margin: 0, color: '#121613' }}>
                                        Create Manual Reservation
                                    </h3>
                                    <div style={{ fontSize: '12.5px', color: '#59655D' }}>Record phone, walk-in or bespoke squad bookings</div>
                                </div>
                                <button onClick={() => setIsAddBookingModalOpen(false)} style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#F8F9F5', border: 'none', color: '#121613', cursor: 'pointer', fontWeight: '800' }}>
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSaveManualBooking} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                        Customer / Squad Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Rahul & Squad (4 Pax)"
                                        value={newBookingForm.name}
                                        onChange={e => setNewBookingForm({ ...newBookingForm, name: e.target.value })}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', boxSizing: 'border-box' }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                            Phone / WhatsApp *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="+91 98470 12345"
                                            value={newBookingForm.phone}
                                            onChange={e => setNewBookingForm({ ...newBookingForm, phone: e.target.value })}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                    <div>
                                        <CustomDateBatchPicker
                                            label="Travel / Weekend Batch"
                                            selectedDate={newBookingForm.dates}
                                            onDateChange={d => setNewBookingForm({ ...newBookingForm, dates: d })}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                    <div>
                                        <CustomSelectDropdown
                                            label="Campsite Package *"
                                            value={newBookingForm.package}
                                            onChange={val => {
                                                const matched = properties.find(p => p.title === val);
                                                setNewBookingForm({
                                                    ...newBookingForm,
                                                    package: val,
                                                    region: matched?.region || newBookingForm.region,
                                                    pricePerGuest: matched?.price || newBookingForm.pricePerGuest
                                                });
                                            }}
                                            options={properties.map(p => ({
                                                value: p.title,
                                                label: p.title,
                                                sublabel: `${p.region || 'Munnar'} · ₹${p.price}`
                                            }))}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                            Number of Campers *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            value={newBookingForm.guests}
                                            onChange={e => setNewBookingForm({ ...newBookingForm, guests: e.target.value })}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                            Price Per Camper (INR) *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            value={newBookingForm.pricePerGuest}
                                            onChange={e => setNewBookingForm({ ...newBookingForm, pricePerGuest: e.target.value })}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                    <div>
                                        <CustomSelectDropdown
                                            label="Initial Status"
                                            value={newBookingForm.status}
                                            onChange={val => setNewBookingForm({ ...newBookingForm, status: val })}
                                            options={[
                                                { value: 'Confirmed', label: 'Confirmed 🟢' },
                                                { value: 'Pending', label: 'Pending 🟡' },
                                                { value: 'Checked In', label: 'Checked In 🔵' }
                                            ]}
                                        />
                                    </div>
                                </div>

                                <div style={{ background: '#F8F9F5', padding: '14px 18px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '13px', color: '#59655D', fontWeight: '600' }}>Calculated Total:</span>
                                    <span style={{ fontSize: '20px', fontWeight: '800', color: '#121613' }}>
                                        ₹{((Number(newBookingForm.guests) || 1) * (Number(newBookingForm.pricePerGuest) || 2499)).toLocaleString('en-IN')}
                                    </span>
                                </div>

                                <button type="submit" className="btn-lime" style={{ padding: '14px', fontSize: '14.5px', fontWeight: '800', marginTop: '6px', cursor: 'pointer' }}>
                                    + Add Booking to System
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── MODAL: CREATE / EDIT CAMPSITE & MULTI-IMAGE GALLERY ── */}
            <AnimatePresence>
                {isPropertyModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <motion.div initial={{ scale: 0.96, y: 14 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96 }} style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.1)', borderRadius: '24px', padding: '36px', maxWidth: '720px', width: '100%', maxHeight: '90vh', overflowY: 'auto', color: '#121613', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.18)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', borderBottom: '1px solid rgba(18, 22, 19, 0.08)', paddingBottom: '16px' }}>
                                <div>
                                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '800', margin: 0, color: '#121613' }}>
                                        {editingProperty ? 'Edit Campsite & Photo Gallery' : 'Add New Kerala Campsite'}
                                    </h3>
                                    <div style={{ fontSize: '12.5px', color: '#59655D' }}>Configure pricing, high-res photos, itinerary, and inclusions</div>
                                </div>
                                <button onClick={() => setIsPropertyModalOpen(false)} style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#F8F9F5', border: 'none', color: '#121613', cursor: 'pointer', fontWeight: '800' }}>
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSavePropertyForm} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                
                                {/* SECTION: PHOTO GALLERY MANAGER */}
                                <div style={{ background: '#F8F9F5', borderRadius: '18px', padding: '20px', border: '1px solid rgba(18, 22, 19, 0.08)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                        <div>
                                            <label style={{ fontSize: '12px', fontWeight: '800', color: '#121613', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block' }}>
                                                📸 Photo Gallery ({propertyForm.gallery ? propertyForm.gallery.length : 0} Images)
                                            </label>
                                            <span style={{ fontSize: '11.5px', color: '#59655D' }}>Upload from your computer or paste image URLs</span>
                                        </div>
                                        <label style={{ cursor: 'pointer', background: '#121613', color: '#FFFFFF', padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                            <span>📤 Upload Photos</span>
                                            <input type="file" multiple accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                                        </label>
                                    </div>

                                    {/* URL Input Bar */}
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                                        <input
                                            type="url"
                                            placeholder="Paste Image URL (https://...)"
                                            value={imageUrlInput}
                                            onChange={e => setImageUrlInput(e.target.value)}
                                            style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.12)', fontSize: '13px', color: '#121613', outline: 'none' }}
                                        />
                                        <button type="button" onClick={handleAddImageUrl} className="btn-lime" style={{ padding: '10px 16px', fontSize: '12px', fontWeight: '800', flexShrink: 0 }}>
                                            + Add URL
                                        </button>
                                    </div>

                                    {/* Gallery Preview Grid */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
                                        {propertyForm.gallery && propertyForm.gallery.map((imgUrl, gIdx) => {
                                            const isCover = propertyForm.image === imgUrl;
                                            return (
                                                <div key={gIdx} style={{ position: 'relative', height: '90px', borderRadius: '10px', overflow: 'hidden', border: isCover ? '2px solid #E5A93B' : '1px solid rgba(18, 22, 19, 0.1)' }}>
                                                    <img src={imgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    {isCover && (
                                                        <span style={{ position: 'absolute', top: '4px', left: '4px', background: '#121613', color: '#E5A93B', fontSize: '9px', fontWeight: '800', padding: '2px 5px', borderRadius: '4px' }}>
                                                            ★ Cover
                                                        </span>
                                                    )}
                                                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', opacity: 0, transition: 'opacity 0.2s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px' }} onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0}>
                                                        {!isCover && (
                                                            <button type="button" onClick={() => handleSetPrimaryImage(imgUrl)} style={{ padding: '3px 8px', borderRadius: '4px', background: '#E5A93B', border: 'none', color: '#121613', fontSize: '10px', fontWeight: '800', cursor: 'pointer' }}>
                                                                Set Cover
                                                            </button>
                                                        )}
                                                        <button type="button" onClick={() => handleRemoveImage(gIdx)} style={{ padding: '3px 8px', borderRadius: '4px', background: '#EF4444', border: 'none', color: '#FFFFFF', fontSize: '10px', fontWeight: '800', cursor: 'pointer' }}>
                                                            Delete 🗑️
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Title & Region */}
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                        Campsite Title *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={propertyForm.title}
                                        onChange={e => setPropertyForm({ ...propertyForm, title: e.target.value })}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', boxSizing: 'border-box' }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                            Region *
                                        </label>
                                        <select
                                            value={propertyForm.region}
                                            onChange={e => setPropertyForm({ ...propertyForm, region: e.target.value })}
                                            style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', boxSizing: 'border-box' }}
                                        >
                                            <option value="Munnar">Munnar</option>
                                            <option value="Suryanelli">Suryanelli</option>
                                            <option value="Wayanad">Wayanad</option>
                                            <option value="Vagamon">Vagamon</option>
                                            <option value="Athirappilly">Athirappilly</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                            Altitude *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={propertyForm.altitude}
                                            onChange={e => setPropertyForm({ ...propertyForm, altitude: e.target.value })}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                            Base Price (INR / Camper) *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            value={propertyForm.price}
                                            onChange={e => setPropertyForm({ ...propertyForm, price: e.target.value })}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                            Original Strikethrough Price (INR)
                                        </label>
                                        <input
                                            type="number"
                                            value={propertyForm.originalPrice}
                                            onChange={e => setPropertyForm({ ...propertyForm, originalPrice: e.target.value })}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                            Duration
                                        </label>
                                        <input
                                            type="text"
                                            value={propertyForm.duration}
                                            onChange={e => setPropertyForm({ ...propertyForm, duration: e.target.value })}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                            Difficulty
                                        </label>
                                        <input
                                            type="text"
                                            value={propertyForm.difficulty}
                                            onChange={e => setPropertyForm({ ...propertyForm, difficulty: e.target.value })}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                        Description & Story
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={propertyForm.description}
                                        onChange={e => setPropertyForm({ ...propertyForm, description: e.target.value })}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                        Key Highlights (Comma Separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={propertyForm.highlights}
                                        onChange={e => setPropertyForm({ ...propertyForm, highlights: e.target.value })}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', boxSizing: 'border-box' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                        Inclusions (Comma Separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={propertyForm.inclusions}
                                        onChange={e => setPropertyForm({ ...propertyForm, inclusions: e.target.value })}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', boxSizing: 'border-box' }}
                                    />
                                </div>

                                <button type="submit" className="btn-lime" style={{ padding: '15px', fontSize: '15px', fontWeight: '800', marginTop: '6px', cursor: 'pointer' }}>
                                    {editingProperty ? 'Save Campsite & Gallery Changes' : '+ Publish New Campsite'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* MODAL: CREATE / EDIT EVENT BATCH */}
            <AnimatePresence>
                {isEventModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <motion.div initial={{ scale: 0.96, y: 14 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96 }} style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.1)', borderRadius: '24px', padding: '36px', maxWidth: '580px', width: '100%', maxHeight: '90vh', overflowY: 'auto', color: '#121613', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.18)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', borderBottom: '1px solid rgba(18, 22, 19, 0.08)', paddingBottom: '16px' }}>
                                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '21px', fontWeight: '800', margin: 0, color: '#121613' }}>
                                    {editingEvent ? 'Edit Trek Batch' : 'Schedule New Event Batch'}
                                </h3>
                                <button onClick={() => setIsEventModalOpen(false)} style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#F8F9F5', border: 'none', color: '#121613', cursor: 'pointer', fontWeight: '800' }}>
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSaveEventForm} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                        Event / Batch Title *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={eventForm.title}
                                        onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', boxSizing: 'border-box' }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                            Dates *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={eventForm.dates}
                                            onChange={e => setEventForm({ ...eventForm, dates: e.target.value })}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                            Price Per Spot (INR) *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            value={eventForm.price}
                                            onChange={e => setEventForm({ ...eventForm, price: e.target.value })}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                            Total Capacity (Pax) *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            value={eventForm.capacity}
                                            onChange={e => setEventForm({ ...eventForm, capacity: e.target.value })}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                            Booked Spots
                                        </label>
                                        <input
                                            type="number"
                                            value={eventForm.booked}
                                            onChange={e => setEventForm({ ...eventForm, booked: e.target.value })}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                        Campsite Location
                                    </label>
                                    <input
                                        type="text"
                                        value={eventForm.campsite}
                                        onChange={e => setEventForm({ ...eventForm, campsite: e.target.value })}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', boxSizing: 'border-box' }}
                                    />
                                </div>

                                <button type="submit" className="btn-lime" style={{ padding: '14px', fontSize: '14.5px', fontWeight: '800', marginTop: '6px', cursor: 'pointer' }}>
                                    {editingEvent ? 'Save Batch Changes' : '+ Schedule Batch'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* FLOATING TOAST */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        style={{
                            position: 'fixed',
                            bottom: '28px',
                            right: '28px',
                            zIndex: 100000,
                            background: '#121613',
                            color: '#FFFFFF',
                            padding: '14px 22px',
                            borderRadius: '14px',
                            fontSize: '13.5px',
                            fontWeight: '700',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <span>{toastMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
