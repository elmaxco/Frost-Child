document.addEventListener('DOMContentLoaded', function () {
	const navs = document.querySelectorAll('.frost-child-flex-nav');
	if (!navs.length) return;

	function getBreakpoint(nav) {
		const raw = nav.getAttribute('data-breakpoint');
		const bp = parseInt(raw, 10);
		return Number.isFinite(bp) ? bp : 960;
	}

	function isMobile(nav) {
		const bp = getBreakpoint(nav);
		return window.matchMedia(`(max-width: ${bp}px)`).matches;
	}

	navs.forEach(function (nav) {
		const toggle = nav.querySelector('.frost-child-flex-nav__toggle');
		const panel = nav.querySelector('.frost-child-flex-nav__panel');
		let closeBtn = nav.querySelector('.frost-child-flex-nav__close');
		if (!toggle || !panel) return;

		// Backward compatibility: older saved blocks won't have the close button.
		if (!closeBtn) {
			closeBtn = document.createElement('button');
			closeBtn.type = 'button';
			closeBtn.className = 'frost-child-flex-nav__close';
			closeBtn.setAttribute('aria-label', 'Stäng');
			closeBtn.textContent = '×';
			panel.insertBefore(closeBtn, panel.firstChild);
		}

		function open() {
			nav.classList.add('is-open');
			toggle.setAttribute('aria-expanded', 'true');
			if (isMobile(nav)) {
				document.body.classList.add('frost-child-flex-nav-open');
				// Close other flexible nav instances on mobile
				document.querySelectorAll('.frost-child-flex-nav.is-open').forEach(function (other) {
					if (other === nav) return;
					other.classList.remove('is-open');
					const otherToggle = other.querySelector('.frost-child-flex-nav__toggle');
					if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
				});
			}
		}

		function close() {
			nav.classList.remove('is-open');
			toggle.setAttribute('aria-expanded', 'false');
			document.body.classList.remove('frost-child-flex-nav-open');
		}

		function isOpen() {
			return nav.classList.contains('is-open');
		}

		// Desktop: always open (acts like normal navigation row)
		function syncMode() {
			if (!isMobile(nav)) {
				open();
				document.body.classList.remove('frost-child-flex-nav-open');
				return;
			}

			// Mobile: start closed
			close();
		}

		syncMode();

		toggle.addEventListener('click', function (e) {
			e.preventDefault();
			e.stopPropagation();
			if (!isMobile(nav)) return;
			if (isOpen()) close();
			else open();
		});

		if (closeBtn) {
			closeBtn.addEventListener('click', function (e) {
				e.preventDefault();
				e.stopPropagation();
				// Tiny tap animation on the X, then close.
				closeBtn.classList.remove('is-clicked');
				// Force reflow so re-adding the class retriggers the animation.
				void closeBtn.offsetWidth;
				closeBtn.classList.add('is-clicked');
				window.setTimeout(function () {
					close();
				}, 110);
			});
		}

		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape' && isMobile(nav) && isOpen()) {
				close();
			}
		});

		window.addEventListener(
			'resize',
			function () {
				syncMode();
			},
			{ passive: true }
		);
	});
});
