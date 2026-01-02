const ListingImages = ({ listing }) => {
    return (
        <div className={listing.images?.length > 1 ? "listing-images-grid" : ""} style={listing.images?.length <= 1 ? { height: '400px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '48px' } : {}}>
            <div className={listing.images?.length > 1 ? "listing-image-main" : ""} style={{ height: '100%' }}>
                <img src={listing.image} alt="Main" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            {listing.images?.length > 1 && listing.images.slice(1, 5).map((img, i) => (
                <div key={i} className="listing-image-sub" style={{ height: '100%' }}>
                    <img src={img} alt={`Sub ${i + 1}`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
            ))}
        </div>
    );
};

export default ListingImages;
