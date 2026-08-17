"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import jsQR from 'jsqr';
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
    ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

export default function MobileMarshalScanner({ onBackToAdmin = null }) {
    // Scanner State
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const animFrameRef = useRef(null);

    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [isScanning, setIsScanning] = useState(true);
    const [facingMode, setFacingMode] = useState('environment'); // 'environment' | 'user'
    const [torchOn, setTorchOn] = useState(false);
    const [hasTorchSupport, setHasTorchSupport] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [manualIdInput, setManualIdInput] = useState('');
    const [isSearchingManual, setIsSearchingManual] = useState(false);
    const [isManualModalOpen, setIsManualModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Scanned Booking Data
    const [scannedBooking, setScannedBooking] = useState(null);
    const [isValidating, setIsValidating] = useState(false);
    
    // Attendance & Headcount State for current scanned booking
    const [roster, setRoster] = useState([]);
    const [isBalancePaid, setIsBalancePaid] = useState(false);
    const [marshalNotes, setMarshalNotes] = useState('');
    const [isSubmittingCheckin, setIsSubmittingCheckin] = useState(false);
    const [checkinSuccessMessage, setCheckinSuccessMessage] = useState('');

    // Audio Chime Synthesizer (Zero external dependency)
    const playSuccessChime = useCallback(() => {
        if (!soundEnabled) return;
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const now = ctx.currentTime;
            
            // First note (High G)
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(783.99, now); // G5
            gain1.gain.setValueAtTime(0.3, now);
            gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            osc1.start(now);
            osc1.stop(now + 0.15);

            // Second note (High C)
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(1046.50, now + 0.12); // C6
            gain2.gain.setValueAtTime(0.4, now + 0.12);
            gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.start(now + 0.12);
            osc2.stop(now + 0.35);

            // Trigger haptic vibration if supported
            if (navigator.vibrate) {
                navigator.vibrate([80, 40, 100]);
            }
        } catch (e) {
            console.log('Audio feedback not supported:', e);
        }
    }, [soundEnabled]);

    // Initialize Camera Stream
    const startCamera = useCallback(async () => {
        try {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }

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
                setErrorMessage('');

                // Check Torch capabilities
                const track = stream.getVideoTracks()[0];
                const capabilities = track.getCapabilities ? track.getCapabilities() : {};
                setHasTorchSupport(Boolean(capabilities.torch));
            }
        } catch (err) {
            console.error('Camera access error:', err);
            setHasCameraPermission(false);
            setErrorMessage('Camera access was denied or not supported. You can upload an image or type the Booking ID below.');
        }
    }, [facingMode]);

    // Stop Camera Stream
    const stopCamera = useCallback(() => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        if (animFrameRef.current) {
            cancelAnimationFrame(animFrameRef.current);
        }
    }, []);

    // Toggle Torch / Flashlight
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

    // Process Scanned QR Code String
    const handleScannedResult = useCallback(async (rawQrData) => {
        if (!rawQrData || isValidating) return;

        setIsScanning(false);
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
                setRoster(data.booking.roster || []);
                setIsBalancePaid(Boolean(data.booking.isBalancePaid));
                setMarshalNotes(data.booking.marshalNotes || '');
            } else {
                setErrorMessage(data.message || 'Scanned QR code is invalid or not found in reservations database.');
                setScannedBooking(null);
            }
        } catch (err) {
            console.error('Validation request failed:', err);
            setErrorMessage('Network error validating pass. Check internet connection or verify offline.');
        } finally {
            setIsValidating(false);
        }
    }, [isValidating, playSuccessChime]);

    // Live Frame QR Detection Loop
    useEffect(() => {
        let isSubscribed = true;

        const scanFrame = () => {
            if (!isSubscribed) return;

            if (isScanning && videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
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
                        return; // Stop scanning loop on detection
                    }
                }
            }

            if (isScanning) {
                animFrameRef.current = requestAnimationFrame(scanFrame);
            }
        };

        if (isScanning) {
            startCamera().then(() => {
                animFrameRef.current = requestAnimationFrame(scanFrame);
            });
        } else {
            stopCamera();
        }

        return () => {
            isSubscribed = false;
            stopCamera();
        };
    }, [isScanning, facingMode, handleScannedResult, startCamera, stopCamera]);

    // Handle Manual ID Search
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
                setRoster(data.booking.roster || []);
                setIsBalancePaid(Boolean(data.booking.isBalancePaid));
                setMarshalNotes(data.booking.marshalNotes || '');
                setIsManualModalOpen(false);
                setIsScanning(false);
            } else {
                setErrorMessage(data.message || `No booking found for #${manualIdInput}`);
            }
        } catch (err) {
            setErrorMessage('Failed to search booking ID.');
        } finally {
            setIsSearchingManual(false);
        }
    };

    // Handle Image Upload Scan
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
                    setErrorMessage('Could not detect a valid QR code in the uploaded image. Please try a clearer screenshot.');
                }
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    // Toggle Individual Camper Presence
    const toggleCamperAttendance = (index) => {
        setRoster(prev => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                present: !updated[index].present
            };
            return updated;
        });
    };

    // Calculate Live Headcount
    const presentCount = roster.filter(c => c.present).length;
    const totalCount = roster.length;
    const shortCount = Math.max(0, totalCount - presentCount);

    // Submit Marshal Check-In
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
                    roster,
                    isBalancePaid,
                    marshalNotes,
                    marshalName: 'Basecamp Marshal'
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
                    isBalancePaid
                }));
                playSuccessChime();
            } else {
                setErrorMessage(data.message || 'Failed to complete check-in');
            }
        } catch (err) {
            setErrorMessage('Network error saving check-in.');
        } finally {
            setIsSubmittingCheckin(false);
        }
    };

    // Reset Scanner for Next Camper
    const resetScanner = () => {
        setScannedBooking(null);
        setCheckinSuccessMessage('');
        setErrorMessage('');
        setManualIdInput('');
        setIsScanning(true);
    };

    return (
        <div style={{
            minHeight: '100dvh',
            background: '#08120A',
            color: '#FFFFFF',
            fontFamily: 'var(--font-jakarta), sans-serif',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflowX: 'hidden'
        }}>
            {/* Hidden canvas for video frame decoding */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {/* ── TOP MARSHAL HEADER ── */}
            <header style={{
                background: 'rgba(11, 21, 14, 0.95)',
                backdropFilter: 'blur(16px)',
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
                                MARSHAL
                            </span>
                        </div>
                        <span style={{ fontSize: '11px', color: '#8E9B92', display: 'block' }}>
                            Basecamp QR & Headcount Scanner
                        </span>
                    </div>
                </div>

                {/* Quick Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        style={{
                            background: soundEnabled ? 'rgba(213, 237, 85, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                            border: `1px solid ${soundEnabled ? 'rgba(213, 237, 85, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
                            color: soundEnabled ? '#D5ED55' : '#8E9B92',
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                        title={soundEnabled ? 'Mute Chimes' : 'Enable Chimes'}
                    >
                        {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                    </button>
                    {isScanning && hasTorchSupport && (
                        <button
                            onClick={toggleTorch}
                            style={{
                                background: torchOn ? '#D5ED55' : 'rgba(255, 255, 255, 0.06)',
                                border: '1px solid rgba(255, 255, 255, 0.12)',
                                color: torchOn ? '#0B150E' : '#FFFFFF',
                                width: '36px',
                                height: '36px',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                            }}
                            title="Toggle Flashlight / Torch"
                        >
                            <Flashlight size={16} />
                        </button>
                    )}
                </div>
            </header>

            {/* ── ERROR / NOTIFICATION TOAST ── */}
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

            {/* ── MAIN SCANNER VIEWPORT ── */}
            {isScanning && !scannedBooking && (
                <main style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    padding: '20px'
                }}>
                    {/* Live Video Feed */}
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: '400px',
                        aspectRatio: '1 / 1',
                        borderRadius: '28px',
                        overflow: 'hidden',
                        boxShadow: '0 0 50px rgba(0, 0, 0, 0.8), 0 0 0 2px rgba(213, 237, 85, 0.2)',
                        background: '#000000'
                    }}>
                        <video
                            ref={videoRef}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />

                        {/* Scanner Viewfinder Overlay */}
                        <div style={{
                            position: 'absolute',
                            inset: '14%',
                            border: '2px solid rgba(213, 237, 85, 0.5)',
                            borderRadius: '20px',
                            pointerEvents: 'none',
                            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.65)'
                        }}>
                            {/* Animated Laser Scanning Line */}
                            <div style={{
                                position: 'absolute',
                                width: '100%',
                                height: '2px',
                                background: 'linear-gradient(90deg, rgba(213,237,85,0) 0%, #D5ED55 50%, rgba(213,237,85,0) 100%)',
                                boxShadow: '0 0 12px #D5ED55',
                                animation: 'scanline 2s infinite ease-in-out'
                            }} />

                            {/* Corner Targeting Reticles */}
                            <div style={{ position: 'absolute', top: '-2px', left: '-2px', width: '20px', height: '20px', borderTop: '4px solid #D5ED55', borderLeft: '4px solid #D5ED55', borderTopLeftRadius: '12px' }} />
                            <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '20px', height: '20px', borderTop: '4px solid #D5ED55', borderRight: '4px solid #D5ED55', borderTopRightRadius: '12px' }} />
                            <div style={{ position: 'absolute', bottom: '-2px', left: '-2px', width: '20px', height: '20px', borderBottom: '4px solid #D5ED55', borderLeft: '4px solid #D5ED55', borderBottomLeftRadius: '12px' }} />
                            <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '20px', height: '20px', borderBottom: '4px solid #D5ED55', borderRight: '4px solid #D5ED55', borderBottomRightRadius: '12px' }} />
                        </div>

                        {/* Loading Indicator during verification */}
                        {isValidating && (
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'rgba(11, 21, 14, 0.85)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                zIndex: 10
                            }}>
                                <div className="spinner-border" style={{ width: '40px', height: '40px', border: '3px solid rgba(213,237,85,0.2)', borderTopColor: '#D5ED55', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                <span style={{ fontSize: '13px', fontWeight: '700', color: '#D5ED55' }}>
                                    Verifying Cryptographic Pass...
                                </span>
                            </div>
                        )}
                    </div>

                    <p style={{
                        textAlign: 'center',
                        fontSize: '13px',
                        color: '#A2B6A6',
                        margin: '18px 0 24px',
                        maxWidth: '320px',
                        lineHeight: 1.5
                    }}>
                        Point camera at the camper&apos;s phone pass, PDF voucher, or physical wristband QR.
                    </p>

                    {/* Quick Marshal Options Bar */}
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        width: '100%',
                        maxWidth: '400px'
                    }}>
                        {/* Camera Flip */}
                        <button
                            onClick={() => setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')}
                            style={{
                                flex: 1,
                                minWidth: '110px',
                                padding: '12px 14px',
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

                        {/* File Upload QR */}
                        <label
                            style={{
                                flex: 1,
                                minWidth: '110px',
                                padding: '12px 14px',
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
                            <Upload size={15} />
                            <span>From Gallery</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                style={{ display: 'none' }}
                            />
                        </label>

                        {/* Manual Search */}
                        <button
                            onClick={() => setIsManualModalOpen(true)}
                            style={{
                                flex: 1,
                                minWidth: '110px',
                                padding: '12px 14px',
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

            {/* ── SCANNED BOOKING & ATTENDANCE CARD ── */}
            {scannedBooking && (
                <main style={{
                    flex: 1,
                    padding: '20px clamp(16px, 4vw, 24px) 100px',
                    maxWidth: '640px',
                    margin: '0 auto',
                    width: '100%',
                    boxSizing: 'border-box'
                }}>
                    {/* Check-In Success Banner */}
                    {checkinSuccessMessage && (
                        <div style={{
                            background: 'rgba(34, 197, 94, 0.15)',
                            border: '1px solid #22C55E',
                            borderRadius: '16px',
                            padding: '16px',
                            color: '#4ADE80',
                            fontSize: '13.5px',
                            fontWeight: '700',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <CheckCircle2 size={20} />
                            <span>{checkinSuccessMessage}</span>
                        </div>
                    )}

                    {/* Authenticity Status Card */}
                    <div style={{
                        background: scannedBooking.status === 'Checked In' 
                            ? 'rgba(59, 130, 246, 0.12)' 
                            : 'rgba(213, 237, 85, 0.12)',
                        border: `1px solid ${scannedBooking.status === 'Checked In' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(213, 237, 85, 0.3)'}`,
                        borderRadius: '20px',
                        padding: '18px 20px',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '42px',
                                height: '42px',
                                borderRadius: '12px',
                                background: scannedBooking.status === 'Checked In' ? '#3B82F6' : '#D5ED55',
                                color: '#0B150E',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: scannedBooking.status === 'Checked In' ? '#93C5FD' : '#D5ED55' }}>
                                    {scannedBooking.status === 'Checked In' ? 'ALREADY CHECKED IN' : 'VERIFIED AANANDHAM PASS'}
                                </span>
                                <div style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF' }}>
                                    #{scannedBooking.id}
                                </div>
                            </div>
                        </div>
                        <span style={{
                            padding: '4px 10px',
                            borderRadius: '999px',
                            background: scannedBooking.status === 'Checked In' ? 'rgba(59,130,246,0.2)' : 'rgba(213,237,85,0.2)',
                            color: scannedBooking.status === 'Checked In' ? '#93C5FD' : '#D5ED55',
                            fontSize: '11.5px',
                            fontWeight: '800'
                        }}>
                            {scannedBooking.status}
                        </span>
                    </div>

                    {/* Camper Profile & Campsite Info */}
                    <div style={{
                        background: '#101E13',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '20px',
                        padding: '22px',
                        marginBottom: '20px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                            <div>
                                <span style={{ fontSize: '11px', fontWeight: '700', color: '#8E9B92', textTransform: 'uppercase' }}>
                                    Lead Camper
                                </span>
                                <div style={{ fontSize: '19px', fontWeight: '800', color: '#FFFFFF', marginTop: '2px' }}>
                                    {scannedBooking.name}
                                </div>
                                <div style={{ fontSize: '13px', color: '#A2B6A6', marginTop: '4px' }}>
                                    📱 {scannedBooking.phone}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <a
                                    href={`tel:${scannedBooking.phone}`}
                                    style={{
                                        width: '38px',
                                        height: '38px',
                                        borderRadius: '10px',
                                        background: 'rgba(255, 255, 255, 0.08)',
                                        color: '#FFFFFF',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textDecoration: 'none'
                                    }}
                                    title="Call Camper"
                                >
                                    <Phone size={16} />
                                </a>
                                <a
                                    href={`https://wa.me/${scannedBooking.phone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(scannedBooking.name)}%2C%20welcome%20to%20Aanandham%20Wilderness!`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        width: '38px',
                                        height: '38px',
                                        borderRadius: '10px',
                                        background: 'rgba(37, 211, 102, 0.15)',
                                        color: '#25D366',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textDecoration: 'none'
                                    }}
                                    title="WhatsApp Camper"
                                >
                                    <MessageCircle size={16} />
                                </a>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div>
                                <span style={{ fontSize: '11px', color: '#8E9B92', display: 'block' }}>Campsite & Ridge:</span>
                                <span style={{ fontSize: '13px', fontWeight: '700', color: '#D5ED55' }}>
                                    {scannedBooking.campsite}
                                </span>
                            </div>
                            <div>
                                <span style={{ fontSize: '11px', color: '#8E9B92', display: 'block' }}>Stay Dates:</span>
                                <span style={{ fontSize: '13px', fontWeight: '700', color: '#FFFFFF' }}>
                                    {scannedBooking.dates}
                                </span>
                            </div>
                            <div>
                                <span style={{ fontSize: '11px', color: '#8E9B92', display: 'block' }}>Tent / Pod Setup:</span>
                                <span style={{ fontSize: '13px', fontWeight: '700', color: '#FFFFFF' }}>
                                    {scannedBooking.roomType}
                                </span>
                            </div>
                            <div>
                                <span style={{ fontSize: '11px', color: '#8E9B92', display: 'block' }}>4x4 Convoy Batch:</span>
                                <span style={{ fontSize: '13px', fontWeight: '700', color: '#FFFFFF' }}>
                                    {scannedBooking.convoyTime || '02:30 PM Departure'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ── HEADCOUNT TRACKER & ROSTER CHECKLIST ── */}
                    <div style={{
                        background: '#101E13',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '20px',
                        padding: '22px',
                        marginBottom: '20px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Users size={18} color="#D5ED55" />
                                <span style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Camper Headcount & Attendance
                                </span>
                            </div>
                            {/* Live Attendance Pill */}
                            <span style={{
                                padding: '4px 12px',
                                borderRadius: '999px',
                                background: shortCount === 0 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                                color: shortCount === 0 ? '#4ADE80' : '#FACC15',
                                fontSize: '12px',
                                fontWeight: '800'
                            }}>
                                {shortCount === 0 
                                    ? `🟢 All ${presentCount} Campers Present` 
                                    : `⚠️ ${presentCount} of ${totalCount} Present (${shortCount} Short)`}
                            </span>
                        </div>

                        {/* Interactive Camper Checklist */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {roster.map((camper, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => toggleCamperAttendance(idx)}
                                    style={{
                                        background: camper.present ? 'rgba(213, 237, 85, 0.06)' : 'rgba(239, 68, 68, 0.08)',
                                        border: `1px solid ${camper.present ? 'rgba(213, 237, 85, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                                        borderRadius: '14px',
                                        padding: '12px 16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{
                                            width: '28px',
                                            height: '28px',
                                            borderRadius: '50%',
                                            background: camper.present ? '#D5ED55' : '#EF4444',
                                            color: '#0B150E',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: '800',
                                            fontSize: '12px'
                                        }}>
                                            {camper.present ? '✓' : '✕'}
                                        </div>
                                        <div>
                                            <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#FFFFFF' }}>
                                                {camper.name}
                                            </span>
                                            <span style={{ fontSize: '11px', color: '#8E9B92', display: 'block' }}>
                                                {idx === 0 ? 'Lead Organizer' : `Guest Slot #${idx + 1}`}
                                            </span>
                                        </div>
                                    </div>
                                    <span style={{
                                        fontSize: '12px',
                                        fontWeight: '800',
                                        color: camper.present ? '#D5ED55' : '#EF4444'
                                    }}>
                                        {camper.present ? 'Present' : 'Absent / Short'}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Meal Preference Tally */}
                        <div style={{ marginTop: '16px', padding: '12px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Utensils size={14} color="#8E9B92" />
                                <span style={{ fontSize: '12.5px', color: '#A2B6A6' }}>
                                    🥗 Veg BBQ: <strong style={{ color: '#FFFFFF' }}>{scannedBooking.vegCount}</strong>
                                </span>
                            </div>
                            <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)' }} />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Utensils size={14} color="#8E9B92" />
                                <span style={{ fontSize: '12.5px', color: '#A2B6A6' }}>
                                    🍗 Non-Veg BBQ: <strong style={{ color: '#FFFFFF' }}>{scannedBooking.nonVegCount}</strong>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ── PAYMENT & BALANCE SETTLEMENT CARD ── */}
                    <div style={{
                        background: '#101E13',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '20px',
                        padding: '22px',
                        marginBottom: '20px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <DollarSign size={18} color="#D5ED55" />
                                <span style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Balance Settlement
                                </span>
                            </div>
                            <span style={{
                                fontSize: '12px',
                                fontWeight: '800',
                                color: isBalancePaid ? '#4ADE80' : '#FACC15'
                            }}>
                                {isBalancePaid ? '✓ SETTLED' : '⚠️ PAYMENT DUE'}
                            </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '10px', marginBottom: '16px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '10px' }}>
                                <span style={{ fontSize: '10.5px', color: '#8E9B92', display: 'block' }}>Total Amount</span>
                                <span style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>
                                    ₹{scannedBooking.totalPrice.toLocaleString('en-IN')}
                                </span>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '10px' }}>
                                <span style={{ fontSize: '10.5px', color: '#8E9B92', display: 'block' }}>Advance Paid</span>
                                <span style={{ fontSize: '14px', fontWeight: '800', color: '#4ADE80' }}>
                                    ₹{scannedBooking.advancePaid.toLocaleString('en-IN')}
                                </span>
                            </div>
                            <div style={{ background: isBalancePaid ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.12)', border: `1px solid ${isBalancePaid ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, padding: '10px 12px', borderRadius: '10px' }}>
                                <span style={{ fontSize: '10.5px', color: isBalancePaid ? '#4ADE80' : '#FCA5A5', display: 'block' }}>
                                    {isBalancePaid ? 'Balance Paid' : 'Collect on Arrival'}
                                </span>
                                <span style={{ fontSize: '15px', fontWeight: '900', color: isBalancePaid ? '#4ADE80' : '#EF4444' }}>
                                    ₹{isBalancePaid ? '0' : scannedBooking.balanceDue.toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>

                        {/* Balance Paid Checkbox Toggle */}
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            background: isBalancePaid ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                            border: `1px solid ${isBalancePaid ? '#22C55E' : 'rgba(255, 255, 255, 0.12)'}`,
                            padding: '12px 14px',
                            borderRadius: '12px',
                            cursor: 'pointer'
                        }}>
                            <input
                                type="checkbox"
                                checked={isBalancePaid}
                                onChange={(e) => setIsBalancePaid(e.target.checked)}
                                style={{ width: '18px', height: '18px', accentColor: '#22C55E', cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: '13px', fontWeight: '700', color: '#FFFFFF' }}>
                                Mark remaining balance (₹{scannedBooking.balanceDue}) as collected (Cash / UPI)
                            </span>
                        </label>
                    </div>

                    {/* Marshal Notes Field */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#8E9B92', display: 'block', marginBottom: '6px' }}>
                            Marshal Observation & Tent Allocation Notes:
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Tent #3 assigned. 1 camper joining after dinner."
                            value={marshalNotes}
                            onChange={e => setMarshalNotes(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                background: '#101E13',
                                border: '1px solid rgba(255, 255, 255, 0.12)',
                                color: '#FFFFFF',
                                fontSize: '13px',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    {/* ── ACTION BUTTONS ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                                fontWeight: '800',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
                            }}
                        >
                            <CheckCircle2 size={18} />
                            <span>
                                {isSubmittingCheckin 
                                    ? 'Saving Check-In...' 
                                    : shortCount > 0 
                                        ? `Confirm Partial Check-In (${presentCount} Present, ${shortCount} Short)` 
                                        : `Confirm Full Check-In (${presentCount}/${totalCount})`}
                            </span>
                        </button>

                        <button
                            onClick={resetScanner}
                            style={{
                                width: '100%',
                                padding: '14px',
                                borderRadius: '16px',
                                background: 'rgba(255, 255, 255, 0.08)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                color: '#FFFFFF',
                                fontSize: '14px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            <QrCode size={16} />
                            <span>Scan Next Camper Pass</span>
                        </button>
                    </div>
                </main>
            )}

            {/* ── MANUAL BOOKING ID MODAL ── */}
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
                                placeholder="e.g. BK-1234 or camper phone"
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
