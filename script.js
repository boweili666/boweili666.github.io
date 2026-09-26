// Toggle abstracts and bibtex blocks
document.querySelectorAll('[data-toggle]').forEach(link => {
  link.addEventListener('click', () => {
    const target = document.getElementById(link.dataset.toggle);
    if (target) target.classList.toggle('open');
  });
});

// One control for the simultaneous background demos; remember the reader's choice.
const wallVideos = [...document.querySelectorAll('[data-background]')];
const wallToggle = document.getElementById('background-toggle');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let backgroundPaused = reduceMotion.matches;
try { const saved = sessionStorage.getItem('backgroundPaused'); if (saved !== null) backgroundPaused = saved === 'true'; } catch (_) {}
function updateBackground() {
  const pause = backgroundPaused || document.hidden;
  wallVideos.forEach(video => {
    video.muted = true;
    if (pause) video.pause();
    else video.play().catch(() => {});
  });
  if (wallToggle) {
    wallToggle.textContent = backgroundPaused ? 'Play background' : 'Pause background';
    wallToggle.setAttribute('aria-pressed', String(backgroundPaused));
  }
}
wallToggle?.addEventListener('click', () => {
  backgroundPaused = !backgroundPaused;
  try { sessionStorage.setItem('backgroundPaused', String(backgroundPaused)); } catch (_) {}
  updateBackground();
});
reduceMotion.addEventListener('change', event => { backgroundPaused = event.matches; updateBackground(); });
document.addEventListener('visibilitychange', updateBackground);
updateBackground();

// Solidify the top bar once the reader scrolls past the top of the hero.
const topbar = document.querySelector('.topbar');
function updateTopbar() { topbar?.classList.toggle('scrolled', window.scrollY > 40); }
window.addEventListener('scroll', updateTopbar, { passive: true });
updateTopbar();
