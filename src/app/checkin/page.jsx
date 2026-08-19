import React from 'react';
import MobileMarshalScanner from '@/components/admin/MobileMarshalScanner';

export const metadata = {
  title: 'Basecamp Camper Check-In & QR Scanner',
  description: 'Mobile live camera QR pass scanner, camper headcount tracking, and balance settlement for basecamp hosts.',
  alternates: {
    canonical: 'https://www.aanandham.in/checkin',
  },
  robots: {
    index: false,
    follow: false
  }
};

export default function CheckinDirectPage() {
  return <MobileMarshalScanner />;
}
