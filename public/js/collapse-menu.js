function toggleLinks() {
  const links = document.querySelectorAll('.collapse-menu a');
  const toggleButton = document.querySelector('.collapse-menu-toggle');
  const isActive = document
    .querySelector('.collapse-menu')
    .classList.toggle('active');

  links.forEach((link) => {
    link.style.display = isActive
      ? 'block'
      : window.innerWidth > 768
      ? 'block'
      : 'none';
  });

  toggleButton.textContent = isActive ? 'Hide' : 'Show';
}

function checkWindowSize() {
  const windowWidth = window.innerWidth;
  const toggleButton = document.querySelector('.collapse-menu-toggle');
  const links = document.querySelectorAll('.collapse-menu a');

  if (windowWidth <= 768) {
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
    toggleButton.textContent = 'Show';
    toggleButton.style.display = 'none';
    document.querySelector('.collapse-menu').classList.remove('active');
  }
}

window.addEventListener('load', () => {
  checkWindowSize();
});
window.addEventListener('resize', checkWindowSize);
