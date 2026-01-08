( function() {
	function initCarousel() {
		var carousels = document.querySelectorAll( '.review-carousel-wrapper' );
		
		carousels.forEach( function( wrapper ) {
			var carousel = wrapper.querySelector( '.review-carousel' );
			var cards = Array.from( carousel.querySelectorAll( '.review-card' ) );
			var prevBtn = wrapper.querySelector( '.review-nav-prev' );
			var nextBtn = wrapper.querySelector( '.review-nav-next' );
			// Adjust visible cards based on screen width
			var isMobile = window.innerWidth <= 768;
			var visibleCards = isMobile ? 1 : 3;
			wrapper.dataset.visibleCards = visibleCards.toString();
			wrapper.style.setProperty( '--visible-cards', visibleCards.toString() );
			
			if ( cards.length <= visibleCards ) {
				if ( prevBtn ) prevBtn.style.display = 'none';
				if ( nextBtn ) nextBtn.style.display = 'none';
				return;
			}
			
			// Create inner wrapper for sliding
			var inner = document.createElement( 'div' );
			inner.className = 'review-carousel-inner';
			cards.forEach( function( card ) {
				inner.appendChild( card );
			} );
			// Clone cards for infinite loop
			cards.forEach( function( card ) {
				var clone = card.cloneNode( true );
				inner.appendChild( clone );
			} );
			carousel.appendChild( inner );
			
			var currentIndex = 0;
			var totalCards = cards.length;
			var isTransitioning = false;
			var autoRotateInterval;
			var duration = parseFloat( getComputedStyle( wrapper ).getPropertyValue( '--carousel-duration' ) ) || 8;
			var autoRotateDelay = duration * 1000;
			
			// Drag variables
			var isDragging = false;
			var startPos = 0;
			var currentTranslate = 0;
			var prevTranslate = 0;
			var animationID = 0;
			
			function getCardStep() {
				var first = cards[0];
				if ( !first ) return 0;
				var cardWidth = first.getBoundingClientRect().width;
				var gap = 0;
				try {
					var innerStyles = window.getComputedStyle( inner );
					gap = parseFloat( innerStyles.columnGap || innerStyles.gap ) || 0;
				} catch ( e ) {
					gap = 0;
				}
				return cardWidth + gap;
			}
			
			function updateCarousel( noTransition ) {
				var step = getCardStep();
				var offset = -currentIndex * step;
				if ( noTransition ) {
					inner.style.transition = 'none';
				}
				inner.style.transform = 'translateX(' + offset + 'px)';
				if ( noTransition ) {
					setTimeout( function() {
						inner.style.transition = '';
					}, 50 );
				}
			}
			
			function next() {
				if ( isTransitioning ) return;
				isTransitioning = true;
				currentIndex++;
				updateCarousel();
				
				if ( currentIndex >= totalCards ) {
					setTimeout( function() {
						currentIndex = 0;
						updateCarousel( true );
						isTransitioning = false;
					}, 500 );
				} else {
					setTimeout( function() {
						isTransitioning = false;
					}, 500 );
				}
				resetAutoRotate();
			}
			
			function prev() {
				if ( isTransitioning ) return;
				isTransitioning = true;
				
				if ( currentIndex <= 0 ) {
					currentIndex = totalCards;
					updateCarousel( true );
					setTimeout( function() {
						currentIndex--;
						updateCarousel();
						setTimeout( function() {
							isTransitioning = false;
						}, 500 );
					}, 50 );
				} else {
					currentIndex--;
					updateCarousel();
					setTimeout( function() {
						isTransitioning = false;
					}, 500 );
				}
				resetAutoRotate();
			}
			
			function resetAutoRotate() {
				clearInterval( autoRotateInterval );
				autoRotateInterval = setInterval( next, autoRotateDelay );
			}
			
			// Mouse/Touch events
			function touchStart( event ) {
				isDragging = true;
				startPos = getPositionX( event );
				prevTranslate = -currentIndex * getCardStep();
				inner.classList.add( 'dragging' );
				clearInterval( autoRotateInterval );
				if ( event.type === 'touchstart' ) {
					event.preventDefault();
				}
			}
			
			function touchMove( event ) {
				if ( !isDragging ) return;
				var currentPosition = getPositionX( event );
				currentTranslate = prevTranslate + currentPosition - startPos;
				var step = getCardStep();
				var offset = -currentIndex * step;
				inner.style.transition = 'none';
				inner.style.transform = 'translateX(' + ( offset + ( currentPosition - startPos ) ) + 'px)';
			}
			
			function touchEnd() {
				if ( !isDragging ) return;
				isDragging = false;
				inner.classList.remove( 'dragging' );
				inner.style.transition = '';
				
				var movedBy = currentTranslate - prevTranslate;
				var threshold = window.innerWidth <= 768 ? 50 : 100;
				
				if ( movedBy < -threshold ) {
					next();
				} else if ( movedBy > threshold ) {
					prev();
				} else {
					updateCarousel();
					resetAutoRotate();
				}
				
				currentTranslate = 0;
				prevTranslate = 0;
			}
			
			function getPositionX( event ) {
				return event.type.includes( 'mouse' ) ? event.pageX : event.touches[0].clientX;
			}
			
			// Event listeners
			if ( prevBtn ) prevBtn.addEventListener( 'click', prev );
			if ( nextBtn ) nextBtn.addEventListener( 'click', next );
			
			// Mouse events
			inner.addEventListener( 'mousedown', touchStart );
			inner.addEventListener( 'mousemove', touchMove );
			inner.addEventListener( 'mouseup', touchEnd );
			inner.addEventListener( 'mouseleave', touchEnd );
			
			// Touch events
			inner.addEventListener( 'touchstart', touchStart, { passive: false } );
			inner.addEventListener( 'touchmove', touchMove, { passive: true } );
			inner.addEventListener( 'touchend', touchEnd );
			
			// Handle resize
			var resizeTimeout;
			window.addEventListener( 'resize', function() {
				clearTimeout( resizeTimeout );
				resizeTimeout = setTimeout( function() {
					var newIsMobile = window.innerWidth <= 768;
					var newVisibleCards = newIsMobile ? 1 : 3;
					if ( newVisibleCards !== visibleCards ) {
						visibleCards = newVisibleCards;
						wrapper.style.setProperty( '--visible-cards', visibleCards.toString() );
						updateCarousel();
					}
				}, 250 );
			} );
			
			updateCarousel();
			autoRotateInterval = setInterval( next, autoRotateDelay );
		} );
	}
	
	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', initCarousel );
	} else {
		initCarousel();
	}
} )();
