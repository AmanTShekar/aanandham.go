"use client";
import React from 'react';
import { ScrollText, Search, RefreshCw, ShieldCheck, Database, Inbox, User, AlertCircle, KeyRound } from 'lucide-react';
import { 
    META_LABEL_STYLE, ELLIPSIS_STYLE, MUTED_TEXT_11, ROW_SPACE_8, 
    ROW_SPACE_10, H2_STYLE, ROW_SPACE_WRAP, ROW_SPACE_14, FORM_INPUT_STYLE 
} from '../AdminSharedStyles';

export default function AdminLogsTab({
    logViewTab = 'auth',
    setLogViewTab,
    logSearch = '',
    setLogSearch,
    logFilterSeverity = 'all',
    setLogFilterSeverity,
    auditLogs = [],
    isLoadingAudit = false,
    fetchAuditLogs,
    dbLogs = [],
    securityOverview = {},
    inquiries = [],
    fetchInquiries
}) {
    const handleExportBackup = () => {
        const data = JSON.stringify({ auditLogs, dbLogs, securityOverview, inquiries, exportedAt: new Date().toISOString() }, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Aanandham_Audit_Bundle_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
    };

    const handleExportWalBackup = () => {
        handleExportBackup();
    };

    return (
        <div style={{ width: '100%' }}>
            <div style={ROW_SPACE_WRAP}>
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
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => { if (fetchAuditLogs) fetchAuditLogs(); if (fetchInquiries) fetchInquiries(); }}
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
                        <RefreshCw size={13} />
                        <span>Refresh Live Logs</span>
                    </button>
                    <button
                        onClick={handleExportBackup}
                        className="btn-lime"
                        style={{ padding: '9px 18px', fontSize: '12.5px', fontWeight: '800' }}
                    >
                        Export Audit Bundle
                    </button>
                </div>
            </div>

            {/* Tab Bar */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
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
                    <ShieldCheck size={14} />
                    <span>Authentication Logs</span>
                    <span style={{ background: logViewTab === 'auth' ? '#D5ED55' : 'rgba(18,22,19,0.08)', color: logViewTab === 'auth' ? '#0B150E' : '#59655D', fontSize: '11px', fontWeight: '800', padding: '1px 7px', borderRadius: '999px' }}>
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
                    <Database size={14} />
                    <span>Database Mutation Trail</span>
                    <span style={{ background: logViewTab === 'db' ? '#D5ED55' : 'rgba(18,22,19,0.08)', color: logViewTab === 'db' ? '#0B150E' : '#59655D', fontSize: '11px', fontWeight: '800', padding: '1px 7px', borderRadius: '999px' }}>
                        {dbLogs.length || 0}
                    </span>
                </button>

                <button
                    onClick={() => setLogViewTab('security')}
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
                    <KeyRound size={14} />
                    <span>Security & Blocks</span>
                    <span style={{ background: logViewTab === 'security' ? '#D5ED55' : 'rgba(18,22,19,0.08)', color: logViewTab === 'security' ? '#0B150E' : '#59655D', fontSize: '11px', fontWeight: '800', padding: '1px 7px', borderRadius: '999px' }}>
                        {securityOverview?.recentEvents?.length || 0}
                    </span>
                </button>

                <button
                    onClick={() => setLogViewTab('inquiries')}
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
                    <Inbox size={14} />
                    <span>Contact Inquiries</span>
                    <span style={{ background: logViewTab === 'inquiries' ? '#D5ED55' : 'rgba(18,22,19,0.08)', color: logViewTab === 'inquiries' ? '#0B150E' : '#59655D', fontSize: '11px', fontWeight: '800', padding: '1px 7px', borderRadius: '999px' }}>
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
                                        background: log.status === 'SUCCESS' ? '#DCFCE7' : log.status === 'BLOCKED' ? '#FEE2E2' : '#FEF3C7',
                                        color: log.status === 'SUCCESS' ? '#166534' : log.status === 'BLOCKED' ? '#991B1B' : '#B45309'
                                    }}>
                                        {log.action}
                                    </span>
                                    <div style={{ fontSize: '11px', color: '#7D8880', marginTop: '4px' }}>
                                        IP: {log.ip}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontWeight: '700', color: '#121613' }}>Role: {log.role}</div>
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
                        {(dbLogs || [])
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
                                        <span style={{ fontSize: '11px', fontWeight: '800', padding: '2px 8px', borderRadius: '6px', background: '#E0F2FE', color: '#0369A1' }}>
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
                        {dbLogs.length === 0 && (
                            <div style={{ padding: '18px', borderRadius: '12px', background: '#F8F9F5', fontSize: '12.5px', color: '#59655D', textAlign: 'center' }}>
                                No database mutations recorded in this session.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* VIEW 3: SECURITY & BLOCKS */}
            {logViewTab === 'security' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

                    <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid rgba(18, 22, 19, 0.08)', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                        <div className="admin-audit-scroll" style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '460px', overflowY: 'auto', overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}>
                            {(securityOverview.recentEvents || [])
                                .filter(e => !logSearch || JSON.stringify(e).toLowerCase().includes(logSearch.toLowerCase()))
                                .map((evt, idx) => (
                                    <div key={evt.id || idx} style={{ padding: '14px 18px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.06)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', alignItems: 'center', fontSize: '12.5px' }}>
                                        <div>
                                            <span style={{ fontSize: '11px', fontWeight: '800', padding: '2px 8px', borderRadius: '6px', background: '#FEE2E2', color: '#991B1B' }}>
                                                {evt.type || 'SECURITY_ALERT'}
                                            </span>
                                            <div style={{ fontSize: '11px', color: '#7D8880', marginTop: '4px' }}>IP: {evt.ip}</div>
                                        </div>
                                        <div style={{ gridColumn: 'span 2' }}>
                                            <div style={{ fontWeight: '700', color: '#121613' }}>{evt.reason || 'Rate limit or suspicious activity'}</div>
                                            <div style={{ fontSize: '11px', color: '#7D8880' }}>Fingerprint: {evt.fingerprint || 'N/A'}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '11px', color: '#7D8880' }}>
                                                {new Date(evt.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            {(!securityOverview.recentEvents || securityOverview.recentEvents.length === 0) && (
                                <div style={{ padding: '18px', borderRadius: '12px', background: '#F8F9F5', fontSize: '12.5px', color: '#59655D', textAlign: 'center' }}>
                                    No security events recorded. System is running cleanly.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* VIEW 4: CONTACT INQUIRIES */}
            {logViewTab === 'inquiries' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ fontSize: '13px', color: '#59655D' }}>
                            Contact form submissions — stored as standalone inquiries (INQ- references).
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
                            {(inquiries || [])
                                .filter(q => !logSearch || JSON.stringify(q).toLowerCase().includes(logSearch.toLowerCase()))
                                .map((inq, idx) => (
                                    <div key={inq.id || idx} style={{ padding: '14px 18px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.06)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', alignItems: 'center', fontSize: '12.5px' }}>
                                        <div>
                                            <span style={{ fontSize: '10.5px', fontWeight: '800', padding: '2px 8px', borderRadius: '6px', background: '#E0F2FE', color: '#0369A1' }}>
                                                {(inq.inquiryType || 'general').toUpperCase()}
                                            </span>
                                            <div style={{ fontWeight: '800', color: '#121613', marginTop: '4px' }}>{inq.name}</div>
                                            <div style={{ fontSize: '11px', color: '#7D8880', fontFamily: 'monospace' }}>{inq.id}</div>
                                        </div>
                                        <div>
                                            <div style={MUTED_TEXT_11}>Contact</div>
                                            <div style={{ fontWeight: '600', color: '#3A443E' }}>{inq.phone || 'N/A'}</div>
                                            <div style={{ fontSize: '11px', color: '#59655D' }}>{inq.email || ''}</div>
                                        </div>
                                        <div>
                                            <div style={MUTED_TEXT_11}>Party / Dates</div>
                                            <div style={{ fontWeight: '700', color: '#121613' }}>{inq.guests || 2} campers</div>
                                            <div style={{ fontSize: '11px', color: '#59655D' }}>{inq.travelDates || 'Flexible'}</div>
                                        </div>
                                        <div style={{ gridColumn: 'span 2' }}>
                                            <div style={MUTED_TEXT_11}>Message</div>
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
    );
}
