// client/src/components/feedback/Skeleton.jsx
const Skeleton = ({ className = 'h-6 w-full', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`animate-pulse rounded-2xl bg-zinc-800/70 border border-white/5 ${className}`}
        />
      ))}
    </>
  );
};

export default Skeleton;
