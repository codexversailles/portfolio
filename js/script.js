// script.js — Luxury Portfolio

document.addEventListener('DOMContentLoaded', () => {

    // 1. Current Year
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // 2. Custom Cursor (desktop/pointer devices only)
    const cursor     = document.getElementById('cursor');
    const cursorRing = document.getElementById('cursor-ring');

    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    if (cursor && cursorRing && !isTouch) {
        let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top  = mouseY + 'px';
        });

        // Smooth ring follow
        function animateRing() {
            ringX += (mouseX - ringX) * 0.12;
            ringY += (mouseY - ringY) * 0.12;
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top  = ringY + 'px';
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Scale on hover
        document.querySelectorAll('a, button, .gallery-img, .project-item').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
                cursorRing.style.width  = '70px';
                cursorRing.style.height = '70px';
                cursorRing.style.opacity = '0.8';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorRing.style.width  = '40px';
                cursorRing.style.height = '40px';
                cursorRing.style.opacity = '0.5';
            });
        });
    }

    // 3. Nav Scroll State
    const nav = document.querySelector('.site-nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 80) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }

    // 4. Mobile Menu Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks   = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-open');
            menuToggle.textContent = navLinks.classList.contains('mobile-open') ? 'CLOSE' : 'MENU';
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('mobile-open');
                menuToggle.textContent = 'MENU';
            });
        });
    }

    // 5. Grid Toggle
    const gridToggleBtn = document.getElementById('toggle-grid-btn');
    const gridOverlay   = document.getElementById('grid-overlay');
    if (gridToggleBtn && gridOverlay) {
        gridToggleBtn.addEventListener('click', () => gridOverlay.classList.toggle('hidden'));
    }

    // 6. Gallery Filters
    const filterBtns  = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterBtns.length && galleryItems.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const val = btn.getAttribute('data-filter');
                galleryItems.forEach(item => {
                    const show = val === 'all' || item.getAttribute('data-category') === val;
                    item.style.display = show ? '' : 'none';
                });
            });
        });
    }

    // 7. Image Modal
    const modal       = document.getElementById('image-modal');
    const modalClose  = document.querySelector('.modal-close');
    const modalTitle  = document.getElementById('modal-title');
    const modalCat    = document.getElementById('modal-cat');
    const galleryImgs = document.querySelectorAll('.gallery-img');

    if (modal && modalClose && galleryImgs.length) {
        galleryImgs.forEach(img => {
            img.addEventListener('click', e => {
                if (modalTitle) modalTitle.textContent = e.target.getAttribute('data-title') || '';
                if (modalCat)   modalCat.textContent   = e.target.getAttribute('data-cat')   || '';
                modal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeModal = () => {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        };

        modalClose.addEventListener('click', closeModal);
        modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
    }

    // 8. Scroll Fade-Up Animations
    const fadeElements = document.querySelectorAll('.fade-up');
    if (fadeElements.length) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                } else {
                    entry.target.classList.remove('visible');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        fadeElements.forEach(el => observer.observe(el));
    }
});
