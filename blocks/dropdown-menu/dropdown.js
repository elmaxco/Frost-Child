document.addEventListener('DOMContentLoaded', function() {
    const dropdownButtons = document.querySelectorAll('.dropdown-menu-button');

    function getBackdrop() {
        let backdrop = document.querySelector('.dropdown-menu-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.className = 'dropdown-menu-backdrop';
            document.body.appendChild(backdrop);
        }
        return backdrop;
    }

    function ensureSingleBackdrop() {
        const backdrops = document.querySelectorAll('.dropdown-menu-backdrop');
        if (backdrops.length <= 1) return;
        // Keep the first, remove any accidental duplicates.
        for (let i = 1; i < backdrops.length; i++) {
            backdrops[i].remove();
        }
    }

    function isAnySimpleDropdownOpen() {
        // Wrapper open class (when not portaled) OR panel open class (when portaled).
        return (
            !!document.querySelector('.frost-child-simple-dropdown.is-open') ||
            !!document.querySelector('.frost-child-simple-dropdown__panel.is-open')
        );
    }

    function syncBackdrop() {
        ensureSingleBackdrop();
        const backdrop = getBackdrop();
        const anyMegaOpen = !!document.querySelector('.dropdown-menu-content.active');
        const shouldBeActive = anyMegaOpen || isAnySimpleDropdownOpen();
        backdrop.classList.toggle('active', shouldBeActive);

        // Inline fallback in case CSS doesn't load or gets overridden.
        // Also important because another script (simple-dropdown) may have
        // previously set inline styles on the shared backdrop.
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

    function positionMenuUnderTrigger(menu, triggerEl) {
        if (!menu || !triggerEl) return;
        const rect = triggerEl.getBoundingClientRect();
        const gap = 12; // 8–16px
        const top = Math.round(rect.bottom + gap);
        menu.style.setProperty('--dropdown-top', `${top}px`);

        // Center the whole dropdown on the trigger center (the arrow under “Tjänster”).
        // Clamp so the card stays within the viewport.
        const triggerCenterX = rect.left + rect.width / 2;

        // Need menu width; if it isn't measurable yet, bail and let caller retry.
        const menuWidth = menu.offsetWidth;
        if (!menuWidth) return;

        const viewportW = window.innerWidth;
        const margin = 16;
        const minCenter = margin + menuWidth / 2;
        const maxCenter = viewportW - margin - menuWidth / 2;
        const clampedCenter = Math.max(minCenter, Math.min(maxCenter, triggerCenterX));

        menu.style.setProperty('--dropdown-left', `${Math.round(clampedCenter)}px`);

        // Position the small pointer so it points to the real trigger center.
        // After clamping, the pointer may not be exactly centered.
        const menuLeft = clampedCenter - menuWidth / 2;
        let arrowLeft = triggerCenterX - menuLeft;
        const clampPadding = 28;
        arrowLeft = Math.max(clampPadding, Math.min(menuWidth - clampPadding, arrowLeft));
        menu.style.setProperty('--dropdown-arrow-left', `${Math.round(arrowLeft)}px`);
    }

    function positionArrowToTrigger(menu, triggerEl) {
        // Kept for backwards compatibility; positioning is now handled in positionMenuUnderTrigger.
        positionMenuUnderTrigger(menu, triggerEl);
    }

    function normalizeText(value) {
        return (value || '')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();
    }
    
    dropdownButtons.forEach(button => {
        const wrapper = button.closest('.dropdown-menu-wrapper');
        const menu = wrapper.querySelector('.dropdown-menu-content');
        
        if (!menu) return;

        // Store refs so we can portal the menu to <body> without breaking close logic.
        if (!menu._dropdownPortal) {
            menu._dropdownPortal = {
                parent: menu.parentNode,
                nextSibling: menu.nextSibling,
                button,
                triggerEl: button,
                restore() {
                    if (this.parent) {
                        this.parent.insertBefore(menu, this.nextSibling || null);
                    }
                },
                portal() {
                    if (menu.parentNode !== document.body) {
                        document.body.appendChild(menu);
                    }
                },
            };
        }

        const sidebarItems = menu.querySelectorAll('.menu-sidebar-item');
        const templates = menu.querySelectorAll('template.menu-item-template');
        const contentMain = menu.querySelector('.menu-content-main');

        if (!contentMain || sidebarItems.length === 0 || templates.length === 0) return;

        const templateByIndex = new Map();
        templates.forEach(tpl => {
            const idx = tpl.getAttribute('data-item-index');
            if (idx !== null) templateByIndex.set(idx, tpl);
        });

        function setActive(index) {
            sidebarItems.forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-item-index') === index);
            });

            const activeBtn = Array.from(sidebarItems).find(
                (btn) => btn.getAttribute('data-item-index') === index
            );
            const activeTitle = activeBtn
                ? (activeBtn.querySelector('.menu-sidebar-title')?.textContent || activeBtn.textContent)
                : '';
            const activeTitleNorm = normalizeText(activeTitle);
            const isSmallFix = activeTitleNorm.includes('mindre jobb') || activeTitleNorm.includes('småfix');
            menu.dataset.popularServicesMode = isSmallFix ? 'smallfix' : 'default';

            const tpl = templateByIndex.get(index);
            contentMain.innerHTML = tpl ? tpl.innerHTML : '';

            if (menu._dropdownCitySwitcher && typeof menu._dropdownCitySwitcher.refresh === 'function') {
                menu._dropdownCitySwitcher.refresh();
            }
        }

        // Default to first sidebar item
        const firstIndex = sidebarItems[0].getAttribute('data-item-index');
        if (firstIndex !== null) setActive(firstIndex);

        sidebarItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                const idx = this.getAttribute('data-item-index');
                if (idx !== null) setActive(idx);
            });

            item.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const idx = this.getAttribute('data-item-index');
                if (idx !== null) setActive(idx);
            });
        });

        // City switcher (locations -> popular services)
        (function initCitySwitcher() {
            const locationButtons = menu.querySelectorAll('.location-button');
            const cityEl = menu.querySelector('.popular-services-city');
            const servicesListEl = menu.querySelector('.popular-services-list');
            const servicesSectionEl = menu.querySelector('.popular-services-section');

            if (!locationButtons.length || !servicesSectionEl || !servicesListEl || !cityEl) return;

            const defaultServicesByCity = {
                Stockholm: ['Badrumsrenovering', 'Köksrenovering', 'Helrenovering', 'Energirenovering', 'Källarrenovering', 'Fasadrenovering'],
                Göteborg: ['Badrumsrenovering', 'Köksrenovering', 'Helrenovering', 'Källarrenovering', 'Fasadrenovering'],
                Uppsala: ['Badrumsrenovering'],
            };

            // For “Mindre jobb eller småfix”: same services for all cities.
            const smallFixServices = ['Elektriker', 'Rörmokare', 'Plattsättare', 'Målare', 'Snickare'];

            let currentCityName = null;

            function getMode() {
                return menu.dataset.popularServicesMode || 'default';
            }

            function getServices(cityName) {
                if (getMode() === 'smallfix') return smallFixServices;
                return defaultServicesByCity[cityName] || defaultServicesByCity.Stockholm;
            }

            function renderServices(cityName) {
                const list = getServices(cityName);
                currentCityName = cityName;
                cityEl.textContent = cityName;
                servicesListEl.innerHTML = list
                    .map((svc) => `<a href="#" class="popular-service-button">${svc}</a>`)
                    .join('');
            }

            function setActiveCity(btn) {
                locationButtons.forEach((b) => b.classList.remove('active'));
                btn.classList.add('active');
                renderServices(btn.textContent.trim());
            }

            // Bind clicks
            locationButtons.forEach((btn) => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveCity(this);
                });
            });

            // Init based on existing active, else first
            const active = menu.querySelector('.location-button.active') || locationButtons[0];
            if (active) setActiveCity(active);

            // Allow sidebar selection to switch which service list is used.
            menu._dropdownCitySwitcher = {
                refresh() {
                    if (currentCityName) {
                        renderServices(currentCityName);
                        return;
                    }
                    const activeBtn = menu.querySelector('.location-button.active') || locationButtons[0];
                    if (activeBtn) setActiveCity(activeBtn);
                },
            };
        })();
        
        function toggleMenu(e, triggerEl) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }

            const willOpen = !menu.classList.contains('active');

            // Close all other dropdowns
            document.querySelectorAll('.dropdown-menu-content.active').forEach(otherMenu => {
                if (otherMenu !== menu) {
                    otherMenu.classList.remove('active');
                    if (otherMenu._dropdownPortal) {
                        otherMenu._dropdownPortal.restore();
                        const otherButton = otherMenu._dropdownPortal.button;
                        if (otherButton) {
                            otherButton.classList.remove('active');
                            otherButton.setAttribute('aria-expanded', 'false');
                        }
                    } else {
                        const otherButton = otherMenu.closest('.dropdown-menu-wrapper')?.querySelector('.dropdown-menu-button');
                        if (otherButton) {
                            otherButton.classList.remove('active');
                            otherButton.setAttribute('aria-expanded', 'false');
                        }
                    }
                }
            });

            if (willOpen) {
                const backdrop = getBackdrop();
                menu._dropdownPortal.triggerEl = triggerEl || button;
                menu._dropdownPortal.portal();
                menu.classList.add('active');
                syncBackdrop();

                // After it becomes display:block, we can measure and align the card + pointer.
                requestAnimationFrame(function() {
                    positionMenuUnderTrigger(menu, triggerEl || button);
                });

                button.classList.add('active');
                button.setAttribute('aria-expanded', 'true');
            } else {
                menu.classList.remove('active');
                syncBackdrop();
                if (menu._dropdownPortal) menu._dropdownPortal.restore();
                button.classList.remove('active');
                button.setAttribute('aria-expanded', 'false');
            }
        }

        // Toggle dropdown on block button click
        button.addEventListener('click', function(e) {
            toggleMenu(e, button);
        });

        // Hook into main navigation link that matches this button text
        const buttonLabel = normalizeText(button.textContent.replace('⌵', ''));
        const navLinks = document.querySelectorAll('.wp-block-navigation a');
        navLinks.forEach(link => {
            if (link.dataset.dropdownBound === '1') return;
            if (normalizeText(link.textContent) === buttonLabel) {
                link.dataset.dropdownBound = '1';
                link.addEventListener('click', function(e) {
                    toggleMenu(e, link);
                });

                // Remember the nav link used as a trigger so outside-click logic works.
                menu._dropdownPortal.triggerEl = link;
            }
        });

        // Keep pointer aligned on resize while open
        window.addEventListener('resize', function() {
            if (menu.classList.contains('active')) {
                const activeTrigger = (menu._dropdownPortal && menu._dropdownPortal.triggerEl) ? menu._dropdownPortal.triggerEl : button;
                positionMenuUnderTrigger(menu, activeTrigger);
            }
        });

        window.addEventListener('scroll', function() {
            if (menu.classList.contains('active')) {
                const activeTrigger = (menu._dropdownPortal && menu._dropdownPortal.triggerEl) ? menu._dropdownPortal.triggerEl : button;
                positionMenuUnderTrigger(menu, activeTrigger);
            }
        }, { passive: true });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        const clickedInsideMenu = !!e.target.closest('.dropdown-menu-content');
        const clickedTriggerButton = !!e.target.closest('.dropdown-menu-button');

        // If a nav link is the trigger, allow clicks on it too.
        const activeMenu = document.querySelector('.dropdown-menu-content.active');
        const clickedTriggerLink = !!(activeMenu && activeMenu._dropdownPortal && activeMenu._dropdownPortal.triggerEl && activeMenu._dropdownPortal.triggerEl.contains(e.target));

        if (clickedInsideMenu || clickedTriggerButton || clickedTriggerLink) return;

        document.querySelectorAll('.dropdown-menu-content.active').forEach(menu => {
            menu.classList.remove('active');

            if (menu._dropdownPortal) {
                menu._dropdownPortal.restore();
                const btn = menu._dropdownPortal.button;
                if (btn) {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-expanded', 'false');
                }
            } else {
                const btn = menu.closest('.dropdown-menu-wrapper')?.querySelector('.dropdown-menu-button');
                if (btn) {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-expanded', 'false');
                }
            }
        });

        // Ensure backdrop is cleared if nothing else needs it.
        syncBackdrop();
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.dropdown-menu-content.active').forEach(menu => {
                menu.classList.remove('active');
                const btn = menu.closest('.dropdown-menu-wrapper').querySelector('.dropdown-menu-button');
                if (btn) {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-expanded', 'false');
                }
            });

            syncBackdrop();
        }
    });
    
});

