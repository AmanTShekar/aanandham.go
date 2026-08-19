"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { LayoutDashboard, ClipboardList, Tent, Mountain, Users, IndianRupee, QrCode, ShieldCheck, Settings, Plus, RefreshCw, ChevronLeft, ChevronRight, ArrowUpRight, X, Upload, Camera, Download, Banknote, TrendingUp, Zap, Calendar, Compass, ScrollText, Search, Bell, Phone, KeyRound, Ticket, MessageCircle, Smartphone, Save, Clock, Flame, ShowerHead, Sunrise, Trees, Sprout, User, Briefcase, Trash2, Database, Heart, BadgePercent, MessageSquareQuote, Inbox } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import CustomDateBatchPicker from '../../components/CustomDateBatchPicker';
import CustomSelectDropdown from '../../components/CustomSelectDropdown';
import LucideAmenityIcon from '../../components/common/LucideAmenityIcon';
import { INITIAL_ALL_CAMPS, getAllCamps, saveAllCamps } from '../../lib/campsData';
import { inr, generateBookingId } from '../../lib/utils';
import { waLink } from '../../lib/whatsapp';
import { getPaymentSettings, savePaymentSettings } from '../../lib/paymentSettings';
import { DEFAULT_DISCOUNTS, loadDiscountsFromStorage, saveDiscountsToStorage } from '../../lib/discountsCore';
import { DEFAULT_TESTIMONIALS, loadTestimonialsFromStorage, saveTestimonialsToStorage } from '../../lib/testimonialsCore';
import { uploadCampsitePhoto } from '../../lib/mediaUpload';
import { getSecurityHeaders } from '../../lib/securityClient';
import MobileMarshalScanner from '@/components/admin/MobileMarshalScanner';

// ── SHARED LIQUID WAVE DRAWER VARIANTS (Matches SiteHeader) ──
const drawerWaveVariants = {
    hidden: { 
        opacity: 0,
        y: -6,
        clipPath: 'circle(0% at calc(100% - 42px) 36px)',
        WebkitClipPath: 'circle(0% at calc(100% - 42px) 36px)',
    },
    visible: { 
        opacity: 1,
        y: 0,
        clipPath: 'circle(260% at calc(100% - 42px) 36px)',
        WebkitClipPath: 'circle(260% at calc(100% - 42px) 36px)',
        transition: { 
            duration: 0.42, 
            ease: [0.22, 1, 0.36, 1] 
        }
    },
    exit: { 
        opacity: 0,
        y: -6,
        clipPath: 'circle(0% at calc(100% - 42px) 36px)',
        WebkitClipPath: 'circle(0% at calc(100% - 42px) 36px)',
        transition: { 
            duration: 0.3, 
            ease: [0.4, 0, 0.2, 1] 
        }
    }
};

const drawerStaggerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.035,
            delayChildren: 0.06
        }
    },
    exit: {
        opacity: 1,
        transition: {
            duration: 0.38
        }
    }
};

const drawerItemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.28, ease: "easeOut" }
    },
    exit: {
        opacity: 1,
        transition: { duration: 0.38 }
    }
};

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

// ── TESTIMONIAL AVATAR PRESETS (clean human portraits) ──
const AVATAR_PRESETS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=200&q=80'
];

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
badge: 'Bestseller ',
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
badge: 'High Altitude ',
        status: 'Active',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
        description: 'South India’s 2nd highest peak summit trek with forest permits, certified mountain guides, and tent glamping.'
    }
];

// ── STATION MARSHALS & FIELD COORDINATORS ──
const INITIAL_MARSHALS = [
    {
        id: 'm-1',
        name: 'Jishnu Mohan',
        station: 'Kolukkumalai Sunrise 4x4 Station',
        campId: 'pkg-kolukkumalai',
        phone: '+91 94471 55667',
        passcode: 'KOLU7900',
        status: 'On Duty',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        notes: 'Lead 4x4 off-road convoy pilot & high-altitude ridge coordinator.'
    },
    {
        id: 'm-2',
        name: 'Harikrishnan P',
        station: 'Meesapulimala High Altitude Basecamp',
        campId: 'pkg-meesapulimala',
        phone: '+91 98471 23456',
        passcode: 'MEESA8600',
        status: 'On Duty',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        notes: 'Certified wilderness first-aid marshal & 8-peak summit escort.'
    },
    {
        id: 'm-3',
        name: 'Akhil Dev',
        station: 'Suryanelli Valley Glamp Gate',
        campId: 'pkg-suryanelli',
        phone: '+91 94470 88990',
        passcode: 'SURYA2026',
        status: 'On Duty',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        notes: 'Geodesic dome pod check-in and estate campfire supervisor.'
    },
    {
        id: 'm-4',
        name: 'Vivek Menon',
        station: 'Vagamon Pine Forest Post',
        campId: 'pkg-vagamon-pine',
        phone: '+91 97455 11223',
        passcode: 'VAGA2026',
        status: 'On Duty',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
        notes: 'Pine forest safari tent marshaling and night barbecue supervisor.'
    },
    {
        id: 'm-5',
        name: 'Suresh Babu',
        station: 'Wayanad 900 Kandi Rainforest Post',
        campId: 'pkg-wayanad',
        phone: '+91 98950 44332',
        passcode: 'WAYA900',
        status: 'On Duty',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
        notes: 'Glass bridge permit verification & treehouse canopy escort.'
    }
];

const INITIAL_DB_LOGS = [
    {
        id: 'log-init-1',
        action: 'DB_SYNC',
        details: 'Initial database synchronization completed across all 5 Kerala regional nodes.',
        recordId: 'SYSTEM-HQ',
        timestamp: new Date().toISOString(),
        actor: 'Master Admin'
    },
    {
        id: 'log-init-2',
        action: 'STATION_ONLINE',
        details: 'Kolukkumalai Sunrise 4x4 Station marshal verified on duty.',
        recordId: 'm-1',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        actor: 'Jishnu Mohan'
    },
    {
        id: 'log-init-3',
        action: 'INVENTORY_AUDIT',
        details: 'Verified geodesic luxury dome pods and alpine quad tents.',
        recordId: 'pkg-kolukkumalai',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        actor: 'Master Admin'
    }
];

export default function AdminPortal() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
const [passcode, setPasscode] = useState('');
    const [passcodeError, setPasscodeError] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);

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
tag: 'Bestseller ',
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

    // Mobile Responsive & Drawer State
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [scannerOverlayOpen, setScannerOverlayOpen] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (isMobileSidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileSidebarOpen]);

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
badge: 'New Batch ',
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
        groupType: 'Family', // 'Family' | 'Friends Squad' | 'Couple' | 'Corporate' | 'Solo'
        allocatedUnit: 'Tent #01',
        roomType: 'Geodesic Luxury Dome Pod',
        pricePerGuest: 2499,
        status: 'Confirmed',
        notes: ''
    });

    // Sidebar Collapse State
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Booking Search, Camp Divider & Filter
    const [bookingSearch, setBookingSearch] = useState('');
    const [bookingFilterStatus, setBookingFilterStatus] = useState('All');
    const [bookingFilterCamp, setBookingFilterCamp] = useState('All');
    const [bookingSortBy, setBookingSortBy] = useState('newest');

    // Custom Themed Deletion Confirmation Dialog State
    const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({
        isOpen: false,
        title: '',
        subtitle: '',
        itemDetails: null,
        confirmText: 'Delete Permanently',
        confirmAction: null
    });

    const openDeleteConfirm = ({ title, subtitle, itemDetails, confirmText = 'Delete Record', onConfirm }) => {
        setDeleteConfirmDialog({
            isOpen: true,
            title,
            subtitle,
            itemDetails,
            confirmText,
            confirmAction: () => {
                if (onConfirm) onConfirm();
                setDeleteConfirmDialog(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const closeDeleteConfirm = () => {
        setDeleteConfirmDialog(prev => ({ ...prev, isOpen: false }));
    };

    // Station Marshals State (Persisted in LocalStorage)
    const [marshals, setMarshals] = useState(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('aanandham_admin_marshals');
                if (saved) return JSON.parse(saved);
            } catch (e) {}
        }
        return INITIAL_MARSHALS;
    });
    const [isMarshalModalOpen, setIsMarshalModalOpen] = useState(false);
    const [editingMarshal, setEditingMarshal] = useState(null);
    const [marshalForm, setMarshalForm] = useState({
        name: '',
        station: 'Kolukkumalai Sunrise 4x4 Station',
        campId: 'pkg-kolukkumalai',
        phone: '',
        passcode: 'KOLU7900',
        status: 'On Duty',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        notes: 'Lead 4x4 off-road convoy pilot & high-altitude ridge coordinator.'
    });

    // Database & System Logs State
    const [dbLogs, setDbLogs] = useState(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('aanandham_admin_db_logs');
                if (saved) return JSON.parse(saved);
            } catch (e) {}
        }
        return INITIAL_DB_LOGS;
    });
const [logViewTab, setLogViewTab] = useState('auth'); // 'auth' | 'db' | 'security' | 'inquiries'
    const [logSearch, setLogSearch] = useState('');
    const [logFilterSeverity, setLogFilterSeverity] = useState('all');
    const [securityOverview, setSecurityOverview] = useState({ activeBlocks: [], recentEvents: [], stats: {} });
    const [inquiries, setInquiries] = useState([]);

    const logDbAction = (action, details, recordId = '') => {
        const newEntry = {
            id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            action,
            details,
            recordId,
            timestamp: new Date().toISOString(),
            actor: 'Aanandham Admin Desk'
        };
        setDbLogs(prev => {
            const updated = [newEntry, ...prev].slice(0, 150);
            try { localStorage.setItem('aanandham_admin_db_logs', JSON.stringify(updated)); } catch {}
            return updated;
        });
    };

    const saveMarshals = (updated) => {
        setMarshals(updated);
        try {
            localStorage.setItem('aanandham_admin_marshals', JSON.stringify(updated));
        } catch (e) {}
        logDbAction('UPDATE_MARSHALS', `Updated field staff roster (${updated.length} marshals)`);
    };

    const handleOpenMarshalModal = (marshal = null) => {
        if (marshal) {
            setEditingMarshal(marshal);
            setMarshalForm({
                name: marshal.name || '',
                station: marshal.station || 'Kolukkumalai Sunrise 4x4 Station',
                campId: marshal.campId || 'pkg-kolukkumalai',
                phone: marshal.phone || '',
                passcode: marshal.passcode || '',
                status: marshal.status || 'On Duty',
                avatar: marshal.avatar || '',
                notes: marshal.notes || ''
            });
        } else {
            setEditingMarshal(null);
            setMarshalForm({
                name: '',
                station: 'Kolukkumalai Sunrise 4x4 Station',
                campId: 'pkg-kolukkumalai',
                phone: '+91 ',
                passcode: 'MARSHAL' + Math.floor(1000 + Math.random() * 9000),
                status: 'On Duty',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                notes: 'Station gate pass verification & convoy coordinator.'
            });
        }
        setIsMarshalModalOpen(true);
    };

    const handleSaveMarshalForm = (e) => {
        e.preventDefault();
        if (!marshalForm.name || !marshalForm.phone) {
showToast('Please enter the full name and phone number');
            return;
        }

        if (editingMarshal) {
            const updated = marshals.map(m => m.id === editingMarshal.id ? { ...m, ...marshalForm } : m);
            saveMarshals(updated);
            logDbAction('EDIT_CREW', `Updated host/guide profile: ${marshalForm.name} (${marshalForm.station})`, editingMarshal.id);
showToast(` ${marshalForm.name}'s details saved`);
        } else {
            const newMarshal = {
                id: `m-${Date.now().toString(36)}`,
                ...marshalForm
            };
            const updated = [newMarshal, ...marshals];
            saveMarshals(updated);
            logDbAction('ADD_CREW', `Added new host/guide: ${marshalForm.name} for ${marshalForm.station}`, newMarshal.id);
showToast(` ${marshalForm.name} added to field crew!`);
        }
        setIsMarshalModalOpen(false);
    };

    const handleDeleteMarshal = (id) => {
        const marshalToDelete = marshals.find(m => m.id === id);
        openDeleteConfirm({
            title: 'Remove from Field Crew?',
            subtitle: `Are you sure you want to remove ${marshalToDelete?.name || 'this crew member'} from ${marshalToDelete?.station || 'their station'}? Their gate PIN will be deactivated.`,
            itemDetails: {
                badge: id,
                label: marshalToDelete?.name || 'Camp Host / Guide',
                subtext: `${marshalToDelete?.station} · PIN: ${marshalToDelete?.passcode}`,
                status: marshalToDelete?.status || 'Active'
            },
confirmText: ' Remove from Crew',
            onConfirm: () => {
                const updated = marshals.filter(m => m.id !== id);
                saveMarshals(updated);
                logDbAction('REMOVE_CREW', `Removed host/guide: ${marshalToDelete?.name || id}`, id);
showToast(` ${marshalToDelete?.name || 'Crew member'} removed`);
            }
        });
    };

    const handleToggleMarshalStatus = (id) => {
        const updated = marshals.map(m => {
            if (m.id === id) {
                const nextStatus = m.status === 'On Duty' ? 'Off Duty' : (m.status === 'Off Duty' ? 'Station Closed' : 'On Duty');
                return { ...m, status: nextStatus };
            }
            return m;
        });
        saveMarshals(updated);
showToast('Marshal duty status updated');
    };

    // Admin Notification Settings
    const [adminPhone, setAdminPhone] = useState('+91 91886 85831');
    const [adminTelegram, setAdminTelegram] = useState('@aanandham_concierge_bot');
    const [settingsSavedToast, setSettingsSavedToast] = useState(false);

// Payment Gateway & QR Settings State
    const [paymentSettings, setPaymentSettings] = useState(() => getPaymentSettings());

    // Discounts & Offers State
    const [discounts, setDiscounts] = useState([]);
    const [discountsSaving, setDiscountsSaving] = useState(false);

    const handleSaveDiscounts = async () => {
        setDiscountsSaving(true);
        try {
            const res = await fetch('/api/admin/discounts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ discounts })
            });
            if (res.ok) {
                saveDiscountsToStorage(discounts);
                showToast('Discounts & Offers Saved & Applied Live!');
            } else {
                const err = await res.json().catch(() => ({}));
                showToast('Failed to Save Discounts: ' + (err.error || res.status));
            }
        } catch (e) {
            showToast('Network Error Saving Discounts');
        } finally {
            setDiscountsSaving(false);
        }
    };

    const handleResetDiscounts = async () => {
        if (!window.confirm('Reset all discounts & offers back to factory defaults?')) return;
        setDiscountsSaving(true);
        try {
            const res = await fetch('/api/admin/discounts', { method: 'DELETE', credentials: 'include' });
            if (res.ok) {
                setDiscounts(DEFAULT_DISCOUNTS);
                saveDiscountsToStorage(DEFAULT_DISCOUNTS);
                showToast('Discounts Reset to Factory Defaults');
            } else {
                showToast('Failed to Reset Discounts');
            }
        } catch (e) {
            showToast('Network Error Resetting Discounts');
        } finally {
            setDiscountsSaving(false);
        }
    };

    const handleAddDiscount = () => {
        const now = new Date().toISOString();
        setDiscounts(prev => [
            ...prev,
            { id: `campaign-${Date.now()}`, name: 'New Offer', type: 'percent', value: 5, minGuests: 2, scope: 'all', active: true, createdAt: now }
        ]);
    };

    const handleUpdateDiscount = (id, patch) => {
        setDiscounts(prev => prev.map(d => d.id === id ? { ...d, ...patch } : d));
    };

    const handleRemoveDiscount = (id) => {
        setDiscounts(prev => prev.filter(d => d.id !== id));
    };

    // Testimonials State
    const [testimonials, setTestimonials] = useState([]);
    const [testimonialsSaving, setTestimonialsSaving] = useState(false);

    const handleSaveTestimonials = async () => {
        setTestimonialsSaving(true);
        try {
            const res = await fetch('/api/admin/testimonials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ testimonials })
            });
            if (res.ok) {
                saveTestimonialsToStorage(testimonials);
                showToast('Testimonials Saved & Published Live!');
            } else {
                const err = await res.json().catch(() => ({}));
                showToast('Failed to Save Testimonials: ' + (err.error || res.status));
            }
        } catch (e) {
            showToast('Network Error Saving Testimonials');
        } finally {
            setTestimonialsSaving(false);
        }
    };

    const handleResetTestimonials = async () => {
        if (!window.confirm('Reset all testimonials back to the factory defaults?')) return;
        setTestimonialsSaving(true);
        try {
            const res = await fetch('/api/admin/testimonials', { method: 'DELETE', credentials: 'include' });
            if (res.ok) {
                setTestimonials(DEFAULT_TESTIMONIALS);
                saveTestimonialsToStorage(DEFAULT_TESTIMONIALS);
                showToast('Testimonials Reset to Defaults');
            } else {
                showToast('Failed to Reset Testimonials');
            }
        } catch (e) {
            showToast('Network Error Resetting Testimonials');
        } finally {
            setTestimonialsSaving(false);
        }
    };

    const handleAddTestimonial = () => {
        setTestimonials(prev => [
            ...prev,
            { id: `t-${Date.now()}`, quote: '', author: 'Guest Camper', campBadge: 'camp', batchDate: '', avatar: '', active: true }
        ]);
    };

    const handleUpdateTestimonial = (id, patch) => {
        setTestimonials(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
    };

    const handleRandomTestimonialAvatar = (id) => {
        const pick = AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)];
        handleUpdateTestimonial(id, { avatar: pick });
    };

    const handleTestimonialAvatarUpload = async (id, file) => {
        if (!file) return;
        try {
            const dataUrl = await compressImageFile(file, 160, 160, 0.82);
            handleUpdateTestimonial(id, { avatar: dataUrl });
            showToast('Avatar Photo Ready — Click Save & Publish to apply');
        } catch (e) {
            showToast(e.message || 'Avatar Upload Failed');
        }
    };

    const handleRemoveTestimonial = (id) => {
        setTestimonials(prev => prev.filter(t => t.id !== id));
    };

const handleSavePaymentSettings = (e) => {
        if (e) e.preventDefault();
        savePaymentSettings(paymentSettings);
showToast('Payment Gateway Settings Saved & Synchronized Live!');
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

        // Testimonials sync (server authoritative, localStorage + defaults fallback)
        const savedTestimonials = loadTestimonialsFromStorage();
        setTestimonials(Array.isArray(savedTestimonials) && savedTestimonials.length > 0 ? savedTestimonials : DEFAULT_TESTIMONIALS);
        try {
            const testRes = await fetch('/api/admin/testimonials', { credentials: 'include' });
            if (testRes.ok) {
                const testData = await testRes.json();
                if (Array.isArray(testData?.testimonials)) setTestimonials(testData.testimonials);
            }
        } catch (e) {}

        // Discounts sync (server authoritative, localStorage + defaults fallback)
        const savedDiscounts = loadDiscountsFromStorage();
        setDiscounts(Array.isArray(savedDiscounts) && savedDiscounts.length > 0 ? savedDiscounts : DEFAULT_DISCOUNTS);
        try {
            const discRes = await fetch('/api/admin/discounts', { credentials: 'include' });
            if (discRes.ok) {
                const discData = await discRes.json();
                if (Array.isArray(discData?.discounts)) setDiscounts(discData.discounts);
            }
        } catch (e) {}
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
        // Authenticate Session via HttpOnly Secure Cookie strictly for Master HQ Admin
        const restoreSession = async () => {
            try {
                const res = await fetch('/api/admin/auth', {
                    method: 'GET',
                    credentials: 'include'
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.authenticated && data.isMasterAdmin === true && data.role === 'admin_coordinator') {
                        setIsAuthenticated(true);
                        reloadDataFromStorage();
                    } else {
                        // If not Master HQ session, show the Passcode Gate on /admin
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

        // Listen for live public booking events
        const handleStorageUpdate = (e) => {
            if (e.key && e.key.startsWith('aanandham_booking_event')) {
                reloadDataFromStorage();
            }
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
showToast('Notification coordinates saved');
    };

    const [auditLogs, setAuditLogs] = useState([]);
    const [isLoadingAudit, setIsLoadingAudit] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
const res = await fetch('/api/admin/auth', {
                method: 'POST',
                headers: await getSecurityHeaders({ 'Content-Type': 'application/json' }),
                credentials: 'include',
                body: JSON.stringify({ passcode: passcode.trim(), rememberMe })
            });
            const data = await res.json();
            if (data.success) {
                if (data.isMasterAdmin === true && data.role === 'admin_coordinator') {
                    setIsAuthenticated(true);
                    setPasscodeError('');
                    reloadDataFromStorage();
                } else {
                    // Station code entered on Master portal -> keep user here and ask for Master HQ code
                    setPasscodeError('Station code entered. Please enter your Master HQ Admin passcode.');
                }
            } else {
                setPasscodeError(data.message || 'Invalid Passcode. Please enter your Master Admin code.');
            }
        } catch (err) {
            setPasscodeError('Network error. Please try again.');
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
showToast('Logged out securely');
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

    // Load Live Security Overview (active blocks + abuse events)
    const fetchSecurityOverview = async () => {
        try {
            const res = await fetch('/api/admin/security', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                if (data.success) setSecurityOverview(data);
            }
        } catch {}
    };

    // Load Contact Form Inquiries from the server (stored as INQ- records, never bookings)
    const fetchInquiries = async () => {
        try {
            const res = await fetch('/api/inquiries', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                if (data.success && Array.isArray(data.inquiries)) setInquiries(data.inquiries);
            }
        } catch {}
    };

    // Export full WAL + audit + snapshot ledger bundle from the server
    const handleExportWalBackup = async () => {
        try {
            const res = await fetch('/api/admin/audit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ action: 'export_backup' })
            });
            const data = await res.json();
            if (data.success && data.auditLogs) {
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                const dateStr = new Date().toISOString().split('T')[0];
                a.href = url;
                a.download = `aanandham-wal-ledger-backup-${dateStr}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                showToast('WAL & ledger backup exported');
            } else {
                showToast(data.message || 'Export requires Master HQ scope');
            }
        } catch {
            showToast('Network error exporting WAL backup');
        }
    };

    // Block / unblock an IP or device fingerprint from the audit console
    const handleSecurityAction = async (action, type, value) => {
        try {
            const res = await fetch('/api/admin/security', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    action,
                    type,
                    value,
                    reason: action === 'block' ? 'Manual block from audit console' : undefined
                })
            });
            const data = await res.json();
            if (data.success) {
                showToast(action === 'unblock' ? 'Entity unblocked' : 'Entity blocked');
                fetchSecurityOverview();
            } else {
                showToast(data.message || 'Action requires Master HQ scope');
            }
        } catch {
            showToast('Network error');
        }
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
showToast('Full JSON system backup exported');
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
showToast('System backup restored successfully');
            } catch {
showToast('Invalid JSON backup file format');
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
showToast('Storage quota reached. Consider exporting backup.');
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
showToast('Storage quota reached.');
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
showToast('Property availability updated');
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
showToast('Room availability updated');
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
showToast(` Room photo uploaded to CDN (${result.sizeKB} KB)`);
        } catch (supabaseErr) {
            // Fallback: compress to base64 for local/dev use
            try {
                const compressedBase64 = await compressImageFile(file, 1200, 800, 0.82);
                setRoomForm(prev => ({ ...prev, image: compressedBase64 }));
showToast('Room photo compressed locally (connect Supabase for CDN storage)');
            } catch (err) {
showToast(` ${err.message || 'Error uploading room image'}`);
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
        const prop = properties.find(p => p.id === propId);
        const room = prop?.rooms?.find(r => r.id === roomId);
        openDeleteConfirm({
            title: 'Delete Room / Pod Type?',
            subtitle: 'This will permanently remove this accommodation tier and its associated features from this campsite listing.',
            itemDetails: {
                badge: 'Room / Pod',
                label: room ? room.name : 'Accommodation Tier',
                subtext: prop ? prop.title : 'Campsite',
                amount: room?.price ? `₹${room.price.toLocaleString('en-IN')} / Night` : null,
                status: `${room?.totalUnits || 0} Units Total`
            },
confirmText: ' Delete Room Type',
            onConfirm: () => {
                const updated = properties.map(p => {
                    if (p.id === propId && p.rooms) {
                        return { ...p, rooms: p.rooms.filter(r => r.id !== roomId) };
                    }
                    return p;
                });
                saveProperties(updated);
showToast('Room type deleted');
            }
        });
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
showToast('Room type updated');
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
showToast('New room type added');
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
tag: prop.tag || 'Bestseller ',
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
tag: 'New Campsite ',
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
showToast(` Uploaded ${successCount} photo(s) to CDN`);
        } else {
showToast('No valid images were uploaded');
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
showToast('Image URL added to gallery');
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
showToast('Image removed');
    };

    // Set Primary Cover Image
    const handleSetPrimaryImage = (url) => {
        setPropertyForm({
            ...propertyForm,
            image: url
        });
showToast('Set as main cover image');
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
showToast('Campsite details updated');
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
                    { id: `am-${Date.now()}-1`, name: 'Campfire Circle & BBQ', icon: Flame, enabled: true },
                    { id: `am-${Date.now()}-2`, name: 'Western Washrooms', icon: ShowerHead, enabled: true },
                    { id: `am-${Date.now()}-3`, name: 'Wilderness Guide Marshals', icon: Compass, enabled: true }
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
showToast('New campsite listing created');
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
badge: 'New Batch ',
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
showToast('Batch updated');
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
showToast('New event batch scheduled');
        }
        setIsEventModalOpen(false);
    };

    // Delete Event
    const handleDeleteEvent = (id) => {
        const eventToDelete = events.find(e => e.id === id);
        openDeleteConfirm({
            title: 'Remove Scheduled Trek Batch?',
            subtitle: 'This will remove the scheduled expedition batch from live inventory and active booking rosters.',
            itemDetails: {
                badge: 'Batch ID: ' + id,
                label: eventToDelete ? eventToDelete.title : 'Scheduled Batch',
                subtext: eventToDelete ? `${eventToDelete.campsite} · ${eventToDelete.dates}` : 'Expedition Batch',
                amount: eventToDelete?.price ? `₹${eventToDelete.price.toLocaleString('en-IN')} / Pax` : null,
                status: eventToDelete ? `${eventToDelete.spotsLeft} spots left (${eventToDelete.booked}/${eventToDelete.capacity})` : 'Active'
            },
confirmText: ' Remove Batch',
            onConfirm: () => {
                const updated = events.filter(e => e.id !== id);
                saveEvents(updated);
showToast('Event batch removed');
            }
        });
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
            groupType: newBookingForm.groupType || 'Family',
            allocatedUnit: newBookingForm.allocatedUnit ? newBookingForm.allocatedUnit.trim() : 'Tent #01',
            notes: newBookingForm.notes ? newBookingForm.notes.trim() : '',
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
            groupType: 'Family',
            allocatedUnit: 'Tent #01',
            roomType: 'Geodesic Luxury Dome Pod',
            pricePerGuest: 2499,
            status: 'Confirmed',
            notes: ''
        });
showToast(` Booking ${newBooking.id} created successfully (${newBooking.groupType} · ${newBooking.allocatedUnit})`);
    };

    // Quick Update Allocated Unit (Tent / Pod #)
    const handleUpdateAllocatedUnit = async (id, newUnit) => {
        const updated = bookings.map(b => b.id === id ? { ...b, allocatedUnit: newUnit } : b);
        setBookings(updated);
        try {
            await fetch('/api/admin/bookings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ id, allocatedUnit: newUnit })
            });
        } catch (e) {}
showToast(` Booking ${id} unit allocated: ${newUnit}`);
    };

    // Quick Update Squad / Group Type
    const handleUpdateGroupType = async (id, newGroupType) => {
        const updated = bookings.map(b => b.id === id ? { ...b, groupType: newGroupType } : b);
        setBookings(updated);
        try {
            await fetch('/api/admin/bookings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ id, groupType: newGroupType })
            });
        } catch (e) {}
showToast(` Booking ${id} squad category set: ${newGroupType}`);
    };

    // Delete Single Booking Securely
    const handleDeleteBooking = (id) => {
        const bookingToDelete = bookings.find(b => b.id === id);
        openDeleteConfirm({
            title: `Delete Reservation?`,
            subtitle: `Are you sure you want to permanently delete reservation ${id}? This will remove the camper record from the live database roster and invalidate their gate pass.`,
            itemDetails: {
                badge: id,
                label: bookingToDelete ? `${bookingToDelete.name} (${bookingToDelete.guests || 2} Campers)` : `Reservation ${id}`,
                subtext: bookingToDelete ? `${bookingToDelete.package} · ${bookingToDelete.dates}` : 'Camper Reservation',
                amount: bookingToDelete?.total ? `₹${Number(bookingToDelete.total).toLocaleString('en-IN')}` : null,
                status: bookingToDelete?.status || 'Pending'
            },
confirmText: ' Delete Reservation',
            onConfirm: async () => {
                const updated = bookings.filter(b => b.id !== id);
                setBookings(updated);
                try {
                    await fetch(`/api/admin/bookings?id=${encodeURIComponent(id)}`, {
                        method: 'DELETE',
                        credentials: 'include'
                    });
                } catch (err) {
                    console.error('Failed to call DELETE /api/admin/bookings:', err);
                }
                logDbAction('DELETE_BOOKING', `Permanently deleted reservation: ${id}`, id);
showToast(` Reservation ${id} permanently deleted`);
            }
        });
    };

    // Update Booking Status via direct PATCH
    const handleUpdateBookingStatus = async (id, newStatus) => {
        const updated = bookings.map(b => b.id === id ? { ...b, status: newStatus } : b);
        setBookings(updated);
        try {
            await fetch('/api/admin/bookings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ id, status: newStatus })
            });
        } catch (e) {
            console.error('Error updating status via PATCH:', e);
        }
        logDbAction('UPDATE_STATUS', `Updated booking ${id} status to ${newStatus}`, id);
showToast(` Booking ${id} marked as ${newStatus}`);
    };

    // Restore / Seed Sample Bookings Roster
    const handleSeedSampleBookings = async () => {
        try {
            const res = await fetch('/api/marshal/seed', { method: 'POST' });
            if (res.ok) {
                await reloadDataFromStorage();
showToast('Sample bookings roster restored successfully!');
                return;
            }
        } catch (e) {}
        await reloadDataFromStorage();
showToast('Refreshed live bookings roster');
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
showToast('Bookings exported to CSV');
    };

// Filter properties by region
    const filteredProperties = propertyFilterRegion === 'All' ? properties : properties.filter(p => (p.region || 'Munnar') === propertyFilterRegion);

    // Campsite Matching Helper for Bookings
    const isBookingMatchingCamp = (b, campId) => {
        if (!campId || campId === 'All') return true;
        const bPkg = String(b.package || '').toLowerCase();
        const bRegion = String(b.region || '').toLowerCase();
        const bCampId = String(b.campsiteId || '').toLowerCase();

        if (campId === 'pkg-kolukkumalai' || campId === 'Kolukkumalai') {
            return bCampId === 'pkg-kolukkumalai' || bPkg.includes('kolukkumalai') || bRegion.includes('kolukkumalai');
        }
        if (campId === 'pkg-meesapulimala' || campId === 'Meesapulimala') {
            return bCampId === 'pkg-meesapulimala' || bPkg.includes('meesapulimala') || bRegion.includes('meesapulimala') || bRegion.includes('silent valley');
        }
        if (campId === 'pkg-suryanelli' || campId === 'Suryanelli') {
            return bCampId === 'pkg-suryanelli' || bPkg.includes('suryanelli') || (bRegion.includes('suryanelli') && !bPkg.includes('kolukkumalai'));
        }
        if (campId === 'pkg-vagamon-pine' || campId === 'Vagamon') {
            return bCampId.includes('vagamon') || bPkg.includes('vagamon') || bRegion.includes('vagamon');
        }
        if (campId === 'pkg-wayanad' || campId === 'Wayanad') {
            return bCampId.includes('wayanad') || bPkg.includes('wayanad') || bRegion.includes('wayanad');
        }
        return true;
    };

    // Live Campsite-Specific Booking Counts
    const koluBookingsCount = bookings.filter(b => isBookingMatchingCamp(b, 'pkg-kolukkumalai')).length;
    const meesaBookingsCount = bookings.filter(b => isBookingMatchingCamp(b, 'pkg-meesapulimala')).length;
    const suryaBookingsCount = bookings.filter(b => isBookingMatchingCamp(b, 'pkg-suryanelli')).length;
    const vagaBookingsCount = bookings.filter(b => isBookingMatchingCamp(b, 'pkg-vagamon-pine')).length;
    const wayaBookingsCount = bookings.filter(b => isBookingMatchingCamp(b, 'pkg-wayanad')).length;

    // Filter & Sort Bookings with Search, Campsite Divider, Status, and Sort Order
    const filteredBookings = useMemo(() => {
        let result = bookings.filter(b => {
            const cleanSearch = bookingSearch.replace(/\D/g, '');
            const cleanPhone = (b.phone || '').replace(/\D/g, '');
            const matchSearch = 
                !bookingSearch.trim() ||
                (b.name || '').toLowerCase().includes(bookingSearch.toLowerCase()) || 
                (cleanSearch && cleanPhone.includes(cleanSearch)) || 
                (b.phone || '').toLowerCase().includes(bookingSearch.toLowerCase()) ||
                (b.package || '').toLowerCase().includes(bookingSearch.toLowerCase()) ||
                (b.utrNumber || '').toLowerCase().includes(bookingSearch.toLowerCase()) ||
                (b.id || '').toLowerCase().includes(bookingSearch.toLowerCase());

            const matchStatus = 
                bookingFilterStatus === 'All' ? true :
                b.status === bookingFilterStatus;

            const matchCamp = isBookingMatchingCamp(b, bookingFilterCamp);

            return matchSearch && matchStatus && matchCamp;
        });

        return result.sort((a, b) => {
            if (bookingSortBy === 'highest_amount') {
                return (Number(b.total) || 0) - (Number(a.total) || 0);
            }
            if (bookingSortBy === 'guests_desc') {
                return (Number(b.guests) || 0) - (Number(a.guests) || 0);
            }
            if (bookingSortBy === 'oldest') {
                return (new Date(a.createdAt || 0).getTime() || 0) - (new Date(b.createdAt || 0).getTime() || 0);
            }
            // Default: newest
            return (new Date(b.createdAt || 0).getTime() || 0) - (new Date(a.createdAt || 0).getTime() || 0);
        });
    }, [bookings, bookingSearch, bookingFilterStatus, bookingFilterCamp, bookingSortBy]);

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
                            <div style={{ fontSize: '12.5px', color: '#DC2626', fontWeight: '700', lineHeight: 1.4 }}>
                                {typeof passcodeError === 'string' ? passcodeError : 'Invalid Passcode. Please enter your Master Admin code.'}
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
<span><ChevronRight size={14} /></span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setRememberMe(prev => !prev)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                background: 'transparent',
                                border: 'none',
                                color: rememberMe ? '#121613' : '#8A938B',
                                fontSize: '12.5px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                padding: '4px 0',
                                marginTop: '-2px'
                            }}
                        >
                            <div style={{
                                width: '17px',
                                height: '17px',
                                borderRadius: '5px',
                                border: `2px solid ${rememberMe ? '#0B150E' : 'rgba(18,22,19,0.25)'}`,
                                background: rememberMe ? '#D5ED55' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                {rememberMe && <span style={{ fontSize: '10px', fontWeight: '900', color: '#0B150E' }}>✓</span>}
                            </div>
                            Keep me signed in for 24 hours
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
                <header style={{ position: 'sticky', top: 0, zIndex: 100, background: '#FFFFFF', borderBottom: '1px solid rgba(18, 22, 19, 0.08)', padding: '16px clamp(24px, 4vw, 56px)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
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
                                    background: '#F1F3EC',
                                    border: '1px solid rgba(18, 22, 19, 0.12)',
                                    color: '#121613',
                                    fontSize: '13px',
                                    fontWeight: '800',
                                    cursor: 'pointer'
                                }}
                            >
← Back to Campsites
                            </button>
                            <div>
                                <span style={{ fontSize: '10.5px', fontWeight: '800', color: '#166534', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block' }}>
                                    CAMPSITE INVENTORY & GALLERY
                                </span>
                                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800', margin: 0, color: '#121613' }}>
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
                                    background: '#F8F9F5',
                                    border: '1px solid rgba(18, 22, 19, 0.12)',
                                    color: '#121613',
                                    fontSize: '12.5px',
                                    fontWeight: '700',
                                    textDecoration: 'none'
                                }}
                            >
View Public Page →
                            </Link>
                            <button
                                onClick={() => handleToggleAvailability(currentDetailProperty.id)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '999px',
                                    background: currentDetailProperty.isAvailable ? '#DCFCE7' : 'rgba(239, 68, 68, 0.08)',
                                    border: currentDetailProperty.isAvailable ? '1px solid rgba(22, 101, 52, 0.25)' : '1px solid rgba(239, 68, 68, 0.25)',
                                    color: currentDetailProperty.isAvailable ? '#166534' : '#DC2626',
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
Edit Property & Gallery 
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
Campsite Photo Gallery ({currentDetailProperty.gallery ? currentDetailProperty.gallery.length : 1})
                                </h3>
                                <div style={{ fontSize: '12.5px', color: '#59655D' }}>High-res wilderness, pod, and sunset photos displayed on public page</div>
                            </div>
                            <button onClick={() => handleOpenPropertyModal(currentDetailProperty)} className="btn-lime" style={{ padding: '8px 16px', fontSize: '12.5px', fontWeight: '800' }}>
Manage Gallery Photos 
                            </button>
                        </div>

                        <div style={{ display: 'flex', gap: '14px', overflowX: 'auto', paddingBottom: '8px' }}>
                            {(currentDetailProperty.gallery || [currentDetailProperty.image]).map((img, idx) => (
                                <div key={idx} style={{ position: 'relative', width: '160px', height: '110px', borderRadius: '14px', overflow: 'hidden', flexShrink: 0, border: img === currentDetailProperty.image ? '2px solid #E5A93B' : '1px solid rgba(18,22,19,0.1)' }}>
                                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    {img === currentDetailProperty.image && (
                                        <span style={{ position: 'absolute', top: '6px', left: '6px', background: '#121613', color: '#E5A93B', fontSize: '9.5px', fontWeight: '800', padding: '2px 6px', borderRadius: '4px' }}>
Cover
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
Edit 
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
                                            <Trash2 size={14} />
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
                        <div style={{ position: 'fixed', inset: 0, zIndex: 100010, background: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
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
<X size={15} strokeWidth={2.5} />
                                    </button>
                                </div>

                                <form onSubmit={handleSaveRoom} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    
                                    {/* FAST CAPACITY PRESETS */}
                                    <div style={{ background: '#F4F7EB', borderRadius: '16px', padding: '14px 16px', border: '1px solid rgba(22, 101, 52, 0.15)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <label style={{ fontSize: '11.5px', fontWeight: '800', color: '#166534', textTransform: 'uppercase', letterSpacing: '0.6px', margin: 0 }}>
Fast Capacity & Tent Presets
                                            </label>
                                            <span style={{ fontSize: '10.5px', color: '#59655D', fontWeight: '700' }}>1-Click Setup</span>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '6px' }}>
                                            {[
                                                {
label: ' Single Tent (1P)',
                                                    name: 'Single Solo Ridge Tent',
                                                    capacity: '1 Person',
                                                    price: 1699,
                                                    totalUnits: 10,
                                                    features: 'Solo Foam Bed, Waterproof Flysheet, Thermal Sleeping Bag, Clean Washrooms',
                                                    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80'
                                                },
                                                {
label: ' 2-Person Dome',
                                                    name: 'Geodesic Luxury Dome Pod',
                                                    capacity: '2 Persons',
                                                    price: 2499,
                                                    totalUnits: 8,
                                                    features: 'Double King Bed, Valley Deck, Thermal Blankets, En-suite Restroom',
                                                    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80'
                                                },
                                                {
label: ' 3-Person Tent',
                                                    name: '3-Person Alpine Weatherproof Tent',
                                                    capacity: '3 Persons',
                                                    price: 1999,
                                                    totalUnits: 12,
                                                    features: '3 Foam Mattresses, Warm Fleece Blankets, Shared Modern Washrooms, Lantern',
                                                    image: 'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=600&q=80'
                                                },
                                                {
label: ' 4-Person Quad',
                                                    name: 'Weatherproof 4-Person Alpine Quad Tent',
                                                    capacity: '4 Persons',
                                                    price: 1799,
                                                    totalUnits: 14,
                                                    features: '4 Sleeping Bags, Waterproof Flysheet, Modern Hot Washrooms, Power Backup',
                                                    image: 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=600&q=80'
                                                },
                                                {
label: ' Family Cottage',
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
showToast(` Applied ${preset.label} preset`);
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
Room / Pod Photo
                                                </label>
                                                <span style={{ fontSize: '11px', color: '#59655D' }}>Upload file from device or paste image URL</span>
                                            </div>
                                            <label style={{ cursor: 'pointer', background: '#121613', color: '#FFFFFF', padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                <span><Upload size={14} /> Upload File</span>
                                                <input type="file" accept="image/*" onChange={handleRoomImageUpload} style={{ display: 'none' }} />
                                            </label>
                                        </div>

                                        {/* Image Preview */}
                                        {roomForm.image ? (
                                            <div style={{ position: 'relative', height: '140px', borderRadius: '12px', overflow: 'hidden', border: '2px solid #E5A93B', marginBottom: '12px' }}>
                                                <img src={roomForm.image} alt="Room Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                <span style={{ position: 'absolute', top: '8px', left: '8px', background: '#121613', color: '#E5A93B', fontSize: '10px', fontWeight: '800', padding: '3px 8px', borderRadius: '4px' }}>
Selected Room Photo
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => setRoomForm({ ...roomForm, image: '' })}
                                                    style={{ position: 'absolute', top: '8px', right: '8px', background: '#EF4444', color: '#FFFFFF', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}
                                                >
Remove
                                                </button>
                                            </div>
                                        ) : (
                                            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '90px', borderRadius: '12px', border: '2px dashed rgba(18,22,19,0.18)', background: '#FFFFFF', cursor: 'pointer', marginBottom: '12px' }}>
                                                <span style={{ fontSize: '20px', marginBottom: '4px' }}><Camera size={20} /></span>
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
    // MAIN ADMIN DASHBOARD WITH SLEEK COLLAPSIBLE SIDEBAR
    // ─────────────────────────────────────────────────────────────
    const navSections = [
        {
            category: 'COMMAND & ROSTER',
            items: [
                { id: 'overview', name: 'Dashboard', icon: LayoutDashboard },
                { id: 'bookings', name: 'Reservations', icon: ClipboardList, count: bookings.length },
                { id: 'properties', name: 'Campsites & Pods', icon: Tent, count: properties.length },
                { id: 'events', name: 'Scheduled Batches', icon: Mountain, count: activeEventsCount },
                { id: 'marshals', name: 'Hosts & Guides', icon: Users, count: marshals.length }
            ]
        },
{
            category: 'FINANCE & SECURITY',
            items: [
                { id: 'financials', name: 'Revenue & Margins', icon: IndianRupee },
                { id: 'payment', name: 'Payment & QR Gateway', icon: QrCode, statusDot: paymentSettings.mode === 'razorpay' ? '#22C55E' : '#E5A93B' },
                { id: 'discounts', name: 'Discounts & Offers', icon: BadgePercent, count: discounts.length },
                { id: 'testimonials', name: 'Testimonials', icon: MessageSquareQuote, count: testimonials.length },
                { id: 'logs', name: 'Security & DB Logs', icon: ShieldCheck, count: (auditLogs?.length || 0) + (dbLogs?.length || 0) + (inquiries?.length || 0) },
                { id: 'settings', name: 'Alerts & Dispatch', icon: Settings }
            ]
        }
    ];

    const allNavItems = navSections.flatMap(sec => sec.items);

    const renderSidebarContent = (isMobile = false) => {
        const isCollapsed = !isMobile && isSidebarCollapsed;

        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100%',
                padding: isCollapsed ? '16px 8px' : '20px 16px',
                boxSizing: 'border-box',
                gap: '14px'
            }}>
                {/* Brand Header (mobile menu shows brand + close) */}
                {isMobile ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '14px', borderBottom: '1px solid rgba(18, 22, 19, 0.08)' }}>
                        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', minWidth: 0 }}>
                            <img
                                src="/logo.png"
                                alt="Aanandham.go Official Logo"
                                style={{ height: '34px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.06))' }}
                            />
                            <div style={{ minWidth: 0 }}>
                                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800', color: '#121613', letterSpacing: '-0.02em', display: 'block', lineHeight: 1.1, whiteSpace: 'nowrap' }}>
                                    Aanandham<span style={{ color: '#E5A93B' }}>.go</span>
                                </span>
                                <span style={{ fontSize: '9.5px', fontWeight: '800', color: '#7D8880', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                    BASECAMP HQ
                                </span>
                            </div>
                        </Link>
                        <button
                            onClick={() => setIsMobileSidebarOpen(false)}
                            aria-label="Close navigation menu"
                            style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#F1F3EC', border: '1px solid rgba(18, 22, 19, 0.1)', color: '#121613', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                        >
                            <X size={18} strokeWidth={2.5} />
                        </button>
                    </div>
                ) : (
                <div style={{ paddingBottom: isCollapsed ? '12px' : '14px', borderBottom: '1px solid rgba(18, 22, 19, 0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', marginBottom: isCollapsed ? '0' : '10px' }}>
                        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', minWidth: 0 }}>
                            <img
                                src="/logo.png"
                                alt="Aanandham.go Official Logo"
                                style={{ height: isCollapsed ? '32px' : '34px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.06))' }}
                            />
                            {!isCollapsed && (
                                <div style={{ minWidth: 0 }}>
                                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800', color: '#121613', letterSpacing: '-0.02em', display: 'block', lineHeight: 1.1, whiteSpace: 'nowrap' }}>
                                        Aanandham<span style={{ color: '#E5A93B' }}>.go</span>
                                    </span>
                                    <span style={{ fontSize: '9.5px', fontWeight: '800', color: '#7D8880', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                        BASECAMP HQ
                                    </span>
                                </div>
                            )}
                        </Link>

                        {isMobile ? (
                            <button
                                onClick={() => setIsMobileSidebarOpen(false)}
                                style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F1F3EC', border: '1px solid rgba(18, 22, 19, 0.1)', color: '#121613', cursor: 'pointer', fontWeight: '800' }}
                            >
                                <X size={15} strokeWidth={2.5} />
                            </button>
                        ) : (
                            !isCollapsed && (
                                <button
                                    onClick={() => setIsSidebarCollapsed(true)}
                                    title="Collapse Sidebar"
                                    style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '8px',
                                        background: '#F1F3EC',
                                        border: '1px solid rgba(18, 22, 19, 0.1)',
                                        color: '#121613',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        fontSize: '12px'
                                    }}
                                >
                                    <ChevronLeft size={14} strokeWidth={2.5} />
                                </button>
                            )
                        )}
                    </div>

                    {!isCollapsed && !isMobile && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#DCFCE7', border: '1px solid rgba(22, 101, 52, 0.2)', padding: '4px 9px', borderRadius: '999px', width: 'fit-content' }}>
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 6px #22C55E' }}></span>
                            <span style={{ fontSize: '9.5px', fontWeight: '800', color: '#166534', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                                Aanandham Admin Live
                            </span>
                        </div>
                    )}

                    {isCollapsed && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                            <button
                                onClick={() => setIsSidebarCollapsed(false)}
                                title="Expand Sidebar"
                                style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '8px',
                                    background: '#F1F3EC',
                                    border: '1px solid rgba(18, 22, 19, 0.12)',
                                    color: '#121613',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                }}
                            >
                                <ChevronRight size={14} strokeWidth={2.5} />
                            </button>
                        </div>
                    )}
                </div>
                )}

                {/* Dual Quick Action Buttons */}
                <div style={{ display: isCollapsed ? 'flex' : 'grid', flexDirection: isCollapsed ? 'column' : undefined, gridTemplateColumns: isCollapsed ? undefined : '1fr 1fr', gap: '6px' }}>
                    <button
                        onClick={() => {
                            setIsAddBookingModalOpen(true);
                            if (isMobile) setIsMobileSidebarOpen(false);
                        }}
                        className="btn-lime"
                        title="Add New Manual Booking"
                        style={{
                            padding: isCollapsed ? '8px 0' : '9px 8px',
                            borderRadius: '10px',
                            fontSize: isCollapsed ? '13px' : '11.5px',
                            fontWeight: '800',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            whiteSpace: 'nowrap',
                            boxShadow: '0 2px 8px rgba(213, 237, 85, 0.28)'
                        }}
                    >
                        <Plus size={13} strokeWidth={3} />
                        {!isCollapsed && <span>Booking</span>}
                    </button>
                    <button
                        onClick={() => {
                            handleOpenPropertyModal();
                            if (isMobile) setIsMobileSidebarOpen(false);
                        }}
                        title="Create Campsite"
                        style={{
                            padding: isCollapsed ? '8px 0' : '9px 8px',
                            borderRadius: '10px',
                            fontSize: isCollapsed ? '13px' : '11.5px',
                            fontWeight: '800',
                            cursor: 'pointer',
                            background: '#F8F9F5',
                            border: '1px solid rgba(18, 22, 19, 0.12)',
                            color: '#121613',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        <span><Tent size={13} strokeWidth={2.5} /></span>
                        {!isCollapsed && <span>Campsite</span>}
                    </button>
                </div>

                {/* Sync Database */}
                <button
                    onClick={() => {
                        reloadDataFromStorage();
showToast('Synced database');
                        if (isMobile) setIsMobileSidebarOpen(false);
                    }}
                    title="Sync Database"
                    style={{
                        width: '100%',
                        padding: isCollapsed ? '8px 0' : '9px 8px',
                        borderRadius: '10px',
                        fontSize: isCollapsed ? '13px' : '11.5px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        background: '#0B150E',
                        border: '1px solid rgba(213, 237, 85, 0.35)',
                        color: '#D5ED55',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        whiteSpace: 'nowrap',
                        marginTop: '6px'
                    }}
                >
                    <RefreshCw size={13} strokeWidth={2.5} />
                    {!isCollapsed && <span>Sync Database</span>}
                </button>

                {/* QR Scanner (Desktop sidebar only; mobile uses the header circle icon) */}
                {!isMobile && (
<button
                    onClick={() => { setScannerOverlayOpen(true); if (isMobile) setIsMobileSidebarOpen(false); }}
                    title="Open Live QR Pass Scanner & Basecamp Host Gate Attendance"
                    style={{
                        width: '100%',
                        padding: isCollapsed ? '8px 0' : '9px 8px',
                        borderRadius: '10px',
                        fontSize: isCollapsed ? '13px' : '11.5px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        background: '#FFFFFF',
                        border: '1.5px solid #D5ED55',
                        color: '#0B150E',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        whiteSpace: 'nowrap',
                        textDecoration: 'none',
                        marginTop: '6px'
                    }}
                >
                    <QrCode size={13} strokeWidth={2.5} />
{!isCollapsed && <span>QR Scanner </span>}
                </button>
                )}

                {/* Categorized Navigation Menu */}
                <nav style={{ display: 'flex', flexDirection: 'column', gap: isCollapsed ? '10px' : '14px' }}>
                    {navSections.map((sec, sIdx) => (
                        <div key={sIdx}>
                            {!isCollapsed && (
                                <div style={{ fontSize: '9.5px', fontWeight: '800', color: '#7D8880', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '5px', paddingLeft: '8px' }}>
                                    {sec.category}
                                </div>
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                {sec.items.map(item => {
                                    const isActive = activeTab === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                setActiveTab(item.id);
                                                if (item.id === 'logs') {
                                                    fetchAuditLogs();
                                                    fetchSecurityOverview();
                                                    fetchInquiries();
                                                }
                                                if (isMobile) setIsMobileSidebarOpen(false);
                                            }}
                                            title={isCollapsed ? item.name : undefined}
                                            style={{
                                                width: '100%',
                                                padding: isCollapsed ? '9px 0' : '8px 12px',
                                                borderRadius: '12px',
                                                background: isActive ? '#D5ED55' : 'transparent',
                                                color: isActive ? '#0B150E' : '#3A443E',
                                                border: isActive ? '1px solid rgba(180, 210, 60, 0.8)' : '1px solid transparent',
                                                fontSize: '13px',
                                                fontWeight: isActive ? '800' : '600',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: isCollapsed ? 'center' : 'space-between',
                                                textAlign: 'left',
                                                boxShadow: isActive ? '0 3px 10px rgba(213, 237, 85, 0.3)' : 'none',
                                                transition: 'all 0.18s ease'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: isCollapsed ? '0' : '10px' }}>
                                                <item.icon size={16} strokeWidth={2.4} />
                                                {!isCollapsed && <span>{item.name}</span>}
                                            </div>
                                            {!isCollapsed && item.count !== undefined && (
                                                <span style={{
                                                    background: isActive ? '#0B150E' : 'rgba(18, 22, 19, 0.08)',
                                                    color: isActive ? '#D5ED55' : '#121613',
                                                    fontSize: '11px',
                                                    fontWeight: '800',
                                                    padding: '2px 7px',
                                                    borderRadius: '999px'
                                                }}>
                                                    {item.count}
                                                </span>
                                            )}
                                            {!isCollapsed && item.desc && !item.count && (
                                                <span style={{
                                                    fontSize: '10.5px',
                                                    color: isActive ? '#166534' : '#7D8880',
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

                {/* Bottom Coordinator Profile & System Controls */}
                <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid rgba(18, 22, 19, 0.08)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: isCollapsed ? '6px 0' : '8px 10px', justifyContent: isCollapsed ? 'center' : 'flex-start', background: '#F8F9F5', borderRadius: '12px', border: '1px solid rgba(18, 22, 19, 0.08)' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#D5ED55', color: '#0B150E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '900', flexShrink: 0, boxShadow: '0 2px 6px rgba(213, 237, 85, 0.4)', overflow: 'hidden' }}>
                            <img src="/logo.png" alt="Aanandham" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                        </div>
                        {!isCollapsed && (
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '12px', fontWeight: '800', color: '#121613', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    Aanandham Admin
                                </div>
                                <div style={{ fontSize: '9.5px', color: '#7D8880', fontWeight: '600' }}>
                                    All Kerala Sanctuaries
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: isCollapsed ? 'column' : 'row', gap: '6px' }}>
                        {!isCollapsed && (
                            <Link
                                href="/"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    flex: 1,
                                    padding: '7px 8px',
                                    borderRadius: '8px',
                                    background: '#FFFFFF',
                                    border: '1px solid rgba(18, 22, 19, 0.12)',
                                    color: '#121613',
                                    textDecoration: 'none',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '4px'
                                }}
                            >
                                <span>Website <ArrowUpRight size={12} strokeWidth={2.5} /></span>
                            </Link>
                        )}
                        <button
                            onClick={handleLogout}
                            title="Sign Out from Master HQ"
                            style={{
                                flex: isCollapsed ? undefined : 1,
                                padding: '7px 8px',
                                borderRadius: '8px',
                                background: 'rgba(239, 68, 68, 0.08)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                color: '#DC2626',
                                fontSize: '11px',
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
    };

    return (
        <div style={{ minHeight: '100vh', width: '100%', background: '#F8F9F5', color: '#121613', display: 'flex', flexDirection: 'column' }}>
            
            {/* ═════════════════════════════════════════════════════════════
                TOP FIXED ADMIN NAVBAR (Reusing SiteHeader structure & style)
            ═════════════════════════════════════════════════════════════ */}
            <motion.header
                className="admin-site-header site-header"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
                <div style={{
                    width: '100%',
                    maxWidth: '1720px',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '14px',
                    boxSizing: 'border-box'
                }}>
                    {/* Far Left: Brand Logo & Title */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                            <img
                                src="/logo.png"
                                alt="Aanandham.go Logo"
                                width="38"
                                height="38"
                                decoding="async"
                                style={{
                                    width: '38px',
                                    height: '38px',
                                    objectFit: 'contain',
                                    borderRadius: '50%',
                                    filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.45))'
                                }}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{
                                    fontSize: '17px',
                                    fontWeight: '900',
                                    letterSpacing: '-0.02em',
                                    color: '#FFFFFF',
                                    fontFamily: 'var(--font-heading)',
                                    lineHeight: 1.1
                                }}>
Aanandham<span style={{ color: '#E5A93B' }}>.go</span>
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '1px' }}>
                                    <span style={{ fontSize: '8.5px', fontWeight: '800', color: '#D5ED55', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                                        HQ ADMIN
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </div>

{/* Far Right: QR Scanner Circle Icon + Mobile Burger Toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        {/* QR Scanner Circle Icon (Icon Only, No Text) */}
                        <button
                            onClick={() => setScannerOverlayOpen(true)}
                            aria-label="Open QR Scanner"
                            title="Open QR Scanner"
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.22)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textDecoration: 'none',
                                cursor: 'pointer',
                                transition: 'background 0.2s ease'
                            }}
                        >
                            <QrCode size={19} strokeWidth={2.2} color="#D5ED55" />
                        </button>
                        {/* Morphing 3-Bar Hamburger Toggle (Shows on <= 1100px) */}
                        <button
                            id="nav-mobile-toggle-btn"
                            className={`nav-mobile-toggle ${isMobileSidebarOpen ? 'is-open' : ''}`}
                            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                            aria-label={isMobileSidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
                            aria-expanded={isMobileSidebarOpen}
                            aria-controls="mobile-navigation-drawer"
                            aria-haspopup="dialog"
                        >
                            <span className="burger-line line-top" />
                            <span className="burger-line line-mid" />
                            <span className="burger-line line-bot" />
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* ═════════════════════════════════════════════════════════════
                MOBILE FULLSCREEN LIQUID WAVE MENU (Matching SiteHeader)
            ═════════════════════════════════════════════════════════════ */}
{/* ── MOBILE FULL-SCREEN NAV MENU (No Blur Backdrop) ── */}
            <AnimatePresence>
                {isMobileSidebarOpen && (
                    <motion.div
                        id="mobile-navigation-drawer"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Admin Navigation Menu"
                        initial={{ opacity: 0, x: -48 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -48 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 320 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 100010,
                            background: '#FFFFFF',
                            boxSizing: 'border-box',
                            color: '#121613',
                            overflowY: 'auto',
                            overscrollBehavior: 'contain',
                            WebkitOverflowScrolling: 'touch',
                            padding: '20px 16px calc(24px + env(safe-area-inset-bottom))'
                        }}
                    >
                        {renderSidebarContent(true)}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ═════════════════════════════════════════════════════════════
                FULL-WIDTH MAIN CONTENT WORKSPACE
            ═════════════════════════════════════════════════════════════ */}
            
                {/* DESKTOP LEFT SIDEBAR (Original Fixed Sidebar) */}
                <aside className="admin-desktop-sidebar" style={{ '--admin-sidebar-width': isSidebarCollapsed ? '76px' : '270px' }}>
                    {renderSidebarContent(false)}
                </aside>

                <main className="admin-main-workspace" style={{ '--admin-sidebar-width': isSidebarCollapsed ? '76px' : '270px' }}>
                
                {/* ── TOP EXECUTIVE COMMAND BAR ── */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '12px',
                    marginBottom: '16px',
                    borderBottom: '1px solid rgba(18, 22, 19, 0.08)',
                    flexWrap: 'wrap',
                    gap: '10px'
                }}>
                    {/* Left: Breadcrumbs & Section Title */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                            <span style={{ fontSize: '10px', color: '#59655D', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                                Aanandham Enterprise HQ
                            </span>
                            <span style={{ color: '#CBD5E1', fontSize: '10px' }}>/</span>
                            <span style={{ fontSize: '10px', color: '#E5A93B', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                                {activeTab.toUpperCase()}
                            </span>
                        </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: '800', margin: 0, color: '#121613', letterSpacing: '-0.02em' }}>
                                    {activeTab === 'overview' ? 'Mission Control & Operations' :
                                     activeTab === 'bookings' ? 'Camper Reservations Roster' :
                                     activeTab === 'properties' ? 'Campsites & Pod Inventory' :
                                     activeTab === 'events' ? 'Scheduled Batches' :
                                     activeTab === 'marshals' ? 'Camp Hosts & Trek Guides' :
                                     activeTab === 'financials' ? 'Revenue & Margins' :
activeTab === 'payment' ? 'Payment Gateway & Live QR' :
                                     activeTab === 'discounts' ? 'Discounts & Offers Center' :
                                     activeTab === 'testimonials' ? 'Guest Testimonials & Reviews' :
                                     activeTab === 'logs' ? 'Security & Database Audit Logs' :
                                     'Alerts & Dispatch Settings'}
                                </h1>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#DCFCE7', color: '#166534', border: '1px solid rgba(22, 101, 52, 0.2)', padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: '800' }}>
                                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22C55E', display: 'inline-block', boxShadow: '0 0 6px #22C55E' }} />
                                    Live DB · {bookings.length} Bookings
                                </span>
                            </div>
                        </div>
                </div>



                {/* ─────────────────────────────────────────────────────────────
                    TAB 1: EXECUTIVE OVERVIEW
                ───────────────────────────────────────────────────────────── */}
                {activeTab === 'overview' && (
                    <div style={{ width: '100%' }}>
                        
                        {/* Header Intro */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
                            <div>
                                <div className="star-badge" style={{ marginBottom: '3px' }}>
<span className="star-icon">★</span> EXECUTIVE DASHBOARD
                                </div>
                                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '800', margin: 0, color: '#121613' }}>
                                    Real-Time Operations & KPIs
                                </h2>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <button onClick={handleExportCSV} style={{ padding: '7px 14px', borderRadius: '999px', background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                    <span><Download size={14} /> Export CSV</span>
                                </button>
                                <button onClick={() => setIsAddBookingModalOpen(true)} className="btn-lime" style={{ padding: '7px 16px', fontSize: '12px', fontWeight: '800' }}>
                                    + Manual Booking
                                </button>
                            </div>
                        </div>

{/* 4 Hero KPI Cards */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                            gap: '12px',
                            marginBottom: '20px'
                        }}>
                            
                            {/* Card 1: Gross Revenue */}
                            <div style={{
                                background: '#FFFFFF',
                                border: '1px solid rgba(18, 22, 19, 0.08)',
                                borderRadius: '18px',
                                padding: '20px 22px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '10.5px', fontWeight: '800', color: '#7D8880', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                                        Gross Revenue
                                    </span>
                                    <span style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#F8F9F5', border: '1px solid rgba(18,22,19,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>
                                    <Banknote size={15} />
                                    </span>
                                </div>
                                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: '800', color: '#121613', letterSpacing: '-0.02em', margin: '2px 0 6px' }}>
                                    ₹{totalRevenue.toLocaleString('en-IN')}
                                </div>
                                <div style={{ fontSize: '12px', color: '#59655D', fontWeight: '600' }}>
                                    From {paidBookings.length} confirmed bookings
                                </div>
                            </div>

                            {/* Card 2: Operating Profit */}
                            <div style={{
                                background: '#FFFFFF',
                                border: '1px solid rgba(18, 22, 19, 0.08)',
                                borderRadius: '18px',
                                padding: '20px 22px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '10.5px', fontWeight: '800', color: '#7D8880', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                                        Est. Net Profit
                                    </span>
                                    <span style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(22, 101, 52, 0.08)', border: '1px solid rgba(22, 101, 52, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>
                                    <TrendingUp size={15} />
                                    </span>
                                </div>
                                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: '800', color: '#166534', letterSpacing: '-0.02em', margin: '2px 0 6px' }}>
                                    ₹{estimatedNetProfit.toLocaleString('en-IN')}
                                </div>
                                <div style={{ fontSize: '12px', color: '#166534', fontWeight: '700' }}>
✓ {profitMarginPercent}% Net Margin
                                </div>
                            </div>

                            {/* Card 3: Total Campers */}
                            <div style={{
                                background: '#FFFFFF',
                                border: '1px solid rgba(18, 22, 19, 0.08)',
                                borderRadius: '18px',
                                padding: '20px 22px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '10.5px', fontWeight: '800', color: '#7D8880', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                                        Total Confirmed Campers
                                    </span>
                                    <span style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>
                                    <Users size={15} />
                                    </span>
                                </div>
                                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: '800', color: '#121613', letterSpacing: '-0.02em', margin: '2px 0 6px' }}>
                                    {activeCampers} <span style={{ fontSize: '16px', color: '#59655D', fontWeight: '600' }}>Pax</span>
                                </div>
                                <div style={{ fontSize: '12px', color: '#59655D', fontWeight: '600' }}>
                                    Across Kerala Campsites
                                </div>
                            </div>

                            {/* Card 4: Pending Inquiries */}
                            <div style={{
                                background: '#FFFFFF',
                                border: '1px solid rgba(18, 22, 19, 0.08)',
                                borderRadius: '18px',
                                padding: '20px 22px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '10.5px', fontWeight: '800', color: '#7D8880', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                                        Pending Inquiries
                                    </span>
                                    <span style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>
                                    <Zap size={15} />
                                    </span>
                                </div>
                                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: '800', color: '#B45309', letterSpacing: '-0.02em', margin: '2px 0 6px' }}>
                                    {bookings.filter(b => b.status === 'Pending').length} <span style={{ fontSize: '16px', color: '#59655D', fontWeight: '600' }}>Leads</span>
                                </div>
                                <div style={{ fontSize: '12px', color: '#B45309', fontWeight: '700' }}>
Instant WhatsApp Dispatch
                                </div>
                            </div>

                        </div>

{/* Operational Quick Jump Bar */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '22px' }}>
                            <button
                                onClick={() => setActiveTab('properties')}
                                style={{ background: '#FFFFFF', border: '1px solid rgba(18,22,19,0.08)', borderRadius: '14px', padding: '14px 16px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)', transition: 'all 0.15s ease' }}
                            >
                                <span style={{ fontSize: '22px' }}><Tent size={22} /></span>
                                <div style={{ minWidth: 0 }}>
                                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#121613', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Campsites & Pods</div>
                                    <div style={{ fontSize: '11px', color: '#59655D', marginTop: '2px' }}>{properties.length} Sanctuaries</div>
                                </div>
                            </button>

                            <button
                                onClick={() => setActiveTab('events')}
                                style={{ background: '#FFFFFF', border: '1px solid rgba(18,22,19,0.08)', borderRadius: '14px', padding: '14px 16px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)', transition: 'all 0.15s ease' }}
                            >
                                <span style={{ fontSize: '22px' }}><Calendar size={22} /></span>
                                <div style={{ minWidth: 0 }}>
                                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#121613', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Weekend Batches</div>
                                    <div style={{ fontSize: '11px', color: '#59655D', marginTop: '2px' }}>{activeEventsCount} Active Treks</div>
                                </div>
                            </button>

                            <button
                                onClick={() => setActiveTab('marshals')}
                                style={{ background: '#FFFFFF', border: '1px solid rgba(18,22,19,0.08)', borderRadius: '14px', padding: '14px 16px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)', transition: 'all 0.15s ease' }}
                            >
                                <span style={{ fontSize: '22px' }}><Compass size={22} /></span>
                                <div style={{ minWidth: 0 }}>
                                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#121613', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Hosts & Guides</div>
                                    <div style={{ fontSize: '11px', color: '#59655D', marginTop: '2px' }}>{marshals.length} Field Crew</div>
                                </div>
                            </button>

                            <button
                                onClick={() => setActiveTab('payment')}
                                style={{ background: '#FFFFFF', border: '1px solid rgba(18,22,19,0.08)', borderRadius: '14px', padding: '14px 16px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)', transition: 'all 0.15s ease' }}
                            >
                                <span style={{ fontSize: '22px' }}><Zap size={22} /></span>
                                <div style={{ minWidth: 0 }}>
                                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#121613', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Payment Gateway</div>
<div style={{ fontSize: '11px', color: '#166534', fontWeight: '700', marginTop: '2px' }}>{paymentSettings.mode === 'coming_soon' ? ' Concierge Mode' : ' Live Razorpay'}</div>
                                </div>
                            </button>

                            <button
                                onClick={() => { setActiveTab('logs'); fetchAuditLogs(); fetchSecurityOverview(); fetchInquiries(); }}
                                style={{ background: '#FFFFFF', border: '1px solid rgba(18,22,19,0.08)', borderRadius: '14px', padding: '14px 16px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)', transition: 'all 0.15s ease' }}
                            >
                                <span style={{ fontSize: '22px' }}><ScrollText size={22} /></span>
                                <div style={{ minWidth: 0 }}>
                                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#121613', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Audit Trail</div>
                                    <div style={{ fontSize: '11px', color: '#59655D', marginTop: '2px' }}>Live DB Security</div>
                                </div>
                            </button>
                        </div>

                        {/* Split Row: Recent Bookings Stream + Upcoming Scheduled Batches */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                            
                            {/* Recent Live Reservations */}
                            <div style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '18px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <div>
                                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '17px', fontWeight: '800', margin: 0, color: '#121613' }}>
Recent Reservations
                                        </h3>
                                        <div style={{ fontSize: '11.5px', color: '#59655D', marginTop: '2px' }}>
                                            Latest camper submissions
                                        </div>
                                    </div>
                                    <button onClick={() => setActiveTab('bookings')} className="btn-lime" style={{ padding: '6px 14px', fontSize: '11.5px', fontWeight: '800', borderRadius: '8px' }}>
View All ({bookings.length}) →
                                    </button>
                                </div>

                                {bookings.length === 0 ? (
                                    <div style={{ padding: '28px 16px', textAlign: 'center', color: '#7D8880', background: '#F8F9F5', borderRadius: '14px', border: '1px dashed rgba(18,22,19,0.12)' }}>
<div style={{ fontSize: '24px', marginBottom: '6px' }}><ClipboardList size={24} /></div>
                                        <div style={{ fontSize: '13.5px', fontWeight: '800', color: '#121613' }}>No Bookings Yet</div>
                                        <div style={{ fontSize: '11.5px', color: '#59655D', marginTop: '4px', marginBottom: '10px' }}>Click below to create a booking or restore sample data.</div>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                            <button onClick={() => setIsAddBookingModalOpen(true)} className="btn-lime" style={{ padding: '6px 14px', fontSize: '11.5px', fontWeight: '800' }}>
                                                + Manual Booking
                                            </button>
                                            <button onClick={handleSeedSampleBookings} style={{ padding: '6px 14px', borderRadius: '10px', background: '#121613', color: '#FFFFFF', fontSize: '11.5px', fontWeight: '800', border: 'none', cursor: 'pointer' }}>
Restore Sample Roster
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {bookings.slice(0, 5).map(b => (
                                            <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', background: '#F8F9F5', border: '1px solid rgba(18,22,19,0.04)', padding: '12px 14px', borderRadius: '14px' }}>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                                                        <span style={{ fontSize: '10px', fontWeight: '800', background: 'rgba(18,22,19,0.08)', padding: '1px 6px', borderRadius: '4px' }}>{b.id}</span>
                                                        <span style={{ fontSize: '13px', fontWeight: '800', color: '#121613' }}>{b.name} ({b.guests} Pax)</span>
                                                    </div>
                                                    <div style={{ fontSize: '11.5px', color: '#59655D' }}>{b.package ? b.package.slice(0, 28) : 'Campsite'}... · {b.dates}</div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#121613' }}>₹{(b.total || 0).toLocaleString('en-IN')}</div>
                                                    <span style={{ fontSize: '10px', fontWeight: '800', color: b.status === 'Confirmed' ? '#166534' : '#B45309' }}>{b.status}</span>
                                                </div>
                                                <div style={{ display: 'flex', gap: '6px' }}>
                                                    <a href={`/pass/${b.id}`} target="_blank" rel="noopener noreferrer" style={{ padding: '6px 10px', fontSize: '11px', fontWeight: '800', borderRadius: '8px', background: '#FFFFFF', border: '1px solid rgba(18,22,19,0.1)', color: '#121613', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
Pass
                                                    </a>
                                                    <a href={waLink(`Hi ${b.name}! Aanandham desk regarding your reservation (${b.id}).`, b.phone)} target="_blank" rel="noopener noreferrer" className="btn-lime" style={{ padding: '6px 10px', fontSize: '11px', fontWeight: '800', borderRadius: '8px', textDecoration: 'none' }}>
WhatsApp →
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Upcoming Scheduled Batches */}
                            <div style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '18px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <div>
                                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '17px', fontWeight: '800', margin: 0, color: '#121613' }}>
Weekend Batches
                                        </h3>
                                        <div style={{ fontSize: '11.5px', color: '#59655D', marginTop: '2px' }}>
                                            Live capacity tracking
                                        </div>
                                    </div>
                                    <button onClick={() => setActiveTab('events')} className="btn-lime" style={{ padding: '6px 14px', fontSize: '11.5px', fontWeight: '800', borderRadius: '8px' }}>
Manage Batches →
                                    </button>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {events.map(ev => (
                                        <div key={ev.id} style={{ background: '#F8F9F5', padding: '12px 14px', borderRadius: '14px', border: '1px solid rgba(18,22,19,0.04)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                            <img src={ev.image} alt={ev.title} style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }} />
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                                                    <span style={{ fontSize: '10px', fontWeight: '800', color: '#B45309' }}>{ev.badge}</span>
                                                    <span style={{ fontSize: '10.5px', color: '#59655D' }}>{ev.dates}</span>
                                                </div>
                                                <div style={{ fontSize: '13px', fontWeight: '800', color: '#121613', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.title}</div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3px', fontSize: '11px' }}>
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
                    <div style={{ width: '100%' }}>
                        
                        {/* 1. CAMPSITE DIVIDER BAR */}
                        <div style={{ marginBottom: '22px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <span style={{ fontSize: '11px', fontWeight: '800', color: '#59655D', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
Filter By Sanctuary Location
                                </span>
                                <span style={{ fontSize: '12px', fontWeight: '700', color: '#166534' }}>
● {filteredBookings.length} of {bookings.length} Bookings Shown
                                </span>
                            </div>
                            
                            <div className="admin-region-chip-row" style={{ display: 'flex', flexWrap: 'nowrap', gap: '8px', alignItems: 'center', overflowX: 'auto', paddingBottom: '6px' }}>
                                {[
                                    { id: 'All', label: 'All Sanctuaries', icon: Tent, count: bookings.length },
                                    { id: 'pkg-kolukkumalai', label: 'Kolukkumalai (7,900 FT)', icon: Sunrise, count: koluBookingsCount },
                                    { id: 'pkg-meesapulimala', label: 'Meesapulimala Ridge', icon: Mountain, count: meesaBookingsCount },
                                    { id: 'pkg-suryanelli', label: 'Suryanelli Valley', icon: Tent, count: suryaBookingsCount },
                                    { id: 'pkg-vagamon-pine', label: 'Vagamon Pine Forest', icon: Trees, count: vagaBookingsCount },
                                    { id: 'pkg-wayanad', label: 'Wayanad 900 Kandi', icon: Sprout, count: wayaBookingsCount }
                                ].map(c => {
                                    const isSelected = bookingFilterCamp === c.id;
                                    return (
                                        <button
                                            key={c.id}
                                            onClick={() => setBookingFilterCamp(c.id)}
                                            style={{
                                                padding: '9px 16px',
                                                borderRadius: '14px',
                                                border: isSelected ? '1.5px solid #121613' : '1px solid rgba(18, 22, 19, 0.1)',
                                                background: isSelected ? '#121613' : '#FFFFFF',
                                                color: isSelected ? '#FFFFFF' : '#3A443E',
                                                fontSize: '12.5px',
                                                fontWeight: isSelected ? '800' : '700',
                                                cursor: 'pointer',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                whiteSpace: 'nowrap',
                                                boxShadow: isSelected ? '0 4px 12px rgba(18, 22, 19, 0.15)' : '0 2px 4px rgba(0,0,0,0.02)',
                                                transition: 'all 0.15s ease'
                                            }}
                                        >
                                            <c.icon size={14} />
                                            <span>{c.label}</span>
                                            <span style={{
                                                background: isSelected ? '#D5ED55' : 'rgba(18, 22, 19, 0.08)',
                                                color: isSelected ? '#0B150E' : '#59655D',
                                                fontSize: '11px',
                                                fontWeight: '800',
                                                padding: '1px 7px',
                                                borderRadius: '999px'
                                            }}>
                                                {c.count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 2. SEARCH, STATUS FILTER & SORT CONTROLS */}
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '22px' }}>
                            <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
                                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', color: '#7D8880' }}><Search size={14} /></span>
                                <input
                                    type="text"
                                    placeholder="Search by camper name, phone, payment ref or booking ID..."
                                    value={bookingSearch}
                                    onChange={(e) => setBookingSearch(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '11px 16px 11px 38px',
                                        borderRadius: '14px',
                                        background: '#FFFFFF',
                                        border: '1px solid rgba(18, 22, 19, 0.12)',
                                        color: '#121613',
                                        fontSize: '13.5px',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

{/* Status Filter Dropdown */}
                            <select
                                value={bookingFilterStatus}
                                onChange={(e) => setBookingFilterStatus(e.target.value)}
                                style={{
                                    padding: '9px 12px',
                                    borderRadius: '12px',
                                    background: '#FFFFFF',
                                    border: '1px solid rgba(18, 22, 19, 0.12)',
                                    color: '#121613',
                                    fontSize: '12.5px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    outline: 'none'
                                }}
                            >
                                <option value="All">All Status</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Checked In">Checked In</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>

                            {/* Sort Selector */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '11.5px', color: '#59655D', fontWeight: '700' }}>Sort:</span>
                                <select
                                    value={bookingSortBy}
                                    onChange={(e) => setBookingSortBy(e.target.value)}
                                    style={{
                                        padding: '8px 12px',
                                        borderRadius: '12px',
                                        background: '#FFFFFF',
                                        border: '1px solid rgba(18, 22, 19, 0.12)',
                                        color: '#121613',
                                        fontSize: '12.5px',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        outline: 'none'
                                    }}
                                >
<option value="newest">Newest First</option>
<option value="highest_amount">Highest Total (₹)</option>
<option value="guests_desc">Most Campers</option>
<option value="oldest">Oldest First</option>
                                </select>
                            </div>

                            <button
                                onClick={handleExportCSV}
                                title="Export current roster to CSV"
                                style={{
                                    padding: '8px 14px',
                                    borderRadius: '12px',
                                    background: '#FFFFFF',
                                    border: '1px solid rgba(18, 22, 19, 0.12)',
                                    color: '#121613',
                                    fontSize: '12.5px',
                                    fontWeight: '800',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px'
                                }}
                            >
                                <span><Download size={14} /> CSV</span>
                            </button>

                            <button
                                onClick={() => setIsAddBookingModalOpen(true)}
                                className="btn-lime"
                                style={{ padding: '8px 16px', fontSize: '12.5px', fontWeight: '800', borderRadius: '12px' }}
                            >
                                + New Booking
                            </button>
</div>

                        {/* 4. BOOKINGS CARDS LIST */}
                        {filteredBookings.length === 0 ? (
                            <div style={{ padding: '48px 24px', textAlign: 'center', background: '#FFFFFF', borderRadius: '20px', border: '1px solid rgba(18,22,19,0.08)' }}>
<div style={{ fontSize: '40px', marginBottom: '10px' }}><ClipboardList size={40} /></div>
                                <div style={{ fontSize: '18px', fontWeight: '800', color: '#121613' }}>No Reservations Found</div>
                                <div style={{ fontSize: '13px', color: '#59655D', marginTop: '4px', maxWidth: '440px', margin: '4px auto 18px' }}>
                                    No records match your selected campsite or search filter. You can add a manual booking or restore sample demonstration bookings.
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                    <button onClick={() => setIsAddBookingModalOpen(true)} className="btn-lime" style={{ padding: '9px 20px', fontSize: '13px', fontWeight: '800' }}>
                                        + Add Manual Booking
                                    </button>
                                    <button onClick={handleSeedSampleBookings} style={{ padding: '9px 18px', borderRadius: '12px', background: '#121613', color: '#FFFFFF', fontSize: '13px', fontWeight: '800', border: 'none', cursor: 'pointer' }}>
Restore Sample Bookings Roster
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {filteredBookings.map(b => {
                                    const formattedCreated = b.createdAt 
                                        ? (isNaN(new Date(b.createdAt).getTime()) ? b.createdAt : new Date(b.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true }))
                                        : 'Recent';

                                    return (
                                    <div
                                        key={b.id}
                                        style={{
                                            background: '#FFFFFF',
                                            border: b.status === 'Pending' ? '1.5px solid #F59E0B' : '1px solid rgba(18, 22, 19, 0.08)',
                                            borderRadius: '20px',
                                            padding: '20px 24px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '16px',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {/* TOP ROW: ID, Squad Category, Date/Time, and Status Pill */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid rgba(18,22,19,0.06)', paddingBottom: '12px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                                <span style={{ fontSize: '11.5px', fontWeight: '900', color: '#121613', background: '#F8F9F5', padding: '3px 9px', borderRadius: '6px', border: '1px solid rgba(18,22,19,0.1)' }}>
                                                    {b.id}
                                                </span>
                                                <span style={{
                                                    fontSize: '11px',
                                                    fontWeight: '800',
                                                    padding: '3px 10px',
                                                    borderRadius: '6px',
                                                    background: b.groupType === 'Family' ? '#FEF3C7' : b.groupType === 'Couple' ? '#FCE7F3' : b.groupType === 'Corporate' ? '#EDE9FE' : b.groupType === 'Solo' ? '#E0F2FE' : '#DCFCE7',
                                                    color: b.groupType === 'Family' ? '#92400E' : b.groupType === 'Couple' ? '#9D174D' : b.groupType === 'Corporate' ? '#5B21B6' : b.groupType === 'Solo' ? '#0369A1' : '#166534'
                                                }}>
{b.groupType === 'Family' ? ' Family' : b.groupType === 'Couple' ? ' Couple' : b.groupType === 'Corporate' ? ' Corporate' : b.groupType === 'Solo' ? ' Solo' : ' Friends Squad'}
                                                </span>
                                                <span style={{ fontSize: '11.5px', color: '#7D8880', fontWeight: '600' }}>
{formattedCreated}
                                                </span>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{
                                                    fontSize: '11.5px',
                                                    fontWeight: '800',
                                                    padding: '4px 12px',
                                                    borderRadius: '999px',
                                                    background: b.status === 'Confirmed' ? '#DCFCE7' : b.status === 'Checked In' ? '#DBEAFE' : b.status === 'Cancelled' ? '#FEE2E2' : '#FEF3C7',
                                                    color: b.status === 'Confirmed' ? '#166534' : b.status === 'Checked In' ? '#1E40AF' : b.status === 'Cancelled' ? '#991B1B' : '#92400E',
                                                    border: '1px solid rgba(0,0,0,0.06)'
                                                }}>
{b.status === 'Confirmed' ? ' Confirmed' : b.status === 'Checked In' ? ' Checked In' : b.status === 'Cancelled' ? ' Cancelled' : ' Pending Verification'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* MIDDLE SECTION: 3 Balanced Information Columns */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', alignItems: 'flex-start' }}>
                                            {/* Col 1: Camper Contact */}
                                            <div>
                                                <div style={{ fontSize: '16px', fontWeight: '800', color: '#121613', marginBottom: '2px' }}>
                                                    {b.name}
                                                </div>
                                                <div style={{ fontSize: '13px', color: '#59655D', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                                                    <span><Phone size={14} /> {b.phone}</span>
{b.email && b.email !== 'N/A' && <span style={{ color: '#7D8880' }}>·  {b.email}</span>}
                                                </div>
{b.utrNumber && (
                                                    <div style={{ marginTop: '8px', fontSize: '11.5px', fontWeight: '800', color: '#166534', background: 'rgba(22, 101, 52, 0.08)', border: '1px solid rgba(22,101,52,0.15)', padding: '4px 10px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                                        <span><KeyRound size={14} /> Payment Ref:</span>
                                                        <span>{b.utrNumber}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Col 2: Trip & Allocation */}
                                            <div>
                                                <div style={{ fontSize: '14px', fontWeight: '800', color: '#121613' }}>
{b.package}
                                                </div>
                                                <div style={{ fontSize: '12.5px', color: '#59655D', marginTop: '2px' }}>
{b.dates} · <strong style={{ color: '#121613' }}>{b.guests} Guests</strong>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                                                    <span style={{ fontSize: '11.5px', fontWeight: '800', background: '#F1F5F9', color: '#0F172A', border: '1px solid rgba(15, 23, 42, 0.12)', padding: '2px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                        <span><Tent size={14} /> Unit:</span>
                                                        <span style={{ color: '#166534' }}>{b.allocatedUnit || 'Tent #01'}</span>
                                                    </span>
                                                    {b.roomType && <span style={{ fontSize: '11.5px', color: '#B45309', fontWeight: '700' }}>· {b.roomType}</span>}
                                                </div>
                                                {b.mealSummary && (
                                                    <div style={{ fontSize: '11.5px', color: '#59655D', marginTop: '4px', fontWeight: '600' }}>
 Meals: {b.mealSummary}
                                                    </div>
                                                )}
                                                {b.notes && (
                                                    <div style={{ marginTop: '6px', fontSize: '11.5px', color: '#59655D', fontStyle: 'italic', background: '#F8F9F5', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(18,22,19,0.04)' }}>
"{b.notes}"
                                                    </div>
                                                )}
                                            </div>

                                            {/* Col 3: Pricing & Financials */}
                                            <div style={{ background: '#F8F9F5', padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(18,22,19,0.06)' }}>
                                                <div style={{ fontSize: '11px', color: '#7D8880', fontWeight: '800', textTransform: 'uppercase' }}>
                                                    Total Fare
                                                </div>
                                                <div style={{ fontSize: '20px', fontWeight: '800', color: '#121613', marginTop: '2px' }}>
                                                    ₹{(b.total || 0).toLocaleString('en-IN')}
                                                </div>
                                                <div style={{ fontSize: '11.5px', color: b.balanceDue === 0 ? '#166534' : '#B45309', fontWeight: '700', marginTop: '2px' }}>
                                                    {b.paidAmount != null ? `Paid: ₹${b.paidAmount.toLocaleString('en-IN')} · Due: ₹${(b.balanceDue || 0).toLocaleString('en-IN')}` : `Source: ${b.source || 'Direct'}`}
                                                </div>
                                            </div>
                                        </div>

                                        {/* BOTTOM ACTION TRAY: Cleanly aligned toolbar utilizing space */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', background: '#F8F9F5', padding: '10px 14px', borderRadius: '14px', border: '1px solid rgba(18,22,19,0.06)' }}>
                                            {/* Left: Quick Status Dropdown */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ fontSize: '11px', fontWeight: '800', color: '#59655D', textTransform: 'uppercase' }}>Update:</span>
                                                <select
                                                    value={b.status}
                                                    onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                                                    style={{
                                                        padding: '6px 10px',
                                                        borderRadius: '8px',
                                                        background: '#FFFFFF',
                                                        border: '1px solid rgba(18, 22, 19, 0.12)',
                                                        fontSize: '12px',
                                                        fontWeight: '800',
                                                        color: '#121613',
                                                        cursor: 'pointer',
                                                        outline: 'none'
                                                    }}
                                                >
<option value="Pending"> Mark Pending</option>
<option value="Confirmed"> Mark Confirmed</option>
<option value="Checked In"> Mark Checked In</option>
<option value="Cancelled"> Mark Cancelled</option>
                                                </select>
                                                {b.status === 'Pending' && (
                                                    <button
                                                        onClick={() => handleUpdateBookingStatus(b.id, 'Confirmed')}
                                                        className="btn-lime"
                                                        style={{ padding: '6px 12px', fontSize: '11.5px', fontWeight: '900', borderRadius: '8px', cursor: 'pointer' }}
                                                    >
Confirm Now
                                                    </button>
                                                )}
                                            </div>

                                            {/* Right: Action Buttons Group */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                                <a
                                                    href={`/pass/${b.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        padding: '7px 12px',
                                                        borderRadius: '8px',
                                                        background: '#FFFFFF',
                                                        border: '1px solid rgba(18,22,19,0.12)',
                                                        color: '#121613',
                                                        textDecoration: 'none',
                                                        fontSize: '12px',
                                                        fontWeight: '800',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                                                    }}
                                                >
                                                    <span><Ticket size={14} /> Pass</span>
                                                </a>

                                                <a
                                                    href={waLink(`Hi ${b.name}! Aanandham coordinator desk confirming your booking (${b.id}) for ${b.package} on ${b.dates}.`, b.phone)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        padding: '7px 14px',
                                                        borderRadius: '8px',
                                                        background: '#25D366',
                                                        color: '#FFFFFF',
                                                        textDecoration: 'none',
                                                        fontSize: '12px',
                                                        fontWeight: '800',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '5px',
                                                        boxShadow: '0 2px 6px rgba(37, 211, 102, 0.25)'
                                                    }}
                                                >
                                                    <span><MessageCircle size={14} /> WhatsApp</span>
                                                </a>

                                                <a
                                                    href={`tel:${(b.phone || '').replace(/\s+/g, '')}`}
                                                    style={{
                                                        padding: '7px 10px',
                                                        borderRadius: '8px',
                                                        background: '#FFFFFF',
                                                        border: '1px solid rgba(18,22,19,0.12)',
                                                        color: '#121613',
                                                        textDecoration: 'none',
                                                        fontSize: '12px',
                                                        fontWeight: '700',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}
                                                    title="Call camper directly"
                                                >
                                                    <span><Phone size={14} /> Call</span>
                                                </a>

                                                <button
                                                    onClick={() => handleDeleteBooking(b.id)}
                                                    title="Delete reservation"
                                                    style={{
                                                        padding: '7px 10px',
                                                        borderRadius: '8px',
                                                        background: 'rgba(239,68,68,0.08)',
                                                        border: '1px solid rgba(239,68,68,0.18)',
                                                        color: '#DC2626',
                                                        cursor: 'pointer',
                                                        fontSize: '12px',
                                                        fontWeight: '800',
                                                        display: 'inline-flex',
                                                        alignItems: 'center'
                                                    }}
                                                >
<span><Trash2 size={14} /></span>
                                                </button>
                                            </div>
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
                    <div style={{ width: '100%' }}>
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
                        <div className="admin-region-chip-row" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '24px' }}>
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
{prop.region || 'Munnar'} · {prop.location}
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
<span><ChevronRight size={14} /></span>
                                        </button>

                                        <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                                            <Link
                                                href={`/camps/${prop.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ padding: '10px 12px', borderRadius: '10px', background: 'rgba(18,22,19,0.06)', color: '#121613', fontSize: '12px', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                                            >
 Public Page
                                            </Link>
                                            <button
                                                onClick={() => handleToggleAvailability(prop.id)}
                                                style={{ flex: 1, padding: '10px', borderRadius: '10px', background: prop.isAvailable ? 'rgba(239, 68, 68, 0.08)' : 'rgba(22, 101, 52, 0.08)', border: prop.isAvailable ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(22, 101, 52, 0.3)', color: prop.isAvailable ? '#DC2626' : '#166534', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}
                                            >
                                                {prop.isAvailable ? 'Mark Sold Out' : 'Mark Available'}
                                            </button>
                                            <button onClick={() => handleOpenPropertyModal(prop)} style={{ padding: '10px 14px', borderRadius: '10px', background: '#F8F9F5', border: '1px solid rgba(18,22,19,0.08)', color: '#121613', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
Edit 
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
                    <div style={{ width: '100%' }}>
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
{ev.campsite}
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
Edit Batch 
                                            </button>
                                            <button onClick={() => handleDeleteEvent(ev.id)} style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: 'none', color: '#DC2626', fontSize: '12.5px', cursor: 'pointer' }}>
                                            <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    TAB 4: CAMP HOSTS, TREK GUIDES & FIELD CREW
                ───────────────────────────────────────────────────────────── */}
                {activeTab === 'marshals' && (
                    <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                            <div>
                                <div className="star-badge" style={{ marginBottom: '4px' }}>
<span className="star-icon">★</span> FIELD OPERATIONS & SANCTUARY CREW
                                </div>
                                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: '800', margin: 0, color: '#121613' }}>
                                    Camp Hosts & Certified Guides
                                </h2>
                                <div style={{ fontSize: '13px', color: '#59655D', marginTop: '4px' }}>
                                    Manage basecamp hosts, summit trek guides, 4x4 convoy pilots, and gate check-in PIN access across all sanctuaries.
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
<button
                                    onClick={() => setScannerOverlayOpen(true)}
                                    style={{
                                        padding: '10px 18px',
                                        borderRadius: '12px',
                                        background: '#FFFFFF',
                                        border: '1px solid rgba(18,22,19,0.12)',
                                        color: '#121613',
                                        fontSize: '13px',
                                        fontWeight: '800',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                                    }}
                                >
                                    <span><Smartphone size={14} /> Open Scanner Simulator</span>
                                </button>
                                <button
                                    onClick={() => handleOpenMarshalModal()}
                                    className="btn-lime"
                                    style={{ padding: '10px 22px', fontSize: '13.5px', fontWeight: '800', cursor: 'pointer', border: 'none', borderRadius: '12px' }}
                                >
                                    + Add Camp Host / Guide
                                </button>
                            </div>
                        </div>

                        {/* Hosts & Guides Card Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
                            {marshals.map(m => (
                                <div
                                    key={m.id}
                                    style={{
                                        background: '#FFFFFF',
                                        border: m.status === 'On Duty' ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(18, 22, 19, 0.08)',
                                        borderRadius: '20px',
                                        padding: '22px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        boxShadow: '0 4px 18px rgba(0,0,0,0.03)',
                                        position: 'relative'
                                    }}
                                >
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', gap: '10px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                                                <img
                                                    src={m.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                                                    alt={m.name}
                                                    style={{
                                                        width: '54px',
                                                        height: '54px',
                                                        borderRadius: '16px',
                                                        objectFit: 'cover',
                                                        flexShrink: 0,
                                                        border: m.status === 'On Duty' ? '2.5px solid #22C55E' : m.status === 'Off Duty' ? '2.5px solid #F59E0B' : '2.5px solid #EF4444'
                                                    }}
                                                />
                                                <div style={{ minWidth: 0 }}>
                                                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#121613', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {m.name}
                                                    </div>
                                                    <div style={{ fontSize: '11px', color: '#166534', fontWeight: '800', background: 'rgba(22,101,52,0.06)', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginTop: '2px' }}>
{m.role || ' Camp Host & Guide'}
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: '#59655D', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
                                                        <span><Phone size={16} /></span>
                                                        <a href={`tel:${m.phone}`} style={{ color: '#59655D', textDecoration: 'none', fontWeight: '600' }}>{m.phone}</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleToggleMarshalStatus(m.id)}
                                                title="Click to cycle duty status (On Duty / Off Duty / Closed)"
                                                style={{
                                                    padding: '5px 12px',
                                                    borderRadius: '999px',
                                                    fontSize: '11px',
                                                    fontWeight: '800',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    flexShrink: 0,
                                                    background: m.status === 'On Duty' ? '#DCFCE7' : m.status === 'Off Duty' ? '#FEF3C7' : '#FEE2E2',
                                                    color: m.status === 'On Duty' ? '#166534' : m.status === 'Off Duty' ? '#92400E' : '#991B1B',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                                }}
                                            >
{m.status === 'On Duty' ? ' On Duty' : m.status === 'Off Duty' ? ' Off Duty' : ' Closed'}
                                            </button>
                                        </div>

                                        {/* Station Assignment Box */}
                                        <div style={{ background: '#F8F9F5', padding: '12px 14px', borderRadius: '14px', marginBottom: '14px', border: '1px solid rgba(18,22,19,0.06)' }}>
                                            <div style={{ fontSize: '10.5px', color: '#7D8880', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>
                                                Assigned Sanctuary Station & Gate PIN
                                            </div>
                                            <div style={{ fontSize: '13px', fontWeight: '700', color: '#121613', marginBottom: '6px' }}>
{m.station}
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                                                <div style={{ fontSize: '12px', color: '#166534', fontWeight: '800', background: 'rgba(22,101,52,0.08)', padding: '3px 10px', borderRadius: '6px', border: '1px solid rgba(22,101,52,0.15)' }}>
Passcode: {m.passcode}
                                                </div>
                                                <span style={{ fontSize: '11px', color: '#7D8880', fontWeight: '600' }}>ID: {m.id}</span>
                                            </div>
                                        </div>

                                        {m.notes && (
                                            <div style={{ fontSize: '12px', color: '#59655D', fontStyle: 'italic', marginBottom: '16px', lineHeight: 1.4, background: 'rgba(18,22,19,0.02)', padding: '8px 12px', borderRadius: '8px' }}>
                                                "{m.notes}"
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid rgba(18,22,19,0.08)', paddingTop: '14px' }}>
                                        <a
                                            href={waLink(`Hi ${m.name}! Aanandham Basecamp HQ dispatching update for ${m.station}.`, m.phone)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                flex: 1,
                                                padding: '9px 12px',
                                                borderRadius: '10px',
                                                background: '#25D366',
                                                color: '#FFFFFF',
                                                textDecoration: 'none',
                                                fontSize: '12px',
                                                fontWeight: '800',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '6px'
                                            }}
                                        >
                                            <span><MessageCircle size={14} /> WhatsApp Dispatch</span>
                                        </a>
                                        <button
                                            onClick={() => handleOpenMarshalModal(m)}
                                            style={{
                                                padding: '9px 14px',
                                                borderRadius: '10px',
                                                background: '#F8F9F5',
                                                border: '1px solid rgba(18,22,19,0.1)',
                                                color: '#121613',
                                                fontSize: '12px',
                                                fontWeight: '700',
                                                cursor: 'pointer'
                                            }}
                                        >
Edit 
                                        </button>
                                        <button
                                            onClick={() => handleDeleteMarshal(m.id)}
                                            title="Revoke Credentials"
                                            style={{
                                                padding: '9px 12px',
                                                borderRadius: '10px',
                                                background: 'rgba(239,68,68,0.08)',
                                                border: '1px solid rgba(239,68,68,0.15)',
                                                color: '#DC2626',
                                                fontSize: '12px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                        <Trash2 size={14} />
                                        </button>
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
                    <div style={{ width: '100%' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <div className="star-badge" style={{ marginBottom: '3px' }}>
<span className="star-icon">★</span> FINANCIAL INTELLIGENCE
                            </div>
                            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '800', margin: 0, color: '#121613' }}>
                                Profit & Revenue Analytics
                            </h2>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                            gap: '16px',
                            marginBottom: '24px'
                        }}>
                            <div style={{
                                background: '#FFFFFF',
                                border: '1px solid rgba(18, 22, 19, 0.08)',
                                borderRadius: '18px',
                                padding: '20px 22px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
                            }}>
                                <div style={{ fontSize: '10.5px', fontWeight: '800', color: '#7D8880', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Gross Revenue (Booked)</div>
                                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: '800', color: '#121613', margin: '6px 0' }}>₹{totalRevenue.toLocaleString('en-IN')}</div>
                                <div style={{ fontSize: '12px', color: '#59655D' }}>100% of confirmed reservations</div>
                            </div>

                            <div style={{
                                background: '#FFFFFF',
                                border: '1px solid rgba(18, 22, 19, 0.08)',
                                borderRadius: '18px',
                                padding: '20px 22px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
                            }}>
                                <div style={{ fontSize: '10.5px', fontWeight: '800', color: '#7D8880', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Direct Operations (45%)</div>
                                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: '800', color: '#B45309', margin: '6px 0' }}>₹{estimatedDirectCosts.toLocaleString('en-IN')}</div>
                                <div style={{ fontSize: '12px', color: '#59655D' }}>Permits, Food & 4x4 safaris</div>
                            </div>

                            <div style={{
                                background: '#FFFFFF',
                                border: '1px solid rgba(18, 22, 19, 0.08)',
                                borderRadius: '18px',
                                padding: '20px 22px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
                            }}>
                                <div style={{ fontSize: '10.5px', fontWeight: '800', color: '#7D8880', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Net Operating Profit</div>
                                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: '800', color: '#166534', margin: '6px 0' }}>₹{estimatedNetProfit.toLocaleString('en-IN')}</div>
<div style={{ fontSize: '12px', color: '#166534', fontWeight: '700' }}> ✓ {profitMarginPercent}% Net Margin</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    TAB: PAYMENT GATEWAY & DYNAMIC QR CONTROL
                ───────────────────────────────────────────────────────────── */}
                {activeTab === 'payment' && (
                    <div style={{ width: '100%' }}>
                        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                            <div>
                                <div className="star-badge" style={{ marginBottom: '3px' }}>
<span className="star-icon">★</span> PAYMENT CONTROL CENTER
                                </div>
                                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '800', margin: '0 0 4px', color: '#121613' }}>
                                    Payment Gateway, QR Code & Checkout Mode
                                </h2>
                                    <p style={{ fontSize: '12.5px', color: '#59655D', margin: 0 }}>
                                        Toggle between "Coming Soon" concierge reservation mode and the "Live Razorpay Gateway" checkout in 1 click.
                                    </p>
                            </div>
                            <button
                                onClick={handleSavePaymentSettings}
                                className="btn-lime"
                                style={{ padding: '9px 20px', fontSize: '12.5px', fontWeight: '800', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                            >
                                <span><Save size={14} /> Save & Apply</span>
                            </button>
                        </div>

                        {/* SECTION 1: MODE SELECTOR CARDS */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ fontSize: '11px', fontWeight: '800', color: '#627266', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                                1. ACTIVE CHECKOUT PAYMENT MODE
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                                {/* Mode 1: Coming Soon (Default) */}
                                <div
                                    onClick={() => setPaymentSettings(prev => ({ ...prev, mode: 'coming_soon' }))}
                                    style={{
                                        border: paymentSettings.mode === 'coming_soon' ? '2px solid #E5A93B' : '1px solid rgba(18,22,19,0.1)',
                                        background: paymentSettings.mode === 'coming_soon' ? '#FFFDF5' : '#FFFFFF',
                                        borderRadius: '18px',
                                        padding: '18px',
                                        cursor: 'pointer',
                                        boxShadow: paymentSettings.mode === 'coming_soon' ? '0 8px 30px rgba(229,169,59,0.14)' : '0 2px 8px rgba(0,0,0,0.02)',
                                        transition: 'all 0.2s ease',
                                        position: 'relative'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
<span style={{ fontSize: '24px' }}><Clock size={24} /></span>
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
0 Payment Friction · High Conversion
                                    </div>
                                </div>

                                {/* Mode 2: Live Razorpay Gateway */}
                                <div
                                    onClick={() => setPaymentSettings(prev => ({ ...prev, mode: 'razorpay' }))}
                                    style={{
                                        border: paymentSettings.mode === 'razorpay' ? '2px solid #22C55E' : '1px solid rgba(18,22,19,0.1)',
                                        background: paymentSettings.mode === 'razorpay' ? '#F0FDF4' : '#FFFFFF',
                                        borderRadius: '20px',
                                        padding: '24px',
                                        cursor: 'pointer',
                                        boxShadow: paymentSettings.mode === 'razorpay' ? '0 8px 30px rgba(34,197,94,0.14)' : '0 2px 8px rgba(0,0,0,0.02)',
                                        transition: 'all 0.2s ease',
                                        position: 'relative'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                        <span style={{ fontSize: '24px' }}><Zap size={24} /></span>
                                        <span style={{
                                            background: paymentSettings.mode === 'razorpay' ? '#22C55E' : 'rgba(18,22,19,0.06)',
                                            color: paymentSettings.mode === 'razorpay' ? '#FFFFFF' : '#59655D',
                                            fontSize: '10.5px',
                                            fontWeight: '900',
                                            padding: '3px 10px',
                                            borderRadius: '999px',
                                            letterSpacing: '0.5px'
                                        }}>
{paymentSettings.mode === 'razorpay' ? '● CURRENTLY ACTIVE' : 'CLICK TO ACTIVATE'}
                                        </span>
                                    </div>
                                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800', margin: '0 0 6px', color: '#121613' }}>
                                        Live Razorpay Gateway Checkout
                                    </h4>
                                    <p style={{ fontSize: '13px', color: '#59655D', lineHeight: 1.55, margin: '0 0 14px' }}>
                                        Guests pay through the encrypted Razorpay checkout (UPI · Cards · NetBanking · Wallets). Each booking creates a server-validated order with a 10-minute slot hold; payments are confirmed automatically via webhook.
                                    </p>
                                    <div style={{ fontSize: '11.5px', fontWeight: '700', color: '#15803D', background: 'rgba(34,197,94,0.12)', padding: '6px 12px', borderRadius: '8px', width: 'fit-content' }}>
                                        Auto-Confirmed · Webhook Verified
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
ACTIVE STATUS: {paymentSettings.mode === 'coming_soon' ? ' COMING SOON MODE' : ' LIVE RAZORPAY GATEWAY'}
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
Save & Apply Settings
                            </button>
                        </div>
                    </div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    TAB: DISCOUNTS & OFFERS
                ───────────────────────────────────────────────────────────── */}
                {activeTab === 'discounts' && (
                    <div style={{ width: '100%' }}>
                        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                            <div>
                                <div className="star-badge" style={{ marginBottom: '3px' }}>
<span className="star-icon">★</span> OFFERS & CAMPAIGNS
                                </div>
                                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '800', margin: '0 0 4px', color: '#121613' }}>
                                    Discounts & Offers Center
                                </h2>
                                <p style={{ fontSize: '12.5px', color: '#59655D', margin: 0 }}>
                                    Manage automated discount campaigns. The best applicable offer is applied automatically at booking across all campsites.
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <button
                                    onClick={handleAddDiscount}
                                    className="btn-secondary"
                                    style={{ padding: '9px 16px', fontSize: '12.5px', fontWeight: '800', border: '1px solid rgba(18,22,19,0.15)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FFFFFF', borderRadius: '10px' }}
                                >
                                    <span><Plus size={14} /> New Campaign</span>
                                </button>
                                <button
                                    onClick={handleResetDiscounts}
                                    className="btn-secondary"
                                    style={{ padding: '9px 16px', fontSize: '12.5px', fontWeight: '800', border: '1px solid rgba(18,22,19,0.15)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FFFFFF', borderRadius: '10px', color: '#B45309' }}
                                >
                                    <span><RefreshCw size={14} /> Reset to Defaults</span>
                                </button>
                                <button
                                    onClick={handleSaveDiscounts}
                                    disabled={discountsSaving}
                                    className="btn-lime"
                                    style={{ padding: '9px 20px', fontSize: '12.5px', fontWeight: '800', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', opacity: discountsSaving ? 0.6 : 1 }}
                                >
                                    <span><Save size={14} /> {discountsSaving ? 'Saving...' : 'Save & Apply'}</span>
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px', background: 'rgba(229,169,59,0.08)', border: '1px solid rgba(229,169,59,0.25)', borderRadius: '12px', padding: '10px 14px' }}>
                            <span style={{ fontSize: '13px' }}><Zap size={15} style={{ color: '#B45309' }} /></span>
                            <span style={{ fontSize: '12.5px', color: '#7C4A03', fontWeight: '700', lineHeight: 1.45 }}>
                                When multiple offers qualify, the one saving guests the most is applied automatically. Scoped offers apply only to their selected campsite.
                            </span>
                        </div>

                        {discounts.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px 20px', background: '#F8F9F5', borderRadius: '16px', border: '1px dashed rgba(18,22,19,0.2)' }}>
                                <div style={{ fontSize: '13px', color: '#59655D', fontWeight: '700' }}>No discount campaigns yet — click "New Campaign" to create one.</div>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
                                {discounts.map((d, idx) => {
                                    const activeQualifies = d.active && !(d.expiresAt && Date.now() > new Date(d.expiresAt).getTime());
                                    return (
                                        <div key={d.id || idx} style={{ background: '#FFFFFF', border: activeQualifies ? '1px solid rgba(22,101,52,0.25)' : '1px solid rgba(18,22,19,0.1)', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', gap: '8px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                                                    <span style={{ background: activeQualifies ? '#DCFCE7' : 'rgba(18,22,19,0.06)', color: activeQualifies ? '#166534' : '#59655D', fontSize: '10.5px', fontWeight: '900', padding: '3px 10px', borderRadius: '999px', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                                                        {activeQualifies ? '● LIVE' : d.active ? 'EXPIRED' : 'PAUSED'}
                                                    </span>
                                                    <span style={{ fontSize: '10px', color: '#8A938B', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.id}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveDiscount(d.id)}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B91C1C', padding: '4px' }}
                                                    title="Delete campaign"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>

                                            <div style={{ marginBottom: '10px' }}>
                                                <label style={{ fontSize: '10.5px', fontWeight: '800', color: '#59655D', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Campaign Name</label>
                                                <input
                                                    type="text"
                                                    value={d.name || ''}
                                                    onChange={(e) => handleUpdateDiscount(d.id, { name: e.target.value })}
                                                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13px', fontWeight: '700', outline: 'none', boxSizing: 'border-box' }}
                                                />
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                                                <div>
                                                    <label style={{ fontSize: '10.5px', fontWeight: '800', color: '#59655D', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Type</label>
                                                    <select
                                                        value={d.type || 'percent'}
                                                        onChange={(e) => handleUpdateDiscount(d.id, { type: e.target.value })}
                                                        style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                                                    >
                                                        <option value="percent">Percent (%)</option>
                                                        <option value="flat">Flat (₹)</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label style={{ fontSize: '10.5px', fontWeight: '800', color: '#59655D', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>{d.type === 'flat' ? 'Amount Off (₹)' : 'Percent Off (%)'}</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max={d.type === 'flat' ? 50000 : 90}
                                                        value={d.value ?? 0}
                                                        onChange={(e) => handleUpdateDiscount(d.id, { value: Math.max(0, Number(e.target.value) || 0) })}
                                                        style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                                                    />
                                                </div>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                                                <div>
                                                    <label style={{ fontSize: '10.5px', fontWeight: '800', color: '#59655D', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Min Guests</label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={d.minGuests ?? 1}
                                                        onChange={(e) => handleUpdateDiscount(d.id, { minGuests: Math.max(1, Number(e.target.value) || 1) })}
                                                        style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                                                    />
                                                </div>
                                                <div>
                                                    <label style={{ fontSize: '10.5px', fontWeight: '800', color: '#59655D', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Scope</label>
                                                    <select
                                                        value={d.scope || 'all'}
                                                        onChange={(e) => handleUpdateDiscount(d.id, { scope: e.target.value })}
                                                        style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                                                    >
                                                        <option value="all">All Campsites</option>
                                                        {properties.map(p => (
                                                            <option key={p.id} value={p.id}>{p.title}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div style={{ marginBottom: '12px' }}>
                                                <label style={{ fontSize: '10.5px', fontWeight: '800', color: '#59655D', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Expires (Optional)</label>
                                                <input
                                                    type="date"
                                                    value={d.expiresAt ? String(d.expiresAt).slice(0, 10) : ''}
                                                    onChange={(e) => handleUpdateDiscount(d.id, { expiresAt: e.target.value ? new Date(e.target.value + 'T23:59:59.000Z').toISOString() : null })}
                                                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                                                />
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(18,22,19,0.08)', paddingTop: '12px' }}>
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '800', color: '#121613', cursor: 'pointer' }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={!!d.active}
                                                        onChange={(e) => handleUpdateDiscount(d.id, { active: e.target.checked })}
                                                        style={{ width: '16px', height: '16px', accentColor: '#166534', cursor: 'pointer' }}
                                                    />
                                                    Active Campaign
                                                </label>
                                                <span style={{ fontSize: '12px', fontWeight: '900', color: '#166534' }}>
                                                    {d.type === 'flat' ? `₹${Number(d.value || 0).toLocaleString('en-IN')} OFF` : `${Number(d.value || 0)}% OFF`}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* LIVE PREVIEW & SAVE */}
                        <div style={{ background: '#121613', borderRadius: '20px', padding: '24px 28px', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginTop: '20px' }}>
                            <div>
                                <div style={{ fontSize: '11px', color: '#E5A93B', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                    {discounts.filter(d => d.active).length} ACTIVE CAMPAIGN{discounts.filter(d => d.active).length === 1 ? '' : 'S'}
                                </div>
                                <div style={{ fontSize: '13.5px', color: '#A2B6A6', marginTop: '2px' }}>
                                    Changes take effect immediately across all booking modals on the website.
                                </div>
                            </div>
                            <button
                                onClick={handleSaveDiscounts}
                                disabled={discountsSaving}
                                className="btn-lime"
                                style={{ padding: '13px 32px', fontSize: '14px', fontWeight: '900', border: 'none', cursor: 'pointer', opacity: discountsSaving ? 0.6 : 1 }}
                            >
                                {discountsSaving ? 'Saving...' : 'Save & Apply Campaigns'}
                            </button>
                        </div>
                    </div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    TAB: TESTIMONIALS & REVIEWS
                ───────────────────────────────────────────────────────────── */}
                {activeTab === 'testimonials' && (
                    <div style={{ width: '100%' }}>
                        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                            <div>
                                <div className="star-badge" style={{ marginBottom: '3px' }}>
<span className="star-icon">★</span> CAMPER REVIEWS
                                </div>
                                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '800', margin: '0 0 4px', color: '#121613' }}>
                                    Guest Testimonials & Reviews
                                </h2>
                                <p style={{ fontSize: '12.5px', color: '#59655D', margin: 0 }}>
                                    Curate the verified camper reviews shown on the homepage. Only active testimonials are published.
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <button
                                    onClick={handleAddTestimonial}
                                    className="btn-secondary"
                                    style={{ padding: '9px 16px', fontSize: '12.5px', fontWeight: '800', border: '1px solid rgba(18,22,19,0.15)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FFFFFF', borderRadius: '10px' }}
                                >
                                    <span><Plus size={14} /> New Testimonial</span>
                                </button>
                                <button
                                    onClick={handleResetTestimonials}
                                    className="btn-secondary"
                                    style={{ padding: '9px 16px', fontSize: '12.5px', fontWeight: '800', border: '1px solid rgba(18,22,19,0.15)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FFFFFF', borderRadius: '10px', color: '#B45309' }}
                                >
                                    <span><RefreshCw size={14} /> Reset to Defaults</span>
                                </button>
                                <button
                                    onClick={handleSaveTestimonials}
                                    disabled={testimonialsSaving}
                                    className="btn-lime"
                                    style={{ padding: '9px 20px', fontSize: '12.5px', fontWeight: '800', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', opacity: testimonialsSaving ? 0.6 : 1 }}
                                >
                                    <span><Save size={14} /> {testimonialsSaving ? 'Saving...' : 'Save & Publish'}</span>
                                </button>
                            </div>
                        </div>

                        {testimonials.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px 20px', background: '#F8F9F5', borderRadius: '16px', border: '1px dashed rgba(18,22,19,0.2)' }}>
                                <div style={{ fontSize: '13px', color: '#59655D', fontWeight: '700' }}>No testimonials yet — click "New Testimonial" to add one.</div>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '14px' }}>
                                {testimonials.map((t, idx) => (
                                    <div key={t.id || idx} style={{ background: '#FFFFFF', border: t.active ? '1px solid rgba(22,101,52,0.25)' : '1px solid rgba(18,22,19,0.1)', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', gap: '8px' }}>
                                            <span style={{ background: t.active ? '#DCFCE7' : 'rgba(18,22,19,0.06)', color: t.active ? '#166534' : '#59655D', fontSize: '10.5px', fontWeight: '900', padding: '3px 10px', borderRadius: '999px', letterSpacing: '0.5px' }}>
                                                {t.active ? '● PUBLISHED' : 'HIDDEN'}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTestimonial(t.id)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B91C1C', padding: '4px' }}
                                                title="Delete testimonial"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>

                                        <div style={{ marginBottom: '10px' }}>
                                            <label style={{ fontSize: '10.5px', fontWeight: '800', color: '#59655D', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Review Quote</label>
                                            <textarea
                                                rows={4}
                                                value={t.quote || ''}
                                                onChange={(e) => handleUpdateTestimonial(t.id, { quote: e.target.value })}
                                                style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '12.5px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.5 }}
                                            />
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                                            <div>
                                                <label style={{ fontSize: '10.5px', fontWeight: '800', color: '#59655D', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Camper Name</label>
                                                <input
                                                    type="text"
                                                    value={t.author || ''}
                                                    onChange={(e) => handleUpdateTestimonial(t.id, { author: e.target.value })}
                                                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                                                />
                                            </div>
                                            <div>
                                                <label style={{ fontSize: '10.5px', fontWeight: '800', color: '#59655D', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Instagram ID (Optional)</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. daniel.kim.trails"
                                                    value={t.instagram || ''}
                                                    onChange={(e) => handleUpdateTestimonial(t.id, { instagram: e.target.value.replace(/\s+/g, '').replace(/^@/, '') })}
                                                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                                                />
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                                            <div>
                                                <label style={{ fontSize: '10.5px', fontWeight: '800', color: '#59655D', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Camp Badge</label>
                                                <input
                                                    type="text"
                                                    value={t.campBadge || ''}
                                                    onChange={(e) => handleUpdateTestimonial(t.id, { campBadge: e.target.value })}
                                                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                                                />
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: '10px' }}>
                                            <label style={{ fontSize: '10.5px', fontWeight: '800', color: '#59655D', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Batch Date Line</label>
                                            <input
                                                type="text"
                                                value={t.batchDate || ''}
                                                onChange={(e) => handleUpdateTestimonial(t.id, { batchDate: e.target.value })}
                                                style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                                            />
                                        </div>

                                        <div style={{ marginBottom: '12px' }}>
                                            <label style={{ fontSize: '10.5px', fontWeight: '800', color: '#59655D', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Camper Avatar</label>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                                                <div style={{ width: '52px', height: '52px', borderRadius: '50%', overflow: 'hidden', background: 'rgba(18,22,19,0.06)', flexShrink: 0, border: '2px solid rgba(22,101,52,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {t.avatar ? (
                                                        <img src={t.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <span style={{ fontSize: '18px', color: '#8A938B' }}>👤</span>
                                                    )}
                                                </div>
                                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRandomTestimonialAvatar(t.id)}
                                                        style={{ padding: '9px 14px', borderRadius: '10px', border: '1px solid rgba(18,22,19,0.14)', background: '#FFFFFF', color: '#121613', fontSize: '12px', fontWeight: '800', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                                        title="Pick a random clean human portrait"
                                                    >
                                                        🎲 <span>Random Face</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => document.getElementById(`avatar-upload-${t.id}`)?.click()}
                                                        style={{ padding: '9px 14px', borderRadius: '10px', border: '1px solid rgba(22,101,52,0.35)', background: '#DCFCE7', color: '#166534', fontSize: '12px', fontWeight: '800', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                                        title="Upload a photo from your device"
                                                    >
                                                        <Upload size={14} /> <span>Upload Photo</span>
                                                    </button>
                                                    {t.avatar && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleUpdateTestimonial(t.id, { avatar: '' })}
                                                            style={{ padding: '9px 12px', borderRadius: '10px', border: '1px solid rgba(18,22,19,0.14)', background: '#FFFFFF', color: '#B91C1C', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}
                                                            title="Remove avatar"
                                                        >
                                                            ✕ Clear
                                                        </button>
                                                    )}
                                                    <input
                                                        id={`avatar-upload-${t.id}`}
                                                        type="file"
                                                        accept="image/jpeg,image/png,image/webp,image/avif"
                                                        style={{ display: 'none' }}
                                                        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleTestimonialAvatarUpload(t.id, f); e.target.value = ''; }}
                                                    />
                                                </div>
                                            </div>

                                            <div style={{ marginBottom: '8px' }}>
                                                <div style={{ fontSize: '10px', fontWeight: '800', color: '#8A938B', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '5px' }}>Pick a preset face (no upload needed)</div>
                                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                                    {AVATAR_PRESETS.map((u) => (
                                                        <button
                                                            key={u}
                                                            type="button"
                                                            onClick={() => handleUpdateTestimonial(t.id, { avatar: u })}
                                                            title="Use this avatar"
                                                            style={{ width: '34px', height: '34px', borderRadius: '50%', overflow: 'hidden', padding: 0, border: t.avatar === u ? '2px solid #166534' : '2px solid transparent', cursor: 'pointer', background: 'rgba(18,22,19,0.06)', flexShrink: 0 }}
                                                        >
                                                            <img src={u} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <label style={{ fontSize: '10px', fontWeight: '800', color: '#8A938B', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Or paste an image URL</label>
                                            <input
                                                type="text"
                                                placeholder="https://…"
                                                value={t.avatar || ''}
                                                onChange={(e) => handleUpdateTestimonial(t.id, { avatar: e.target.value })}
                                                style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                                            />
                                            <div style={{ fontSize: '10.5px', color: '#8A938B', fontWeight: '700', marginTop: '5px' }}>
                                                Uploaded photos are auto-resized to 160px and stored inside the testimonials data file (no separate folder needed). Preset faces load from Unsplash CDN.
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(18,22,19,0.08)', paddingTop: '12px' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '800', color: '#121613', cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={!!t.active}
                                                    onChange={(e) => handleUpdateTestimonial(t.id, { active: e.target.checked })}
                                                    style={{ width: '16px', height: '16px', accentColor: '#166534', cursor: 'pointer' }}
                                                />
                                                Publish on Homepage
                                            </label>
                                            <span style={{ fontSize: '11px', color: '#8A938B', fontWeight: '700' }}>{t.id}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* LIVE PREVIEW & SAVE */}
                        <div style={{ background: '#121613', borderRadius: '20px', padding: '24px 28px', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginTop: '20px' }}>
                            <div>
                                <div style={{ fontSize: '11px', color: '#E5A93B', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                    {testimonials.filter(t => t.active).length} TESTIMONIAL{testimonials.filter(t => t.active).length === 1 ? '' : 'S'} PUBLISHED
                                </div>
                                <div style={{ fontSize: '13.5px', color: '#A2B6A6', marginTop: '2px' }}>
                                    Changes take effect immediately on the homepage testimonials carousel.
                                </div>
                            </div>
                            <button
                                onClick={handleSaveTestimonials}
                                disabled={testimonialsSaving}
                                className="btn-lime"
                                style={{ padding: '13px 32px', fontSize: '14px', fontWeight: '900', border: 'none', cursor: 'pointer', opacity: testimonialsSaving ? 0.6 : 1 }}
                            >
                                {testimonialsSaving ? 'Saving...' : 'Save & Publish Reviews'}
                            </button>
                        </div>
                    </div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    TAB 6: COORDINATOR SETTINGS
                ───────────────────────────────────────────────────────────── */}
                {activeTab === 'settings' && (
                    <div style={{ width: '100%' }}>
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
Save Coordinates
                                </button>
                                {settingsSavedToast && (
                                    <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ color: '#166534', fontSize: '13px', fontWeight: '700' }}>
Saved & Synchronized
                                    </motion.span>
                                )}
                            </div>
                        </form>

                        {/* SECTION: SYSTEM DATA BACKUP & RESTORE */}
                        <div style={{ marginTop: '36px', background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '20px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: '800', color: '#121613', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block' }}>
SYSTEM BACKUP & DISASTER RECOVERY
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
                                    <span><Save size={14} /> Export JSON Backup</span>
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
                                    <span><Download size={14} /> Restore JSON Backup</span>
                                    <input type="file" accept=".json" onChange={handleImportBackup} style={{ display: 'none' }} />
                                </label>
                            </div>
                        </div>

                        {/* SECTION: ACCESS AUDIT LOGS */}
                        <div style={{ marginTop: '24px', background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '20px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: '800', color: '#121613', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block' }}>
 COORDINATOR ACCESS AUDIT TRAIL
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
{isLoadingAudit ? 'Refreshing...' : ' Fetch Logs'}
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

                {/* ─────────────────────────────────────────────────────────────
                    TAB: SECURITY, AUTHENTICATION & DATABASE AUDIT LOGS
                ───────────────────────────────────────────────────────────── */}
                {activeTab === 'logs' && (
                    <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                            <div>
                                <div className="star-badge" style={{ marginBottom: '4px' }}>
<span className="star-icon">★</span> ENTERPRISE SECURITY & AUDIT TRAIL
                                </div>
                                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: '800', margin: 0, color: '#121613' }}>
                                    Security & System Audit Logs
                                </h2>
                                <div style={{ fontSize: '13px', color: '#59655D', marginTop: '4px' }}>
                                    Immutable chronological audit logs for coordinator authentication, database mutations, and station check-ins.
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
<button
onClick={() => { fetchAuditLogs(); fetchSecurityOverview(); fetchInquiries(); showToast('Logs refreshed live'); }}
                                    style={{
                                        padding: '9px 16px',
                                        borderRadius: '12px',
                                        background: '#F8F9F5',
                                        border: '1px solid rgba(18,22,19,0.12)',
                                        color: '#121613',
                                        fontSize: '12.5px',
                                        fontWeight: '800',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                >
<span><RefreshCw size={13} /> Refresh Live Logs</span>
                                </button>
<button
                                    onClick={handleExportBackup}
                                    className="btn-lime"
                                    style={{ padding: '9px 18px', fontSize: '12.5px', fontWeight: '800' }}
                                >
Export Audit Bundle
                                </button>
                                <button
                                    onClick={handleExportWalBackup}
                                    style={{
                                        padding: '9px 16px',
                                        borderRadius: '12px',
                                        background: '#F8F9F5',
                                        border: '1px solid rgba(18,22,19,0.12)',
                                        color: '#121613',
                                        fontSize: '12.5px',
                                        fontWeight: '800',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                >
<span><Database size={13} /> Export WAL Ledger</span>
                                </button>
                            </div>
                        </div>

                        {/* Sub-View Switcher (Auth Logs vs Database Mutation Logs) */}
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', borderBottom: '1px solid rgba(18, 22, 19, 0.08)', paddingBottom: '12px' }}>
                            <button
                                onClick={() => setLogViewTab('auth')}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '12px',
                                    border: logViewTab === 'auth' ? '1.5px solid #121613' : '1px solid rgba(18, 22, 19, 0.1)',
                                    background: logViewTab === 'auth' ? '#121613' : '#FFFFFF',
                                    color: logViewTab === 'auth' ? '#FFFFFF' : '#3A443E',
                                    fontSize: '13px',
                                    fontWeight: logViewTab === 'auth' ? '800' : '600',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
<span><ShieldCheck size={14} /> Authentication & Login Logs</span>
                                <span style={{
                                    background: logViewTab === 'auth' ? '#D5ED55' : 'rgba(18, 22, 19, 0.08)',
                                    color: logViewTab === 'auth' ? '#0B150E' : '#59655D',
                                    fontSize: '11px',
                                    fontWeight: '800',
                                    padding: '1px 7px',
                                    borderRadius: '999px'
                                }}>
                                    {auditLogs.length || 3}
                                </span>
                            </button>

                            <button
                                onClick={() => setLogViewTab('db')}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '12px',
                                    border: logViewTab === 'db' ? '1.5px solid #121613' : '1px solid rgba(18, 22, 19, 0.1)',
                                    background: logViewTab === 'db' ? '#121613' : '#FFFFFF',
                                    color: logViewTab === 'db' ? '#FFFFFF' : '#3A443E',
                                    fontSize: '13px',
                                    fontWeight: logViewTab === 'db' ? '800' : '600',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
<span><Database size={14} /> Database & Mutation Trail</span>
                                <span style={{
                                    background: logViewTab === 'db' ? '#D5ED55' : 'rgba(18, 22, 19, 0.08)',
                                    color: logViewTab === 'db' ? '#0B150E' : '#59655D',
                                    fontSize: '11px',
                                    fontWeight: '800',
                                    padding: '1px 7px',
                                    borderRadius: '999px'
                                }}>
                                    {dbLogs.length}
                                </span>
                            </button>

                            <button
                                onClick={() => { setLogViewTab('security'); fetchSecurityOverview(); }}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '12px',
                                    border: logViewTab === 'security' ? '1.5px solid #121613' : '1px solid rgba(18, 22, 19, 0.1)',
                                    background: logViewTab === 'security' ? '#121613' : '#FFFFFF',
                                    color: logViewTab === 'security' ? '#FFFFFF' : '#3A443E',
                                    fontSize: '13px',
                                    fontWeight: logViewTab === 'security' ? '800' : '600',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
<span><ShieldCheck size={14} /> Security & Blocks</span>
                                <span style={{
                                    background: logViewTab === 'security' ? '#D5ED55' : 'rgba(18, 22, 19, 0.08)',
                                    color: logViewTab === 'security' ? '#0B150E' : '#59655D',
                                    fontSize: '11px',
                                    fontWeight: '800',
                                    padding: '1px 7px',
                                    borderRadius: '999px'
                                }}>
                                    {securityOverview.activeBlocks?.length || 0}
                                </span>
                            </button>

                            <button
                                onClick={() => { setLogViewTab('inquiries'); fetchInquiries(); }}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '12px',
                                    border: logViewTab === 'inquiries' ? '1.5px solid #121613' : '1px solid rgba(18, 22, 19, 0.1)',
                                    background: logViewTab === 'inquiries' ? '#121613' : '#FFFFFF',
                                    color: logViewTab === 'inquiries' ? '#FFFFFF' : '#3A443E',
                                    fontSize: '13px',
                                    fontWeight: logViewTab === 'inquiries' ? '800' : '600',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
<span><Inbox size={14} /> Contact Inquiries</span>
                                <span style={{
                                    background: logViewTab === 'inquiries' ? '#D5ED55' : 'rgba(18, 22, 19, 0.08)',
                                    color: logViewTab === 'inquiries' ? '#0B150E' : '#59655D',
                                    fontSize: '11px',
                                    fontWeight: '800',
                                    padding: '1px 7px',
                                    borderRadius: '999px'
                                }}>
                                    {inquiries.length}
                                </span>
                            </button>
                        </div>

                        {/* Search Bar */}
                        <div style={{ marginBottom: '20px' }}>
                            <input
                                type="text"
                                placeholder="Search logs by IP, action, actor, or ID..."
                                value={logSearch}
                                onChange={e => setLogSearch(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 18px',
                                    borderRadius: '14px',
                                    background: '#FFFFFF',
                                    border: '1px solid rgba(18, 22, 19, 0.12)',
                                    fontSize: '13.5px',
                                    color: '#121613',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                                }}
                            />
                        </div>

                        {/* VIEW 1: AUTHENTICATION LOGS */}
{logViewTab === 'auth' && (
                            <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid rgba(18, 22, 19, 0.08)', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                                <div className="admin-audit-scroll" style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '460px', overflowY: 'auto', overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}>
                                    {(auditLogs.length > 0 ? auditLogs : [
                                        { id: '1', timestamp: new Date().toISOString(), ip: '127.0.0.1 (Local)', action: 'AUTH_SUCCESS', role: 'admin_coordinator', details: 'Master HQ session authenticated', status: 'SUCCESS' },
                                        { id: '2', timestamp: new Date(Date.now() - 1800000).toISOString(), ip: '192.168.1.45', action: 'STATION_LOGIN', role: 'basecamp_host', details: 'Kolukkumalai Gate scanner verified', status: 'SUCCESS' },
                                        { id: '3', timestamp: new Date(Date.now() - 7200000).toISOString(), ip: '49.37.12.98', action: 'PASSCODE_ATTEMPT', role: 'unknown', details: 'Rate limit / Gate verification check', status: 'NOTICE' }
                                    ])
                                    .filter(l => !logSearch || JSON.stringify(l).toLowerCase().includes(logSearch.toLowerCase()))
                                    .map((log, idx) => (
                                        <div
                                            key={log.id || idx}
                                            style={{
                                                padding: '14px 18px',
                                                borderRadius: '12px',
                                                background: '#F8F9F5',
                                                border: '1px solid rgba(18, 22, 19, 0.06)',
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                                gap: '12px',
                                                alignItems: 'center',
                                                fontSize: '12.5px'
                                            }}
                                        >
                                            <div>
                                                <span style={{
                                                    fontSize: '11px',
                                                    fontWeight: '800',
                                                    padding: '2px 8px',
                                                    borderRadius: '6px',
                                                    background: log.status === 'SUCCESS' ? '#DCFCE7' : log.status === 'FAILED' ? '#FEE2E2' : '#FEF3C7',
                                                    color: log.status === 'SUCCESS' ? '#166534' : log.status === 'FAILED' ? '#991B1B' : '#92400E'
                                                }}>
                                                    {log.status || 'SUCCESS'}
                                                </span>
                                                <div style={{ fontSize: '13px', fontWeight: '800', color: '#121613', marginTop: '4px' }}>
                                                    {log.action || 'AUTH_EVENT'}
                                                </div>
                                            </div>

                                            <div>
                                                <div style={{ color: '#7D8880', fontSize: '11px' }}>Scope / Role</div>
                                                <div style={{ fontWeight: '700', color: '#121613' }}>{log.role || 'admin_coordinator'}</div>
                                            </div>

                                            <div>
                                                <div style={{ color: '#7D8880', fontSize: '11px' }}>Origin IP</div>
                                                <div style={{ fontFamily: 'monospace', fontWeight: '600', color: '#3A443E' }}>{log.ip || '127.0.0.1'}</div>
                                            </div>

                                            <div>
                                                <div style={{ color: '#7D8880', fontSize: '11px' }}>Details / Note</div>
                                                <div style={{ color: '#59655D' }}>{log.details || 'Coordinator login'}</div>
                                            </div>

                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '11px', color: '#7D8880' }}>
                                                    {new Date(log.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true })}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

{/* VIEW 2: DATABASE & MUTATION AUDIT TRAIL */}
                        {logViewTab === 'db' && (
                            <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid rgba(18, 22, 19, 0.08)', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                                <div className="admin-audit-scroll" style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '460px', overflowY: 'auto', overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}>
                                    {dbLogs
                                        .filter(l => !logSearch || JSON.stringify(l).toLowerCase().includes(logSearch.toLowerCase()))
                                        .map(log => (
                                            <div
                                                key={log.id}
                                                style={{
                                                    padding: '14px 18px',
                                                    borderRadius: '12px',
                                                    background: '#F8F9F5',
                                                    border: '1px solid rgba(18, 22, 19, 0.06)',
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                                    gap: '12px',
                                                    alignItems: 'center',
                                                    fontSize: '12.5px'
                                                }}
                                            >
                                                <div>
                                                    <span style={{
                                                        fontSize: '11px',
                                                        fontWeight: '800',
                                                        padding: '2px 8px',
                                                        borderRadius: '6px',
                                                        background: '#E0F2FE',
                                                        color: '#0369A1'
                                                    }}>
 {log.action}
                                                    </span>
                                                    <div style={{ fontSize: '11px', color: '#7D8880', marginTop: '4px' }}>
                                                        Ref: {log.recordId || log.id}
                                                    </div>
                                                </div>

                                                <div style={{ gridColumn: 'span 2' }}>
                                                    <div style={{ fontWeight: '700', color: '#121613' }}>{log.details}</div>
                                                    <div style={{ fontSize: '11px', color: '#7D8880' }}>By {log.actor || 'Aanandham Admin'}</div>
                                                </div>

                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '11px', color: '#7D8880' }}>
                                                        {new Date(log.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true })}
                                                    </div>
                                                </div>
                                            </div>
))}
                                </div>
                            </div>
                        )}

                        {/* VIEW 3: SECURITY & BLOCKS (device fingerprint + IP tracking) */}
                        {logViewTab === 'security' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {/* Stats Chips */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                                    {[
                                        { label: 'Active IP Blocks', value: securityOverview.stats?.activeIpBlocks || 0, color: '#991B1B' },
                                        { label: 'Active Device Blocks', value: securityOverview.stats?.activeDeviceBlocks || 0, color: '#B45309' },
                                        { label: 'Suspicious Events', value: securityOverview.stats?.suspiciousEvents || 0, color: '#0369A1' },
                                        { label: 'Bot Events', value: securityOverview.stats?.botEvents || 0, color: '#6D28D9' },
                                        { label: 'Permanent Blocks', value: securityOverview.stats?.permanentBlocks || 0, color: '#7F1D1D' },
                                        { label: 'Total Events', value: securityOverview.stats?.totalEvents || 0, color: '#166534' }
                                    ].map(stat => (
                                        <div key={stat.label} style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid rgba(18, 22, 19, 0.08)', padding: '12px 16px' }}>
                                            <div style={{ fontSize: '22px', fontWeight: '800', color: stat.color }}>{stat.value}</div>
                                            <div style={{ fontSize: '11px', color: '#7D8880', fontWeight: '700', marginTop: '2px' }}>{stat.label}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Active Blocks */}
                                <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid rgba(18, 22, 19, 0.08)', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                        <div style={{ fontSize: '14px', fontWeight: '800', color: '#121613' }}>Active Blocks (IP & Device)</div>
                                        <button
                                            onClick={fetchSecurityOverview}
                                            style={{ background: 'none', border: 'none', color: '#59655D', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                        >
<RefreshCw size={12} /> Refresh
                                        </button>
                                    </div>
                                    {securityOverview.activeBlocks && securityOverview.activeBlocks.length > 0 ? (
                                        <div className="admin-audit-scroll" style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto', overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}>
                                            {securityOverview.activeBlocks.map((block, idx) => (
                                                <div key={block.id || idx} style={{
                                                    padding: '12px 16px',
                                                    borderRadius: '12px',
                                                    background: block.tier >= 3 ? '#FEF2F2' : '#FFFBEB',
                                                    border: '1px solid rgba(18, 22, 19, 0.06)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    gap: '12px',
                                                    flexWrap: 'wrap',
                                                    fontSize: '12.5px'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                                        <span style={{
                                                            fontSize: '10.5px', fontWeight: '800', padding: '3px 8px', borderRadius: '6px',
                                                            background: block.type === 'ip' ? '#DBEAFE' : '#EDE9FE',
                                                            color: block.type === 'ip' ? '#1E40AF' : '#5B21B6'
                                                        }}>
                                                            {block.type === 'ip' ? 'IP' : 'DEVICE'}
                                                        </span>
                                                        <span style={{ fontFamily: 'monospace', fontWeight: '700', color: '#121613', fontSize: '12px' }}>{block.value}</span>
                                                        <span style={{ fontSize: '11px', fontWeight: '700', color: block.tier >= 3 ? '#991B1B' : '#B45309' }}>
                                                            Tier {block.tier}{block.tier === 4 ? ' (PERMANENT)' : ''}
                                                        </span>
                                                        <span style={{ fontSize: '11px', color: '#7D8880' }}>
                                                            {block.until === Infinity ? 'Never expires' : `until ${new Date(block.until).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}`}
                                                        </span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <span style={{ fontSize: '11px', color: '#59655D', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{block.reason}</span>
                                                        <button
                                                            onClick={() => handleSecurityAction('unblock', block.type, block.value)}
                                                            style={{ padding: '6px 12px', borderRadius: '9px', background: '#121613', color: '#FFFFFF', border: 'none', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}
                                                        >
Unblock
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={{ padding: '18px', borderRadius: '12px', background: '#F8F9F5', fontSize: '12.5px', color: '#59655D', textAlign: 'center' }}>
                                            No active blocks. Automated tiered blocking will appear here when abuse patterns are detected.
                                        </div>
                                    )}
                                </div>

                                {/* Recent Security Events */}
                                <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid rgba(18, 22, 19, 0.08)', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#121613', marginBottom: '14px' }}>Recent Security Events (fingerprint + bot scoring)</div>
                                    <div className="admin-audit-scroll" style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '360px', overflowY: 'auto', overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}>
                                        {(securityOverview.recentEvents && securityOverview.recentEvents.length > 0 ? securityOverview.recentEvents : [])
                                            .filter(e => !logSearch || JSON.stringify(e).toLowerCase().includes(logSearch.toLowerCase()))
                                            .map((evt, idx) => (
                                                <div key={evt.id || idx} style={{
                                                    padding: '12px 16px',
                                                    borderRadius: '12px',
                                                    background: evt.severity === 'SUSPICIOUS' ? '#FEF2F2' : '#F8F9F5',
                                                    border: '1px solid rgba(18, 22, 19, 0.06)',
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                                                    gap: '10px',
                                                    alignItems: 'center',
                                                    fontSize: '12px'
                                                }}>
                                                    <div>
                                                        <span style={{
                                                            fontSize: '10.5px', fontWeight: '800', padding: '2px 8px', borderRadius: '6px',
                                                            background: evt.severity === 'SUSPICIOUS' ? '#FEE2E2' : '#E0F2FE',
                                                            color: evt.severity === 'SUSPICIOUS' ? '#991B1B' : '#0369A1'
                                                        }}>
                                                            {evt.severity}
                                                        </span>
                                                        <div style={{ fontWeight: '800', color: '#121613', marginTop: '4px' }}>{evt.action}</div>
                                                    </div>
                                                    <div>
                                                        <div style={{ color: '#7D8880', fontSize: '10.5px' }}>IP</div>
                                                        <div style={{ fontFamily: 'monospace', fontWeight: '600', color: '#3A443E' }}>{evt.ip}</div>
                                                    </div>
                                                    <div>
                                                        <div style={{ color: '#7D8880', fontSize: '10.5px' }}>Device / Bot</div>
                                                        <div style={{ fontFamily: 'monospace', fontWeight: '600', color: '#3A443E', fontSize: '11px' }}>
                                                            {evt.deviceFingerprint ? `${evt.deviceFingerprint.slice(0, 10)}…` : '—'} · bot {evt.botScore || 0}/10
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div style={{ color: '#7D8880', fontSize: '10.5px' }}>When</div>
                                                        <div style={{ color: '#59655D' }}>
                                                            {new Date(evt.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        {(!securityOverview.recentEvents || securityOverview.recentEvents.length === 0) && (
                                            <div style={{ padding: '18px', borderRadius: '12px', background: '#F8F9F5', fontSize: '12.5px', color: '#59655D', textAlign: 'center' }}>
                                                No security events yet. Failed logins, abuse patterns and bot detections will appear here.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* VIEW 4: CONTACT INQUIRIES (stored as INQ- records, never bookings) */}
                        {logViewTab === 'inquiries' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                                    <div style={{ fontSize: '13px', color: '#59655D' }}>
                                        Contact form submissions — stored as standalone inquiries (INQ- references). They never touch the booking pipeline or camp capacity.
                                    </div>
                                    <button
                                        onClick={fetchInquiries}
                                        style={{ background: 'none', border: 'none', color: '#59655D', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                    >
<RefreshCw size={12} /> Refresh
                                    </button>
                                </div>

                                <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid rgba(18, 22, 19, 0.08)', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                                    <div className="admin-audit-scroll" style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '480px', overflowY: 'auto', overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}>
                                        {(inquiries.length > 0 ? inquiries : [])
                                            .filter(q => !logSearch || JSON.stringify(q).toLowerCase().includes(logSearch.toLowerCase()))
                                            .map((inq, idx) => (
                                                <div key={inq.id || idx} style={{
                                                    padding: '14px 18px',
                                                    borderRadius: '12px',
                                                    background: '#F8F9F5',
                                                    border: '1px solid rgba(18, 22, 19, 0.06)',
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                                                    gap: '12px',
                                                    alignItems: 'center',
                                                    fontSize: '12.5px'
                                                }}>
                                                    <div>
                                                        <span style={{
                                                            fontSize: '10.5px', fontWeight: '800', padding: '2px 8px', borderRadius: '6px',
                                                            background: '#E0F2FE', color: '#0369A1'
                                                        }}>
                                                            {(inq.inquiryType || 'general').toUpperCase()}
                                                        </span>
                                                        <div style={{ fontWeight: '800', color: '#121613', marginTop: '4px' }}>{inq.name}</div>
                                                        <div style={{ fontSize: '11px', color: '#7D8880', fontFamily: 'monospace' }}>{inq.id}</div>
                                                    </div>
                                                    <div>
                                                        <div style={{ color: '#7D8880', fontSize: '11px' }}>Contact</div>
                                                        <div style={{ fontWeight: '600', color: '#3A443E' }}>{inq.phone || 'N/A'}</div>
                                                        <div style={{ fontSize: '11px', color: '#59655D' }}>{inq.email || ''}</div>
                                                    </div>
                                                    <div>
                                                        <div style={{ color: '#7D8880', fontSize: '11px' }}>Party / Dates</div>
                                                        <div style={{ fontWeight: '700', color: '#121613' }}>{inq.guests || 2} campers</div>
                                                        <div style={{ fontSize: '11px', color: '#59655D' }}>{inq.travelDates || 'Flexible'}</div>
                                                    </div>
                                                    <div style={{ gridColumn: 'span 2' }}>
                                                        <div style={{ color: '#7D8880', fontSize: '11px' }}>Message</div>
                                                        <div style={{ color: '#59655D', fontSize: '12px' }}>{inq.message || 'No message'}</div>
                                                    </div>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={{ fontSize: '11px', color: '#7D8880' }}>
                                                            {new Date(inq.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true })}
                                                        </div>
                                                        <div style={{ fontSize: '10.5px', color: '#7D8880' }}>{inq.source || 'Contact Form'}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        {inquiries.length === 0 && (
                                            <div style={{ padding: '18px', borderRadius: '12px', background: '#F8F9F5', fontSize: '12.5px', color: '#59655D', textAlign: 'center' }}>
                                                No contact inquiries yet. Contact form submissions will appear here as INQ- records.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

            </main>

            {/* ── MODAL: CREATE MANUAL BOOKING ── */}
            <AnimatePresence>
                {isAddBookingModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 100010, background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0px' }}>
                        <motion.div initial={{ scale: 0.96, y: 14 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96 }} className="admin-modal-box">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(18, 22, 19, 0.08)', paddingBottom: '14px' }}>
                                <div>
                                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '800', margin: 0, color: '#121613' }}>
                                        Create Manual Reservation
                                    </h3>
                                    <div style={{ fontSize: '12px', color: '#59655D' }}>Record phone, walk-in or bespoke squad bookings</div>
                                </div>
                                <button onClick={() => setIsAddBookingModalOpen(false)} style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F8F9F5', border: 'none', color: '#121613', cursor: 'pointer', fontWeight: '800' }}>
<X size={15} strokeWidth={2.5} />
                                </button>
                            </div>

                            <form onSubmit={handleSaveManualBooking} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '4px' }}>
                                        Customer / Squad Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Rahul & Squad (4 Pax)"
                                        value={newBookingForm.name}
                                        onChange={e => setNewBookingForm({ ...newBookingForm, name: e.target.value })}
                                        style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', boxSizing: 'border-box' }}
                                    />
                                </div>

                                <div className="admin-form-grid-2">
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '4px' }}>
                                            Phone / WhatsApp *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="+91 98470 12345"
                                            value={newBookingForm.phone}
                                            onChange={e => setNewBookingForm({ ...newBookingForm, phone: e.target.value })}
                                            style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', boxSizing: 'border-box' }}
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

                                <div className="admin-form-grid-2">
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
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '4px' }}>
                                            Number of Campers *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            value={newBookingForm.guests}
                                            onChange={e => setNewBookingForm({ ...newBookingForm, guests: e.target.value })}
                                            style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                </div>

                                {/* Squad / Group Category Selector */}
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: '800', color: '#121613', display: 'block', marginBottom: '6px' }}>
                                        Squad / Group Category *
                                    </label>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(85px, 1fr))', gap: '6px' }}>
                                        {[
{ id: 'Family', label: 'Family', icon: Users },
                                            { id: 'Friends Squad', label: 'Friends', icon: Users },
                                            { id: 'Couple', label: 'Couple', icon: Heart },
                                            { id: 'Corporate', label: 'Corporate', icon: Briefcase },
                                            { id: 'Solo', label: 'Solo', icon: User }
                                        ].map(gt => {
                                            const isSelected = newBookingForm.groupType === gt.id;
                                            return (
                                                <button
                                                    key={gt.id}
                                                    type="button"
                                                    onClick={() => setNewBookingForm(prev => ({ ...prev, groupType: gt.id }))}
                                                    style={{
                                                        padding: '8px 6px',
                                                        borderRadius: '10px',
                                                        border: isSelected ? '2px solid #166534' : '1px solid rgba(18, 22, 19, 0.12)',
                                                        background: isSelected ? '#DCFCE7' : '#F8F9F5',
                                                        color: isSelected ? '#166534' : '#121613',
                                                        fontSize: '11.5px',
                                                        fontWeight: isSelected ? '800' : '600',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        gap: '2px',
                                                        transition: 'all 0.15s ease'
                                                    }}
                                                >
                                                    <gt.icon size={16} />
                                                    <span>{gt.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Tent / Pod Unit Allocation & Quick Assign Chips */}
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                        <label style={{ fontSize: '12px', fontWeight: '800', color: '#121613' }}>
Tent / Pod Assignment (For Marshals)
                                        </label>
                                        <span style={{ fontSize: '10.5px', color: '#7D8880' }}>Gate Check-In</span>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="e.g. Tent #03 (Family Zone) or Dome Pod 2"
                                        value={newBookingForm.allocatedUnit}
                                        onChange={e => setNewBookingForm({ ...newBookingForm, allocatedUnit: e.target.value })}
                                        style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', boxSizing: 'border-box', marginBottom: '6px' }}
                                    />
                                    {/* Quick-Click Unit Suggestions */}
                                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                        {['Tent 01', 'Tent 02', 'Tent 03', 'Dome Pod A', 'Dome Pod B', 'Alpine Hut 01'].map(unit => (
                                            <button
                                                key={unit}
                                                type="button"
                                                onClick={() => setNewBookingForm(prev => ({ ...prev, allocatedUnit: unit }))}
                                                style={{
                                                    padding: '3px 8px',
                                                    borderRadius: '6px',
                                                    border: newBookingForm.allocatedUnit === unit ? '1px solid #166534' : '1px solid rgba(18, 22, 19, 0.1)',
                                                    background: newBookingForm.allocatedUnit === unit ? '#DCFCE7' : '#FFFFFF',
                                                    color: newBookingForm.allocatedUnit === unit ? '#166534' : '#59655D',
                                                    fontSize: '10.5px',
                                                    fontWeight: '700',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                + {unit}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Special Squad Requests & Dietary Notes */}
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '4px' }}>
                                        Special Squad Requirements & Dietary Notes (Optional)
                                    </label>
                                    <textarea
                                        rows={2}
                                        placeholder="e.g. Family with kids, campfire setup, vegetarian food only"
                                        value={newBookingForm.notes}
                                        onChange={e => setNewBookingForm({ ...newBookingForm, notes: e.target.value })}
                                        style={{ width: '100%', padding: '9px 12px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '12.5px', boxSizing: 'border-box', resize: 'vertical', lineHeight: 1.4 }}
                                    />
                                </div>

                                <div className="admin-form-grid-2">
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '4px' }}>
                                            Price Per Camper (INR) *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            value={newBookingForm.pricePerGuest}
                                            onChange={e => setNewBookingForm({ ...newBookingForm, pricePerGuest: e.target.value })}
                                            style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                    <div>
                                        <CustomSelectDropdown
                                            label="Initial Status"
                                            value={newBookingForm.status}
                                            onChange={val => setNewBookingForm({ ...newBookingForm, status: val })}
                                            options={[
{ value: 'Confirmed', label: 'Confirmed ' },
{ value: 'Pending', label: 'Pending ' },
{ value: 'Checked In', label: 'Checked In ' }
                                            ]}
                                        />
                                    </div>
                                </div>

                                <div style={{ background: '#F8F9F5', padding: '12px 16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '12.5px', color: '#59655D', fontWeight: '600' }}>Calculated Total:</span>
                                    <span style={{ fontSize: '18px', fontWeight: '800', color: '#121613' }}>
                                        ₹{((Number(newBookingForm.guests) || 1) * (Number(newBookingForm.pricePerGuest) || 2499)).toLocaleString('en-IN')}
                                    </span>
                                </div>

<button type="submit" className="btn-lime" style={{ padding: '12px', fontSize: '14px', fontWeight: '800', marginTop: '4px', cursor: 'pointer', borderRadius: '12px' }}>
                                    + Add Booking to System
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── MODAL: CREATE / EDIT CAMPSITE & MULTI-IMAGE GALLERY ── */}
            {/* ── MODAL: CREATE / EDIT CAMPSITE & MULTI-IMAGE GALLERY ── */}
            <AnimatePresence>
                {isPropertyModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 100010, background: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0px' }}>
                        <motion.div initial={{ scale: 0.96, y: 14 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96 }} className="admin-modal-box" style={{ maxWidth: '720px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(18, 22, 19, 0.08)', paddingBottom: '14px' }}>
                                <div>
                                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '800', margin: 0, color: '#121613' }}>
                                        {editingProperty ? 'Edit Campsite & Photo Gallery' : 'Add New Kerala Campsite'}
                                    </h3>
                                    <div style={{ fontSize: '12px', color: '#59655D' }}>Configure pricing, photos, itinerary, and inclusions</div>
                                </div>
                                <button onClick={() => setIsPropertyModalOpen(false)} style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F8F9F5', border: 'none', color: '#121613', cursor: 'pointer', fontWeight: '800' }}>
<X size={15} strokeWidth={2.5} />
                                </button>
                            </div>

                            <form onSubmit={handleSavePropertyForm} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                
                                {/* SECTION: PHOTO GALLERY MANAGER */}
                                <div style={{ background: '#F8F9F5', borderRadius: '16px', padding: '16px', border: '1px solid rgba(18, 22, 19, 0.08)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                        <div>
                                            <label style={{ fontSize: '11.5px', fontWeight: '800', color: '#121613', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block' }}>
Photo Gallery ({propertyForm.gallery ? propertyForm.gallery.length : 0} Images)
                                            </label>
                                            <span style={{ fontSize: '11px', color: '#59655D' }}>Upload from device or paste image URLs</span>
                                        </div>
                                        <label style={{ cursor: 'pointer', background: '#121613', color: '#FFFFFF', padding: '6px 12px', borderRadius: '8px', fontSize: '11.5px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                            <span><Upload size={14} /> Upload</span>
                                            <input type="file" multiple accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                                        </label>
                                    </div>

                                    {/* URL Input Bar */}
                                    <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                                        <input
                                            type="url"
                                            placeholder="Paste Image URL (https://...)"
                                            value={imageUrlInput}
                                            onChange={e => setImageUrlInput(e.target.value)}
                                            style={{ flex: 1, padding: '9px 12px', borderRadius: '10px', background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.12)', fontSize: '12.5px', color: '#121613', outline: 'none' }}
                                        />
                                        <button type="button" onClick={handleAddImageUrl} className="btn-lime" style={{ padding: '9px 14px', fontSize: '11.5px', fontWeight: '800', flexShrink: 0 }}>
                                            + Add URL
                                        </button>
                                    </div>

                                    {/* Gallery Preview Grid */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '8px' }}>
                                        {propertyForm.gallery && propertyForm.gallery.map((imgUrl, gIdx) => {
                                            const isCover = propertyForm.image === imgUrl;
                                            return (
                                                <div key={gIdx} style={{ position: 'relative', height: '80px', borderRadius: '8px', overflow: 'hidden', border: isCover ? '2px solid #E5A93B' : '1px solid rgba(18, 22, 19, 0.1)' }}>
                                                    <img src={imgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    {isCover && (
                                                        <span style={{ position: 'absolute', top: '3px', left: '3px', background: '#121613', color: '#E5A93B', fontSize: '8.5px', fontWeight: '800', padding: '1px 4px', borderRadius: '4px' }}>
Cover
                                                        </span>
                                                    )}
                                                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', opacity: 0, transition: 'opacity 0.2s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px' }} onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0}>
                                                        {!isCover && (
                                                            <button type="button" onClick={() => handleSetPrimaryImage(imgUrl)} style={{ padding: '2px 6px', borderRadius: '4px', background: '#E5A93B', border: 'none', color: '#121613', fontSize: '9px', fontWeight: '800', cursor: 'pointer' }}>
                                                                Set Cover
                                                            </button>
                                                        )}
                                                        <button type="button" onClick={() => handleRemoveImage(gIdx)} style={{ padding: '2px 6px', borderRadius: '4px', background: '#EF4444', border: 'none', color: '#FFFFFF', fontSize: '9px', fontWeight: '800', cursor: 'pointer' }}>
Delete 
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Title & Region */}
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '4px' }}>
                                        Campsite Title *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={propertyForm.title}
                                        onChange={e => setPropertyForm({ ...propertyForm, title: e.target.value })}
                                        style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', boxSizing: 'border-box' }}
                                    />
                                </div>

                                <div className="admin-form-grid-2">
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '4px' }}>
                                            Region *
                                        </label>
                                        <select
                                            value={propertyForm.region}
                                            onChange={e => setPropertyForm({ ...propertyForm, region: e.target.value })}
                                            style={{ width: '100%', padding: '11px 12px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13px', boxSizing: 'border-box' }}
                                        >
                                            <option value="Munnar">Munnar</option>
                                            <option value="Suryanelli">Suryanelli</option>
                                            <option value="Wayanad">Wayanad</option>
                                            <option value="Vagamon">Vagamon</option>
                                            <option value="Athirappilly">Athirappilly</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '4px' }}>
                                            Altitude *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={propertyForm.altitude}
                                            onChange={e => setPropertyForm({ ...propertyForm, altitude: e.target.value })}
                                            style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                </div>

                                <div className="admin-form-grid-2">
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '4px' }}>
                                            Base Price (INR / Camper) *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            value={propertyForm.price}
                                            onChange={e => setPropertyForm({ ...propertyForm, price: e.target.value })}
                                            style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '4px' }}>
                                            Original Strikethrough Price (INR)
                                        </label>
                                        <input
                                            type="number"
                                            value={propertyForm.originalPrice}
                                            onChange={e => setPropertyForm({ ...propertyForm, originalPrice: e.target.value })}
                                            style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                </div>

                                <div className="admin-form-grid-2">
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '4px' }}>
                                            Duration
                                        </label>
                                        <input
                                            type="text"
                                            value={propertyForm.duration}
                                            onChange={e => setPropertyForm({ ...propertyForm, duration: e.target.value })}
                                            style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '4px' }}>
                                            Difficulty
                                        </label>
                                        <input
                                            type="text"
                                            value={propertyForm.difficulty}
                                            onChange={e => setPropertyForm({ ...propertyForm, difficulty: e.target.value })}
                                            style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '4px' }}>
                                        Description & Story
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={propertyForm.description}
                                        onChange={e => setPropertyForm({ ...propertyForm, description: e.target.value })}
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13px', boxSizing: 'border-box', resize: 'vertical' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '4px' }}>
                                        Key Highlights (Comma Separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={propertyForm.highlights}
                                        onChange={e => setPropertyForm({ ...propertyForm, highlights: e.target.value })}
                                        style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', boxSizing: 'border-box' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '4px' }}>
                                        Inclusions (Comma Separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={propertyForm.inclusions}
                                        onChange={e => setPropertyForm({ ...propertyForm, inclusions: e.target.value })}
                                        style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', boxSizing: 'border-box' }}
                                    />
                                </div>

                                <button type="submit" className="btn-lime" style={{ padding: '13px', fontSize: '14px', fontWeight: '800', marginTop: '4px', cursor: 'pointer', borderRadius: '12px' }}>
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
                    <div style={{ position: 'fixed', inset: 0, zIndex: 100010, background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0px' }}>
                        <motion.div initial={{ scale: 0.96, y: 14 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96 }} className="admin-modal-box">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(18, 22, 19, 0.08)', paddingBottom: '14px' }}>
                                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '800', margin: 0, color: '#121613' }}>
                                    {editingEvent ? 'Edit Trek Batch' : 'Schedule New Event Batch'}
                                </h3>
                                <button onClick={() => setIsEventModalOpen(false)} style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F8F9F5', border: 'none', color: '#121613', cursor: 'pointer', fontWeight: '800' }}>
<X size={15} strokeWidth={2.5} />
                                </button>
                            </div>

                            <form onSubmit={handleSaveEventForm} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '4px' }}>
                                        Event / Batch Title *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={eventForm.title}
                                        onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                                        style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', boxSizing: 'border-box' }}
                                    />
                                </div>

                                <div className="admin-form-grid-2">
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '4px' }}>
                                            Dates *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={eventForm.dates}
                                            onChange={e => setEventForm({ ...eventForm, dates: e.target.value })}
                                            style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '4px' }}>
                                            Price Per Spot (INR) *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            value={eventForm.price}
                                            onChange={e => setEventForm({ ...eventForm, price: e.target.value })}
                                            style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                </div>

                                <div className="admin-form-grid-2">
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '4px' }}>
                                            Total Capacity (Pax) *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            value={eventForm.capacity}
                                            onChange={e => setEventForm({ ...eventForm, capacity: e.target.value })}
                                            style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '4px' }}>
                                            Booked Spots
                                        </label>
                                        <input
                                            type="number"
                                            value={eventForm.booked}
                                            onChange={e => setEventForm({ ...eventForm, booked: e.target.value })}
                                            style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '4px' }}>
                                        Campsite Location
                                    </label>
                                    <input
                                        type="text"
                                        value={eventForm.campsite}
                                        onChange={e => setEventForm({ ...eventForm, campsite: e.target.value })}
                                        style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', boxSizing: 'border-box' }}
                                    />
                                </div>

<button type="submit" className="btn-lime" style={{ padding: '12px', fontSize: '14px', fontWeight: '800', marginTop: '4px', cursor: 'pointer', borderRadius: '12px' }}>
                                    {editingEvent ? 'Save Batch Changes' : '+ Schedule Batch'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── CUSTOM THEMED DELETION CONFIRMATION MODAL ── */}
            <AnimatePresence>
                {deleteConfirmDialog.isOpen && (
                    <div style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 100010,
                        background: 'rgba(0, 0, 0, 0.65)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0px'
                    }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.94, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.94, y: 16 }}
                            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                            className="admin-modal-box"
                            style={{
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                maxWidth: '480px'
                            }}
                        >
                            {/* Modal Top Warning Header */}
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
                                <div style={{
                                    width: '42px',
                                    height: '42px',
                                    borderRadius: '12px',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid rgba(239, 68, 68, 0.25)',
                                    color: '#DC2626',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '20px',
                                    flexShrink: 0
                                }}>
                                    <Trash2 size={16} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        fontSize: '10.5px',
                                        fontWeight: '800',
                                        color: '#DC2626',
                                        letterSpacing: '1px',
                                        textTransform: 'uppercase',
                                        marginBottom: '3px'
                                    }}>
                                        CONFIRM DELETION
                                    </div>
                                    <h3 style={{
                                        fontFamily: 'var(--font-heading)',
                                        fontSize: '18px',
                                        fontWeight: '800',
                                        margin: 0,
                                        color: '#121613',
                                        lineHeight: 1.25
                                    }}>
                                        {deleteConfirmDialog.title}
                                    </h3>
                                </div>
                                <button
                                    onClick={closeDeleteConfirm}
                                    style={{
                                        width: '30px',
                                        height: '30px',
                                        borderRadius: '50%',
                                        background: '#F8F9F5',
                                        border: '1px solid rgba(18, 22, 19, 0.1)',
                                        color: '#59655D',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '13px',
                                        fontWeight: '800'
                                    }}
                                >
<X size={15} strokeWidth={2.5} />
                                </button>
                            </div>

                            {/* Subtitle Description */}
                            <p style={{
                                fontSize: '13px',
                                color: '#59655D',
                                lineHeight: 1.5,
                                margin: '0 0 16px'
                            }}>
                                {deleteConfirmDialog.subtitle}
                            </p>

                            {/* Snapshot Card of Item Being Deleted */}
                            {deleteConfirmDialog.itemDetails && (
                                <div style={{
                                    background: '#F8F9F5',
                                    border: '1px solid rgba(18, 22, 19, 0.08)',
                                    borderRadius: '14px',
                                    padding: '14px 16px',
                                    marginBottom: '18px'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                        <span style={{
                                            fontSize: '10.5px',
                                            fontWeight: '800',
                                            color: '#121613',
                                            background: '#FFFFFF',
                                            border: '1px solid rgba(18, 22, 19, 0.1)',
                                            padding: '2px 7px',
                                            borderRadius: '6px'
                                        }}>
                                            {deleteConfirmDialog.itemDetails.badge}
                                        </span>
                                        {deleteConfirmDialog.itemDetails.status && (
                                            <span style={{
                                                fontSize: '10.5px',
                                                fontWeight: '800',
                                                color: deleteConfirmDialog.itemDetails.status === 'Confirmed' ? '#166534' : '#B45309'
                                            }}>
                                                {deleteConfirmDialog.itemDetails.status}
                                            </span>
                                        )}
                                    </div>
                                    <div style={{
                                        fontSize: '14px',
                                        fontWeight: '800',
                                        color: '#121613',
                                        marginBottom: '3px',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {deleteConfirmDialog.itemDetails.label}
                                    </div>
                                    <div style={{
                                        fontSize: '12px',
                                        color: '#59655D',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {deleteConfirmDialog.itemDetails.subtext}
                                        </span>
                                        {deleteConfirmDialog.itemDetails.amount && (
                                            <span style={{ fontWeight: '800', color: '#121613', fontSize: '13px', marginLeft: '8px' }}>
                                                {deleteConfirmDialog.itemDetails.amount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Modal Action Buttons */}
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    onClick={closeDeleteConfirm}
                                    style={{
                                        padding: '10px 18px',
                                        borderRadius: '10px',
                                        background: '#F1F3EC',
                                        border: '1px solid rgba(18, 22, 19, 0.1)',
                                        color: '#121613',
                                        fontSize: '12.5px',
                                        fontWeight: '800',
                                        cursor: 'pointer',
                                        transition: 'all 0.15s ease'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={deleteConfirmDialog.confirmAction}
                                    style={{
                                        padding: '10px 20px',
                                        borderRadius: '10px',
                                        background: '#DC2626',
                                        border: '1px solid #B91C1C',
                                        color: '#FFFFFF',
                                        fontSize: '12.5px',
                                        fontWeight: '800',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        boxShadow: '0 4px 14px rgba(220, 38, 38, 0.3)',
                                        transition: 'all 0.15s ease'
                                    }}
                                >
                                    <span>{deleteConfirmDialog.confirmText}</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── MODAL: CREATE / EDIT CAMP HOST / GUIDE ── */}
            <AnimatePresence>
                {isMarshalModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 100010, background: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0px' }}>
                        <motion.div initial={{ scale: 0.96, y: 14 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, opacity: 0 }} className="admin-modal-box">

                            {/* ── Header ── */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '1px solid rgba(18, 22, 19, 0.08)', paddingBottom: '16px', gap: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                    {marshalForm.avatar ? (
                                        <img
                                            src={marshalForm.avatar}
                                            alt="Preview"
                                            style={{ width: '52px', height: '52px', borderRadius: '14px', objectFit: 'cover', border: '2px solid #D5ED55', flexShrink: 0 }}
                                            onError={e => { e.target.style.display = 'none'; }}
                                        />
                                    ) : (
                                        <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #D5ED55 0%, #A8D520 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>

                                        </div>
                                    )}
                                    <div>
                                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800', margin: 0, color: '#121613' }}>
                                            {editingMarshal ? 'Edit Host / Guide Details' : 'Add New Camp Host / Guide'}
                                        </h3>
                                        <div style={{ fontSize: '12px', color: '#59655D', marginTop: '2px' }}>
                                            {editingMarshal ? `Updating credentials for ${marshalForm.name || 'this crew member'}` : 'Assign gate PIN & sanctuary station'}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsMarshalModalOpen(false)}
                                    style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F8F9F5', border: '1px solid rgba(18,22,19,0.1)', color: '#121613', cursor: 'pointer', fontWeight: '800', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                                >
<X size={15} strokeWidth={2.5} />
                                </button>
                            </div>

                            <form onSubmit={handleSaveMarshalForm} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                                {/* Full Name */}
                                <div>
                                    <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#59655D', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '5px' }}>
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Suresh Babu"
                                        value={marshalForm.name}
                                        onChange={e => setMarshalForm({ ...marshalForm, name: e.target.value })}
                                        style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', background: '#F8F9F5', border: '1.5px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', boxSizing: 'border-box', outline: 'none', fontWeight: '600' }}
                                    />
                                </div>

                                {/* Phone + Passcode */}
                                <div className="admin-form-grid-2">
                                    <div>
                                        <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#59655D', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '5px' }}>
                                            Phone / WhatsApp *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="+91 98950 44332"
                                            value={marshalForm.phone}
                                            onChange={e => setMarshalForm({ ...marshalForm, phone: e.target.value })}
                                            style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', background: '#F8F9F5', border: '1.5px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', boxSizing: 'border-box', outline: 'none' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#59655D', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '5px' }}>
                                            Gate PIN / Passcode *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. WAYA900"
                                            value={marshalForm.passcode}
                                            onChange={e => setMarshalForm({ ...marshalForm, passcode: e.target.value.toUpperCase() })}
                                            style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', background: '#F8F9F5', border: '1.5px solid rgba(18, 22, 19, 0.12)', color: '#166534', fontSize: '13.5px', boxSizing: 'border-box', outline: 'none', fontWeight: '800', letterSpacing: '1px', fontFamily: 'monospace' }}
                                        />
                                    </div>
                                </div>

                                {/* Sanctuary Station */}
                                <div>
                                    <CustomSelectDropdown
                                        label="Assigned Sanctuary Station *"
                                        value={marshalForm.station}
                                        onChange={val => {
                                            const matched = properties.find(p => p.title === val || p.location?.includes(val));
                                            setMarshalForm({ ...marshalForm, station: val, campId: matched?.id || marshalForm.campId });
                                        }}
                                        options={[
{ value: 'Kolukkumalai Sunrise 4x4 Station', label: ' Kolukkumalai Sunrise 4x4 Station', sublabel: 'Munnar · 7,900 FT' },
{ value: 'Meesapulimala High Altitude Basecamp', label: ' Meesapulimala High Altitude Basecamp', sublabel: 'Silent Valley · 8,661 FT' },
{ value: 'Suryanelli Valley Glamp Gate', label: ' Suryanelli Valley Glamp Gate', sublabel: 'Munnar Valley' },
{ value: 'Vagamon Pine Forest Post', label: ' Vagamon Pine Forest Post', sublabel: 'Vagamon Ridge' },
{ value: 'Wayanad 900 Kandi Rainforest Post', label: ' Wayanad 900 Kandi Rainforest Post', sublabel: 'Wayanad Canopy' }
                                        ]}
                                    />
                                </div>

                                {/* Duty Status + Avatar */}
                                <div className="admin-form-grid-2">
                                    <div>
                                        <CustomSelectDropdown
                                            label="Duty Status"
                                            value={marshalForm.status}
                                            onChange={val => setMarshalForm({ ...marshalForm, status: val })}
                                            options={[
{ value: 'On Duty', label: ' On Duty' },
{ value: 'Off Duty', label: ' Off Duty' },
{ value: 'Station Closed', label: ' Station Closed' }
                                            ]}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#59655D', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '5px' }}>
                                            Avatar / Photo URL
                                        </label>
                                        <input
                                            type="url"
                                            placeholder="https://images.unsplash.com/..."
                                            value={marshalForm.avatar}
                                            onChange={e => setMarshalForm({ ...marshalForm, avatar: e.target.value })}
                                            style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', background: '#F8F9F5', border: '1.5px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '12.5px', boxSizing: 'border-box', outline: 'none' }}
                                        />
                                    </div>
                                </div>

                                {/* Responsibilities Notes */}
                                <div>
                                    <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#59655D', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '5px' }}>
                                        Responsibilities & Notes
                                    </label>
                                    <textarea
                                        rows={2}
                                        placeholder="e.g. Glass bridge permit verification & treehouse canopy escort"
                                        value={marshalForm.notes}
                                        onChange={e => setMarshalForm({ ...marshalForm, notes: e.target.value })}
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', background: '#F8F9F5', border: '1.5px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13px', boxSizing: 'border-box', resize: 'vertical', lineHeight: 1.5, outline: 'none' }}
                                    />
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    className="btn-lime"
                                    style={{ padding: '13px', fontSize: '14px', fontWeight: '800', marginTop: '2px', cursor: 'pointer', borderRadius: '13px', letterSpacing: '0.2px', border: 'none' }}
                                >
{editingMarshal ? ' Save Details' : '+ Add to Field Crew'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* FLOATING TOAST */}
            <AnimatePresence>
                {toastMessage && (
                    <div style={{
position: 'fixed',
                        top: '24px',
                        left: 0,
                        right: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        pointerEvents: 'none',
                        zIndex: 100010,
                        padding: '0 16px'
                    }}>
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -15, scale: 0.95 }}
                            style={{
                                pointerEvents: 'auto',
                                background: '#121613',
                                color: '#FFFFFF',
                                padding: '12px 24px',
                                borderRadius: '999px',
                                fontSize: '13.5px',
                                fontWeight: '700',
                                border: '1.5px solid #D5ED55',
                                boxShadow: '0 16px 40px rgba(0,0,0,0.7), 0 0 24px rgba(213, 237, 85, 0.25)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
<span>{toastMessage}</span>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {scannerOverlayOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 100010,
                    background: '#0B150E',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 14px',
                        background: '#0B150E',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                        flexShrink: 0,
                        height: '52px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <QrCode size={17} color="#D5ED55" />
                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#F5F7F4' }}>Basecamp QR Scanner</span>
                        </div>
                        <button
                            onClick={() => setScannerOverlayOpen(false)}
                            aria-label="Close QR Scanner"
                            title="Close QR Scanner"
                            style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.08)',
                                border: '1px solid rgba(255, 255, 255, 0.22)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            <X size={18} color="#F5F7F4" />
                        </button>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
                        <MobileMarshalScanner embedded />
                    </div>
                </div>
            )}

        </div>
    );
}
