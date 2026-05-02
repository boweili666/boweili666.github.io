// Toggle abstracts and bibtex blocks
document.querySelectorAll('[data-toggle]').forEach(link => {
  link.addEventListener('click', () => {
    const target = document.getElementById(link.dataset.toggle);
    if (target) target.classList.toggle('open');
  });
});
