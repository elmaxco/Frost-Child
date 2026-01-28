document.addEventListener('DOMContentLoaded', function() {
    const dropdownButtons = document.querySelectorAll('.dropdown-menu-button');
    
    dropdownButtons.forEach(button => {
        const wrapper = button.closest('.dropdown-menu-wrapper');
        const menu = wrapper.querySelector('.dropdown-menu-content');
        
        if (!menu) return;

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

            const tpl = templateByIndex.get(index);
            contentMain.innerHTML = tpl ? tpl.innerHTML : '';
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
        
        // Toggle dropdown on button click
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Close all other dropdowns
            document.querySelectorAll('.dropdown-menu-content.active').forEach(otherMenu => {
                if (otherMenu !== menu) {
                    otherMenu.classList.remove('active');
                    otherMenu.closest('.dropdown-menu-wrapper').querySelector('.dropdown-menu-button').classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            menu.classList.toggle('active');
            button.classList.toggle('active');
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown-menu-wrapper')) {
            document.querySelectorAll('.dropdown-menu-content.active').forEach(menu => {
                menu.classList.remove('active');
                menu.closest('.dropdown-menu-wrapper').querySelector('.dropdown-menu-button').classList.remove('active');
            });
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.dropdown-menu-content.active').forEach(menu => {
                menu.classList.remove('active');
                menu.closest('.dropdown-menu-wrapper').querySelector('.dropdown-menu-button').classList.remove('active');
            });
        }
    });
    
});

