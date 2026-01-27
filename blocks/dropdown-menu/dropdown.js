document.addEventListener('DOMContentLoaded', function() {
    const dropdownButtons = document.querySelectorAll('.dropdown-menu-button');
    
    dropdownButtons.forEach(button => {
        const wrapper = button.closest('.dropdown-menu-wrapper');
        const menu = wrapper.querySelector('.dropdown-menu-content');
        
        if (!menu) return;
        
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
