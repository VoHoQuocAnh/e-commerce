// client/src/components/common/Loader.jsx
const Loader = ({ fullScreen = false, text = 'ĐANG TẢI STUDIO 3D...' }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-2xl border-2 border-lime-400/30 animate-ping" />
        <div className="w-14 h-14 rounded-2xl border-2 border-lime-400 border-t-transparent animate-spin" />
      </div>
      <span className="text-xs font-mono tracking-widest text-lime-400 uppercase">{text}</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-xl flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;
