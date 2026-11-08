(function() {
  const sections = document.querySelectorAll(".hero-slider");
  sections.forEach(function(section) {
    if (section.dataset.sliderInitialized) return;
    section.dataset.sliderInitialized = "true";

    const intervalAttr = section.dataset.interval;
    const interval = intervalAttr ? parseInt(intervalAttr) : 5000;

    const slides = section.querySelectorAll(".slide");
    const dots = section.querySelectorAll(".slider-dot");
    const prevBtn = section.querySelector("#slider-prev");
    const nextBtn = section.querySelector("#slider-next");

    if (!slides.length) return;

    let currentSlide = 0;
    let slideInterval = null;

    function showSlide(index) {
      slides.forEach(function(slide, i) {
        slide.classList.toggle("active", i === index);
      });
      dots.forEach(function(dot, i) {
        dot.classList.toggle("active", i === index);
      });
      currentSlide = index;
    }

    function nextSlide() {
      showSlide((currentSlide + 1) % slides.length);
    }

    function prevSlide() {
      showSlide((currentSlide - 1 + slides.length) % slides.length);
    }

    function startSlider() {
      stopSlider();
      slideInterval = setInterval(nextSlide, interval);
    }

    function stopSlider() {
      if (slideInterval) clearInterval(slideInterval);
    }

    prevBtn?.addEventListener("click", function() {
      prevSlide();
      startSlider();
    });

    nextBtn?.addEventListener("click", function() {
      nextSlide();
      startSlider();
    });

    dots.forEach(function(dot, i) {
      dot.addEventListener("click", function() {
        showSlide(i);
        startSlider();
      });
    });

    startSlider();
  });
})();