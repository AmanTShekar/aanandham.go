import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import './Map.css';

const Map = ({ listings }) => {
    const navigate = useNavigate();

    // Default center (Paris)
    const center = [48.8566, 2.3522];

    const createCustomIcon = (price) => {
        return L.divIcon({
            className: 'custom-price-marker',
            html: `<div class="price-pill">$${price}</div>`,
            iconSize: [50, 28],
            iconAnchor: [25, 14]
        });
    };

    return (
        <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%', borderRadius: 'var(--radius-lg)' }}>
            {/* CartoDB Voyager Tiles - Clean and Premium */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            {listings.map((listing) => {
                // Use actual coordinates or fallback to Paris
                const lat = listing.latitude || (48.8566 + (Math.random() - 0.5) * 0.1);
                const lng = listing.longitude || (2.3522 + (Math.random() - 0.5) * 0.1);

                return (
                    <Marker
                        key={listing._id || listing.id}
                        position={[lat, lng]}
                        icon={createCustomIcon(listing.price)}
                    >
                        <Popup className="custom-popup">
                            <div style={{ width: '220px', padding: '0' }}>
                                <div style={{ position: 'relative', height: '140px', width: '100%', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', overflow: 'hidden' }}>
                                    <img
                                        src={listing.image}
                                        alt={listing.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                                <div style={{ padding: '12px' }}>
                                    <div style={{ fontWeight: '600', fontSize: '15px', marginBottom: '4px', lineHeight: '1.2', color: 'var(--text-main)' }}>{listing.title}</div>
                                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{listing.location}</div>
                                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <span style={{ fontWeight: '600', fontSize: '15px', color: 'var(--text-main)' }}>${listing.price}</span>
                                        <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>/ night</span>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/listings/${listing._id || listing.id}`)}
                                        style={{
                                            marginTop: '12px',
                                            width: '100%',
                                            padding: '8px',
                                            backgroundColor: 'var(--text-main)',
                                            color: 'var(--bg-white)',
                                            border: 'none',
                                            borderRadius: 'var(--radius-md)',
                                            cursor: 'pointer',
                                            fontWeight: '600',
                                            fontSize: '14px',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                                        onMouseLeave={(e) => e.target.style.opacity = '1'}
                                    >
                                        View Listing
                                    </button>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
};

export default Map;
