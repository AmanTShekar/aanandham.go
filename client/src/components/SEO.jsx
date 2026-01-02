import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url, schema }) => {
    const siteTitle = "Aanandham";
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const metaDescription = description || "Book verified luxury tent stays in Munnar, Suryanelli, and Kolukkumalai. Experience glamping in Kerala with Aanandham.";
    const metaImage = image || "https://aanandham.in/og-image.jpg";
    const metaUrl = url || "https://aanandham.in";
    const metaKeywords = keywords || "Munnar Camping, Tent Stay Munnar, Kolukkumalai Trekking, Suryanelli, Glamping Kerala, Luxury Resorts India";

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            <meta name="keywords" content={metaKeywords} />
            <link rel="canonical" href={metaUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={metaUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={metaUrl} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={metaDescription} />
            <meta property="twitter:image" content={metaImage} />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(schema || {
                    "@context": "https://schema.org",
                    "@type": "TravelAgency",
                    "name": "Aanandham.go",
                    "url": metaUrl,
                    "email": "bookings@aanandhamgo.in",
                    "description": metaDescription,
                    "contactPoint": {
                        "@type": "ContactPoint",
                        "email": "bookings@aanandhamgo.in",
                        "contactType": "reservations",
                        "areaServed": "IN"
                    }
                })}
            </script>
        </Helmet>
    );
};

export default SEO;
