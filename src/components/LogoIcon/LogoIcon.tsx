/**
 * CSS-based Boggle logo icon
 * Replicates the app icon design with pure CSS
 */

interface LogoIconProps {
  size?: number;
}

export function LogoIcon({ size = 160 }: LogoIconProps) {
  const letters = ['B', 'O', 'G', 'L'];

  return (
    <div
      className="logo-icon"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: 'var(--board-bg)',
        border: '4px solid var(--tile-border)',
        borderRadius: '20%',
        padding: `${size * 0.1}px`,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: `${size * 0.05}px`,
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
      }}
    >
      {letters.map((letter, index) => (
        <div
          key={index}
          style={{
            backgroundColor: 'var(--tile-bg)',
            border: '3px solid var(--tile-border)',
            borderRadius: '15%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: `${size * 0.35}px`,
            fontWeight: 'bold',
            color: 'var(--tile-text)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          {letter}
        </div>
      ))}
    </div>
  );
}
