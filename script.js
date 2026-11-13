// Toggle abstracts and bibtex blocks
document.querySelectorAll('[data-toggle]').forEach(link => {
  link.addEventListener('click', () => {
    const target = document.getElementById(link.dataset.toggle);
    if (target) target.classList.toggle('open');
  });
});

// Keep every paper in the HTML; enhance the list with topic tabs when JavaScript runs.
const publicationTabs = document.querySelector('.pub-tabs');
const publicationList = document.getElementById('publication-list');
if (publicationTabs && publicationList) {
  const tabs = [...publicationTabs.querySelectorAll('[data-pub-filter]')];
  const papers = [...publicationList.querySelectorAll('[data-pub-category]')];
  const matches = (paper, category) => category === 'all' || paper.dataset.pubCategory === category;

  function selectPublicationTab(tab, focus = false) {
    tabs.forEach(button => {
      const selected = button === tab;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    publicationList.setAttribute('aria-labelledby', tab.id);
    papers.forEach(paper => {
      const wasHidden = paper.hidden;
      paper.hidden = !matches(paper, tab.dataset.pubFilter);
      paper.querySelectorAll('video').forEach(video => {
        if (paper.hidden) video.pause();
        else if (wasHidden && video.autoplay && !document.hidden) video.play().catch(() => {});
      });
    });
    if (focus) tab.focus();
  }

  tabs.forEach((tab, index) => {
    const count = papers.filter(paper => matches(paper, tab.dataset.pubFilter)).length;
    const label = tab.textContent.trim();
    tab.querySelector('.pub-tab-count').textContent = count;
    tab.setAttribute('aria-label', `${label}, ${count} publications`);
    tab.addEventListener('click', () => selectPublicationTab(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      selectPublicationTab(tabs[next], true);
    });
  });

  function revealLinkedPublication(hash) {
    let id;
    try { id = decodeURIComponent(hash.slice(1)); } catch (_) { return; }
    const target = document.getElementById(id);
    const paper = target?.closest('[data-pub-category]');
    if (!paper || !publicationList.contains(paper)) return;
    if (paper.hidden) selectPublicationTab(tabs.find(tab => tab.dataset.pubFilter === paper.dataset.pubCategory));
    if (target.classList.contains('pub-extra')) target.classList.add('open');
    requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
  }

  publicationList.setAttribute('role', 'tabpanel');
  publicationList.tabIndex = 0;
  selectPublicationTab(tabs[0]);
  publicationTabs.hidden = false;
  revealLinkedPublication(window.location.hash);
  window.addEventListener('hashchange', () => revealLinkedPublication(window.location.hash));
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (link) revealLinkedPublication(link.getAttribute('href'));
  });
}

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
