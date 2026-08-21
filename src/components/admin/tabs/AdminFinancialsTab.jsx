"use client";
import React from 'react';
import { IndianRupee, TrendingUp, Download, ScrollText, CheckCircle2, AlertCircle } from 'lucide-react';
import { inr } from '../../../lib/utils';
import { 
    META_LABEL_STYLE, ELLIPSIS_STYLE, MUTED_TEXT_11, ROW_SPACE_8, 
    ROW_SPACE_10, H2_STYLE, ROW_SPACE_WRAP, ROW_SPACE_14 
} from '../AdminSharedStyles';

export default function AdminFinancialsTab({
    financialStats,
    bookings,
    handleExportLedgerCSV
}) {
    return (
        <div>
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
                                <div style={META_LABEL_STYLE}>Gross Revenue (Booked)</div>
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
                                <div style={META_LABEL_STYLE}>Direct Operations (45%)</div>
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
                                <div style={META_LABEL_STYLE}>Net Operating Profit</div>
                                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: '800', color: '#166534', margin: '6px 0' }}>₹{estimatedNetProfit.toLocaleString('en-IN')}</div>
<div style={{ fontSize: '12px', color: '#166534', fontWeight: '700' }}> ✓ {profitMarginPercent}% Net Margin</div>
                            </div>
                        </div>
                    </div>
        </div>
    );
}
