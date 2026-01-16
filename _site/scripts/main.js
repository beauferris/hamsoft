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
  document.querySelectorAll(".card-slider").forEach(setupCardSlider);
  
  // Sticker parallax effect and drag functionality
  setupStickerParallax();
  setupStickerDragging();
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

function setupCardSlider(slider) {
  const slides = Array.from(slider.querySelectorAll(".card-slider__slide"));
  if (!slides.length) return;

  const prevButton = slider.querySelector(".card-slider__control--prev");
  const nextButton = slider.querySelector(".card-slider__control--next");
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

  slider.addEventListener("keydown", (event) => {
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
    prevButton?.classList.add("card-slider__control--hidden");
    nextButton?.classList.add("card-slider__control--hidden");
  }

  updateSlides();
}

function setupStickerParallax() {
  const landingCentered = document.querySelector(".landing.centered");
  if (!landingCentered) return;

  const stickers = landingCentered.querySelectorAll(".sticker");
  if (!stickers.length) return;

  const wrapper = landingCentered;

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
      // Don't apply parallax if sticker is being dragged
      if (!sticker.classList.contains("dragging") && !sticker.dataset.dragStarted) {
        // Check if sticker is hovered and combine transforms
        const isHovered = sticker.matches(':hover');
        if (isHovered) {
          // Combine parallax translation with hover scale and rotation
          sticker.style.transform = `translate(${translateX}px, ${translateY}px) scale(1.15) rotate(5deg)`;
        } else {
          // Apply parallax transform on top of any left/top positioning
          sticker.style.transform = `translate(${translateX}px, ${translateY}px)`;
        }
      }
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

function setupStickerDragging() {
  const landingCentered = document.querySelector(".landing.centered");
  if (!landingCentered) return;

  const stickers = landingCentered.querySelectorAll(".sticker");
  if (!stickers.length) return;

  // Use hero-inner as wrapper for boundary calculations (was working before)
  // This ensures stickers can be dragged within the hero-inner bounds
  const wrapper = landingCentered.querySelector(".hero-inner");
  if (!wrapper) return;

  let draggedSticker = null;
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;
  let initialPositionSet = false;

  stickers.forEach((sticker) => {
    sticker.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      isDragging = true;
      draggedSticker = sticker;
      sticker.classList.add("dragging");
      sticker.dataset.dragStarted = 'true'; // Disable parallax immediately
      initialPositionSet = false;

      // First, remove hover effects by temporarily clearing transform to get accurate position
      // Store the current transform to restore if needed
      const currentTransform = sticker.style.transform;
      
      // Get the current parallax translation values from the transform
      const translateMatch = currentTransform.match(/translate\(([^,]+)px,\s*([^)]+)\)/);
      let translateX = 0;
      let translateY = 0;
      if (translateMatch) {
        translateX = parseFloat(translateMatch[1]) || 0;
        translateY = parseFloat(translateMatch[2]) || 0;
      }
      
      // Temporarily set transform to just translation (no scale/rotate) to get accurate bounding rect
      sticker.style.transform = `translate(${translateX}px, ${translateY}px)`;
      
      // Force a reflow to ensure the transform is applied
      void sticker.offsetHeight;
      
      const rect = sticker.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();
      
      // Calculate offset from where the cursor clicked on the sticker
      // This is the distance from the sticker's top-left corner to the click point
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      
      // Immediately freeze the current position by converting transform to left/top
      // The bounding rect now reflects the position without hover effects
      const currentLeft = rect.left - wrapperRect.left;
      const currentTop = rect.top - wrapperRect.top;
      
      // Set position immediately to freeze it (this will replace any transform)
      sticker.style.left = `${currentLeft}px`;
      sticker.style.top = `${currentTop}px`;
      sticker.style.right = 'auto';
      sticker.style.bottom = 'auto';
      sticker.style.transform = ''; // Clear transform
    });
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging || !draggedSticker) return;

    const wrapperRect = wrapper.getBoundingClientRect();
    const wrapperLeft = wrapperRect.left;
    const wrapperTop = wrapperRect.top;
    const wrapperWidth = wrapperRect.width;
    const wrapperHeight = wrapperRect.height;

    // Calculate new position so the clicked point stays under the cursor
    let newX = e.clientX - wrapperLeft - offsetX;
    let newY = e.clientY - wrapperTop - offsetY;

    // Get sticker dimensions
    const stickerRect = draggedSticker.getBoundingClientRect();
    const stickerWidth = stickerRect.width;
    const stickerHeight = stickerRect.height;

    // Constrain to wrapper bounds (with some padding)
    const padding = 20;
    newX = Math.max(padding, Math.min(newX, wrapperWidth - stickerWidth - padding));
    newY = Math.max(padding, Math.min(newY, wrapperHeight - stickerHeight - padding));

    // Use left/top for absolute positioning
    draggedSticker.style.left = `${newX}px`;
    draggedSticker.style.top = `${newY}px`;
    draggedSticker.style.right = 'auto';
    draggedSticker.style.bottom = 'auto';
    draggedSticker.style.transform = '';
    // Don't set manuallyPositioned - allow parallax to continue after drag
  });

  document.addEventListener("mouseup", () => {
    if (isDragging && draggedSticker) {
      isDragging = false;
      draggedSticker.classList.remove("dragging");
      delete draggedSticker.dataset.dragStarted;
      draggedSticker = null;
      initialPositionSet = false;
    }
  });

  // Also handle touch events for mobile
  stickers.forEach((sticker) => {
    sticker.addEventListener("touchstart", (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      isDragging = true;
      draggedSticker = sticker;
      sticker.classList.add("dragging");
      sticker.dataset.dragStarted = 'true'; // Disable parallax immediately
      initialPositionSet = false;

      const touch = e.touches[0];
      const rect = sticker.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();
      
      // Calculate offset from where the touch started on the sticker
      offsetX = touch.clientX - rect.left;
      offsetY = touch.clientY - rect.top;
      
      // Immediately freeze the current position
      // The bounding rect already accounts for any transforms
      const currentLeft = rect.left - wrapperRect.left;
      const currentTop = rect.top - wrapperRect.top;
      
      sticker.style.left = `${currentLeft}px`;
      sticker.style.top = `${currentTop}px`;
      sticker.style.right = 'auto';
      sticker.style.bottom = 'auto';
      sticker.style.transform = '';
    });
  });

  document.addEventListener("touchmove", (e) => {
    if (!isDragging || !draggedSticker) return;

    const touch = e.touches[0];
    const wrapperRect = wrapper.getBoundingClientRect();
    const wrapperLeft = wrapperRect.left;
    const wrapperTop = wrapperRect.top;
    const wrapperWidth = wrapperRect.width;
    const wrapperHeight = wrapperRect.height;

    let newX = touch.clientX - wrapperLeft - offsetX;
    let newY = touch.clientY - wrapperTop - offsetY;

    const stickerRect = draggedSticker.getBoundingClientRect();
    const stickerWidth = stickerRect.width;
    const stickerHeight = stickerRect.height;

    const padding = 20;
    newX = Math.max(padding, Math.min(newX, wrapperWidth - stickerWidth - padding));
    newY = Math.max(padding, Math.min(newY, wrapperHeight - stickerHeight - padding));

    draggedSticker.style.left = `${newX}px`;
    draggedSticker.style.top = `${newY}px`;
    draggedSticker.style.right = 'auto';
    draggedSticker.style.bottom = 'auto';
    draggedSticker.style.transform = '';
    // Don't set manuallyPositioned - allow parallax to continue after drag
  });

  document.addEventListener("touchend", () => {
    if (isDragging && draggedSticker) {
      isDragging = false;
      draggedSticker.classList.remove("dragging");
      delete draggedSticker.dataset.dragStarted;
      draggedSticker = null;
      initialPositionSet = false;
    }
  });

  // Reset moved stickers when window shrinks to mobile
  function resetStickersOnMobile() {
    const isMobile = window.innerWidth <= 640; // 40.0625em = 640px
    
    if (isMobile) {
      stickers.forEach((sticker) => {
        // Reset any manually positioned stickers
        if (sticker.style.left || sticker.style.top || sticker.style.right || sticker.style.bottom) {
          sticker.style.left = '';
          sticker.style.top = '';
          sticker.style.right = '';
          sticker.style.bottom = '';
          sticker.style.transform = '';
          delete sticker.dataset.manuallyPositioned;
        }
      });
    }
  }

  // Check on resize
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resetStickersOnMobile();
    }, 100);
  });

  // Check on initial load
  resetStickersOnMobile();
}
