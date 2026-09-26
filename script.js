// Toggle abstracts and bibtex blocks
document.querySelectorAll('[data-toggle]').forEach(link => {
  link.addEventListener('click', () => {
    const target = document.getElementById(link.dataset.toggle);
    if (target) target.classList.toggle('open');
  });
});

const cmuSegmentButton = document.getElementById('play-cmu-segment');
const cmuShowcase = document.getElementById('cmu-showcase-video');
if (cmuSegmentButton && cmuShowcase) {
  cmuSegmentButton.addEventListener('click', () => {
    cmuShowcase.currentTime = 35;
    cmuShowcase.play().catch(() => { cmuShowcase.focus(); });
  });
}
