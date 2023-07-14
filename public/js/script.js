$('.owl-carousel').owlCarousel({
  loop: false,
  margin: 0,
  responsiveClass: true,
  responsive: {
    0: {
      items: 3,
    },
    768: {
      items: 2,
    },
    1100: {
      items: 3,
    },
    1400: {
      items: 4,
      loop: false,
    },
  },
});
