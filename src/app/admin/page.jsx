"use client";
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import ErrorBoundary from '@/components/ErrorBoundary';
import MobileMarshalScanner from '@/components/admin/MobileMarshalScanner';
import { useAdminPortalState } from '@/components/admin/useAdminPortalState';

// Layout Submodules
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminAuthModal from '@/components/admin/AdminAuthModal';
import PropertyDetailInspector from '@/components/admin/PropertyDetailInspector';

// Tab Submodules
import AdminOverviewTab from '@/components/admin/tabs/AdminOverviewTab';
import AdminBookingsTab from '@/components/admin/tabs/AdminBookingsTab';
import AdminPropertiesTab from '@/components/admin/tabs/AdminPropertiesTab';
import AdminEventsTab from '@/components/admin/tabs/AdminEventsTab';
import AdminMarshalsTab from '@/components/admin/tabs/AdminMarshalsTab';
import AdminFinancialsTab from '@/components/admin/tabs/AdminFinancialsTab';
import AdminPaymentTab from '@/components/admin/tabs/AdminPaymentTab';
import AdminDiscountsTab from '@/components/admin/tabs/AdminDiscountsTab';
import AdminTestimonialsTab from '@/components/admin/tabs/AdminTestimonialsTab';
import AdminSettingsTab from '@/components/admin/tabs/AdminSettingsTab';
import AdminLogsTab from '@/components/admin/tabs/AdminLogsTab';

// Modal Submodules
import AddBookingModal from '@/components/admin/modals/AddBookingModal';
import PropertyEditModal from '@/components/admin/modals/PropertyEditModal';
import EventEditModal from '@/components/admin/modals/EventEditModal';
import MarshalEditModal from '@/components/admin/modals/MarshalEditModal';
import DeleteConfirmModal from '@/components/admin/modals/DeleteConfirmModal';

function AdminPortalInner() {
    const admin = useAdminPortalState();
    const {
        isAuthenticated, passcode, setPasscode, passcodeError, rememberMe, setRememberMe, handleLogin,
        activeTab, setActiveTab, activePropertyDetailId, setActivePropertyDetailId,
        properties, events, bookings, marshals, discounts, testimonials, dbLogs, authLogs, authStats,
        adminProfile, adminScopeCamp, isSidebarCollapsed, setIsSidebarCollapsed,
        isMobileSidebarOpen, setIsMobileSidebarOpen, isMobile, scannerOverlayOpen, setScannerOverlayOpen,
        toastMessage, handleLogout, showToast,
        // Modals state
        isPropertyModalOpen, setIsPropertyModalOpen, editingProperty, setEditingProperty, propertyForm, setPropertyForm,
        imageUrlInput, setImageUrlInput, handleSaveProperty,
        isAddBookingModalOpen, setIsAddBookingModalOpen, newBookingForm, setNewBookingForm, handleSaveBooking,
        isEventModalOpen, setIsEventModalOpen, editingEvent, setEditingEvent, eventForm, setEventForm, handleSaveEvent,
        isMarshalModalOpen, setIsMarshalModalOpen, editingMarshal, setEditingMarshal, marshalForm, setMarshalForm, handleSaveMarshal,
        deleteConfirmDialog, closeDeleteConfirm,
        // Tab specific
        stats, filteredBookings, bookingSearch, setBookingSearch, bookingFilterStatus, setBookingFilterStatus,
        bookingFilterCamp, setBookingFilterCamp, copiedBookingId, isExportingCsv, handleExportBookingsCsv,
        handleStatusChange, handleShareBookingWhatsApp, handleCopyBookingPassLink, openDeleteConfirm,
        filteredProperties, propertyFilterRegion, setPropertyFilterRegion, handleDeleteProperty,
        filteredEvents, handleDeleteEvent, filteredMarshals, handleDeleteMarshal,
        paymentSettings, setPaymentSettings, handleSavePaymentSettings, settingsSavedToast,
        setDiscounts, handleSaveDiscounts, discountsSaving, handleResetDiscounts,
        setTestimonials, handleSaveTestimonials, testimonialsSaving, handleResetTestimonials, handleAddTestimonial,
        adminPhone, setAdminPhone, adminTelegram, setAdminTelegram, handleSaveSettings,
        logViewTab, setLogViewTab, logSearch, setLogSearch, logFilterSeverity, setLogFilterSeverity,
        filteredLogs, filteredInquiries
    } = admin;

    const currentDetailProperty = properties.find(p => p.id === activePropertyDetailId) || null;

    const openPropertyModal = (prop = null) => {
        if (prop) {
            setEditingProperty(prop);
            setPropertyForm({ ...prop });
        } else {
            setEditingProperty(null);
            setPropertyForm({
                title: '',
                region: 'Munnar',
                category: 'Summit Trek & Glamp',
                tag: 'Bestseller',
                location: 'Munnar, Kerala',
                altitude: '7,900 FT',
                price: 2499,
                originalPrice: 3200,
                duration: '2 Days / 1 Night',
                difficulty: 'Moderate Offroad',
                image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
                gallery: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80'],
                description: '',
                highlights: '4x4 Jeep Safari, Campfire BBQ',
                inclusions: 'Stay, Meals, Safari',
                exclusions: 'Personal transport'
            });
        }
        setIsPropertyModalOpen(true);
    };

    const openAddRoomModal = () => {
        setEditingRoom(null);
        setRoomForm({
            name: '',
            capacity: '2 Adults',
            price: 2499,
            totalUnits: 8,
            image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80',
            features: 'Private Deck, King Bed, Mountain View'
        });
        setIsAddRoomModalOpen(true);
    };

    const openEditRoomModal = (room) => {
        setEditingRoom(room);
        setRoomForm({
            name: room.name || '',
            capacity: room.capacity || '2 Adults',
            price: room.price || 2499,
            totalUnits: room.totalUnits || 8,
            image: room.image || '',
            features: Array.isArray(room.features) ? room.features.join(', ') : (room.features || '')
        });
        setIsAddRoomModalOpen(true);
    };

    if (!isAuthenticated) {
        return (
            <AdminAuthModal
                passcode={passcode}
                setPasscode={setPasscode}
                passcodeError={passcodeError}
                rememberMe={rememberMe}
                setRememberMe={setRememberMe}
                handleLogin={handleLogin}
            />
        );
    }

    // ─────────────────────────────────────────────────────────────
    // DEDICATED PROPERTY INSPECTOR VIEW
    // ─────────────────────────────────────────────────────────────
    if (activePropertyDetailId && currentDetailProperty) {
        return (
            <PropertyDetailInspector
                currentDetailProperty={currentDetailProperty}
                setActivePropertyDetailId={setActivePropertyDetailId}
                openAddRoomModal={openAddRoomModal}
                openEditRoomModal={openEditRoomModal}
                handleDeleteRoom={handleDeleteRoom}
                openPropertyModal={openPropertyModal}
                isAddRoomModalOpen={isAddRoomModalOpen}
                setIsAddRoomModalOpen={setIsAddRoomModalOpen}
                editingRoom={editingRoom}
                roomForm={roomForm}
                setRoomForm={setRoomForm}
                handleSaveRoom={handleSaveRoom}
                handleUploadPhoto={handleUploadPhoto}
            />
        );
    }

    const financialStats = {
        totalRevenue: stats.totalRevenue,
        estimatedDirectCosts: Math.round(stats.totalRevenue * 0.45),
        estimatedNetProfit: stats.estimatedNetProfit,
        profitMarginPercent: stats.profitMarginPercent,
        paidBookingsCount: bookings.filter(b => b.status === 'Confirmed' || b.status === 'Checked In').length,
        totalBookingsCount: bookings.length
    };

    const navItems = [
        { id: 'overview', label: 'Overview' },
        { id: 'bookings', label: 'Bookings' },
        { id: 'properties', label: 'Campsites' },
        { id: 'events', label: 'Expeditions' },
        { id: 'marshals', label: 'Staff' },
        { id: 'financials', label: 'Ledger' },
        { id: 'payment', label: 'Payments' },
        { id: 'discounts', label: 'Discounts' },
        { id: 'testimonials', label: 'Reviews' },
        { id: 'logs', label: 'Logs' },
        { id: 'settings', label: 'Settings' }
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F9F5', color: '#121613' }}>
            {/* Sidebar Navigation */}
            <AdminSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isSidebarCollapsed={isSidebarCollapsed}
                setIsSidebarCollapsed={setIsSidebarCollapsed}
                isMobileSidebarOpen={isMobileSidebarOpen}
                setIsMobileSidebarOpen={setIsMobileSidebarOpen}
                isMobile={isMobile}
                navItems={navItems}
                handleLogout={handleLogout}
                setScannerOverlayOpen={setScannerOverlayOpen}
            />

            {/* Main Content Area */}
            <main style={{
                flex: 1,
                minWidth: 0,
                padding: isMobile ? '16px' : '28px 36px',
                marginLeft: isMobile ? 0 : (isSidebarCollapsed ? '72px' : '260px'),
                transition: 'margin-left 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
            }}>
                <AdminHeader
                    activeTab={activeTab}
                    bookingsCount={bookings.length}
                    isMobile={isMobile}
                    isMobileSidebarOpen={isMobileSidebarOpen}
                    setIsMobileSidebarOpen={setIsMobileSidebarOpen}
                    setScannerOverlayOpen={setScannerOverlayOpen}
                    fetchBookings={fetchBookings}
                    isOnlineMode={isOnlineMode}
                />

                {/* Tab Views */}
                {activeTab === 'overview' && (
                    <AdminOverviewTab
                        stats={stats}
                        properties={properties}
                        bookings={bookings}
                        marshals={marshals}
                        setActiveTab={setActiveTab}
                        openPropertyModal={openPropertyModal}
                        setIsAddBookingModalOpen={setIsAddBookingModalOpen}
                        setIsMarshalModalOpen={setIsMarshalModalOpen}
                        setScannerOverlayOpen={setScannerOverlayOpen}
                        fetchBookings={fetchBookings}
                    />
                )}

                {activeTab === 'bookings' && (
                    <AdminBookingsTab
                        bookings={bookings}
                        filteredBookings={filteredBookings}
                        bookingSearch={bookingSearch}
                        setBookingSearch={setBookingSearch}
                        bookingFilterStatus={bookingFilterStatus}
                        setBookingFilterStatus={setBookingFilterStatus}
                        bookingFilterCamp={bookingFilterCamp}
                        setBookingFilterCamp={setBookingFilterCamp}
                        bookingSortBy={bookingSortBy}
                        setBookingSortBy={setBookingSortBy}
                        properties={properties}
                        isLoadingBookings={isLoadingBookings}
                        fetchBookings={fetchBookings}
                        setIsAddBookingModalOpen={setIsAddBookingModalOpen}
                        handleStatusUpdate={handleStatusUpdate}
                        handleDeleteBooking={handleDeleteBooking}
                        handleExportBookingsCSV={handleExportBookingsCSV}
                        isOnlineMode={isOnlineMode}
                    />
                )}

                {activeTab === 'properties' && (
                    <AdminPropertiesTab
                        properties={properties}
                        propertyFilterRegion={propertyFilterRegion}
                        setPropertyFilterRegion={setPropertyFilterRegion}
                        openPropertyModal={openPropertyModal}
                        setActivePropertyDetailId={setActivePropertyDetailId}
                    />
                )}

                {activeTab === 'events' && (
                    <AdminEventsTab
                        events={events}
                        openEventModal={openEventModal}
                        handleDeleteEvent={handleDeleteEvent}
                    />
                )}

                {activeTab === 'marshals' && (
                    <AdminMarshalsTab
                        marshals={marshals}
                        properties={properties}
                        openMarshalModal={openMarshalModal}
                        handleDeleteMarshal={handleDeleteMarshal}
                        setScannerOverlayOpen={setScannerOverlayOpen}
                        handleQuickAddStaffPreset={handleQuickAddStaffPreset}
                    />
                )}

                {activeTab === 'financials' && (
                    <AdminFinancialsTab
                        financialStats={financialStats}
                        bookings={bookings}
                        handleExportLedgerCSV={handleExportLedgerCSV}
                    />
                )}

                {activeTab === 'payment' && (
                    <AdminPaymentTab
                        paymentSettings={paymentSettings}
                        setPaymentSettings={setPaymentSettings}
                        handleSavePaymentSettings={handleSavePaymentSettings}
                        settingsSavedToast={settingsSavedToast}
                    />
                )}

                {activeTab === 'discounts' && (
                    <AdminDiscountsTab
                        discounts={discounts}
                        setDiscounts={setDiscounts}
                        handleSaveDiscounts={handleSaveDiscounts}
                        discountsSaving={discountsSaving}
                        handleResetDefaultDiscounts={handleResetDefaultDiscounts}
                    />
                )}

                {activeTab === 'testimonials' && (
                    <AdminTestimonialsTab
                        testimonials={testimonials}
                        setTestimonials={setTestimonials}
                        handleSaveTestimonials={handleSaveTestimonials}
                        testimonialsSaving={testimonialsSaving}
                        handleResetDefaultTestimonials={handleResetDefaultTestimonials}
                        handleQuickAddRandomTestimonial={handleQuickAddRandomTestimonial}
                    />
                )}

                {activeTab === 'settings' && (
                    <AdminSettingsTab
                        adminPhone={adminPhone}
                        setAdminPhone={setAdminPhone}
                        adminTelegram={adminTelegram}
                        setAdminTelegram={setAdminTelegram}
                        handleSaveGeneralSettings={handleSaveGeneralSettings}
                        settingsSavedToast={settingsSavedToast}
                        isOnlineMode={isOnlineMode}
                        bookings={bookings}
                        fetchBookings={fetchBookings}
                    />
                )}

                {activeTab === 'logs' && (
                    <AdminLogsTab
                        logViewTab={logViewTab}
                        setLogViewTab={setLogViewTab}
                        logSearch={logSearch}
                        setLogSearch={setLogSearch}
                        logFilterSeverity={logFilterSeverity}
                        setLogFilterSeverity={setLogFilterSeverity}
                        auditLogs={auditLogs}
                        isLoadingAudit={isLoadingAudit}
                        fetchAuditLogs={fetchAuditLogs}
                        dbLogs={dbLogs}
                        securityOverview={securityOverview}
                        inquiries={inquiries}
                        fetchInquiries={fetchInquiries}
                    />
                )}
            </main>

            {/* Modals & Dialogs */}
            <AddBookingModal
                isAddBookingModalOpen={isAddBookingModalOpen}
                setIsAddBookingModalOpen={setIsAddBookingModalOpen}
                newBookingForm={newBookingForm}
                setNewBookingForm={setNewBookingForm}
                handleSaveManualBooking={handleSaveManualBooking}
                properties={properties}
            />

            <PropertyEditModal
                isPropertyModalOpen={isPropertyModalOpen}
                setIsPropertyModalOpen={setIsPropertyModalOpen}
                editingProperty={editingProperty}
                propertyForm={propertyForm}
                setPropertyForm={setPropertyForm}
                imageUrlInput={imageUrlInput}
                setImageUrlInput={setImageUrlInput}
                handleSaveProperty={handleSaveProperty}
                handleUploadPhoto={handleUploadPhoto}
                handleRemovePhoto={handleRemovePhoto}
            />

            <EventEditModal
                isEventModalOpen={isEventModalOpen}
                setIsEventModalOpen={setIsEventModalOpen}
                editingEvent={editingEvent}
                eventForm={eventForm}
                setEventForm={setEventForm}
                handleSaveEvent={handleSaveEvent}
                properties={properties}
            />

            <MarshalEditModal
                isMarshalModalOpen={isMarshalModalOpen}
                setIsMarshalModalOpen={setIsMarshalModalOpen}
                editingMarshal={editingMarshal}
                marshalForm={marshalForm}
                setMarshalForm={setMarshalForm}
                handleSaveMarshal={handleSaveMarshal}
                properties={properties}
            />

            <DeleteConfirmModal
                deleteConfirmDialog={deleteConfirmDialog}
                setDeleteConfirmDialog={setDeleteConfirmDialog}
            />

            {/* Mobile / Desktop Live QR Scanner Overlay */}
            {scannerOverlayOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 100030,
                    background: '#0B150E',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div style={{
                        padding: '12px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        background: '#121613'
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

export default function AdminPortal() {
    return (
        <ErrorBoundary
            title="Admin Command Station Glitch"
            description="The administrative dashboard encountered an unexpected state. Click retry to recover session state."
        >
            <AdminPortalInner />
        </ErrorBoundary>
    );
}

