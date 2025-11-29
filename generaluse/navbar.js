document.addEventListener('DOMContentLoaded', function() {
            const navItems = document.querySelectorAll('.navbar-nav .nav-item');
    
            // Set equal margins for each item dynamically
            navItems.forEach(item => {
                item.style.margin = '0 10px'; // Set fixed margin for spacing
            });
        });

