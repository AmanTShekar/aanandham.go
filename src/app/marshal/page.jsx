import React from 'react';
import MobileMarshalScanner from '@/components/admin/MobileMarshalScanner';

export const metadata = {
  title: 'Basecamp Marshal Scanner | Aanandham.go',
  description: 'Mobile QR pass verification, camper attendance, and headcount tracker.',
  robots: {
    index: false,
    follow: false
  }
};

export default function MarshalDirectPage() {
  return <MobileMarshalScanner />;
}
