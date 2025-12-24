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
  
  // Sticker parallax effect
  setupStickerParallax();
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

function setupStickerParallax() {
  const stickers = document.querySelectorAll(".hero-inner .sticker");
  if (!stickers.length) return;

  const wrapper = document.querySelector(".hero-inner");
  if (!wrapper) return;

  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;
  let animationId = null;
  let isAnimating = false;

  const intensity = 10; // Reduced intensity for less movement
  const threshold = 0.001; // Stop animating when difference is smaller than this

  function updateStickers() {
    // Calculate transform values (same for all stickers) - only translation, no rotation
    const translateX = currentX * intensity;
    const translateY = currentY * intensity;

    stickers.forEach((sticker) => {
      // Apply only translation, no rotation at all
      sticker.style.transform = `translate(${translateX}px, ${translateY}px)`;
    });
  }

  function animate() {
    const prevX = currentX;
    const prevY = currentY;

    // More responsive interpolation (less floaty)
    currentX += (mouseX - currentX) * 0.4;
    currentY += (mouseY - currentY) * 0.4;

    // Check if values have changed significantly
    const deltaX = Math.abs(currentX - prevX);
    const deltaY = Math.abs(currentY - prevY);

    // Only update if there's meaningful change
    if (deltaX > threshold || deltaY > threshold) {
      updateStickers();
    }

    // Check if we're close enough to target to stop animating
    const distToTarget = Math.abs(mouseX - currentX) + Math.abs(mouseY - currentY);
    
    if (distToTarget > threshold) {
      animationId = requestAnimationFrame(animate);
    } else {
      // Final update to ensure we're exactly at target
      currentX = mouseX;
      currentY = mouseY;
      updateStickers();
      isAnimating = false;
    }
  }

  function startAnimation() {
    if (!isAnimating) {
      isAnimating = true;
      animationId = requestAnimationFrame(animate);
    }
  }

  // Track mouse movement
  wrapper.addEventListener("mousemove", (e) => {
    const rect = wrapper.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
    mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
    startAnimation();
  });

  wrapper.addEventListener("mouseleave", () => {
    mouseX = 0;
    mouseY = 0;
    startAnimation();
  });
}
