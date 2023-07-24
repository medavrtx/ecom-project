let width = 768;

function toggleLinks() {
  const links = document.querySelectorAll('.collapse-menu a');
  const toggleButton = document.querySelector('.collapse-menu-toggle');
  const isActive = document
    .querySelector('.collapse-menu')
    .classList.toggle('active');

  links.forEach((link) => {
    link.style.display = isActive
      ? 'block'
      : window.innerWidth > width
      ? 'block'
      : 'none';
  });
  toggleButton.textContent = isActive ? 'Hide' : 'Show More';
}

function checkWindowSize() {
  const windowWidth = window.innerWidth;
  const toggleButton = document.querySelector('.collapse-menu-toggle');
  const links = document.querySelectorAll('.collapse-menu a');

  if (windowWidth <= width) {
    // Hide links and show toggle button on small screens
    links.forEach((link) => {
      link.style.display = 'none';
    });
    toggleButton.style.display = 'block';
  } else {
    // Show links and hide toggle button on font-sz-lg screens
    links.forEach((link) => {
      link.style.display = 'block';
    });
    toggleButton.textContent = 'Show More';
    toggleButton.style.display = 'none';
    document.querySelector('.collapse-menu').classList.remove('active');
  }
}

window.addEventListener('load', () => {
  checkWindowSize();
});
window.addEventListener('resize', checkWindowSize);
