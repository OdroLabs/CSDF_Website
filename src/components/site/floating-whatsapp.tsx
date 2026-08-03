/**
 * Global floating "Chat on WhatsApp" button.
 *
 * Rendered directly in the locale layout — outside <main>, the header and any
 * animated/transformed container — so `position: fixed` always resolves
 * against the viewport. Same slot/z-index the floating donate button used.
 */
export function FloatingWhatsapp({ phone, label }: { phone: string; label: string }) {
  return (
    <div
      className="pointer-events-none fixed right-4 z-[80] md:bottom-6 md:right-6"
      style={{ bottom: "max(1rem, calc(0.75rem + env(safe-area-inset-bottom)))" }}
    >
      <a
        href={`https://wa.me/${phone}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="group pointer-events-auto relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/40 ring-1 ring-white/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#20BD5C] hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-safe:active:scale-95"
      >
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366]/40 motion-safe:animate-ping [animation-duration:2.2s]" />
        <svg viewBox="0 0 32 32" className="relative h-7 w-7 fill-current" aria-hidden="true">
          <path d="M16.004 3C9.086 3 3.48 8.606 3.48 15.523c0 2.238.585 4.42 1.697 6.343L3.36 29l7.31-1.917a12.47 12.47 0 0 0 5.334 1.207h.005c6.917 0 12.523-5.606 12.523-12.524C28.53 8.85 22.865 3 16.004 3zm7.372 17.694c-.313.882-1.552 1.615-2.542 1.826-.677.144-1.56.26-4.535-.975-3.804-1.576-6.25-5.436-6.44-5.687-.184-.25-1.545-2.056-1.545-3.923s.967-2.79 1.31-3.17c.313-.348.682-.435.91-.435.23 0 .46.002.66.012.212.01.497-.081.777.593.313.75 1.062 2.593 1.155 2.782.093.19.155.412.03.663-.121.25-.183.406-.363.625-.184.22-.386.49-.55.658-.184.19-.375.396-.16.775.212.377.94 1.552 2.02 2.514 1.387 1.237 2.556 1.62 2.933 1.803.376.184.596.156.815-.094.22-.25.94-1.094 1.19-1.47.25-.376.5-.313.844-.188.343.125 2.182 1.03 2.556 1.218.373.19.622.281.716.44.094.156.094.9-.22 1.783z" />
        </svg>
      </a>
    </div>
  );
}
