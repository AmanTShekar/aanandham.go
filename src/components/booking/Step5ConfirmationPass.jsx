"use client";
import React from 'react';
import { PartyPopper, Calendar, MapPin, Tent, Users, ShieldCheck, Download, Share2, Copy, ExternalLink, QrCode } from 'lucide-react';
import { inr } from '../../lib/utils';
import { ROW_GAP_10 } from './BookingConstants';

export default function Step5ConfirmationPass({
    confirmedPass,
    handleSharePassToWhatsApp,
    onClose
}) {
    return (
                                <div style={{ textAlign: 'center' }}>
                                    {/* Success Icon */}
                                    <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: '#DCFCE7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '26px' }}>
                                        <Tent size={26} />
                                    </div>

                                    <span style={{ background: '#166534', color: '#D5ED55', fontSize: '10.5px', fontWeight: '800', padding: '3px 12px', borderRadius: '999px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                                        Wilderness Permit Locked
                                    </span>

                                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '800', color: '#121613', margin: '10px 0 4px' }}>
                                        You're Headed to {confirmedPass.package}!
                                    </h2>
                                    <p style={{ fontSize: '12.5px', color: '#59655D', margin: '0 0 18px' }}>
                                        Your reservation has been recorded in our high-altitude basecamp roster. Present this pass on arrival.
                                    </p>

                                    {/* Digital Boarding Pass Ticket Card */}
                                    <div style={{
                                        background: '#101E13',
                                        borderRadius: '20px',
                                        padding: '18px',
                                        color: '#FFFFFF',
                                        textAlign: 'left',
                                        border: '1px solid rgba(213,237,85,0.3)',
                                        boxShadow: '0 16px 48px rgba(0,0,0,0.25)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        marginBottom: '18px'
                                    }}>
                                        {/* Pass Header */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px dashed rgba(255,255,255,0.2)', paddingBottom: '12px', marginBottom: '12px' }}>
                                            <div>
                                                <div style={{ fontSize: '10px', color: '#D5ED55', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                    Official Boarding Pass
                                                </div>
                                                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800', color: '#FFFFFF', marginTop: '2px' }}>
                                                    {confirmedPass.package}
                                                </div>
                                                <div style={{ fontSize: '11.5px', color: '#A2B6A6' }}>
                                                    {confirmedPass.location} · {confirmedPass.altitude}
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '9.5px', color: '#A2B6A6' }}>PASS CODE:</div>
                                                <div style={{ fontSize: '14px', fontWeight: '900', color: '#D5ED55', letterSpacing: '0.5px' }}>
                                                    {confirmedPass.id}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Pass Grid Details */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '12px' }}>
                                            <div>
                                                <div style={{ fontSize: '10px', color: '#A2B6A6', textTransform: 'uppercase' }}>Lead Camper</div>
                                                <div style={{ fontSize: '12.5px', fontWeight: '800', color: '#FFFFFF' }}>{confirmedPass.name}</div>
                                                <div style={{ fontSize: '10.5px', color: '#D5ED55' }}>{confirmedPass.phone}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '10px', color: '#A2B6A6', textTransform: 'uppercase' }}>Expedition Batch</div>
                                                <div style={{ fontSize: '12.5px', fontWeight: '800', color: '#FFFFFF' }}>{confirmedPass.dates}</div>
                                                <div style={{ fontSize: '10.5px', color: '#A2B6A6' }}>Check-in: 02:00 PM</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '10px', color: '#A2B6A6', textTransform: 'uppercase' }}>Stay Units</div>
                                                <div style={{ fontSize: '12.5px', fontWeight: '800', color: '#FFFFFF' }}>{confirmedPass.roomType}</div>
                                                <div style={{ fontSize: '10.5px', color: '#A2B6A6' }}>{confirmedPass.guests} Campers</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '10px', color: '#A2B6A6', textTransform: 'uppercase' }}>Fare & Payment</div>
                                                <div style={{ fontSize: '12.5px', fontWeight: '800', color: '#D5ED55' }}>Paid: {inr(confirmedPass.paidAmount)}</div>
                                                <div style={{ fontSize: '10.5px', color: '#A2B6A6' }}>Due: {inr(confirmedPass.balanceDue)}</div>
                                            </div>
                                        </div>

                                        <div style={{ background: 'rgba(255,255,255,0.06)', padding: '8px 12px', borderRadius: '8px', fontSize: '11.5px', color: '#D5ED55', marginBottom: '8px' }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><Utensils size={13} /> <strong>Campfire Meal Prep:</strong> {confirmedPass.vegCount} Vegetarian + {confirmedPass.nonVegCount} Non-Veg BBQ ({confirmedPass.dietaryChoice})</span>
                                        </div>

                                        {confirmedPass.addons.length > 0 && (
                                            <div style={{ background: 'rgba(255,255,255,0.06)', padding: '8px 12px', borderRadius: '8px', fontSize: '11.5px', color: '#D5ED55', marginBottom: '10px' }}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><Sparkles size={13} /> <strong>Included Upgrades:</strong> {confirmedPass.addons.join(', ')}</span>
                                            </div>
                                        )}

                                        <div style={{ fontSize: '11px', color: '#A2B6A6', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <MapPin size={12} color="#D5ED55" />
                                            <span>Jeep convoy pickup coordinates shared via WhatsApp.</span>
                                        </div>
                                    </div>

                                    {/* Pass Action Buttons */}
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                        <button
                                            type="button"
                                            onClick={handleSharePassToWhatsApp}
                                            className="btn-lime"
                                            style={{
                                                padding: '10px 20px',
                                                fontSize: '13px',
                                                fontWeight: '900',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <span>Sync with Host on WhatsApp →</span>
                                        </button>
                                        
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            style={{
                                                padding: '10px 18px',
                                                borderRadius: '999px',
                                                background: '#ECEEE6',
                                                border: 'none',
                                                color: '#121613',
                                                fontSize: '12.5px',
                                                fontWeight: '800',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Done & Close
                                        </button>
                                    </div>
                                </div>
    );
}
