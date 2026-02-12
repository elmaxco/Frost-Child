(function() {
  'use strict';

  function initReviewCarousel() {
    const carousels = document.querySelectorAll('.review-carousel');

    carousels.forEach(carousel => {
      const track = carousel.querySelector('.carousel-track');
      const cards = Array.from(carousel.querySelectorAll('.review-card'));
      const prevButton = carousel.querySelector('.carousel-button.prev');
      const nextButton = carousel.querySelector('.carousel-button.next');
      const dotsContainer = carousel.querySelector('.carousel-dots');

      if (!track || cards.length === 0) return;

      let viewport = carousel.querySelector('.carousel-viewport');
      if (!viewport) {
        viewport = document.createElement('div');
        viewport.className = 'carousel-viewport';
        track.parentNode.insertBefore(viewport, track);
        viewport.appendChild(track);
      }

      const cardsToShow = parseInt(carousel.dataset.cardsToShow) || 3;
      const autoplay = carousel.dataset.autoplay === 'true';
      const autoplaySpeed = parseInt(carousel.dataset.autoplaySpeed) || 5000;

      let currentIndex = 0;
      let autoplayInterval = null;
      let isMobile = window.innerWidth <= 768;
      let actualCardsToShow = isMobile ? 1 : cardsToShow;

      // Set card widths
      function updateCardWidths() {
        isMobile = window.innerWidth <= 768;
        actualCardsToShow = isMobile ? 1 : cardsToShow;
        const cardWidth = 100 / actualCardsToShow;
        
        cards.forEach(card => {
          card.style.width = `calc(${cardWidth}% - ${(actualCardsToShow - 1) * 20 / actualCardsToShow}px)`;
          card.style.minWidth = `calc(${cardWidth}% - ${(actualCardsToShow - 1) * 20 / actualCardsToShow}px)`;
        });
      }

      // Create dots
      function createDots() {
        dotsContainer.innerHTML = '';
        const totalDots = Math.ceil(cards.length / actualCardsToShow);
        
        for (let i = 0; i < totalDots; i++) {
          const dot = document.createElement('button');
          dot.className = 'carousel-dot';
          dot.setAttribute('aria-label', `Gå till sida ${i + 1}`);
          if (i === 0) dot.classList.add('active');
          
          dot.addEventListener('click', () => goToSlide(i * actualCardsToShow));
          dotsContainer.appendChild(dot);
        }
      }

      // Update active dot
      function updateDots() {
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        const activeDotIndex = Math.floor(currentIndex / actualCardsToShow);
        
        dots.forEach((dot, index) => {
          if (index === activeDotIndex) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      }

      // Go to specific slide
      function goToSlide(index) {
        const maxIndex = cards.length - actualCardsToShow;
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        
        const cardWidth = cards[0].offsetWidth;
        const gap = 20;
        const offset = currentIndex * (cardWidth + gap);
        
        track.style.transform = `translateX(-${offset}px)`;
        updateDots();
        updateButtons();
      }

      // Next slide
      function nextSlide() {
        if (currentIndex < cards.length - actualCardsToShow) {
          goToSlide(currentIndex + 1);
        } else {
          goToSlide(0); // Loop back to start
        }
      }

      // Previous slide
      function prevSlide() {
        if (currentIndex > 0) {
          goToSlide(currentIndex - 1);
        } else {
          goToSlide(cards.length - actualCardsToShow); // Loop to end
        }
      }

      // Update button states
      function updateButtons() {
        // Always show buttons for better UX (they loop anyway)
        prevButton.style.opacity = '1';
        nextButton.style.opacity = '1';
      }

      // Start autoplay
      function startAutoplay() {
        if (autoplay) {
          autoplayInterval = setInterval(nextSlide, autoplaySpeed);
        }
      }

      // Stop autoplay
      function stopAutoplay() {
        if (autoplayInterval) {
          clearInterval(autoplayInterval);
          autoplayInterval = null;
        }
      }

      // Event listeners
      nextButton.addEventListener('click', (e) => {
        nextSlide();
        stopAutoplay();
        // Ta bort focus omedelbart
        setTimeout(() => e.currentTarget.blur(), 0);
      });

      prevButton.addEventListener('click', (e) => {
        prevSlide();
        stopAutoplay();
        // Ta bort focus omedelbart
        setTimeout(() => e.currentTarget.blur(), 0);
      });

      // Pause autoplay on hover
      carousel.addEventListener('mouseenter', stopAutoplay);
      carousel.addEventListener('mouseleave', startAutoplay);

      // Touch/swipe support
      let touchStartX = 0;
      let touchEndX = 0;

      viewport.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
      }, { passive: true });

      viewport.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }, { passive: true });

      function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
          if (diff > 0) {
            nextSlide();
          } else {
            prevSlide();
          }
        }
      }

      // Responsive handling
      let resizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          updateCardWidths();
          createDots();
          goToSlide(0); // Reset to first slide on resize
        }, 250);
      });

      // Initialize
      updateCardWidths();
      createDots();
      updateButtons();
      startAutoplay();
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReviewCarousel);
  } else {
    initReviewCarousel();
  }
})();
