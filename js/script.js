// script.js — Luxury Portfolio

// Automatically reset scroll position to top whenever page loads or reloads
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});

document.addEventListener('DOMContentLoaded', () => {
    window.scrollTo(0, 0);

    // 0. Intro Preloader
    const introScreen = document.getElementById('intro-screen');
    
    if (introScreen) {
        // Keep page locked at top while intro fade-in effect is running
        const pinToTop = () => window.scrollTo(0, 0);
        window.addEventListener('scroll', pinToTop, { passive: true });
        pinToTop();

        setTimeout(() => {
            window.removeEventListener('scroll', pinToTop);
            window.scrollTo(0, 0);
            introScreen.classList.add('hidden');
            setTimeout(() => {
                window.scrollTo(0, 0);
                const heroTitleRight = document.querySelector('.hero-fade-right');
                if (heroTitleRight) heroTitleRight.classList.add('visible');
            }, 1000);
        }, 3900); // 3.9 seconds (0.5s initial black screen + 3.4s staggered animation and hold)
    } else {
        window.scrollTo(0, 0);
        setTimeout(() => {
            const heroTitleRight = document.querySelector('.hero-fade-right');
            if (heroTitleRight) heroTitleRight.classList.add('visible');
        }, 1000);
    }
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

    // 3b. Hero Image Scroll Dynamics & Effects
    const heroImageImg   = document.querySelector('.hero-image img');
    const heroImageWrap  = document.querySelector('.hero-image');
    const heroContent    = document.querySelector('.hero-content');
    const heroScrollLine = document.querySelector('.hero-scroll-line');
    const heroSection    = document.getElementById('hero');

    if (heroSection) {
        let ticking = false;

        function updateHeroDynamics() {
            const scrollY = window.scrollY || window.pageYOffset;
            const heroHeight = heroSection.offsetHeight || window.innerHeight;

            // Only compute while hero is in or near viewport
            if (scrollY <= heroHeight * 1.2) {
                const progress = Math.min(1, Math.max(0, scrollY / (heroHeight * 0.85)));

                // 1. Image Opacity & Brightness (slightly dimmer base, darkening smoothly on scroll down)
                const opacity    = (0.78 - progress * 0.68).toFixed(3);   // 0.78 down to 0.10
                const brightness = (0.98 - progress * 0.68).toFixed(3);   // 0.98 down to 0.30

                if (heroImageImg) {
                    heroImageImg.style.setProperty('--hero-img-opacity', opacity);
                    heroImageImg.style.setProperty('--hero-img-brightness', brightness);
                    // Subtle luxury parallax translation & subtle scale
                    const imgY = (scrollY * 0.14).toFixed(1);
                    const imgScale = (1 + progress * 0.035).toFixed(3);
                    heroImageImg.style.transform = `translate3d(0, ${imgY}px, 0) scale(${imgScale})`;
                }

                // 2. Dynamic Dark Top Gradient (deepens on scroll down)
                if (heroImageWrap) {
                    const topDarkness = (0.22 + progress * 0.73).toFixed(3); // 0.22 up to 0.95
                    heroImageWrap.style.setProperty('--hero-top-darkness', topDarkness);
                }

                // 3. Subtle Hero Content Drift & Soft Fade
                if (heroContent) {
                    const contentY = (-scrollY * 0.15).toFixed(1);
                    const contentOpacity = Math.max(0, (1 - progress * 1.15)).toFixed(3);
                    heroContent.style.transform = `translate3d(0, ${contentY}px, 0)`;
                    heroContent.style.opacity = contentOpacity;
                }

                // 4. Fade out scroll line early
                if (heroScrollLine) {
                    heroScrollLine.style.opacity = Math.max(0, (1 - progress * 2.5)).toFixed(3);
                }
            }
            ticking = false;
        }

        function onScroll() {
            if (!ticking) {
                requestAnimationFrame(updateHeroDynamics);
                ticking = true;
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        updateHeroDynamics();
    }

    // 4. Mobile Menu Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks   = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navLinks.classList.toggle('mobile-open');
            menuToggle.textContent = isOpen ? 'CLOSE' : 'MENU';
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('mobile-open');
                menuToggle.textContent = 'MENU';
                document.body.style.overflow = '';
            });
        });

        navLinks.addEventListener('click', (e) => {
            if (e.target === navLinks) {
                navLinks.classList.remove('mobile-open');
                menuToggle.textContent = 'MENU';
                document.body.style.overflow = '';
            }
        });
    }

    // 6. Gallery Filters
    const filterBtns  = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterBtns.length && galleryItems.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const val = (btn.getAttribute('data-filter') || 'all').toLowerCase();
                galleryItems.forEach(item => {
                    const catAttr = (item.getAttribute('data-category') || '').toLowerCase();
                    const categories = catAttr.split(/\s+/);
                    const show = val === 'all' || categories.includes(val) || catAttr === val;
                    item.style.display = show ? '' : 'none';
                });
            });
        });
    }

    // 7. Image Modal (Fullscreen Viewer)
    const modal       = document.getElementById('image-modal');
    const modalClose  = document.querySelector('.modal-close');
    const modalImg    = document.getElementById('modal-img');
    const modalTitle  = document.getElementById('modal-title');
    const modalCat    = document.getElementById('modal-cat');

    function openModal(imgSrc, title, cat) {
        if (!modal) return;
        if (modalImg && imgSrc) {
            modalImg.src = imgSrc;
        }
        if (modalTitle) modalTitle.textContent = title || '';
        if (modalCat)   modalCat.textContent   = cat || '';
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        if (modalImg) modalImg.src = '';
    }

    if (modal && modalClose) {
        // Project pictures: tap/click to open fullscreen
        document.querySelectorAll('.project-visual img').forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                const projectItem = img.closest('.project-item');
                const title = projectItem ? (projectItem.querySelector('.project-title')?.textContent.trim() || '') : '';
                const cat   = projectItem ? (projectItem.querySelector('.project-category')?.textContent.trim() || '') : '';
                openModal(img.src, title, cat);
            });
        });

        // Press article thumbnails: tap/click to open fullscreen
        document.querySelectorAll('.press-img').forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                const card = img.closest('.press-card');
                const title = card ? (card.querySelector('.press-headline')?.textContent.trim() || '') : '';
                const cat   = card ? (card.querySelector('.press-source')?.textContent.trim() || '') : '';
                openModal(img.src, title, cat);
            });
        });

        // Gallery items: tap/click to open fullscreen
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                if (!img) return;
                const src = img.getAttribute('data-fullscreen') || img.currentSrc || img.src;
                const title = item.getAttribute('data-title') || img.getAttribute('data-title') || item.querySelector('.gallery-title')?.textContent.trim() || '';
                const cat   = item.getAttribute('data-cat') || img.getAttribute('data-cat') || item.querySelector('.gallery-cat')?.textContent.trim() || '';
                openModal(src, title, cat);
            });
        });

        modalClose.addEventListener('click', (e) => {
            e.stopPropagation();
            closeModal();
        });

        modal.addEventListener('click', e => {
            if (e.target === modal || e.target.classList.contains('modal-image-container') || e.target.classList.contains('modal-content')) {
                closeModal();
            }
        });

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') closeModal();
        });
    }

    // 8. Scroll Fade-Up Animations
    const fadeElements = document.querySelectorAll('.fade-up');
    if (fadeElements.length) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

        fadeElements.forEach(el => observer.observe(el));
    }

    // 8b. Universal Dynamic Scroll Parallax (scroll down & up on all sections)
    const parallaxItems = document.querySelectorAll(
        '.about-statement, .about-text, .press-card, .skill-category, .project-item, .gallery-item, .timeline-item, .achievement-list li, .resume-card, .contact-title, .section-meta'
    );

    if (parallaxItems.length) {
        let isParallaxTicking = false;

        function updateGlobalParallax() {
            const vh = window.innerHeight;

            parallaxItems.forEach(item => {
                const rect = item.getBoundingClientRect();
                if (rect.bottom > -100 && rect.top < vh + 100) {
                    const itemCenter = rect.top + rect.height / 2;
                    const screenCenter = vh / 2;
                    const diff = (itemCenter - screenCenter) / (vh / 2);

                    let speed = 14;
                    if (item.classList.contains('about-statement') || item.classList.contains('contact-title')) {
                        speed = 22;
                    } else if (item.classList.contains('section-meta')) {
                        speed = 8;
                    } else if (item.classList.contains('press-card') || item.classList.contains('gallery-item')) {
                        speed = 14;
                    } else if (item.classList.contains('project-item')) {
                        speed = 18;
                    }

                    const offsetY = (-diff * speed).toFixed(1);
                    item.style.setProperty('--parallax-y', offsetY + 'px');
                    if (!item.classList.contains('parallax-layer')) {
                        item.classList.add('parallax-layer');
                    }

                    const innerImg = item.querySelector('.press-img, .gallery-thumb img, .project-visual img');
                    if (innerImg) {
                        const imgOffsetY = (diff * (speed * 0.7)).toFixed(1);
                        innerImg.style.setProperty('--parallax-img-y', imgOffsetY + 'px');
                        if (!innerImg.classList.contains('parallax-img')) {
                            innerImg.classList.add('parallax-img');
                        }
                    }
                }
            });
            isParallaxTicking = false;
        }

        function onParallaxScroll() {
            if (!isParallaxTicking) {
                requestAnimationFrame(updateGlobalParallax);
                isParallaxTicking = true;
            }
        }

        window.addEventListener('scroll', onParallaxScroll, { passive: true });
        window.addEventListener('resize', onParallaxScroll, { passive: true });
        updateGlobalParallax();
    }

    // 8c. Section Title Light-Up on Scroll
    const allSections = document.querySelectorAll('section[id]');
    if (allSections.length) {
        let isLightUpTicking = false;

        function updateSectionLightUp() {
            const vh = window.innerHeight;
            const focalPoint = vh * 0.42; // Focal center where reading occurs

            allSections.forEach(sec => {
                const rect = sec.getBoundingClientRect();
                const meta = sec.querySelector('.section-meta');
                const title = sec.querySelector('.about-statement, .press-title, .contact-title');
                // Check if this section is currently active around focal point
                const isActive = (rect.top <= vh * 0.65 && rect.bottom >= vh * 0.2);

                if (meta) {
                    if (isActive) {
                        meta.classList.add('lit-up');
                    } else {
                        meta.classList.remove('lit-up');
                    }
                }

                if (title) {
                    if (isActive) {
                        title.classList.add('section-active-title');
                    } else {
                        title.classList.remove('section-active-title');
                    }
                }
            });
            isLightUpTicking = false;
        }

        function onLightUpScroll() {
            if (!isLightUpTicking) {
                requestAnimationFrame(updateSectionLightUp);
                isLightUpTicking = true;
            }
        }

        window.addEventListener('scroll', onLightUpScroll, { passive: true });
        updateSectionLightUp();
    }

    // 9. Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        // Ignore if user is typing in an input (future proofing)
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        // Ignore if image modal is open
        const modal = document.getElementById('image-modal');
        if (modal && !modal.classList.contains('hidden')) return;

        const keyMap = {
            '0': '#hero',
            '1': '#about',
            '2': '#press',
            '3': '#skills',
            '4': '#work',
            '5': '#creative',
            '6': '#experience',
            '7': '#achievements',
            '8': '#resume',
            '9': '#contact'
        };

        const targetSelector = keyMap[e.key];
        if (targetSelector) {
            const targetElement = document.querySelector(targetSelector);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });

    // 10. Resume Availability Check & Luxury Popup
    const resumeBtns = document.querySelectorAll('.resume-btn');
    const toastModal = document.getElementById('toast-modal');
    const toastClose = document.getElementById('toast-close');

    function showResumeUnavailable() {
        if (toastModal) {
            toastModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeToast() {
        if (toastModal) {
            toastModal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    if (toastClose) {
        toastClose.addEventListener('click', (e) => {
            e.stopPropagation();
            closeToast();
        });
    }

    if (toastModal) {
        toastModal.addEventListener('click', (e) => {
            if (e.target === toastModal) closeToast();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && toastModal && !toastModal.classList.contains('hidden')) {
            closeToast();
        }
    });

    if (resumeBtns.length) {
        resumeBtns.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const href = btn.getAttribute('href');
                if (!href || href === '#' || href.trim() === '') {
                    e.preventDefault();
                    showResumeUnavailable();
                    return;
                }

                try {
                    const response = await fetch(href, { method: 'HEAD' });
                    if (!response.ok) {
                        e.preventDefault();
                        showResumeUnavailable();
                    }
                } catch (err) {
                    e.preventDefault();
                    showResumeUnavailable();
                }
            });
        });
    }
});





