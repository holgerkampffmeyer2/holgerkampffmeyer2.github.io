export function initSlider(interval = 5000) {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".slider-dot");
  const prevBtn = document.getElementById("slider-prev");
  const nextBtn = document.getElementById("slider-next");

  if (!slides.length) return;

  let currentSlide = 0;
  let slideInterval = null;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
    dots.forEach((dot, i) => {
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

  prevBtn?.addEventListener("click", () => {
    prevSlide();
    startSlider();
  });

  nextBtn?.addEventListener("click", () => {
    nextSlide();
    startSlider();
  });

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      showSlide(i);
      startSlider();
    });
  });

  startSlider();
}
