import { FaFilter } from 'react-icons/fa';

const CategoryBar = ({ categories, selectedCategory, onSelectCategory, onFilterClick }) => {
    return (
        <div style={{
            position: 'sticky',
            top: '80px', // Height of Navbar
            backgroundColor: 'var(--bg-white)',
            zIndex: 900,
            boxShadow: 'var(--shadow-sm)',
            paddingTop: '20px'
        }}>
            <div className="container" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px'
            }}>
                <style>
                    {`
              .no-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}
                </style>

                {/* Categories List */}
                <div className="no-scrollbar" style={{
                    display: 'flex',
                    gap: '32px',
                    overflowX: 'auto',
                    flex: 1,
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    paddingRight: '24px'
                }}>
                    {categories && categories.map((item, index) => {
                        const isSelected = selectedCategory === item.label || (!selectedCategory && index === 0);
                        return (
                            <div key={index}
                                onClick={() => onSelectCategory && onSelectCategory(item.label)}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '8px',
                                    minWidth: '64px',
                                    cursor: 'pointer',
                                    paddingBottom: '12px',
                                    borderBottom: isSelected ? '2px solid var(--primary)' : '2px solid transparent',
                                    color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                                    opacity: 1,
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isSelected) {
                                        e.currentTarget.style.borderBottom = '2px solid var(--border)';
                                        e.currentTarget.style.color = 'var(--text-main)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isSelected) {
                                        e.currentTarget.style.borderBottom = '2px solid transparent';
                                        e.currentTarget.style.color = 'var(--text-secondary)';
                                    }
                                }}
                            >
                                <item.icon size={24} />
                                <span style={{ fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' }}>{item.label}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '12px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        padding: '10px 16px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s ease'
                    }}
                        onClick={onFilterClick}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--text-main)'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                    >
                        <FaFilter size={14} />
                        <span>Filters</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryBar;
