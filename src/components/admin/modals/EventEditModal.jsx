"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { 
    H2_STYLE, COL_GAP_14, FIELD_LABEL_STYLE, FORM_INPUT_STYLE 
} from '../AdminSharedStyles';

export default function EventEditModal({
    isEventModalOpen,
    setIsEventModalOpen,
    editingEvent,
    eventForm,
    setEventForm,
    handleSaveEvent
}) {
    return (
        <AnimatePresence>
            {isEventModalOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 100010, background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                    <motion.div initial={{ scale: 0.96, y: 14 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96 }} className="admin-modal-box">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(18, 22, 19, 0.08)', paddingBottom: '14px' }}>
                            <h3 style={H2_STYLE}>
                                {editingEvent ? 'Edit Trek Batch' : 'Schedule New Event Batch'}
                            </h3>
                            <button onClick={() => setIsEventModalOpen(false)} style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F8F9F5', border: 'none', color: '#121613', cursor: 'pointer', fontWeight: '800' }}>
                                <X size={15} strokeWidth={2.5} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveEvent} style={COL_GAP_14}>
                            <div>
                                <label style={FIELD_LABEL_STYLE}>
                                    Event / Batch Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={eventForm.title}
                                    onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                                    style={FORM_INPUT_STYLE}
                                />
                            </div>

                            <div className="admin-form-grid-2">
                                <div>
                                    <label style={FIELD_LABEL_STYLE}>
                                        Dates *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={eventForm.dates}
                                        onChange={e => setEventForm({ ...eventForm, dates: e.target.value })}
                                        style={FORM_INPUT_STYLE}
                                    />
                                </div>
                                <div>
                                    <label style={FIELD_LABEL_STYLE}>
                                        Price Per Spot (INR) *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={eventForm.price}
                                        onChange={e => setEventForm({ ...eventForm, price: e.target.value })}
                                        style={FORM_INPUT_STYLE}
                                    />
                                </div>
                            </div>

                            <div className="admin-form-grid-2">
                                <div>
                                    <label style={FIELD_LABEL_STYLE}>
                                        Total Capacity (Pax) *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={eventForm.capacity}
                                        onChange={e => setEventForm({ ...eventForm, capacity: e.target.value })}
                                        style={FORM_INPUT_STYLE}
                                    />
                                </div>
                                <div>
                                    <label style={FIELD_LABEL_STYLE}>
                                        Booked Spots
                                    </label>
                                    <input
                                        type="number"
                                        value={eventForm.booked}
                                        onChange={e => setEventForm({ ...eventForm, booked: e.target.value })}
                                        style={FORM_INPUT_STYLE}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={FIELD_LABEL_STYLE}>
                                    Campsite Location
                                </label>
                                <input
                                    type="text"
                                    value={eventForm.campsite}
                                    onChange={e => setEventForm({ ...eventForm, campsite: e.target.value })}
                                    style={FORM_INPUT_STYLE}
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
    );
}
