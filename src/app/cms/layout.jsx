export const metadata = {
  title: 'Coordinator Login — Internal',
  description: 'Internal coordinator access. Not for public use.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  alternates: {
    canonical: 'https://www.aanandham.in/cms',
  },
};

export default function CmsLayout({ children }) {
  return children;
}
