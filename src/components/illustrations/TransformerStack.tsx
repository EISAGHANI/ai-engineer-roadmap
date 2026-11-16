/** A tower of identical blocks: attention room + thinking room, repeated N times. */
export function TransformerStack() {
  const blocks = [0, 1, 2];
  return (
    <svg viewBox="0 0 640 300" className="w-full" role="img" aria-label="Transformer: embeddings in, stacked attention and feed-forward blocks, next-word guess out">
      <defs>
        <marker id="ts-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10z" fill="var(--muted)" />
        </marker>
      </defs>
      <rect x="40" y="250" width="200" height="32" rx="8" fill="none" stroke="var(--border)" />
      <text x="140" y="271" textAnchor="middle" fontSize="12" fill="var(--text)">
        Words as note cards (embeddings)
      </text>
      {blocks.map((b, i) => {
        const y = 180 - i * 70;
        return (
          <g key={b}>
            <rect x="40" y={y} width="200" height="56" rx="10" fill="var(--area-llm)" fillOpacity="0.12" stroke="var(--area-llm)" strokeWidth="1.5" />
            <text x="140" y={y + 20} textAnchor="middle" fontSize="11" fill="var(--text)" fontWeight="600">
              Room 1: look at the other words
            </text>
            <text x="140" y={y + 42} textAnchor="middle" fontSize="11" fill="var(--text)">
              Room 2: think about what you saw
            </text>
            <line x1="140" y1={y + 70} x2="140" y2={y + 58} stroke="var(--muted)" markerEnd="url(#ts-arrow)" />
          </g>
        );
      })}
      <text x="140" y="30" textAnchor="middle" fontSize="12" fill="var(--text)" fontWeight="600">
        Guess the next word
      </text>
      <line x1="140" y1="40" x2="140" y2="48" stroke="var(--muted)" />
      <text x="260" y="130" fontSize="11" fill="var(--muted)">
        × 32 to 100+ floors
      </text>
      <text x="340" y="80" fontSize="12" fill="var(--text)" fontWeight="600">
        Same two rooms on every floor
      </text>
      <text x="340" y="104" fontSize="11" fill="var(--muted)">
        GPT, Claude and Llama all stack these blocks.
      </text>
      <text x="340" y="124" fontSize="11" fill="var(--muted)">
        Bigger models = more floors, wider rooms.
      </text>
      <text x="340" y="160" fontSize="11" fill="var(--muted)">
        Room 1 = self-attention (concept 03)
      </text>
      <text x="340" y="180" fontSize="11" fill="var(--muted)">
        Room 2 = feed-forward layer
      </text>
    </svg>
  );
}
