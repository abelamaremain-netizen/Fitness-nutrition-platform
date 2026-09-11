export default function GlobalLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: "#0d0d0d" }}>
      <div className="w-8 h-8 border-2 border-white/15 border-t-white/60 rounded-full animate-spin" />
    </div>
  );
}
