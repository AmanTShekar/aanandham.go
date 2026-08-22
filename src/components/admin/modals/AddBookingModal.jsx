"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Phone, IndianRupee, Mountain, Users, ShieldCheck } from 'lucide-react';
import { inr } from '../../../lib/utils';
import { 
    FORM_INPUT_STYLE, FIELD_LABEL_STYLE, H2_STYLE, COL_GAP_14 
} from '../AdminSharedStyles';

export default function AddBookingModal({
    isAddBookingModalOpen,
    setIsAddBookingModalOpen,
    newBookingForm,
    setNewBookingForm,
    handleSaveManualBooking,
    properties = []
}) {
    if (!isAddBookingModalOpen) return null;

    return (
        <AnimatePresence>
            <div style={{ position: 'fixed', inset: 0, zIndex: 100010, background: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                <motion.div initial={{ scale: 0.96, y: 14 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96 }} className="admin-modal-box">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(18, 22, 19, 0.08)', paddingBottom: '14px' }}>
                        <div>
                            <h3 style={H2_STYLE}>
                                Create Manual Reservation
                            </h3>
                            <div style={{ fontSize: '12px', color: '#59655D' }}>Record phone, walk-in or bespoke squad bookings</div>
                        </div>
                        <button onClick={() => setIsAddBookingModalOpen(false)} style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F8F9F5', border: 'none', color: '#121613', cursor: 'pointer', fontWeight: '800' }}>
                            <X size={15} strokeWidth={2.5} />
                        </button>
                    </div>

                    <form onSubmit={handleSaveManualBooking} style={COL_GAP_14}>
                        <div>
                            <label style={FIELD_LABEL_STYLE}>
                                Customer / Squad Name *
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Rahul & Squad (4 Pax)"
                                value={newBookingForm.name}
                                onChange={e => setNewBookingForm({ ...newBookingForm, name: e.target.value })}
                                style={FORM_INPUT_STYLE}
                            />
                        </div>

                        <div className="admin-form-grid-2">
                            <div>
                                <label style={FIELD_LABEL_STYLE}>
                                    Phone / WhatsApp *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="+91 98470 12345"
                                    value={newBookingForm.phone}
                                    onChange={e => setNewBookingForm({ ...newBookingForm, phone: e.target.value })}
                                    style={FORM_INPUT_STYLE}
                                />
                            </div>
                            <div>
                                <label style={FIELD_LABEL_STYLE}>
                                    Camp Sanctuary *
                                </label>
                                <select
                                    value={newBookingForm.campsite}
                                    onChange={e => setNewBookingForm({ ...newBookingForm, campsite: e.target.value })}
                                    style={FORM_INPUT_STYLE}
                                >
                                    {(properties || []).map(p => (
                                        <option key={p.id} value={p.title || p.name}>{p.title || p.name}</option>
                                    ))}
                                    <option value="Kolukkumalai Sunrise Glamping">Kolukkumalai Sunrise Glamping</option>
                                    <option value="900 Kandi Rainforest Retreat">900 Kandi Rainforest Retreat</option>
                                    <option value="Vagamon Pine Forest Camp">Vagamon Pine Forest Camp</option>
                                    <option value="Munnar Cloud Valley Estate">Munnar Cloud Valley Estate</option>
                                </select>
                            </div>
                        </div>

                        <div className="admin-form-grid-2">
                            <div>
                                <label style={FIELD_LABEL_STYLE}>
                                    Dates *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. 24 Oct - 25 Oct 2026"
                                    value={newBookingForm.dates}
                                    onChange={e => setNewBookingForm({ ...newBookingForm, dates: e.target.value })}
                                    style={FORM_INPUT_STYLE}
                                />
                            </div>
                            <div>
                                <label style={FIELD_LABEL_STYLE}>
                                    Headcount (Pax) *
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    value={newBookingForm.guests}
                                    onChange={e => setNewBookingForm({ ...newBookingForm, guests: Number(e.target.value) })}
                                    style={FORM_INPUT_STYLE}
                                />
                            </div>
                        </div>

                        <div className="admin-form-grid-2">
                            <div>
                                <label style={FIELD_LABEL_STYLE}>
                                    Price Per Guest (₹)
                                </label>
                                <input
                                    type="number"
                                    value={newBookingForm.pricePerGuest}
                                    onChange={e => setNewBookingForm({ ...newBookingForm, pricePerGuest: Number(e.target.value) })}
                                    style={FORM_INPUT_STYLE}
                                />
                            </div>
                            <div>
                                <label style={FIELD_LABEL_STYLE}>
                                    Advance Paid (₹)
                                </label>
                                <input
                                    type="number"
                                    value={newBookingForm.advancePaid}
                                    onChange={e => setNewBookingForm({ ...newBookingForm, advancePaid: Number(e.target.value) })}
                                    style={FORM_INPUT_STYLE}
                                />
                            </div>
                        </div>

                        <div className="admin-form-grid-2">
                            <div>
                                <label style={FIELD_LABEL_STYLE}>
                                    Veg Count
                                </label>
                                <input
                                    type="number"
                                    value={newBookingForm.vegCount}
                                    onChange={e => setNewBookingForm({ ...newBookingForm, vegCount: Number(e.target.value) })}
                                    style={FORM_INPUT_STYLE}
                                />
                            </div>
                            <div>
                                <label style={FIELD_LABEL_STYLE}>
                                    Non-Veg Count
                                </label>
                                <input
                                    type="number"
                                    value={newBookingForm.nonVegCount}
                                    onChange={e => setNewBookingForm({ ...newBookingForm, nonVegCount: Number(e.target.value) })}
                                    style={FORM_INPUT_STYLE}
                                />
                            </div>
                        </div>

                        <div className="admin-form-grid-2">
                            <div>
                                <label style={FIELD_LABEL_STYLE}>
                                    Assigned Tent / Room
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Tent T-04 / Safari Dome 1"
                                    value={newBookingForm.assignedTent || ''}
                                    onChange={e => setNewBookingForm({ ...newBookingForm, assignedTent: e.target.value })}
                                    style={FORM_INPUT_STYLE}
                                />
                            </div>
                            <div>
                                <label style={FIELD_LABEL_STYLE}>
                                    Initial Status
                                </label>
                                <select
                                    value={newBookingForm.status}
                                    onChange={e => setNewBookingForm({ ...newBookingForm, status: e.target.value })}
                                    style={FORM_INPUT_STYLE}
                                >
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Pending Deposit">Pending Deposit</option>
                                    <option value="Checked In">Checked In</option>
                                </select>
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
        </AnimatePresence>
    );
}
