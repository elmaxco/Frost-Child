( function () {
	'use strict';

	document.addEventListener( 'DOMContentLoaded', function () {
		var carousels = document.querySelectorAll( '.ic-carousel' );
		carousels.forEach( initCarousel );
	} );

	function initCarousel( el ) {
		var track = el.querySelector( '.ic-track' );
		var slides = Array.from( track.children );
		if ( ! slides.length ) return;

		/* ---- read data attributes ---- */
		var visibleDesktop = parseInt( el.dataset.visible, 10 ) || 3;
		var autoplay = el.dataset.autoplay === 'true';
		var autoplaySpeed = parseInt( el.dataset.autoplaySpeed, 10 ) || 4000;
		var transitionSpeed = parseInt( el.dataset.transitionSpeed, 10 ) || 500;
		var pauseOnHover = el.dataset.pauseHover === 'true';
		var infinite = el.dataset.infinite === 'true';

		var totalSlides = slides.length;
		var currentIndex = 0;
		var isTransitioning = false;
		var autoplayTimer = null;
		var touchStartX = 0;
		var touchEndX = 0;
		var touchStartY = 0;
		var isDragging = false;

		/* ---- responsive visible count ---- */
		function getVisibleCount() {
			var w = window.innerWidth;
			if ( w <= 600 ) return 1;
			if ( w <= 900 ) return Math.min( 2, visibleDesktop );
			return visibleDesktop;
		}

		var visibleCount = getVisibleCount();

		/* ---- clone slides for infinite loop ---- */
		var clonesBefore = [];
		var clonesAfter = [];

		function setupClones() {
			/* remove old clones */
			clonesBefore.forEach( function ( c ) { c.remove(); } );
			clonesAfter.forEach( function ( c ) { c.remove(); } );
			clonesBefore = [];
			clonesAfter = [];

			if ( ! infinite || totalSlides <= visibleCount ) return;

			var cloneCount = visibleCount;

			for ( var i = 0; i < cloneCount; i++ ) {
				var cloneAfter = slides[ i ].cloneNode( true );
				cloneAfter.classList.add( 'ic-clone' );
				cloneAfter.setAttribute( 'aria-hidden', 'true' );
				track.appendChild( cloneAfter );
				clonesAfter.push( cloneAfter );
			}

			for ( var j = totalSlides - cloneCount; j < totalSlides; j++ ) {
				var cloneBefore = slides[ j ].cloneNode( true );
				cloneBefore.classList.add( 'ic-clone' );
				cloneBefore.setAttribute( 'aria-hidden', 'true' );
				track.insertBefore( cloneBefore, track.firstChild );
				clonesBefore.push( cloneBefore );
			}
		}

		/* ---- position ---- */
		function getOffset() {
			if ( ! infinite || totalSlides <= visibleCount ) return currentIndex;
			return currentIndex + clonesBefore.length;
		}

		function getSlideWidthPercent() {
			return 100 / visibleCount;
		}

		function setPosition( animate ) {
			var offset = getOffset();
			var slideWidth = getSlideWidthPercent();
			var translateX = -offset * slideWidth;
			track.style.transition = animate ? 'transform ' + transitionSpeed + 'ms ease' : 'none';
			track.style.transform = 'translateX(' + translateX + '%)';
		}

		/* ---- navigation ---- */
		function goTo( index, animate ) {
			if ( isTransitioning && animate ) return;
			if ( typeof animate === 'undefined' ) animate = true;

			if ( infinite && totalSlides > visibleCount ) {
				currentIndex = index;
				isTransitioning = animate;
				setPosition( animate );
			} else {
				var maxIndex = Math.max( 0, totalSlides - visibleCount );
				currentIndex = Math.max( 0, Math.min( index, maxIndex ) );
				setPosition( animate );
			}
			updateDots();
			updateArrows();
		}

		function goNext() { goTo( currentIndex + 1 ); }
		function goPrev() { goTo( currentIndex - 1 ); }

		/* ---- transition end (infinite loop snap) ---- */
		track.addEventListener( 'transitionend', function () {
			isTransitioning = false;
			if ( ! infinite || totalSlides <= visibleCount ) return;

			if ( currentIndex >= totalSlides ) {
				currentIndex = 0;
				setPosition( false );
			} else if ( currentIndex < 0 ) {
				currentIndex = totalSlides - 1;
				setPosition( false );
			}
			updateDots();
		} );

		/* ---- arrows ---- */
		var prevBtn = el.querySelector( '.ic-arrow-prev' );
		var nextBtn = el.querySelector( '.ic-arrow-next' );
		if ( prevBtn ) prevBtn.addEventListener( 'click', function () { goPrev(); resetAutoplay(); } );
		if ( nextBtn ) nextBtn.addEventListener( 'click', function () { goNext(); resetAutoplay(); } );

		function updateArrows() {
			if ( infinite || ! prevBtn ) return;
			var maxIndex = Math.max( 0, totalSlides - visibleCount );
			prevBtn.disabled = currentIndex <= 0;
			nextBtn.disabled = currentIndex >= maxIndex;
		}

		/* ---- dots ---- */
		var dotsContainer = el.querySelector( '.ic-dots' );
		var dots = dotsContainer ? Array.from( dotsContainer.children ) : [];

		function updateDots() {
			if ( ! dots.length ) return;
			var activeIndex = ( ( currentIndex % totalSlides ) + totalSlides ) % totalSlides;
			dots.forEach( function ( dot, i ) {
				dot.classList.toggle( 'active', i === activeIndex );
			} );
		}

		dots.forEach( function ( dot, i ) {
			dot.addEventListener( 'click', function () {
				goTo( i );
				resetAutoplay();
			} );
		} );

		/* ---- autoplay ---- */
		function startAutoplay() {
			if ( ! autoplay ) return;
			stopAutoplay();
			autoplayTimer = setInterval( goNext, autoplaySpeed );
		}

		function stopAutoplay() {
			if ( autoplayTimer ) { clearInterval( autoplayTimer ); autoplayTimer = null; }
		}

		function resetAutoplay() { stopAutoplay(); startAutoplay(); }

		if ( pauseOnHover ) {
			el.addEventListener( 'mouseenter', stopAutoplay );
			el.addEventListener( 'mouseleave', startAutoplay );
		}

		/* ---- touch / swipe ---- */
		track.addEventListener( 'touchstart', function ( e ) {
			touchStartX = e.changedTouches[ 0 ].screenX;
			touchStartY = e.changedTouches[ 0 ].screenY;
			isDragging = true;
		}, { passive: true } );

		track.addEventListener( 'touchmove', function ( e ) {
			if ( ! isDragging ) return;
			touchEndX = e.changedTouches[ 0 ].screenX;
		}, { passive: true } );

		track.addEventListener( 'touchend', function () {
			if ( ! isDragging ) return;
			isDragging = false;
			var diffX = touchStartX - touchEndX;
			var diffY = Math.abs( touchStartY - ( touchEndX || touchStartX ) );
			if ( Math.abs( diffX ) > 40 ) {
				if ( diffX > 0 ) goNext();
				else goPrev();
				resetAutoplay();
			}
		} );

		/* ---- mouse drag ---- */
		var mouseStartX = 0;
		var mouseDragging = false;

		track.addEventListener( 'mousedown', function ( e ) {
			mouseStartX = e.clientX;
			mouseDragging = true;
			track.style.cursor = 'grabbing';
			e.preventDefault();
		} );

		document.addEventListener( 'mousemove', function ( e ) {
			if ( ! mouseDragging ) return;
		} );

		document.addEventListener( 'mouseup', function ( e ) {
			if ( ! mouseDragging ) return;
			mouseDragging = false;
			track.style.cursor = '';
			var diff = mouseStartX - e.clientX;
			if ( Math.abs( diff ) > 40 ) {
				if ( diff > 0 ) goNext();
				else goPrev();
				resetAutoplay();
			}
		} );

		/* ---- keyboard ---- */
		el.setAttribute( 'tabindex', '0' );
		el.addEventListener( 'keydown', function ( e ) {
			if ( e.key === 'ArrowLeft' ) { goPrev(); resetAutoplay(); e.preventDefault(); }
			if ( e.key === 'ArrowRight' ) { goNext(); resetAutoplay(); e.preventDefault(); }
		} );

		/* ---- resize ---- */
		var resizeTimeout;
		window.addEventListener( 'resize', function () {
			clearTimeout( resizeTimeout );
			resizeTimeout = setTimeout( function () {
				var newVisible = getVisibleCount();
				if ( newVisible !== visibleCount ) {
					visibleCount = newVisible;
					setupClones();
					currentIndex = Math.min( currentIndex, Math.max( 0, totalSlides - visibleCount ) );
					setPosition( false );
					updateDots();
					updateArrows();
				}
			}, 200 );
		} );

		/* ---- init ---- */
		setupClones();
		setPosition( false );
		updateDots();
		updateArrows();
		startAutoplay();
	}
} )();
