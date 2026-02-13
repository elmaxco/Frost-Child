( function () {
	'use strict';

	function initImageCarousel() {
		var carousels = document.querySelectorAll( '.ic-carousel' );

		carousels.forEach( function ( carousel ) {
			var track = carousel.querySelector( '.ic-track' );
			var slides = Array.from( carousel.querySelectorAll( '.ic-slide' ) );
			var prevButton = carousel.querySelector( '.ic-arrow-prev' );
			var nextButton = carousel.querySelector( '.ic-arrow-next' );
			var dotsContainer = carousel.querySelector( '.ic-dots' );
			var trackWrapper = carousel.querySelector( '.ic-track-wrapper' );

			if ( ! track || slides.length === 0 || ! trackWrapper ) {
				return;
			}

			var visibleDesktop = parseInt( carousel.dataset.visible, 10 ) || 3;
			var autoplay = carousel.dataset.autoplay === 'true';
			var autoplaySpeed = parseInt( carousel.dataset.autoplaySpeed, 10 ) || 4000;
			var transitionSpeed = parseInt( carousel.dataset.transitionSpeed, 10 ) || 500;
			var pauseOnHover = carousel.dataset.pauseHover === 'true';
			var infinite = carousel.dataset.infinite === 'true';

			var currentIndex = 0;
			var autoplayInterval = null;
			var actualVisible = 1;

			track.style.transition = 'transform ' + transitionSpeed + 'ms ease-in-out';

			function getVisibleSlides() {
				var isMobile = window.innerWidth <= 768;
				return isMobile ? 1 : Math.max( 1, visibleDesktop );
			}

			function updateSlideWidths() {
				actualVisible = getVisibleSlides();
				var gap = parseFloat( window.getComputedStyle( track ).gap || '0' );
				var percent = 100 / actualVisible;
				var pxGap = ( ( actualVisible - 1 ) * gap ) / actualVisible;

				slides.forEach( function ( slide ) {
					slide.style.width = 'calc(' + percent + '% - ' + pxGap + 'px)';
					slide.style.minWidth = 'calc(' + percent + '% - ' + pxGap + 'px)';
				} );
			}

			function maxIndex() {
				return Math.max( 0, slides.length - actualVisible );
			}

			function updateDots() {
				if ( ! dotsContainer ) {
					return;
				}

				var dots = dotsContainer.querySelectorAll( '.ic-dot' );
				var activeDotIndex = Math.floor( currentIndex / Math.max( 1, actualVisible ) );

				dots.forEach( function ( dot, index ) {
					dot.classList.toggle( 'active', index === activeDotIndex );
				} );
			}

			function rebuildDots() {
				if ( ! dotsContainer ) {
					return;
				}

				dotsContainer.innerHTML = '';
				var dotCount = Math.ceil( slides.length / Math.max( 1, actualVisible ) );

				for ( var i = 0; i < dotCount; i++ ) {
					var dot = document.createElement( 'button' );
					dot.className = 'ic-dot' + ( i === 0 ? ' active' : '' );
					dot.setAttribute( 'aria-label', 'Go to page ' + ( i + 1 ) );
					( function ( pageIndex ) {
						dot.addEventListener( 'click', function () {
							goToSlide( pageIndex * actualVisible );
							resetAutoplay();
						} );
					} )( i );
					dotsContainer.appendChild( dot );
				}
			}

			function updateButtons() {
				if ( ! prevButton || ! nextButton ) {
					return;
				}

				if ( infinite ) {
					prevButton.disabled = false;
					nextButton.disabled = false;
					return;
				}

				prevButton.disabled = currentIndex <= 0;
				nextButton.disabled = currentIndex >= maxIndex();
			}

			function goToSlide( index ) {
				if ( infinite ) {
					if ( index > maxIndex() ) {
						currentIndex = 0;
					} else if ( index < 0 ) {
						currentIndex = maxIndex();
					} else {
						currentIndex = index;
					}
				} else {
					currentIndex = Math.max( 0, Math.min( index, maxIndex() ) );
				}

				var slideWidth = slides[ 0 ].offsetWidth;
				var gap = parseFloat( window.getComputedStyle( track ).gap || '0' );
				var offset = currentIndex * ( slideWidth + gap );

				track.style.transform = 'translateX(-' + offset + 'px)';
				updateDots();
				updateButtons();
			}

			function nextSlide() {
				goToSlide( currentIndex + 1 );
			}

			function prevSlide() {
				goToSlide( currentIndex - 1 );
			}

			function startAutoplay() {
				if ( ! autoplay ) {
					return;
				}

				stopAutoplay();
				autoplayInterval = setInterval( nextSlide, autoplaySpeed );
			}

			function stopAutoplay() {
				if ( autoplayInterval ) {
					clearInterval( autoplayInterval );
					autoplayInterval = null;
				}
			}

			function resetAutoplay() {
				stopAutoplay();
				startAutoplay();
			}

			if ( nextButton ) {
				nextButton.addEventListener( 'click', function ( event ) {
					nextSlide();
					resetAutoplay();
					setTimeout( function () {
						event.currentTarget.blur();
					}, 0 );
				} );
			}

			if ( prevButton ) {
				prevButton.addEventListener( 'click', function ( event ) {
					prevSlide();
					resetAutoplay();
					setTimeout( function () {
						event.currentTarget.blur();
					}, 0 );
				} );
			}

			if ( pauseOnHover ) {
				carousel.addEventListener( 'mouseenter', stopAutoplay );
				carousel.addEventListener( 'mouseleave', startAutoplay );
			}

			var touchStartX = 0;
			var touchEndX = 0;

			trackWrapper.addEventListener( 'touchstart', function ( event ) {
				touchStartX = event.changedTouches[ 0 ].screenX;
				stopAutoplay();
			}, { passive: true } );

			trackWrapper.addEventListener( 'touchend', function ( event ) {
				touchEndX = event.changedTouches[ 0 ].screenX;
				var diff = touchStartX - touchEndX;
				if ( Math.abs( diff ) > 50 ) {
					if ( diff > 0 ) {
						nextSlide();
					} else {
						prevSlide();
					}
				}
				startAutoplay();
			}, { passive: true } );

			carousel.setAttribute( 'tabindex', '0' );
			carousel.addEventListener( 'keydown', function ( event ) {
				if ( event.key === 'ArrowLeft' ) {
					prevSlide();
					resetAutoplay();
					event.preventDefault();
				}
				if ( event.key === 'ArrowRight' ) {
					nextSlide();
					resetAutoplay();
					event.preventDefault();
				}
			} );

			var resizeTimeout;
			window.addEventListener( 'resize', function () {
				clearTimeout( resizeTimeout );
				resizeTimeout = setTimeout( function () {
					updateSlideWidths();
					rebuildDots();
					goToSlide( 0 );
				}, 250 );
			} );

			updateSlideWidths();
			rebuildDots();
			goToSlide( 0 );
			startAutoplay();
		} );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', initImageCarousel );
	} else {
		initImageCarousel();
	}
} )();
