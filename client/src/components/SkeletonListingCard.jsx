const SkeletonListingCard = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
                aspectRatio: '20/19',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-off-white)',
                animation: 'pulse 1.5s infinite ease-in-out'
            }}></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ width: '60%', height: '16px', backgroundColor: 'var(--bg-off-white)', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
                    <div style={{ width: '15%', height: '16px', backgroundColor: 'var(--bg-off-white)', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
                </div>
                <div style={{ width: '40%', height: '14px', backgroundColor: 'var(--bg-off-white)', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
                <div style={{ width: '30%', height: '14px', backgroundColor: 'var(--bg-off-white)', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
                <div style={{ width: '25%', height: '16px', backgroundColor: 'var(--bg-off-white)', borderRadius: '4px', marginTop: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
            </div>
            <style>
                {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.6; }
            100% { opacity: 1; }
          }
        `}
            </style>
        </div>
    );
};

export default SkeletonListingCard;
