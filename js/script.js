// script.js - Interactive elements for Swiss Style Portfolio

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Current Year
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // 2. Mobile Menu Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            if (navLinks.classList.contains('active')) {
                menuToggle.textContent = 'CLOSE';
            } else {
                menuToggle.textContent = 'MENU';
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.textContent = 'MENU';
            });
        });
    }

    // 3. Grid Toggle
    const gridToggleBtn = document.getElementById('toggle-grid-btn');
    const gridOverlay = document.getElementById('grid-overlay');

    if (gridToggleBtn && gridOverlay) {
        gridToggleBtn.addEventListener('click', () => {
            gridOverlay.classList.toggle('hidden');
        });
    }

    // 4. Creative Gallery Filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterBtns.length > 0 && galleryItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'flex'; // Or whatever display type is default
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // 5. Image Modal
    const modal = document.getElementById('image-modal');
    const modalClose = document.querySelector('.modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalCat = document.getElementById('modal-cat');
    const galleryImages = document.querySelectorAll('.gallery-img');

    if (modal && modalClose && galleryImages.length > 0) {
        galleryImages.forEach(img => {
            img.addEventListener('click', (e) => {
                const title = e.target.getAttribute('data-title');
                const cat = e.target.getAttribute('data-cat');
                
                if (modalTitle) modalTitle.textContent = title;
                if (modalCat) modalCat.textContent = cat;
                
                modal.classList.remove('hidden');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            });
        });

        modalClose.addEventListener('click', () => {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto'; // Restore scrolling
        });

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal-content') || e.target.classList.contains('modal-image-container')) {
                modal.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                modal.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }
        });
    }
});
