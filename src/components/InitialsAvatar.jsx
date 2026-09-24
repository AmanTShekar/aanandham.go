'use client';

/**
 * InitialsAvatar — Pure HTML/CSS avatar with author initials.
 * No external API dependency. Generates unique gradient backgrounds
 * based on the author name hash for visual variety.
 */

// Curated palette of gradient pairs for avatars
const AVATAR_GRADIENTS = [
    ['#4F46E5', '#7C3AED'], // Indigo → Violet
    ['#0EA5E9', '#2563EB'], // Sky → Blue
    ['#10B981', '#059669'], // Emerald → Green
    ['#F59E0B', '#D97706'], // Amber → Orange
    ['#EC4899', '#DB2777'], // Pink → Rose
    ['#8B5CF6', '#6D28D9'], // Violet → Purple
    ['#14B8A6', '#0D9488'], // Teal → Cyan
    ['#F97316', '#EA580C'], // Orange → Deep Orange
    ['#06B6D4', '#0891B2'], // Cyan → Teal
    ['#A855F7', '#9333EA'], // Purple → Deep Purple
    ['#EF4444', '#DC2626'], // Red → Deep Red
    ['#84CC16', '#65A30D'], // Lime → Green
];

function hashName(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }
    return Math.abs(hash);
}

function getInitials(name) {
    if (!name) return '?';
    const cleaned = name.replace(/^Dr\.\s*/i, '').replace(/&/g, '').trim();
    const parts = cleaned.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function InitialsAvatar({ name, size = 44, fontSize = 16, borderColor = '#E5A93B', style = {} }) {
    const initials = getInitials(name || 'Camper');
    const idx = hashName(name || 'Camper') % AVATAR_GRADIENTS.length;
    const [c1, c2] = AVATAR_GRADIENTS[idx];

    return (
        <div
            aria-label={name || 'Camper'}
            style={{
                width: `${size}px`,
                height: `${size}px`,
                minWidth: `${size}px`,
                minHeight: `${size}px`,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${c1}, ${c2})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-heading), "Bricolage Grotesque", Inter, sans-serif',
                fontSize: `${fontSize}px`,
                fontWeight: '800',
                color: '#FFFFFF',
                letterSpacing: '0.5px',
                border: `1.5px solid ${borderColor}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                userSelect: 'none',
                flexShrink: 0,
                ...style
            }}
        >
            {initials}
        </div>
    );
}
