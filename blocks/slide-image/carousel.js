( function() {
	function initCarousel() {
		var carousels = document.querySelectorAll( '.review-carousel-wrapper' );
		
		carousels.forEach( function( wrapper ) {
			var carousel = wrapper.querySelector( '.review-carousel' );
			var cards = Array.from( carousel.querySelectorAll( '.review-card' ) );
			var prevBtn = wrapper.querySelector( '.review-nav-prev' );
			var nextBtn = wrapper.querySelector( '.review-nav-next' );
			var visibleCards = parseInt( wrapper.dataset.visibleCards ) || 3;
			
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
			carousel.appendChild( inner );
			
			var currentIndex = 0;
			var autoRotateInterval;
			var duration = parseFloat( getComputedStyle( wrapper ).getPropertyValue( '--carousel-duration' ) ) || 8;
			var autoRotateDelay = duration * 1000;
			
			// Drag variables
			var isDragging = false;
			var startPos = 0;
			var currentTranslate = 0;
			var prevTranslate = 0;
			var animationID = 0;
			
			function getCardWidth() {
				return cards[0].offsetWidth + 20; // width + gap
			}
			
			function updateCarousel() {
				var cardWidth = getCardWidth();
				var offset = -currentIndex * cardWidth;
				inner.style.transform = 'translateX(' + offset + 'px)';
			}
			
			function next() {
				if ( currentIndex < cards.length - visibleCards ) {
					currentIndex++;
				} else {
					currentIndex = 0;
				}
				updateCarousel();
				resetAutoRotate();
			}
			
			function prev() {
				if ( currentIndex > 0 ) {
					currentIndex--;
				} else {
					currentIndex = cards.length - visibleCards;
				}
				updateCarousel();
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
				inner.classList.add( 'dragging' );
				clearInterval( autoRotateInterval );
			}
			
			function touchMove( event ) {
				if ( !isDragging ) return;
				var currentPosition = getPositionX( event );
				currentTranslate = prevTranslate + currentPosition - startPos;
				var cardWidth = getCardWidth();
				var offset = -currentIndex * cardWidth;
				inner.style.transform = 'translateX(' + ( offset + ( currentPosition - startPos ) ) + 'px)';
			}
			
			function touchEnd() {
				if ( !isDragging ) return;
				isDragging = false;
				inner.classList.remove( 'dragging' );
				
				var movedBy = currentTranslate - prevTranslate;
				
				if ( movedBy < -100 && currentIndex < cards.length - visibleCards ) {
					currentIndex++;
				} else if ( movedBy > 100 && currentIndex > 0 ) {
					currentIndex--;
				}
				
				currentTranslate = 0;
				prevTranslate = 0;
				updateCarousel();
				resetAutoRotate();
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
			inner.addEventListener( 'touchstart', touchStart );
			inner.addEventListener( 'touchmove', touchMove );
			inner.addEventListener( 'touchend', touchEnd );
			
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
