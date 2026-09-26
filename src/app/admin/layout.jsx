export const metadata = {
  title: 'Admin — Internal',
  description: 'Internal administration. Not for public use.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  alternates: {
    canonical: 'https://www.aanandham.in/admin',
  },
};

export default function AdminLayout({ children }) {
  return children;
}
