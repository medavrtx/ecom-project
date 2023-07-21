function toggleLinks() {
  const links = document.querySelectorAll('.category-links a');
  const toggleButton = document.querySelector('.category-links-toggle');
  const isActive = document
    .querySelector('.category-links')
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
  const toggleButton = document.querySelector('.category-links-toggle');
  const links = document.querySelectorAll('.category-links a');

  if (windowWidth <= 768) {
    // Hide links and show toggle button on small screens
    links.forEach((link) => {
      link.style.display = 'none';
    });
    toggleButton.style.display = 'block';
  } else {
    // Show links and hide toggle button on larger screens
    links.forEach((link) => {
      link.style.display = 'block';
    });
    toggleButton.textContent = 'Show';
    toggleButton.style.display = 'none';
    document.querySelector('.category-links').classList.remove('active');
  }
}

window.addEventListener('load', () => {
  checkWindowSize();
  toggleLinks();
});
window.addEventListener('resize', checkWindowSize);
