"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import jsQR from 'jsqr';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Camera, 
    Flashlight, 
    RefreshCw, 
    Upload, 
    Search, 
    CheckCircle2, 
    AlertCircle, 
    Clock, 
    UserCheck, 
    UserX, 
    Users, 
    Phone, 
    MessageCircle, 
    DollarSign, 
    Utensils, 
    Tent, 
    MapPin, 
    ArrowLeft, 
    Volume2, 
    VolumeX,
    X,
    QrCode,
    Sparkles,
    ShieldCheck,
    Power,
    SlidersHorizontal,
    ChevronRight,
    TrendingUp,
    ListFilter,
    Send,
    Mail,
    Flame,
    Compass,
    Ticket,
    CheckSquare,
    Square,
    UserPlus,
    UserMinus,
    Tag,
    Layers,
    History,
    Check,
    FileText,
    ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export default function MobileMarshalScanner({ onBackToAdmin = null }) {
    // ── NAVIGATION TABS: 'scanner' | 'roster' | 'kitchen' ──
    const [activeTab, setActiveTab] = useState('scanner');

    // ── CAMERA & SCANNER STATE ──
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const animFrameRef = useRef(null);

    const [isCameraEnabled, setIsCameraEnabled] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [facingMode, setFacingMode] = useState('environment');
    const [torchOn, setTorchOn] = useState(false);
    const [hasTorchSupport, setHasTorchSupport] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [manualIdInput, setManualIdInput] = useState('');
    const [isSearchingManual, setIsSearchingManual] = useState(false);
    const [isManualModalOpen, setIsManualModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // ── SIMULATION / TEST PASS MODAL STATE ──
    const [isTestEmailModalOpen, setIsTestEmailModalOpen] = useState(false);
    const [testEmailInput, setTestEmailInput] = useState('aman.tshekar@gmail.com');
    const [testNameInput, setTestNameInput] = useState('Aman Shekar');
    const [testGuestsCount, setTestGuestsCount] = useState(4);
    const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
    const [isSeedingDemo, setIsSeedingDemo] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // ── ROSTER & STATS ──
    const [rosterList, setRosterList] = useState([]);
    const [stats, setStats] = useState({
        totalExpectedCampers: 0,
        totalCheckedInCampers: 0,
        totalPendingCampers: 0,
        totalShortCampers: 0,
        vegMealsCount: 0,
        nonVegMealsCount: 0,
        totalBalanceDue: 0,
        totalBalanceCollected: 0
    });
    const [isLoadingRoster, setIsLoadingRoster] = useState(false);
    const [rosterSearchQuery, setRosterSearchQuery] = useState('');
    const [rosterFilterStatus, setRosterFilterStatus] = useState('all');

    // ── CURRENT SCANNED / SELECTED BOOKING ──
    const [scannedBooking, setScannedBooking] = useState(null);
    const [isValidating, setIsValidating] = useState(false);
    const [rosterChecklist, setRosterChecklist] = useState([]);
    const [isBalancePaid, setIsBalancePaid] = useState(false);
    const [assignedTent, setAssignedTent] = useState('');
    const [wristbandRange, setWristbandRange] = useState('');
    const [marshalNotes, setMarshalNotes] = useState('');
    const [isSubmittingCheckin, setIsSubmittingCheckin] = useState(false);
    const [checkinSuccessMessage, setCheckinSuccessMessage] = useState('');
    const [extraGuestsCount, setExtraGuestsCount] = useState(0);

    // ── TOAST NOTIFICATION HELPER ──
    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 4000);
    };

    // ── AUDIO CHIME FEEDBACK ──
    const playSuccessChime = useCallback(() => {
        if (!soundEnabled) return;
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const now = ctx.currentTime;
            
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(783.99, now);
            gain1.gain.setValueAtTime(0.3, now);
            gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            osc1.start(now);
            osc1.stop(now + 0.15);

            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(1046.50, now + 0.12);
            gain2.gain.setValueAtTime(0.4, now + 0.12);
            gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.start(now + 0.12);
            osc2.stop(now + 0.35);

            if (navigator.vibrate) {
                navigator.vibrate([80, 40, 100]);
            }
        } catch (e) {
            console.log('Audio feedback not supported:', e);
        }
    }, [soundEnabled]);

    // ── FETCH ROSTER & HEADCOUNT DATA ──
    const fetchRosterData = useCallback(async () => {
        setIsLoadingRoster(true);
        try {
            const res = await fetch('/api/marshal/roster');
            const data = await res.json();
            if (data.success) {
                setRosterList(data.roster || []);
                setStats(data.stats || {});
            }
        } catch (e) {
            console.error('Failed to fetch roster:', e);
        } finally {
            setIsLoadingRoster(false);
        }
    }, []);

    useEffect(() => {
        fetchRosterData();
    }, [fetchRosterData]);

    // ── CAMERA CONTROLS ──
    const stopCamera = useCallback(() => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        if (animFrameRef.current) {
            cancelAnimationFrame(animFrameRef.current);
        }
        setTorchOn(false);
    }, []);

    const startCamera = useCallback(async () => {
        if (typeof window === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setHasCameraPermission(false);
            setErrorMessage('Camera not supported. Use gallery upload or manual search.');
            return;
        }

        try {
            stopCamera();

            const constraints = {
                video: {
                    facingMode: { ideal: facingMode },
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.setAttribute('playsinline', 'true');
                await videoRef.current.play();
                setHasCameraPermission(true);
                setIsCameraEnabled(true);
                setErrorMessage('');

                const track = stream.getVideoTracks()[0];
                const capabilities = track.getCapabilities ? track.getCapabilities() : {};
                setHasTorchSupport(Boolean(capabilities.torch));
            }
        } catch (err) {
            setHasCameraPermission(false);
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                setErrorMessage('Camera permission blocked. Tap "Enable Camera" or allow in browser settings.');
            } else {
                setErrorMessage('Could not initialize camera. You can upload an image or type the Booking ID.');
            }
        }
    }, [facingMode, stopCamera]);

    const toggleCameraPower = () => {
        if (isCameraEnabled) {
            stopCamera();
            setIsCameraEnabled(false);
        } else {
            startCamera();
        }
    };

    const toggleTorch = async () => {
        if (!videoRef.current || !videoRef.current.srcObject) return;
        const track = videoRef.current.srcObject.getVideoTracks()[0];
        if (track && track.applyConstraints) {
            try {
                await track.applyConstraints({
                    advanced: [{ torch: !torchOn }]
                });
                setTorchOn(!torchOn);
            } catch (e) {
                console.warn('Could not toggle torch:', e);
            }
        }
    };

    // ── VERIFY SCANNED PASS ──
    const handleScannedResult = useCallback(async (rawQrData) => {
        if (!rawQrData || isValidating) return;

        setIsValidating(true);
        setErrorMessage('');
        setCheckinSuccessMessage('');

        playSuccessChime();

        try {
            const res = await fetch('/api/marshal/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ qrData: rawQrData })
            });

            const data = await res.json();

            if (data.success && data.booking) {
                setScannedBooking(data.booking);
                setRosterChecklist(data.booking.roster || []);
                setIsBalancePaid(Boolean(data.booking.isBalancePaid));
                setMarshalNotes(data.booking.marshalNotes || '');
                setAssignedTent(data.booking.assignedTent || '');
                setWristbandRange(data.booking.wristbandRange || '');
                setExtraGuestsCount(0);
                stopCamera();
                setIsCameraEnabled(false);
            } else {
                setErrorMessage(data.message || 'Scanned QR is invalid or not in reservations database.');
                setScannedBooking(null);
            }
        } catch (err) {
            setErrorMessage('Network error validating pass.');
        } finally {
            setIsValidating(false);
        }
    }, [isValidating, playSuccessChime, stopCamera]);

    // ── SCAN FRAME LOOP ──
    useEffect(() => {
        let isSubscribed = true;

        const scanFrame = () => {
            if (!isSubscribed) return;

            if (isCameraEnabled && activeTab === 'scanner' && !scannedBooking && videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
                const canvas = canvasRef.current;
                if (canvas) {
                    const ctx = canvas.getContext('2d', { willReadFrequently: true });
                    canvas.width = videoRef.current.videoWidth;
                    canvas.height = videoRef.current.videoHeight;
                    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height, {
                        inversionAttempts: 'dontInvert'
                    });

                    if (code && code.data) {
                        handleScannedResult(code.data);
                        return;
                    }
                }
            }

            if (isCameraEnabled && activeTab === 'scanner' && !scannedBooking) {
                animFrameRef.current = requestAnimationFrame(scanFrame);
            }
        };

        if (isCameraEnabled && activeTab === 'scanner' && !scannedBooking) {
            animFrameRef.current = requestAnimationFrame(scanFrame);
        } else {
            stopCamera();
        }

        return () => {
            isSubscribed = false;
            stopCamera();
        };
    }, [isCameraEnabled, activeTab, scannedBooking, handleScannedResult, stopCamera]);

    // ── MANUAL LOOKUP ──
    const handleManualSearch = async (e) => {
        e?.preventDefault();
        if (!manualIdInput.trim()) return;

        setIsSearchingManual(true);
        setErrorMessage('');

        try {
            const res = await fetch('/api/marshal/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingId: manualIdInput.trim() })
            });

            const data = await res.json();

            if (data.success && data.booking) {
                playSuccessChime();
                setScannedBooking(data.booking);
                setRosterChecklist(data.booking.roster || []);
                setIsBalancePaid(Boolean(data.booking.isBalancePaid));
                setMarshalNotes(data.booking.marshalNotes || '');
                setAssignedTent(data.booking.assignedTent || '');
                setWristbandRange(data.booking.wristbandRange || '');
                setExtraGuestsCount(0);
                setIsManualModalOpen(false);
                stopCamera();
                setIsCameraEnabled(false);
            } else {
                setErrorMessage(data.message || `No reservation found for #${manualIdInput}`);
            }
        } catch (err) {
            setErrorMessage('Failed to search reservation ID.');
        } finally {
            setIsSearchingManual(false);
        }
    };

    // ── GALLERY IMAGE UPLOAD ──
    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);

                if (code && code.data) {
                    handleScannedResult(code.data);
                } else {
                    setErrorMessage('No valid QR code detected in image. Please try a clearer screenshot.');
                }
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    // ── TRIGGER DEMO EMAIL PASS ──
    const handleSendTestEmail = async (e) => {
        e.preventDefault();
        if (!testEmailInput.trim()) return;

        setIsSendingTestEmail(true);
        try {
            const res = await fetch('/api/marshal/test-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: testEmailInput.trim(),
                    name: testNameInput.trim() || 'Explorer Lead',
                    guests: testGuestsCount
                })
            });

            const data = await res.json();
            if (data.success) {
                showToast(`✓ Confirmation pass sent to ${testEmailInput}!`);
                setIsTestEmailModalOpen(false);
                fetchRosterData();
                if (data.booking) {
                    setScannedBooking(data.booking);
                    setRosterChecklist(data.booking.attendanceRoster || []);
                    setIsBalancePaid(false);
                    setExtraGuestsCount(0);
                }
            } else {
                setErrorMessage(data.message || 'Failed to dispatch test pass');
            }
        } catch (err) {
            setErrorMessage('Network error sending test email.');
        } finally {
            setIsSendingTestEmail(false);
        }
    };

    // ── TRIGGER DEMO SEEDING ──
    const handleSeedDemoCampers = async () => {
        setIsSeedingDemo(true);
        try {
            const res = await fetch('/api/marshal/seed', { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                showToast(`✓ Generated ${data.count} simulation campers!`);
                await fetchRosterData();
                setActiveTab('roster');
            } else {
                setErrorMessage(data.message || 'Failed to seed sample campers');
            }
        } catch (e) {
            setErrorMessage('Network error generating demo campers.');
        } finally {
            setIsSeedingDemo(false);
        }
    };

    // ── SELECT GUEST FROM ROSTER ──
    const selectGuestFromRoster = (guest) => {
        setScannedBooking(guest);
        setRosterChecklist(guest.roster || []);
        setIsBalancePaid(Boolean(guest.isBalancePaid));
        setMarshalNotes(guest.notes || '');
        setAssignedTent(guest.assignedTent || '');
        setWristbandRange(guest.wristbandRange || '');
        setExtraGuestsCount(0);
        setCheckinSuccessMessage('');
        setErrorMessage('');
    };

    // ── TOGGLE ATTENDANCE ON INDIVIDUAL CAMPER ──
    const toggleCamperAttendance = (index) => {
        setRosterChecklist(prev => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                present: !updated[index].present
            };
            return updated;
        });
    };

    // ── ONE-TAP "CHECK IN ALL REMAINING LATE CAMPERS" ──
    const checkInAllRemaining = () => {
        setRosterChecklist(prev => prev.map(c => ({ ...c, present: true })));
        showToast('✓ Marked all campers as present!');
    };

    // ── ADD EXTRA WALK-IN CAMPER ──
    const handleAddExtraCamper = () => {
        const nextId = rosterChecklist.length + 1;
        setRosterChecklist(prev => [
            ...prev,
            { id: nextId, name: `Extra Camper #${nextId} (Walk-In)`, present: true, isExtra: true }
        ]);
        setExtraGuestsCount(prev => prev + 1);
        showToast('✓ Added 1 extra walk-in camper (+₹2,499 added to balance)');
    };

    const handleRemoveExtraCamper = () => {
        if (extraGuestsCount <= 0) return;
        setRosterChecklist(prev => prev.slice(0, -1));
        setExtraGuestsCount(prev => Math.max(0, prev - 1));
    };

    // ── ATTENDANCE CALCULATIONS ──
    const presentCount = rosterChecklist.filter(c => c.present).length;
    const totalCount = rosterChecklist.length;
    const shortCount = Math.max(0, totalCount - presentCount);
    const extraBalance = extraGuestsCount * 2499;
    const dynamicBalanceDue = Math.max(0, (scannedBooking?.balanceDue || 0) + extraBalance);

    // ── CONFIRM CHECK-IN & ISSUE ENTRY PERMIT ──
    const handleConfirmCheckin = async () => {
        if (!scannedBooking) return;

        setIsSubmittingCheckin(true);
        setCheckinSuccessMessage('');

        try {
            const res = await fetch('/api/marshal/checkin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingId: scannedBooking.id,
                    checkedInCount: presentCount,
                    shortCount,
                    roster: rosterChecklist,
                    isBalancePaid,
                    assignedTent,
                    wristbandRange,
                    marshalNotes: `[Tent: ${assignedTent || 'Unassigned'} | Wristbands: ${wristbandRange || 'None'}] ${marshalNotes || ''}`,
                    marshalName: 'Basecamp Host'
                })
            });

            const data = await res.json();

            if (data.success) {
                setCheckinSuccessMessage(data.message);
                setScannedBooking(prev => ({
                    ...prev,
                    status: shortCount > 0 ? 'Partial Check-In' : 'Checked In',
                    checkedInCount: presentCount,
                    shortCount,
                    isBalancePaid,
                    assignedTent,
                    wristbandRange
                }));
                playSuccessChime();
                fetchRosterData();
            } else {
                setErrorMessage(data.message || 'Failed to complete check-in');
            }
        } catch (err) {
            setErrorMessage('Network error saving check-in.');
        } finally {
            setIsSubmittingCheckin(false);
        }
    };

    const resetScanner = () => {
        setScannedBooking(null);
        setCheckinSuccessMessage('');
        setErrorMessage('');
        setManualIdInput('');
    };

    // ── FILTERED ROSTER ──
    const filteredRoster = rosterList.filter(item => {
        const matchesQuery = 
            item.name.toLowerCase().includes(rosterSearchQuery.toLowerCase()) ||
            item.id.toLowerCase().includes(rosterSearchQuery.toLowerCase()) ||
            item.phone.includes(rosterSearchQuery) ||
            item.campsite.toLowerCase().includes(rosterSearchQuery.toLowerCase());

        if (!matchesQuery) return false;

        if (rosterFilterStatus === 'checked_in') return item.status === 'Checked In';
        if (rosterFilterStatus === 'short') return item.status === 'Partial Check-In' || item.shortCount > 0;
        if (rosterFilterStatus === 'pending') return item.status !== 'Checked In' && item.status !== 'Partial Check-In';

        return true;
    });

    return (
        <div style={{
            minHeight: '100dvh',
            background: 'radial-gradient(circle at 50% 0%, #112015 0%, #071009 100%)',
            color: '#FFFFFF',
            fontFamily: 'var(--font-jakarta), sans-serif',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflowX: 'hidden'
        }}>
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {/* ── TOAST NOTIFICATION ── */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        style={{
                            position: 'fixed',
                            top: '16px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: '#D5ED55',
                            color: '#0B150E',
                            padding: '10px 22px',
                            borderRadius: '999px',
                            fontWeight: '800',
                            fontSize: '13px',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                            zIndex: 1000,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <Sparkles size={16} />
                        <span>{toastMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── TOP APP BAR ── */}
            <header style={{
                background: 'rgba(11, 21, 14, 0.85)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                zIndex: 40
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {onBackToAdmin ? (
                        <button
                            onClick={onBackToAdmin}
                            style={{
                                background: 'rgba(255, 255, 255, 0.08)',
                                border: '1px solid rgba(255, 255, 255, 0.12)',
                                color: '#FFFFFF',
                                borderRadius: '50%',
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            <ArrowLeft size={18} />
                        </button>
                    ) : (
                        <Link
                            href="/admin"
                            style={{
                                background: 'rgba(255, 255, 255, 0.08)',
                                border: '1px solid rgba(255, 255, 255, 0.12)',
                                color: '#FFFFFF',
                                borderRadius: '50%',
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textDecoration: 'none'
                            }}
                        >
                            <ArrowLeft size={18} />
                        </Link>
                    )}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '15px', fontWeight: '800', letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                                Aanandham<span style={{ color: '#E5A93B' }}>.go</span>
                            </span>
                            <span style={{ fontSize: '10px', background: '#D5ED55', color: '#0B150E', padding: '2px 6px', borderRadius: '4px', fontWeight: '900', letterSpacing: '0.5px' }}>
                                BASECAMP HOST
                            </span>
                        </div>
                        <span style={{ fontSize: '11px', color: '#8E9B92', display: 'block' }}>
                            Gate Pass, Headcount & Attendance Console
                        </span>
                    </div>
                </div>

                {/* Quick Simulation & Audio Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                        onClick={() => setIsTestEmailModalOpen(true)}
                        style={{
                            background: 'rgba(229, 169, 59, 0.15)',
                            border: '1px solid rgba(229, 169, 59, 0.4)',
                            color: '#E5A93B',
                            padding: '6px 10px',
                            borderRadius: '10px',
                            fontSize: '11.5px',
                            fontWeight: '800',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            cursor: 'pointer'
                        }}
                        title="Send Real Test Pass Email"
                    >
                        <Mail size={13} />
                        <span>Email Pass</span>
                    </button>

                    <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        style={{
                            background: soundEnabled ? 'rgba(213, 237, 85, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                            border: `1px solid ${soundEnabled ? 'rgba(213, 237, 85, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
                            color: soundEnabled ? '#D5ED55' : '#8E9B92',
                            width: '34px',
                            height: '34px',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
                    </button>
                </div>
            </header>

            {/* ── 3-TAB SEGMENTED CONTROLLER ── */}
            <div style={{
                background: 'rgba(11, 21, 14, 0.9)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '8px 16px',
                display: 'flex',
                gap: '8px',
                position: 'sticky',
                top: '64px',
                zIndex: 35
            }}>
                <button
                    onClick={() => { setActiveTab('scanner'); setScannedBooking(null); }}
                    style={{
                        flex: 1,
                        padding: '10px 8px',
                        borderRadius: '12px',
                        background: activeTab === 'scanner' ? '#D5ED55' : 'rgba(255, 255, 255, 0.05)',
                        color: activeTab === 'scanner' ? '#0B150E' : '#A2B6A6',
                        border: 'none',
                        fontSize: '12.5px',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                >
                    <Camera size={15} />
                    <span>QR Scanner</span>
                </button>

                <button
                    onClick={() => { setActiveTab('roster'); setScannedBooking(null); stopCamera(); setIsCameraEnabled(false); }}
                    style={{
                        flex: 1,
                        padding: '10px 8px',
                        borderRadius: '12px',
                        background: activeTab === 'roster' ? '#D5ED55' : 'rgba(255, 255, 255, 0.05)',
                        color: activeTab === 'roster' ? '#0B150E' : '#A2B6A6',
                        border: 'none',
                        fontSize: '12.5px',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                >
                    <Users size={15} />
                    <span>Guest Roster ({rosterList.length})</span>
                </button>

                <button
                    onClick={() => { setActiveTab('kitchen'); setScannedBooking(null); stopCamera(); setIsCameraEnabled(false); }}
                    style={{
                        flex: 1,
                        padding: '10px 8px',
                        borderRadius: '12px',
                        background: activeTab === 'kitchen' ? '#D5ED55' : 'rgba(255, 255, 255, 0.05)',
                        color: activeTab === 'kitchen' ? '#0B150E' : '#A2B6A6',
                        border: 'none',
                        fontSize: '12.5px',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                >
                    <Utensils size={15} />
                    <span>Kitchen & Tally</span>
                </button>
            </div>

            {/* ── ERROR MESSAGE BANNER ── */}
            {errorMessage && (
                <div style={{
                    background: '#DC2626',
                    color: '#FFFFFF',
                    padding: '12px 18px',
                    fontSize: '13px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    zIndex: 50
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertCircle size={18} />
                        <span>{errorMessage}</span>
                    </div>
                    <button
                        onClick={() => setErrorMessage('')}
                        style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════
                TAB 1: LIVE QR CAMERA SCANNER
            ══════════════════════════════════════════════════════════ */}
            {activeTab === 'scanner' && !scannedBooking && (
                <main style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px 20px 80px',
                    maxWidth: '520px',
                    margin: '0 auto',
                    width: '100%',
                    boxSizing: 'border-box'
                }}>
                    {/* Camera Control Bar */}
                    <div style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px',
                        background: 'rgba(16, 30, 19, 0.8)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        padding: '10px 16px',
                        borderRadius: '16px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: isCameraEnabled ? '#22C55E' : '#EF4444',
                                boxShadow: isCameraEnabled ? '0 0 8px #22C55E' : 'none'
                            }} />
                            <span style={{ fontSize: '12px', fontWeight: '700', color: isCameraEnabled ? '#4ADE80' : '#FCA5A5' }}>
                                {isCameraEnabled ? 'Camera Live' : 'Camera Paused'}
                            </span>
                        </div>

                        <button
                            onClick={toggleCameraPower}
                            style={{
                                padding: '6px 14px',
                                borderRadius: '999px',
                                background: isCameraEnabled ? 'rgba(239, 68, 68, 0.15)' : '#D5ED55',
                                border: isCameraEnabled ? '1px solid rgba(239, 68, 68, 0.3)' : 'none',
                                color: isCameraEnabled ? '#EF4444' : '#0B150E',
                                fontSize: '11.5px',
                                fontWeight: '800',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <Power size={13} />
                            <span>{isCameraEnabled ? 'Turn Off' : 'Turn On Camera'}</span>
                        </button>
                    </div>

                    {/* Viewfinder Frame */}
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '1 / 1',
                        borderRadius: '28px',
                        overflow: 'hidden',
                        boxShadow: '0 0 50px rgba(0, 0, 0, 0.8), 0 0 0 2px rgba(213, 237, 85, 0.2)',
                        background: '#000000',
                        marginBottom: '16px'
                    }}>
                        <video
                            ref={videoRef}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />

                        {isCameraEnabled && (
                            <div style={{
                                position: 'absolute',
                                inset: '14%',
                                border: '2px solid rgba(213, 237, 85, 0.5)',
                                borderRadius: '20px',
                                pointerEvents: 'none',
                                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.65)'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '2px',
                                    background: 'linear-gradient(90deg, rgba(213,237,85,0) 0%, #D5ED55 50%, rgba(213,237,85,0) 100%)',
                                    boxShadow: '0 0 12px #D5ED55',
                                    animation: 'scanline 2s infinite ease-in-out'
                                }} />
                                <div style={{ position: 'absolute', top: '-2px', left: '-2px', width: '20px', height: '20px', borderTop: '4px solid #D5ED55', borderLeft: '4px solid #D5ED55', borderTopLeftRadius: '12px' }} />
                                <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '20px', height: '20px', borderTop: '4px solid #D5ED55', borderRight: '4px solid #D5ED55', borderTopRightRadius: '12px' }} />
                                <div style={{ position: 'absolute', bottom: '-2px', left: '-2px', width: '20px', height: '20px', borderBottom: '4px solid #D5ED55', borderLeft: '4px solid #D5ED55', borderBottomLeftRadius: '12px' }} />
                                <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '20px', height: '20px', borderBottom: '4px solid #D5ED55', borderRight: '4px solid #D5ED55', borderBottomRightRadius: '12px' }} />
                            </div>
                        )}

                        {!isCameraEnabled && (
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: '#0D180F',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '24px',
                                textAlign: 'center',
                                zIndex: 10
                            }}>
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '50%',
                                    background: 'rgba(213, 237, 85, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '14px',
                                    border: '1px solid rgba(213, 237, 85, 0.3)'
                                }}>
                                    <Camera size={30} color="#D5ED55" />
                                </div>
                                <h3 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: '800', color: '#FFFFFF' }}>
                                    Live Camera Paused
                                </h3>
                                <p style={{ margin: '0 0 18px', fontSize: '12px', color: '#8E9B92', maxWidth: '260px', lineHeight: 1.45 }}>
                                    Tap to activate live scanner or pick a guest from the roster.
                                </p>
                                <button
                                    onClick={startCamera}
                                    style={{
                                        padding: '12px 22px',
                                        borderRadius: '12px',
                                        background: '#D5ED55',
                                        color: '#0B150E',
                                        fontSize: '13px',
                                        fontWeight: '800',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                >
                                    <Power size={15} />
                                    <span>Turn On Camera</span>
                                </button>
                            </div>
                        )}

                        {isValidating && (
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'rgba(11, 21, 14, 0.9)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                zIndex: 30
                            }}>
                                <div className="spinner-border" style={{ width: '40px', height: '40px', border: '3px solid rgba(213,237,85,0.2)', borderTopColor: '#D5ED55', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                <span style={{ fontSize: '13px', fontWeight: '700', color: '#D5ED55' }}>
                                    Verifying Pass...
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Quick Tools */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%' }}>
                        {isCameraEnabled && (
                            <>
                                <button
                                    onClick={() => setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')}
                                    style={{
                                        padding: '12px',
                                        borderRadius: '14px',
                                        background: 'rgba(255, 255, 255, 0.06)',
                                        border: '1px solid rgba(255, 255, 255, 0.12)',
                                        color: '#FFFFFF',
                                        fontSize: '12.5px',
                                        fontWeight: '700',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <RefreshCw size={15} />
                                    <span>Flip Camera</span>
                                </button>

                                {hasTorchSupport && (
                                    <button
                                        onClick={toggleTorch}
                                        style={{
                                            padding: '12px',
                                            borderRadius: '14px',
                                            background: torchOn ? '#D5ED55' : 'rgba(255, 255, 255, 0.06)',
                                            border: '1px solid rgba(255, 255, 255, 0.12)',
                                            color: torchOn ? '#0B150E' : '#FFFFFF',
                                            fontSize: '12.5px',
                                            fontWeight: '700',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '6px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <Flashlight size={15} />
                                        <span>{torchOn ? 'Torch ON' : 'Torch OFF'}</span>
                                    </button>
                                )}
                            </>
                        )}

                        <label style={{
                            padding: '12px',
                            borderRadius: '14px',
                            background: 'rgba(255, 255, 255, 0.06)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            color: '#FFFFFF',
                            fontSize: '12.5px',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            cursor: 'pointer'
                        }}>
                            <Upload size={15} />
                            <span>Upload Pass</span>
                            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                        </label>

                        <button
                            onClick={() => setIsManualModalOpen(true)}
                            style={{
                                padding: '12px',
                                borderRadius: '14px',
                                background: 'rgba(213, 237, 85, 0.12)',
                                border: '1px solid rgba(213, 237, 85, 0.3)',
                                color: '#D5ED55',
                                fontSize: '12.5px',
                                fontWeight: '800',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                cursor: 'pointer'
                            }}
                        >
                            <Search size={15} />
                            <span>Enter Booking ID</span>
                        </button>
                    </div>
                </main>
            )}

            {/* ══════════════════════════════════════════════════════════
                TAB 2: GUEST ROSTER & HEADCOUNT LIST
            ══════════════════════════════════════════════════════════ */}
            {activeTab === 'roster' && !scannedBooking && (
                <main style={{
                    flex: 1,
                    padding: '16px clamp(16px, 4vw, 24px) 80px',
                    maxWidth: '800px',
                    margin: '0 auto',
                    width: '100%',
                    boxSizing: 'border-box'
                }}>
                    {/* Headcount Stat Ribbon */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '14px' }}>
                        <div style={{ background: 'rgba(16, 30, 19, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '10px 6px', textAlign: 'center' }}>
                            <span style={{ fontSize: '9.5px', color: '#8E9B92', fontWeight: '700', textTransform: 'uppercase', display: 'block' }}>Expected</span>
                            <span style={{ fontSize: '18px', fontWeight: '900', color: '#FFFFFF' }}>{stats.totalExpectedCampers}</span>
                        </div>
                        <div style={{ background: 'rgba(16, 30, 19, 0.8)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '14px', padding: '10px 6px', textAlign: 'center' }}>
                            <span style={{ fontSize: '9.5px', color: '#4ADE80', fontWeight: '700', textTransform: 'uppercase', display: 'block' }}>At Camp</span>
                            <span style={{ fontSize: '18px', fontWeight: '900', color: '#4ADE80' }}>{stats.totalCheckedInCampers}</span>
                        </div>
                        <div style={{ background: 'rgba(16, 30, 19, 0.8)', border: '1px solid rgba(234, 179, 8, 0.3)', borderRadius: '14px', padding: '10px 6px', textAlign: 'center' }}>
                            <span style={{ fontSize: '9.5px', color: '#FACC15', fontWeight: '700', textTransform: 'uppercase', display: 'block' }}>En Route</span>
                            <span style={{ fontSize: '18px', fontWeight: '900', color: '#FACC15' }}>{stats.totalPendingCampers}</span>
                        </div>
                        <div style={{ background: 'rgba(16, 30, 19, 0.8)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '14px', padding: '10px 6px', textAlign: 'center' }}>
                            <span style={{ fontSize: '9.5px', color: '#FCA5A5', fontWeight: '700', textTransform: 'uppercase', display: 'block' }}>Short</span>
                            <span style={{ fontSize: '18px', fontWeight: '900', color: '#EF4444' }}>{stats.totalShortCampers}</span>
                        </div>
                    </div>

                    {/* Simulation Generator Bar */}
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(229, 169, 59, 0.1) 0%, rgba(213, 237, 85, 0.1) 100%)',
                        border: '1px solid rgba(229, 169, 59, 0.3)',
                        borderRadius: '16px',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '14px',
                        gap: '10px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Sparkles size={16} color="#E5A93B" />
                            <span style={{ fontSize: '12px', fontWeight: '800', color: '#FFFFFF' }}>
                                Need realistic test data?
                            </span>
                        </div>
                        <button
                            onClick={handleSeedDemoCampers}
                            disabled={isSeedingDemo}
                            style={{
                                padding: '6px 14px',
                                borderRadius: '10px',
                                background: '#E5A93B',
                                color: '#0B150E',
                                fontSize: '11.5px',
                                fontWeight: '800',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}
                        >
                            <span>{isSeedingDemo ? 'Seeding...' : '⚡ Seed 4 Demo Campers'}</span>
                        </button>
                    </div>

                    {/* Search & Status Filter */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={16} color="#8E9B92" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="text"
                                placeholder="Search by camper name, booking ID, phone..."
                                value={rosterSearchQuery}
                                onChange={e => setRosterSearchQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 14px 12px 38px',
                                    borderRadius: '14px',
                                    background: '#101E13',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    color: '#FFFFFF',
                                    fontSize: '13px',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        {/* Filter Chips */}
                        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                            {[
                                { id: 'all', label: `All (${rosterList.length})` },
                                { id: 'pending', label: `⏳ Expected (${rosterList.filter(r => r.status !== 'Checked In' && r.status !== 'Partial Check-In').length})` },
                                { id: 'checked_in', label: `🟢 Checked In (${rosterList.filter(r => r.status === 'Checked In').length})` },
                                { id: 'short', label: `⚠️ Short Arrival (${rosterList.filter(r => r.status === 'Partial Check-In' || r.shortCount > 0).length})` }
                            ].map(filter => (
                                <button
                                    key={filter.id}
                                    onClick={() => setRosterFilterStatus(filter.id)}
                                    style={{
                                        padding: '6px 12px',
                                        borderRadius: '999px',
                                        background: rosterFilterStatus === filter.id ? '#D5ED55' : 'rgba(255, 255, 255, 0.06)',
                                        color: rosterFilterStatus === filter.id ? '#0B150E' : '#C8D8CB',
                                        border: 'none',
                                        fontSize: '11.5px',
                                        fontWeight: '800',
                                        whiteSpace: 'nowrap',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Guest Cards */}
                    {isLoadingRoster ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#8E9B92' }}>
                            Loading guest roster...
                        </div>
                    ) : filteredRoster.length === 0 ? (
                        <div style={{ padding: '40px 20px', textAlign: 'center', background: '#101E13', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                            <p style={{ color: '#8E9B92', margin: 0, fontSize: '13px' }}>No reservations match your filter.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {filteredRoster.map(guest => {
                                const isCheckedIn = guest.status === 'Checked In';
                                const isPartial = guest.status === 'Partial Check-In' || guest.shortCount > 0;
                                return (
                                    <div
                                        key={guest.id}
                                        onClick={() => selectGuestFromRoster(guest)}
                                        style={{
                                            background: '#101E13',
                                            border: `1px solid ${isCheckedIn ? 'rgba(34, 197, 94, 0.25)' : isPartial ? 'rgba(234, 179, 8, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
                                            borderRadius: '16px',
                                            padding: '14px 16px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '8px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <span style={{ fontSize: '15px', fontWeight: '800', color: '#FFFFFF' }}>
                                                        {guest.name}
                                                    </span>
                                                    <span style={{ fontSize: '11px', color: '#8E9B92' }}>
                                                        #{guest.id}
                                                    </span>
                                                </div>
                                                <span style={{ fontSize: '12px', color: '#A2B6A6', display: 'block', marginTop: '2px' }}>
                                                    🏕️ {guest.campsite} • {guest.convoyTime}
                                                </span>
                                            </div>

                                            <span style={{
                                                padding: '4px 10px',
                                                borderRadius: '999px',
                                                background: isCheckedIn ? 'rgba(34,197,94,0.2)' : isPartial ? 'rgba(234,179,8,0.2)' : 'rgba(255,255,255,0.08)',
                                                color: isCheckedIn ? '#4ADE80' : isPartial ? '#FACC15' : '#C8D8CB',
                                                fontSize: '11px',
                                                fontWeight: '800'
                                            }}>
                                                {isCheckedIn ? '✓ Checked In' : isPartial ? `⚠️ ${guest.checkedInCount}/${guest.totalGuests} Present` : '⏳ Expected'}
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
                                            <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#8E9B92' }}>
                                                <span>👥 <strong>{guest.totalGuests}</strong> Campers</span>
                                                <span>🥗 <strong>{guest.vegCount}</strong>V / <strong>{guest.nonVegCount}</strong>NV</span>
                                                <span>💰 {guest.isBalancePaid ? '✓ Paid' : `₹${guest.balanceDue} Due`}</span>
                                            </div>
                                            <span style={{ fontSize: '11.5px', color: '#D5ED55', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '2px' }}>
                                                Open Pass Ticket →
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </main>
            )}

            {/* ══════════════════════════════════════════════════════════
                TAB 3: KITCHEN & OCCUPANCY TALLY
            ══════════════════════════════════════════════════════════ */}
            {activeTab === 'kitchen' && !scannedBooking && (
                <main style={{
                    flex: 1,
                    padding: '20px clamp(16px, 4vw, 24px) 80px',
                    maxWidth: '800px',
                    margin: '0 auto',
                    width: '100%',
                    boxSizing: 'border-box'
                }}>
                    {/* Headcount Gauge */}
                    <div style={{
                        background: '#101E13',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '20px',
                        padding: '22px',
                        marginBottom: '16px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <TrendingUp size={20} color="#D5ED55" />
                            <span style={{ fontSize: '15px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Ridge Headcount Occupancy
                            </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '14px' }}>
                                <span style={{ fontSize: '11px', color: '#8E9B92', display: 'block' }}>Physically Present</span>
                                <span style={{ fontSize: '28px', fontWeight: '900', color: '#4ADE80' }}>
                                    {stats.totalCheckedInCampers} <span style={{ fontSize: '14px', color: '#8E9B92' }}>/ {stats.totalExpectedCampers}</span>
                                </span>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '14px' }}>
                                <span style={{ fontSize: '11px', color: '#8E9B92', display: 'block' }}>En Route / Expected</span>
                                <span style={{ fontSize: '28px', fontWeight: '900', color: '#FACC15' }}>
                                    {stats.totalPendingCampers} <span style={{ fontSize: '14px', color: '#8E9B92' }}>Campers</span>
                                </span>
                            </div>
                        </div>

                        <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                            <div style={{
                                width: `${stats.totalExpectedCampers > 0 ? (stats.totalCheckedInCampers / stats.totalExpectedCampers) * 100 : 0}%`,
                                height: '100%',
                                background: '#D5ED55',
                                borderRadius: '999px'
                            }} />
                        </div>
                    </div>

                    {/* Kitchen BBQ Portions */}
                    <div style={{
                        background: '#101E13',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '20px',
                        padding: '22px',
                        marginBottom: '16px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <Utensils size={20} color="#D5ED55" />
                            <span style={{ fontSize: '15px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Kitchen & Catering Portions Required
                            </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                            <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '16px', borderRadius: '16px' }}>
                                <span style={{ fontSize: '12px', color: '#4ADE80', fontWeight: '700', display: 'block' }}>🥗 Veg BBQ Meals</span>
                                <span style={{ fontSize: '32px', fontWeight: '900', color: '#4ADE80' }}>
                                    {stats.vegMealsCount}
                                </span>
                                <span style={{ fontSize: '11px', color: '#8E9B92', display: 'block', marginTop: '4px' }}>Portions to Prep</span>
                            </div>

                            <div style={{ background: 'rgba(249, 115, 22, 0.1)', border: '1px solid rgba(249, 115, 22, 0.3)', padding: '16px', borderRadius: '16px' }}>
                                <span style={{ fontSize: '12px', color: '#FB923C', fontWeight: '700', display: 'block' }}>🍗 Chicken BBQ Meals</span>
                                <span style={{ fontSize: '32px', fontWeight: '900', color: '#FB923C' }}>
                                    {stats.nonVegMealsCount}
                                </span>
                                <span style={{ fontSize: '11px', color: '#8E9B92', display: 'block', marginTop: '4px' }}>Portions to Prep</span>
                            </div>
                        </div>
                    </div>

                    {/* Front Desk Cash Collection */}
                    <div style={{
                        background: '#101E13',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '20px',
                        padding: '22px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <DollarSign size={20} color="#D5ED55" />
                            <span style={{ fontSize: '15px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Front Desk Settlement
                            </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '14px' }}>
                                <span style={{ fontSize: '11px', color: '#8E9B92', display: 'block' }}>Balance To Collect</span>
                                <span style={{ fontSize: '24px', fontWeight: '900', color: '#EF4444' }}>
                                    ₹{stats.totalBalanceDue.toLocaleString('en-IN')}
                                </span>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '14px' }}>
                                <span style={{ fontSize: '11px', color: '#8E9B92', display: 'block' }}>Balance Settled</span>
                                <span style={{ fontSize: '24px', fontWeight: '900', color: '#4ADE80' }}>
                                    ₹{stats.totalBalanceCollected.toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>
                    </div>
                </main>
            )}

            {/* ══════════════════════════════════════════════════════════
                CINEMA TICKET STUB / BOARDING PASS CHECK-IN WORKSPACE
                (Responsive 1-Col Mobile, 2-Col Tablet/Laptop)
            ══════════════════════════════════════════════════════════ */}
            {scannedBooking && (
                <main style={{
                    flex: 1,
                    padding: '20px clamp(16px, 4vw, 32px) 100px',
                    maxWidth: '1080px',
                    margin: '0 auto',
                    width: '100%',
                    boxSizing: 'border-box'
                }}>
                    {checkinSuccessMessage && (
                        <div style={{
                            background: 'rgba(34, 197, 94, 0.15)',
                            border: '1px solid #22C55E',
                            borderRadius: '16px',
                            padding: '16px',
                            color: '#4ADE80',
                            fontSize: '13.5px',
                            fontWeight: '700',
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <CheckCircle2 size={20} />
                            <span>{checkinSuccessMessage}</span>
                        </div>
                    )}

                    {/* ── RESPONSIVE GRID LAYOUT ── */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '20px',
                        alignItems: 'start'
                    }}>

                        {/* ── LEFT COLUMN: PVR CINEMA BOARDING TICKET STUB ── */}
                        <div style={{
                            background: '#0F1E13',
                            border: '1px solid rgba(213, 237, 85, 0.25)',
                            borderRadius: '24px',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
                        }}>
                            {/* Top Golden Header */}
                            <div style={{
                                background: 'linear-gradient(135deg, #142819 0%, #0D1C11 100%)',
                                padding: '20px 22px',
                                borderBottom: '2px dashed rgba(255, 255, 255, 0.15)',
                                position: 'relative'
                            }}>
                                {/* Circular ticket side cutouts */}
                                <div style={{ position: 'absolute', left: '-12px', bottom: '-12px', width: '24px', height: '24px', borderRadius: '50%', background: '#071009', zIndex: 5 }} />
                                <div style={{ position: 'absolute', right: '-12px', bottom: '-12px', width: '24px', height: '24px', borderRadius: '50%', background: '#071009', zIndex: 5 }} />

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <span style={{ fontSize: '10.5px', fontWeight: '900', color: '#D5ED55', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                            EXPEDITION BOARDING PASS
                                        </span>
                                        <h2 style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: '900', color: '#FFFFFF' }}>
                                            {scannedBooking.name}
                                        </h2>
                                        <span style={{ fontSize: '12px', color: '#A2B6A6' }}>
                                            Pass #{scannedBooking.id}
                                        </span>
                                    </div>

                                    {/* Status Pill */}
                                    <span style={{
                                        padding: '5px 12px',
                                        borderRadius: '999px',
                                        background: scannedBooking.status === 'Checked In' 
                                            ? '#22C55E' 
                                            : scannedBooking.status === 'Partial Check-In' 
                                                ? '#F59E0B' 
                                                : '#D5ED55',
                                        color: '#0B150E',
                                        fontSize: '11px',
                                        fontWeight: '900',
                                        letterSpacing: '0.5px',
                                        textTransform: 'uppercase'
                                    }}>
                                        {scannedBooking.status === 'Checked In' ? '✓ Checked In' : scannedBooking.status === 'Partial Check-In' ? '⚠️ Partial In' : 'Confirmed'}
                                    </span>
                                </div>
                            </div>

                            {/* Ticket Details Body */}
                            <div style={{ padding: '22px' }}>
                                {/* Campsite & Convoy Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px', background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '16px' }}>
                                    <div>
                                        <span style={{ fontSize: '10.5px', color: '#8E9B92', textTransform: 'uppercase', fontWeight: '700', display: 'block' }}>Sanctuary</span>
                                        <strong style={{ fontSize: '13.5px', color: '#D5ED55' }}>{scannedBooking.campsite}</strong>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '10.5px', color: '#8E9B92', textTransform: 'uppercase', fontWeight: '700', display: 'block' }}>Convoy Batch</span>
                                        <strong style={{ fontSize: '13.5px', color: '#FFFFFF' }}>{scannedBooking.convoyTime || '02:30 PM Batch'}</strong>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '10.5px', color: '#8E9B92', textTransform: 'uppercase', fontWeight: '700', display: 'block' }}>Accommodation</span>
                                        <strong style={{ fontSize: '13.5px', color: '#FFFFFF' }}>{scannedBooking.roomType}</strong>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '10.5px', color: '#8E9B92', textTransform: 'uppercase', fontWeight: '700', display: 'block' }}>Stay Dates</span>
                                        <strong style={{ fontSize: '13.5px', color: '#FFFFFF' }}>{scannedBooking.dates}</strong>
                                    </div>
                                </div>

                                {/* Catering & BBQ Tokens */}
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: '14px', marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Utensils size={15} color="#D5ED55" />
                                        <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#FFFFFF' }}>
                                            Catering Tokens:
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', fontSize: '12px' }}>
                                        <span style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#4ADE80', padding: '3px 8px', borderRadius: '6px', fontWeight: '800' }}>
                                            🥗 {scannedBooking.vegCount} Veg
                                        </span>
                                        <span style={{ background: 'rgba(249, 115, 22, 0.15)', color: '#FB923C', padding: '3px 8px', borderRadius: '6px', fontWeight: '800' }}>
                                            🍗 {scannedBooking.nonVegCount} Non-Veg
                                        </span>
                                    </div>
                                </div>

                                {/* Lead Contact & WhatsApp */}
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <a
                                        href={`tel:${scannedBooking.phone}`}
                                        style={{
                                            flex: 1,
                                            padding: '10px',
                                            borderRadius: '12px',
                                            background: 'rgba(255, 255, 255, 0.06)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            color: '#FFFFFF',
                                            fontSize: '12.5px',
                                            fontWeight: '700',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '6px',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        <Phone size={14} />
                                        <span>Call ({scannedBooking.phone})</span>
                                    </a>
                                    <a
                                        href={`https://wa.me/${scannedBooking.phone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(scannedBooking.name)}%2C%20welcome%20to%20Aanandham%20Wilderness!`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            padding: '10px 16px',
                                            borderRadius: '12px',
                                            background: 'rgba(37, 211, 102, 0.15)',
                                            border: '1px solid rgba(37, 211, 102, 0.3)',
                                            color: '#25D366',
                                            fontSize: '12.5px',
                                            fontWeight: '800',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '6px',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        <MessageCircle size={15} />
                                        <span>WhatsApp</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* ── RIGHT COLUMN: ATTENDANCE CHECKLIST & GATE SETTLEMENT ── */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                            {/* RE-SCAN & LATE ARRIVAL NOTIFICATION BANNER */}
                            {scannedBooking.status === 'Checked In' ? (
                                <div style={{
                                    background: 'rgba(34, 197, 94, 0.12)',
                                    border: '1px solid rgba(34, 197, 94, 0.3)',
                                    borderRadius: '18px',
                                    padding: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '12px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <CheckCircle2 size={24} color="#4ADE80" />
                                        <div>
                                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#4ADE80', display: 'block' }}>
                                                Pass Already Verified & Checked In
                                            </span>
                                            <span style={{ fontSize: '11px', color: '#8E9B92' }}>
                                                You can modify attendance, add walk-ins, or re-issue gate wristbands below.
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : scannedBooking.status === 'Partial Check-In' ? (
                                <div style={{
                                    background: 'rgba(234, 179, 8, 0.12)',
                                    border: '1px solid rgba(234, 179, 8, 0.35)',
                                    borderRadius: '18px',
                                    padding: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '12px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Clock size={24} color="#FACC15" />
                                        <div>
                                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#FACC15', display: 'block' }}>
                                                Late Campers Joining Active Group
                                            </span>
                                            <span style={{ fontSize: '11px', color: '#8E9B92' }}>
                                                {presentCount} of {totalCount} currently at camp. {shortCount} arriving late.
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={checkInAllRemaining}
                                        style={{
                                            padding: '8px 14px',
                                            borderRadius: '10px',
                                            background: '#FACC15',
                                            color: '#0B150E',
                                            fontSize: '11.5px',
                                            fontWeight: '900',
                                            border: 'none',
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        ✓ Check In All Late
                                    </button>
                                </div>
                            ) : null}

                            {/* ── ATTENDEE PER-PERSON TICKETS ── */}
                            <div style={{
                                background: '#101E13',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                borderRadius: '20px',
                                padding: '20px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Ticket size={18} color="#D5ED55" />
                                        <span style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>
                                            Camper Headcount & Attendance
                                        </span>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <button
                                            onClick={checkInAllRemaining}
                                            style={{
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                background: 'rgba(213, 237, 85, 0.15)',
                                                color: '#D5ED55',
                                                fontSize: '11px',
                                                fontWeight: '800',
                                                border: 'none',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            All Present
                                        </button>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '999px',
                                            background: shortCount === 0 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                                            color: shortCount === 0 ? '#4ADE80' : '#FACC15',
                                            fontSize: '11.5px',
                                            fontWeight: '800'
                                        }}>
                                            {shortCount === 0 ? `🟢 ${presentCount}/${totalCount} Full Party` : `⚠️ ${presentCount}/${totalCount} (${shortCount} Short)`}
                                        </span>
                                    </div>
                                </div>

                                {/* Attendee Checkboxes with Status Dropdowns */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {rosterChecklist.map((camper, idx) => {
                                        const camperStatus = camper.status || (camper.present ? 'present' : 'absent');
                                        return (
                                            <div
                                                key={idx}
                                                style={{
                                                    background: camperStatus === 'present' 
                                                        ? 'rgba(213, 237, 85, 0.06)' 
                                                        : camperStatus === 'late' 
                                                            ? 'rgba(234, 179, 8, 0.08)' 
                                                            : 'rgba(239, 68, 68, 0.08)',
                                                    border: `1px solid ${camperStatus === 'present' ? 'rgba(213, 237, 85, 0.3)' : camperStatus === 'late' ? 'rgba(234, 179, 8, 0.35)' : 'rgba(239, 68, 68, 0.3)'}`,
                                                    borderRadius: '14px',
                                                    padding: '12px 14px',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '8px'
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <div style={{
                                                            width: '28px',
                                                            height: '28px',
                                                            borderRadius: '50%',
                                                            background: camperStatus === 'present' ? '#D5ED55' : camperStatus === 'late' ? '#FACC15' : '#EF4444',
                                                            color: '#0B150E',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontWeight: '900',
                                                            fontSize: '13px'
                                                        }}>
                                                            {camperStatus === 'present' ? '✓' : camperStatus === 'late' ? '⏳' : '✕'}
                                                        </div>
                                                        <div>
                                                            <span style={{ fontSize: '13.5px', fontWeight: '800', color: '#FFFFFF', display: 'block' }}>
                                                                {camper.name}
                                                            </span>
                                                            <span style={{ fontSize: '11px', color: '#8E9B92' }}>
                                                                {idx === 0 ? 'Lead Organizer' : `Camper Ticket #${idx + 1}`}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Status Dropdown Selector */}
                                                    <select
                                                        value={camperStatus}
                                                        onChange={(e) => {
                                                            const newStatus = e.target.value;
                                                            setRosterChecklist(prev => {
                                                                const updated = [...prev];
                                                                updated[idx] = {
                                                                    ...updated[idx],
                                                                    status: newStatus,
                                                                    present: newStatus === 'present'
                                                                };
                                                                return updated;
                                                            });
                                                        }}
                                                        style={{
                                                            padding: '6px 10px',
                                                            borderRadius: '8px',
                                                            background: camperStatus === 'present' ? 'rgba(213, 237, 85, 0.15)' : camperStatus === 'late' ? 'rgba(234, 179, 8, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                                            color: camperStatus === 'present' ? '#D5ED55' : camperStatus === 'late' ? '#FACC15' : '#EF4444',
                                                            border: `1px solid ${camperStatus === 'present' ? 'rgba(213, 237, 85, 0.4)' : camperStatus === 'late' ? 'rgba(234, 179, 8, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                                                            fontSize: '11.5px',
                                                            fontWeight: '800',
                                                            cursor: 'pointer',
                                                            outline: 'none'
                                                        }}
                                                    >
                                                        <option value="present" style={{ background: '#101E13', color: '#D5ED55' }}>🟢 Present (Checked In)</option>
                                                        <option value="late" style={{ background: '#101E13', color: '#FACC15' }}>⏳ Arriving Late (Next Jeep)</option>
                                                        <option value="absent" style={{ background: '#101E13', color: '#EF4444' }}>❌ Absent / No-Show</option>
                                                        <option value="departed" style={{ background: '#101E13', color: '#8E9B92' }}>🚶 Departed Camp</option>
                                                    </select>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Walk-In / Extra Guest Adder */}
                                <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
                                    <span style={{ fontSize: '12px', color: '#8E9B92' }}>
                                        Walk-In / Extra Guest on Arrival?
                                    </span>
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                        {extraGuestsCount > 0 && (
                                            <button
                                                onClick={handleRemoveExtraCamper}
                                                style={{ padding: '4px 8px', borderRadius: '8px', background: 'rgba(239,68,68,0.15)', color: '#EF4444', border: 'none', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}
                                            >
                                                - Remove Extra
                                            </button>
                                        )}
                                        <button
                                            onClick={handleAddExtraCamper}
                                            style={{ padding: '4px 10px', borderRadius: '8px', background: 'rgba(213,237,85,0.15)', color: '#D5ED55', border: '1px solid rgba(213,237,85,0.3)', fontSize: '11.5px', fontWeight: '800', cursor: 'pointer' }}
                                        >
                                            + Add Extra Camper (+₹2,499)
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* ── TENT & WRISTBAND ALLOCATION WITH PRESET DROPDOWN ── */}
                            <div style={{
                                background: '#101E13',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                borderRadius: '20px',
                                padding: '20px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                    <Tent size={18} color="#D5ED55" />
                                    <span style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>
                                        Tent & Wristband Assignment
                                    </span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <div>
                                        <label style={{ fontSize: '11px', fontWeight: '700', color: '#8E9B92', display: 'block', marginBottom: '4px' }}>
                                            Assigned Tent / Pod (Dropdown):
                                        </label>
                                        <select
                                            value={assignedTent}
                                            onChange={e => setAssignedTent(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '11px 12px',
                                                borderRadius: '10px',
                                                background: '#08120A',
                                                border: '1px solid rgba(213, 237, 85, 0.4)',
                                                color: '#D5ED55',
                                                fontSize: '12.5px',
                                                fontWeight: '700',
                                                outline: 'none',
                                                boxSizing: 'border-box',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <option value="" style={{ background: '#08120A', color: '#8E9B92' }}>-- Select Tent / Dome Pod --</option>
                                            <option value="Pod #1 (Sunset Ridge Deck)" style={{ background: '#08120A', color: '#FFFFFF' }}>⛺ Pod #1 (Sunset Ridge Deck)</option>
                                            <option value="Pod #2 (Panoramic Glass Dome)" style={{ background: '#08120A', color: '#FFFFFF' }}>⛺ Pod #2 (Panoramic Glass Dome)</option>
                                            <option value="Pod #3 (Sunrise Cliff Edge)" style={{ background: '#08120A', color: '#FFFFFF' }}>⛺ Pod #3 (Sunrise Cliff Edge)</option>
                                            <option value="Pod #4 (Valley View Dome)" style={{ background: '#08120A', color: '#FFFFFF' }}>⛺ Pod #4 (Valley View Dome)</option>
                                            <option value="Pod #5 (Cloud View Pod)" style={{ background: '#08120A', color: '#FFFFFF' }}>⛺ Pod #5 (Cloud View Pod)</option>
                                            <option value="Alpine Tent A-1 (2-Person)" style={{ background: '#08120A', color: '#FFFFFF' }}>🏕️ Alpine Tent A-1 (2-Person)</option>
                                            <option value="Alpine Tent A-2 (2-Person)" style={{ background: '#08120A', color: '#FFFFFF' }}>🏕️ Alpine Tent A-2 (2-Person)</option>
                                            <option value="Alpine Quad Q-1 (4-Person)" style={{ background: '#08120A', color: '#FFFFFF' }}>🏕️ Alpine Quad Q-1 (4-Person)</option>
                                            <option value="Alpine Quad Q-2 (4-Person)" style={{ background: '#08120A', color: '#FFFFFF' }}>🏕️ Alpine Quad Q-2 (4-Person)</option>
                                            <option value="Cottage #1 (Cliffside Wooden)" style={{ background: '#08120A', color: '#FFFFFF' }}>🏡 Cottage #1 (Cliffside Wooden)</option>
                                            <option value="Cottage #2 (Honeymoon Suite)" style={{ background: '#08120A', color: '#FFFFFF' }}>🏡 Cottage #2 (Honeymoon Suite)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label style={{ fontSize: '11px', fontWeight: '700', color: '#8E9B92', display: 'block', marginBottom: '4px' }}>
                                            Wristband Tag # Range:
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. #104 - #107"
                                            value={wristbandRange}
                                            onChange={e => setWristbandRange(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '10px 12px',
                                                borderRadius: '10px',
                                                background: '#08120A',
                                                border: '1px solid rgba(255, 255, 255, 0.12)',
                                                color: '#FFFFFF',
                                                fontSize: '12.5px',
                                                outline: 'none',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ── BALANCE & CASH SETTLEMENT ── */}
                            <div style={{
                                background: '#101E13',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                borderRadius: '20px',
                                padding: '20px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <DollarSign size={18} color="#D5ED55" />
                                        <span style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>
                                            Gate Settlement
                                        </span>
                                    </div>
                                    <span style={{ fontSize: '12px', fontWeight: '800', color: isBalancePaid ? '#4ADE80' : '#FACC15' }}>
                                        {isBalancePaid ? '✓ SETTLED' : '⚠️ PAYMENT DUE'}
                                    </span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '8px', marginBottom: '14px' }}>
                                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '8px' }}>
                                        <span style={{ fontSize: '10px', color: '#8E9B92', display: 'block' }}>Total</span>
                                        <span style={{ fontSize: '13px', fontWeight: '800', color: '#FFFFFF' }}>₹{(scannedBooking.totalPrice + extraBalance).toLocaleString('en-IN')}</span>
                                    </div>
                                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '8px' }}>
                                        <span style={{ fontSize: '10px', color: '#8E9B92', display: 'block' }}>Advance</span>
                                        <span style={{ fontSize: '13px', fontWeight: '800', color: '#4ADE80' }}>₹{scannedBooking.advancePaid.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div style={{ background: isBalancePaid ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.12)', padding: '8px 10px', borderRadius: '8px' }}>
                                        <span style={{ fontSize: '10px', color: isBalancePaid ? '#4ADE80' : '#FCA5A5', display: 'block' }}>Collect</span>
                                        <span style={{ fontSize: '14px', fontWeight: '900', color: isBalancePaid ? '#4ADE80' : '#EF4444' }}>₹{isBalancePaid ? '0' : dynamicBalanceDue.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>

                                <label style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    background: isBalancePaid ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                                    border: `1px solid ${isBalancePaid ? '#22C55E' : 'rgba(255, 255, 255, 0.12)'}`,
                                    padding: '10px 12px',
                                    borderRadius: '12px',
                                    cursor: 'pointer'
                                }}>
                                    <input
                                        type="checkbox"
                                        checked={isBalancePaid}
                                        onChange={(e) => setIsBalancePaid(e.target.checked)}
                                        style={{ width: '18px', height: '18px', accentColor: '#22C55E', cursor: 'pointer' }}
                                    />
                                    <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#FFFFFF' }}>
                                        Mark balance (₹{dynamicBalanceDue}) as collected (Cash / UPI)
                                    </span>
                                </label>
                            </div>

                            {/* ── ACTION BUTTONS ── */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <button
                                    onClick={handleConfirmCheckin}
                                    disabled={isSubmittingCheckin}
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        borderRadius: '16px',
                                        background: shortCount > 0 ? '#F59E0B' : '#D5ED55',
                                        color: '#0B150E',
                                        fontSize: '15px',
                                        fontWeight: '900',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
                                    }}
                                >
                                    <CheckCircle2 size={18} />
                                    <span>
                                        {isSubmittingCheckin 
                                            ? 'Saving Gate Pass...' 
                                            : shortCount > 0 
                                                ? `Confirm Partial Gate Check-In (${presentCount} Present, ${shortCount} Short)` 
                                                : `Confirm Full Gate Entry (${presentCount}/${totalCount})`}
                                    </span>
                                </button>

                                <button
                                    onClick={resetScanner}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '14px',
                                        background: 'rgba(255, 255, 255, 0.08)',
                                        border: '1px solid rgba(255, 255, 255, 0.12)',
                                        color: '#FFFFFF',
                                        fontSize: '13.5px',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px'
                                    }}
                                >
                                    <ArrowLeft size={16} />
                                    <span>Scan Next Arrival / Back</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            )}

            {/* ── EMAIL TEST PASS MODAL ── */}
            {isTestEmailModalOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.85)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    zIndex: 100
                }}>
                    <div style={{
                        background: '#101E13',
                        border: '1px solid rgba(229, 169, 59, 0.3)',
                        borderRadius: '24px',
                        padding: '24px',
                        width: '100%',
                        maxWidth: '420px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Mail size={18} color="#E5A93B" />
                                <span style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF' }}>
                                    Dispatch Test Reservation Pass
                                </span>
                            </div>
                            <button
                                onClick={() => setIsTestEmailModalOpen(false)}
                                style={{ background: 'none', border: 'none', color: '#8E9B92', cursor: 'pointer' }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <p style={{ fontSize: '12.5px', color: '#A2B6A6', lineHeight: 1.45, margin: '0 0 16px' }}>
                            Enter your email address to receive an official booking pass with live QR code, 4-digit gate PIN, and PDF voucher via Resend.
                        </p>

                        <form onSubmit={handleSendTestEmail} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                                <label style={{ fontSize: '11px', fontWeight: '700', color: '#8E9B92', display: 'block', marginBottom: '4px' }}>
                                    Recipient Email:
                                </label>
                                <input
                                    type="email"
                                    required
                                    placeholder="yourname@gmail.com"
                                    value={testEmailInput}
                                    onChange={e => setTestEmailInput(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px 14px',
                                        borderRadius: '12px',
                                        background: '#08120A',
                                        border: '1px solid rgba(229, 169, 59, 0.4)',
                                        color: '#FFFFFF',
                                        fontSize: '14px',
                                        fontWeight: '700',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '10px' }}>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#8E9B92', display: 'block', marginBottom: '4px' }}>
                                        Lead Name:
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Aman Shekar"
                                        value={testNameInput}
                                        onChange={e => setTestNameInput(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '12px 14px',
                                            borderRadius: '12px',
                                            background: '#08120A',
                                            border: '1px solid rgba(255, 255, 255, 0.12)',
                                            color: '#FFFFFF',
                                            fontSize: '13px',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#8E9B92', display: 'block', marginBottom: '4px' }}>
                                        Guests:
                                    </label>
                                    <select
                                        value={testGuestsCount}
                                        onChange={e => setTestGuestsCount(Number(e.target.value))}
                                        style={{
                                            width: '100%',
                                            padding: '12px 14px',
                                            borderRadius: '12px',
                                            background: '#08120A',
                                            border: '1px solid rgba(255, 255, 255, 0.12)',
                                            color: '#FFFFFF',
                                            fontSize: '13px',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                    >
                                        <option value={2}>2 Campers</option>
                                        <option value={4}>4 Campers</option>
                                        <option value={6}>6 Campers</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSendingTestEmail}
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    borderRadius: '14px',
                                    background: '#E5A93B',
                                    color: '#0B150E',
                                    fontSize: '14px',
                                    fontWeight: '800',
                                    border: 'none',
                                    cursor: 'pointer',
                                    marginTop: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px'
                                }}
                            >
                                <Send size={15} />
                                <span>{isSendingTestEmail ? 'Sending via Resend...' : 'Send Live Pass Email →'}</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* ── MANUAL LOOKUP MODAL ── */}
            {isManualModalOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.85)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    zIndex: 100
                }}>
                    <div style={{
                        background: '#101E13',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '24px',
                        padding: '24px',
                        width: '100%',
                        maxWidth: '400px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <span style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF' }}>
                                Look up Booking Pass
                            </span>
                            <button
                                onClick={() => setIsManualModalOpen(false)}
                                style={{ background: 'none', border: 'none', color: '#8E9B92', cursor: 'pointer' }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleManualSearch}>
                            <input
                                type="text"
                                placeholder="e.g. BK-1234 or phone number"
                                value={manualIdInput}
                                onChange={e => setManualIdInput(e.target.value)}
                                autoFocus
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    borderRadius: '12px',
                                    background: '#08120A',
                                    border: '1px solid rgba(213, 237, 85, 0.4)',
                                    color: '#FFFFFF',
                                    fontSize: '15px',
                                    fontWeight: '700',
                                    outline: 'none',
                                    marginBottom: '16px',
                                    boxSizing: 'border-box'
                                }}
                            />

                            <button
                                type="submit"
                                disabled={isSearchingManual || !manualIdInput.trim()}
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    borderRadius: '14px',
                                    background: '#D5ED55',
                                    color: '#0B150E',
                                    fontSize: '14px',
                                    fontWeight: '800',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                {isSearchingManual ? 'Searching...' : 'Find & Check In Camper →'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
