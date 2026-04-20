'use client';

export default function LoadingScreen() {
  return (
    <div
      style={{
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--cream)',
        gap: 20,
      }}
    >
      <div style={{ position: 'relative', width: 56, height: 56 }}>
        <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 56, height: 56 }}>
          <circle
            cx="28"
            cy="28"
            r="22"
            stroke="var(--cream-dark)"
            strokeWidth="3"
          />
          <circle
            cx="28"
            cy="28"
            r="22"
            stroke="var(--forest)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="138"
            strokeDashoffset="100"
            style={{ transformOrigin: '28px 28px', animation: 'spin 1s linear infinite' }}
          />
          <circle cx="28" cy="28" r="8" fill="var(--forest)" opacity="0.15" />
          <circle cx="28" cy="28" r="4" fill="var(--forest)" />
        </svg>
      </div>

      <div style={{ textAlign: 'center' }}>
        <p
          className="font-display"
          style={{ color: 'var(--forest)', fontSize: 15, fontWeight: 500, letterSpacing: '0.02em' }}
        >
          Carregando...
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
