import { AnimatedGradientText } from '../magicui/AnimatedGradientText';

export default function ButtonLihatSemua({ onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={`font-medium text-sm ${className || ''}`}
    >
      <AnimatedGradientText>Lihat Semua →</AnimatedGradientText>
    </button>
  );
}
