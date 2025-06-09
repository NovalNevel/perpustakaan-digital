export function AnimatedGradientText({ children }) {
  return (
    <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]">
      {children}
    </span>
  );
}
