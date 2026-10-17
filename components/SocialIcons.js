"use client";

function brandIcon(platform) {
  const p = (platform || "").toLowerCase();
  const cls = "w-4 h-4 fill-current";
  if (p.includes("facebook"))
    return (
      <svg className={cls} viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    );
  if (p.includes("instagram"))
    return (
      <svg className={cls} viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    );
  if (p.includes("tiktok"))
    return (
      <svg className={cls} viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.4a6.33 6.33 0 0 0-.86-.06 6.34 6.34 0 1 0 6.34 6.33V8.89a8.28 8.28 0 0 0 4.77 1.52V6.96a4.85 4.85 0 0 1-1-.27z" />
      </svg>
    );
  if (p.includes("telegram"))
    return (
      <svg className={cls} viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.95-1.28 4.92-2.13 5.9-2.55 2.81-1.17 3.39-1.38 3.77-1.38.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
      </svg>
    );
  if (p.includes("youtube"))
    return (
      <svg className={cls} viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  return (
    <svg className={cls} viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  );
}

function hoverColor(platform) {
  const p = (platform || "").toLowerCase();
  if (p.includes("facebook"))
    return "hover:text-[#1877F2] hover:bg-[#1877F2]/10 hover:border-[#1877F2]/30";
  if (p.includes("instagram"))
    return "hover:text-[#E4405F] hover:bg-[#E4405F]/10 hover:border-[#E4405F]/30";
  if (p.includes("tiktok"))
    return "hover:text-[#00F2FE] hover:bg-[#00F2FE]/10 hover:border-[#00F2FE]/30";
  if (p.includes("telegram"))
    return "hover:text-[#229ED9] hover:bg-[#229ED9]/10 hover:border-[#229ED9]/30";
  if (p.includes("youtube"))
    return "hover:text-[#FF0000] hover:bg-[#FF0000]/10 hover:border-[#FF0000]/30";
  return "hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/30";
}

export default function SocialIcons({ links = [], className = "", size = "md" }) {
  const sizeClasses =
    size === "sm" ? "w-7 h-7" : size === "lg" ? "w-10 h-10" : "w-8 h-8";
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {links.map((link) => (
        <a
          key={link.id || link.url}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          title={link.platform}
          aria-label={link.platform}
          className={`relative group inline-flex items-center justify-center rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm ${sizeClasses} ${hoverColor(link.platform)}`}
        >
          {brandIcon(link.platform)}
          <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 border border-slate-700/80 px-2 py-0.5 text-[11px] font-medium text-slate-200 opacity-0 shadow-xl transition-all duration-150 group-hover:opacity-100 group-hover:-translate-y-1 z-50">
            {link.platform}
          </span>
        </a>
      ))}
    </div>
  );
}
