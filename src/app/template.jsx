"use client";
import React from 'react';

export default function Template({ children }) {
  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100%', backgroundColor: 'transparent' }}>
      <div style={{ width: '100%', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
}
