(() => {
	const SELECTOR_WRAP = '.frost-child-simple-dropdown';
	const SELECTOR_BTN = '.frost-child-simple-dropdown__button';
	const SELECTOR_PANEL = '.frost-child-simple-dropdown__panel';
	const BACKDROP_SELECTOR = '.dropdown-menu-backdrop';

	function getBlocks() {
		return Array.from(document.querySelectorAll(SELECTOR_WRAP));
	}

	function getBackdrop() {
		let backdrop = document.querySelector(BACKDROP_SELECTOR);
		if (!backdrop) {
			backdrop = document.createElement('div');
			backdrop.className = 'dropdown-menu-backdrop';
			document.body.appendChild(backdrop);
		}
		return backdrop;
	}

	function syncBackdrop() {
		const backdrop = getBackdrop();
		const anySimpleOpen = !!document.querySelector(`${SELECTOR_WRAP}.is-open`);
		const anyMegaOpen = !!document.querySelector('.dropdown-menu-content.active');
		const shouldBeActive = anySimpleOpen || anyMegaOpen;

		backdrop.classList.toggle('active', shouldBeActive);
		// Inline fallback in case CSS doesn't load or gets overridden.
		if (shouldBeActive) {
			backdrop.style.position = 'fixed';
			backdrop.style.inset = '0';
			backdrop.style.background = 'rgba(0, 0, 0, 0.35)';
			backdrop.style.zIndex = '1000';
			backdrop.style.transition = 'opacity 0.25s ease';
			backdrop.style.opacity = '1';
			backdrop.style.pointerEvents = 'auto';
		} else {
			backdrop.style.position = '';
			backdrop.style.inset = '';
			backdrop.style.background = '';
			backdrop.style.zIndex = '';
			backdrop.style.transition = '';
			backdrop.style.opacity = '';
			backdrop.style.pointerEvents = '';
		}
	}

	function closeAll(except) {
		getBlocks().forEach((wrap) => {
			if (except && wrap === except) return;
			wrap.classList.remove('is-open');
			const btn = wrap.querySelector(SELECTOR_BTN);
			if (btn) btn.setAttribute('aria-expanded', 'false');

			const panel = wrap.querySelector(SELECTOR_PANEL) || wrap._simpleDropdownPanel;
			if (panel) {
				panel.classList.remove('is-open');
				// Restore panel if it was portaled.
				if (panel._simpleDropdownPortal && panel._simpleDropdownPortal.parent) {
					panel._simpleDropdownPortal.parent.insertBefore(panel, panel._simpleDropdownPortal.nextSibling || null);
				}
				panel._simpleDropdownPortal = null;
				panel.style.position = '';
				panel.style.top = '';
				panel.style.left = '';
				panel.style.transform = '';
				panel.style.zIndex = '';
			}
		});
		if (!except) syncBackdrop();
	}

	function positionPanel(panel, button) {
		if (!panel || !button) return;
		const rect = button.getBoundingClientRect();
		const gap = 10;
		const top = Math.round(rect.bottom + gap);
		const centerX = rect.left + rect.width / 2;

		panel.style.position = 'fixed';
		panel.style.top = `${top}px`;
		panel.style.left = `${Math.round(centerX)}px`;
		panel.style.transform = 'translateX(-50%)';
		panel.style.zIndex = '1001';

		// Clamp within viewport (like dropdown-menu).
		const panelWidth = panel.offsetWidth;
		if (panelWidth) {
			const viewportW = window.innerWidth;
			const margin = 16;
			const minCenter = margin + panelWidth / 2;
			const maxCenter = viewportW - margin - panelWidth / 2;
			const clampedCenter = Math.max(minCenter, Math.min(maxCenter, centerX));
			panel.style.left = `${Math.round(clampedCenter)}px`;
		}
	}

	function bindBlock(wrap) {
		if (!wrap || wrap.dataset.simpleDropdownBound === '1') return;
		const button = wrap.querySelector(SELECTOR_BTN);
		const panel = wrap.querySelector(SELECTOR_PANEL);
		if (!button) return;

		wrap.dataset.simpleDropdownBound = '1';

		button.addEventListener('click', (e) => {
			e.preventDefault();
			e.stopPropagation();

			const isOpen = wrap.classList.contains('is-open');
			closeAll(wrap);
			wrap.classList.toggle('is-open', !isOpen);
			button.setAttribute('aria-expanded', String(!isOpen));

			if (panel) {
				wrap._simpleDropdownPanel = panel;
				if (!isOpen) {
					// Portal panel to <body> so it sits above the shared backdrop.
					if (!panel._simpleDropdownPortal) {
						panel._simpleDropdownPortal = {
							parent: panel.parentNode,
							nextSibling: panel.nextSibling,
						};
					}
					if (panel.parentNode !== document.body) {
						document.body.appendChild(panel);
					}
					panel.classList.add('is-open');
					// After display, measure & position.
					requestAnimationFrame(() => positionPanel(panel, button));
				} else {
					panel.classList.remove('is-open');
					if (panel._simpleDropdownPortal && panel._simpleDropdownPortal.parent) {
						panel._simpleDropdownPortal.parent.insertBefore(panel, panel._simpleDropdownPortal.nextSibling || null);
					}
					panel._simpleDropdownPortal = null;
					panel.style.position = '';
					panel.style.top = '';
					panel.style.left = '';
					panel.style.transform = '';
					panel.style.zIndex = '';
				}
			}

			syncBackdrop();
		});
	}

	function init() {
		getBlocks().forEach(bindBlock);

		// Clicking the backdrop should close the dropdown, same feel as dropdown-menu.
		const backdrop = getBackdrop();
		if (!backdrop.dataset.simpleDropdownBound) {
			backdrop.dataset.simpleDropdownBound = '1';
			backdrop.addEventListener('click', () => closeAll());
		}

		// Close when clicking outside.
		if (!document.documentElement.dataset.simpleDropdownDocBound) {
			document.documentElement.dataset.simpleDropdownDocBound = '1';
			document.addEventListener('click', (e) => {
				if (e.target.closest(SELECTOR_WRAP)) return;
				if (e.target.closest(SELECTOR_PANEL)) return;
				closeAll();
			});

			document.addEventListener('keydown', (e) => {
				if (e.key === 'Escape') closeAll();
			});
		}

		// If blocks get inserted later (e.g. header/nav variations), bind them.
		if (!window.__simpleDropdownObserver) {
			window.__simpleDropdownObserver = new MutationObserver(() => {
				getBlocks().forEach(bindBlock);
			});
			window.__simpleDropdownObserver.observe(document.body, { childList: true, subtree: true });
		}

		// Keep portaled panel aligned.
		if (!window.__simpleDropdownPositionBound) {
			window.__simpleDropdownPositionBound = true;
			const reposition = () => {
				const openWrap = document.querySelector(`${SELECTOR_WRAP}.is-open`);
				if (!openWrap) return;
				const btn = openWrap.querySelector(SELECTOR_BTN);
				const pnl = openWrap._simpleDropdownPanel || openWrap.querySelector(SELECTOR_PANEL);
				if (pnl && pnl.classList.contains('is-open')) positionPanel(pnl, btn);
			};
			window.addEventListener('resize', reposition);
			window.addEventListener('scroll', reposition, { passive: true });
		}
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
