document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("menu-toggle");
  const nav = document.getElementById("main-nav");

  if (toggleButton && nav) {
    toggleButton.addEventListener("click", function () {
      nav.classList.toggle("hide");
      nav.classList.toggle("show");
    });
  }

  document.querySelectorAll(".photo-gallery").forEach(setupPhotoGallery);
});

function setupPhotoGallery(gallery) {
  const slides = Array.from(gallery.querySelectorAll(".photo-gallery__slide"));
  if (!slides.length) return;

  const prevButton = gallery.querySelector(".photo-gallery__control--prev");
  const nextButton = gallery.querySelector(".photo-gallery__control--next");
  let currentIndex = 0;

  const updateSlides = () => {
    slides.forEach((slide, index) => {
      const isActive = index === currentIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", (!isActive).toString());
    });
  };

  const goToSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    updateSlides();
  };

  prevButton?.addEventListener("click", () => goToSlide(currentIndex - 1));
  nextButton?.addEventListener("click", () => goToSlide(currentIndex + 1));

  gallery.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToSlide(currentIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goToSlide(currentIndex + 1);
    }
  });

  if (slides.length <= 1) {
    prevButton?.setAttribute("disabled", "true");
    nextButton?.setAttribute("disabled", "true");
    prevButton?.classList.add("photo-gallery__control--hidden");
    nextButton?.classList.add("photo-gallery__control--hidden");
  }

  updateSlides();
}
