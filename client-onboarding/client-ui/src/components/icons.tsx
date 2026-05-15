interface IconProps {
  size?: number;
}

export const Icon = {
  check: ({ size = 14 }: IconProps = {}) => (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M2.5 7.5L5.5 10.5L11.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  x: ({ size = 12 }: IconProps = {}) => (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),

  plus: ({ size = 14 }: IconProps = {}) => (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),

  arrow: ({ size = 16 }: IconProps = {}) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  clock: ({ size = 14 }: IconProps = {}) => (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7 4v3.2L9 8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
};

export function Spinner() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" style={{ animation: "spin 0.9s linear infinite" }}>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.25" />
      <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
