"use client";
import React from 'react';
import { Settings, Save, Smartphone, MessageCircle, Database, ShieldCheck, AlertCircle } from 'lucide-react';
import { 
    META_LABEL_STYLE, ELLIPSIS_STYLE, MUTED_TEXT_11, ROW_SPACE_8, 
    ROW_SPACE_10, H2_STYLE, ROW_SPACE_WRAP, ROW_SPACE_14, FORM_INPUT_STYLE, FIELD_LABEL_STYLE 
} from '../AdminSharedStyles';

export default function AdminSettingsTab({
    adminPhone,
    setAdminPhone,
    adminTelegram,
    setAdminTelegram,
    handleSaveGeneralSettings,
    settingsSavedToast,
    isOnlineMode,
    bookings,
    fetchBookings
}) {
    return (
        <div>
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
                            <div style={ROW_SPACE_14}>
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
                            <div style={ROW_SPACE_14}>
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
        </div>
    );
}
