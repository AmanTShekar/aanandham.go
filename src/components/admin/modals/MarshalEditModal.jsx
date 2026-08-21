"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, KeyRound, Briefcase, ShieldCheck, Mountain } from 'lucide-react';
import { 
    FORM_INPUT_STYLE, FIELD_LABEL_STYLE, H2_STYLE, COL_GAP_14 
} from '../AdminSharedStyles';

export default function MarshalEditModal({
    isMarshalModalOpen,
    setIsMarshalModalOpen,
    editingMarshal,
    marshalForm,
    setMarshalForm,
    handleSaveMarshal,
    properties
}) {
    if (!isMarshalModalOpen) return null;
    return (
        <AnimatePresence>
            <div style={{ position: 'fixed', inset: 0, zIndex: 100010, background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0px' }}>
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
                                         loading="lazy" decoding="async"/>
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

                            <form onSubmit={handleSaveMarshalForm} style={COL_GAP_14}>

                                {/* Full Name */}
                                <div>
                                    <label style={MICRO_LABEL}>
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
                                        <label style={MICRO_LABEL}>
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
                                        <label style={MICRO_LABEL}>
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
                                        <label style={MICRO_LABEL}>
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
                                    <label style={MICRO_LABEL}>
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
{editingMarshal ? '✓ Save Details' : '+ Add to Field Crew'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
            </div>
        </AnimatePresence>
    );
}
