// Shared body scroll-lock with reference counting.
// Multiple modals can lock/unlock safely — the lock releases only
// when the last modal unlocks.
let lockCount = 0;

export function lockScroll() {
  if (typeof document === "undefined") return;
  lockCount += 1;
  document.body.style.overflow = "hidden";
}

export function unlockScroll() {
  if (typeof document === "undefined") return;
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = "";
  }
}
