// Theme helpers shared by server + client. No "use client" here — the init
// script string must be importable from the server RootLayout.
export const THEME_KEY = "dia-theme";

// Runs before paint to avoid dark/light flash. Keep tiny.
export function initThemeScript() {
  return `(function(){try{var t=localStorage.getItem('${THEME_KEY}');if(t==='light'){document.documentElement.classList.add('theme-light');}}catch(e){}})();`;
}
