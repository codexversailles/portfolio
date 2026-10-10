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

    // 0. Intro Preloader & Play Gate
    const introScreen  = document.getElementById('intro-screen');
    const introPlayBtn = document.getElementById('intro-play-btn');
    const introText    = document.getElementById('intro-text');
    
    // Global hook for audio start on user cue
    window.startPortfolioAudio = null;

    if (introScreen) {
        // Keep page locked at top while waiting for user and during animation
        const pinToTop = () => window.scrollTo(0, 0);
        window.addEventListener('scroll', pinToTop, { passive: true });
        pinToTop();

        const triggerEnter = () => {
            // 1. Immediately play audio via user click cue
            if (typeof window.startPortfolioAudio === 'function') {
                window.startPortfolioAudio();
            }

            // 2. Change play icon to pause icon
            if (introPlayBtn) {
                introPlayBtn.classList.add('is-paused-state');
            }

            // 3. Keep pause icon briefly visible, then fade out into 0.5s black screen
            setTimeout(() => {
                if (introPlayBtn) {
                    introPlayBtn.classList.add('fade-out');
                }

                // 4. Exactly 0.5s of pure black screen before the moving text starts
                setTimeout(() => {
                    if (introText) {
                        introText.classList.add('animating');
                    }

                    // 5. Fade out preloader screen after animation completes (3.4s)
                    setTimeout(() => {
                        window.removeEventListener('scroll', pinToTop);
                        window.scrollTo(0, 0);
                        introScreen.classList.add('hidden');
                        setTimeout(() => {
                            window.scrollTo(0, 0);
                            const heroTitleRight = document.querySelector('.hero-fade-right');
                            if (heroTitleRight) {
                                heroTitleRight.classList.add('visible');
                                // Wait for LANCE ANDRE FERMO to finish fading in (0.75s) before typing
                                setTimeout(() => {
                                    heroTitleRight.classList.add('hero-subblock-active');
                                }, 750);
                            }
                        }, 1000);
                    }, 3400);
                }, 500); // 0.5 seconds black screen
            }, 300); // Brief feedback showing the pause icon
        };

        let hasTriggered = false;
        const onUserTrigger = (e) => {
            if (hasTriggered) return;
            hasTriggered = true;
            if (e) e.stopPropagation();
            triggerEnter();
        };

        if (introPlayBtn) {
            introPlayBtn.addEventListener('click', onUserTrigger);
            introPlayBtn.addEventListener('touchend', onUserTrigger);
        }
        
        // Also allow clicking anywhere on introScreen as a safe fallback
        introScreen.addEventListener('click', onUserTrigger);
    } else {
        window.scrollTo(0, 0);
        setTimeout(() => {
            const heroTitleRight = document.querySelector('.hero-fade-right');
            if (heroTitleRight) {
                heroTitleRight.classList.add('visible');
                setTimeout(() => {
                    heroTitleRight.classList.add('hero-subblock-active');
                }, 750);
            }
        }, 1000);
    }

    // Split hero wave lines into individual animated character spans
    document.querySelectorAll('[data-wave]').forEach(el => {
        const text = el.textContent;
        el.innerHTML = '';
        // Group by words so whitespace doesn't break
        const words = text.split(' ');
        let charIndex = 0;
        words.forEach((word, wIdx) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'hero-word';
            for (let i = 0; i < word.length; i++) {
                const charSpan = document.createElement('span');
                charSpan.className = 'hero-char';
                charSpan.textContent = word[i];
                charSpan.style.setProperty('--char-index', charIndex);
                wordSpan.appendChild(charSpan);
                charIndex++;
            }
            el.appendChild(wordSpan);
            if (wIdx < words.length - 1) {
                const spaceSpan = document.createElement('span');
                spaceSpan.className = 'hero-char-space';
                spaceSpan.innerHTML = '&nbsp;';
                el.appendChild(spaceSpan);
                charIndex++;
            }
        });
    });

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

                // 1. Image Opacity & Brightness (lighter base, subtle smooth darkening on scroll)
                const opacity    = (0.94 - progress * 0.65).toFixed(3);   // 0.94 down to 0.29
                const brightness = (1.12 - progress * 0.60).toFixed(3);   // 1.12 down to 0.52

                if (heroImageImg) {
                    heroImageImg.style.setProperty('--hero-img-opacity', opacity);
                    heroImageImg.style.setProperty('--hero-img-brightness', brightness);
                    // Subtle luxury parallax translation & subtle scale
                    const imgY = (scrollY * 0.14).toFixed(1);
                    const imgScale = (1 + progress * 0.035).toFixed(3);
                    heroImageImg.style.transform = `translate3d(0, ${imgY}px, 0) scale(${imgScale})`;
                }

                // 2. Dynamic Dark Top Gradient (deepens softly on scroll down)
                if (heroImageWrap) {
                    const topDarkness = (0.10 + progress * 0.70).toFixed(3); // 0.10 up to 0.80
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

    // 8d. About Section Dynamic Hugging & Scroll Parallax
    const aboutSection = document.getElementById('about');
    const aboutStatement = document.querySelector('.about-statement');
    const aboutText = document.querySelector('.about-text');
    const aboutBgImg = document.querySelector('.about-bg-img');
    const contactBgImg = document.querySelector('.contact-bg-img');
    const contactSection = document.getElementById('contact');

    if (aboutSection) {
        let isAboutTicking = false;

        function updateAboutScrollHug() {
            const vh = window.innerHeight;
            const isWideScreen = window.innerWidth >= 900;
            const rect = aboutSection.getBoundingClientRect();

            // Only compute while About section is near/in viewport
            if (rect.bottom > -100 && rect.top < vh + 100) {
                // Progress: 0 when top enters bottom of viewport, 1 when section reaches top/center
                const totalTravel = vh + rect.height;
                const currentProgress = Math.min(1, Math.max(0, (vh - rect.top) / totalTravel));

                // Both statement and description are anchored on the left
                // Subtle organic scroll glide on the copy blocks
                if (isWideScreen) {
                    const glideY = ((currentProgress - 0.5) * -16).toFixed(1);
                    if (aboutText) {
                        aboutText.style.transform = `translate3d(0, ${glideY}px, 0)`;
                    }
                } else {
                    if (aboutText) aboutText.style.transform = 'none';
                }

                // Subtle parallax depth on about background photo
                if (aboutBgImg) {
                    if (isWideScreen) {
                        const bgOffset = ((currentProgress - 0.5) * 40).toFixed(1);
                        aboutBgImg.style.transform = `scale(1.08) translate3d(25px, ${bgOffset}px, 0)`;
                    } else {
                        aboutBgImg.style.transform = '';
                    }
                }
            }

            // Contact background photo parallax
            if (contactSection && contactBgImg) {
                const cRect = contactSection.getBoundingClientRect();
                if (cRect.bottom > -100 && cRect.top < vh + 100) {
                    if (isWideScreen) {
                        const cProgress = Math.min(1, Math.max(0, (vh - cRect.top) / (vh + cRect.height)));
                        const cOffset = ((cProgress - 0.5) * 35).toFixed(1);
                        contactBgImg.style.transform = `translate3d(-50px, ${cOffset}px, 0)`;
                    } else {
                        contactBgImg.style.transform = '';
                    }
                }
            }

            isAboutTicking = false;
        }

        function onAboutScroll() {
            if (!isAboutTicking) {
                requestAnimationFrame(updateAboutScrollHug);
                isAboutTicking = true;
            }
        }

        window.addEventListener('scroll', onAboutScroll, { passive: true });
        window.addEventListener('resize', onAboutScroll, { passive: true });
        updateAboutScrollHug();
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
                e.preventDefault();
                const href = btn.getAttribute('href');
                if (!href || href === '#' || href.trim() === '') {
                    showResumeUnavailable();
                    return;
                }

                try {
                    const response = await fetch(href, { method: 'HEAD' });
                    if (response.ok) {
                        // File actually exists, proceed to open or download
                        if (btn.hasAttribute('download')) {
                            const tempLink = document.createElement('a');
                            tempLink.href = href;
                            tempLink.setAttribute('download', '');
                            document.body.appendChild(tempLink);
                            tempLink.click();
                            document.body.removeChild(tempLink);
                        } else {
                            window.open(href, '_blank');
                        }
                    } else {
                        showResumeUnavailable();
                    }
                } catch (err) {
                    showResumeUnavailable();
                }
            });
        });
    }

    // ============================================================
    // 16. GitHub Activity Graph Builder & Stats Fetcher
    // ============================================================
    const ghMatrixEl = document.getElementById('gh-graph-matrix');
    const ghTotalEl  = document.getElementById('gh-total-contribs');
    const ghDaysEl   = document.getElementById('gh-days-commits');
    const ghStreakEl = document.getElementById('gh-longest-streak');
    const ghBusiestEl= document.getElementById('gh-busiest-day');

    if (ghMatrixEl) {
        // Fallback pre-calculated data from user's current commit log
        function renderMatrix(contributions) {
            ghMatrixEl.innerHTML = '';
            const frag = document.createDocumentFragment();
            // Up to 52-53 weeks (7 rows x 53 cols = ~371 cells)
            contributions.forEach(item => {
                const cell = document.createElement('div');
                cell.className = `gh-cell lvl-${item.level || 0}`;
                const titleText = `${item.date}: ${item.count} contribution${item.count === 1 ? '' : 's'}`;
                cell.setAttribute('title', titleText);
                frag.appendChild(cell);
            });
            ghMatrixEl.appendChild(frag);
        }

        // Generate default mock layout matching user profile commits if offline
        function generateDefaultCells() {
            const cells = [];
            const today = new Date();
            for (let i = 370; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(d.getDate() - i);
                const dateStr = d.toISOString().split('T')[0];
                let count = 0;
                let level = 0;

                // Match recent activity spikes
                if (dateStr >= '2026-10-01' && dateStr <= '2026-10-10') {
                    if (dateStr === '2026-10-03') { count = 41; level = 4; }
                    else if (dateStr === '2026-10-04') { count = 26; level = 4; }
                    else if (dateStr === '2026-10-09') { count = 9; level = 4; }
                    else if (dateStr === '2026-10-01' || dateStr === '2026-10-08') { count = 2; level = 1; }
                    else if (dateStr === '2026-10-10') { count = 1; level = 1; }
                }

                cells.push({ date: dateStr, count, level });
            }
            return cells;
        }

        // Render immediately with baseline
        renderMatrix(generateDefaultCells());

        // Fetch live from GitHub Contributions API
        fetch('https://github-contributions-api.jogruber.de/v4/codexversailles?y=last')
            .then(res => res.json())
            .then(data => {
                if (data && Array.isArray(data.contributions)) {
                    renderMatrix(data.contributions);

                    let total = 0;
                    let daysWithCommits = 0;
                    let busiest = 0;
                    let longestStreak = 0;
                    let currentStreak = 0;

                    data.contributions.forEach(d => {
                        total += d.count;
                        if (d.count > 0) {
                            daysWithCommits++;
                            currentStreak++;
                            if (currentStreak > longestStreak) longestStreak = currentStreak;
                            if (d.count > busiest) busiest = d.count;
                        } else {
                            currentStreak = 0;
                        }
                    });

                    if (ghTotalEl) ghTotalEl.textContent = total;
                    if (ghDaysEl) ghDaysEl.textContent = daysWithCommits;
                    if (ghStreakEl) ghStreakEl.textContent = `${longestStreak} days`;
                    if (ghBusiestEl) ghBusiestEl.textContent = busiest;
                }
            })
            .catch(() => {
                // Keep default calculated values
            });
    }

    // ============================================================
    // 17. Floating Background Music Player
    // ============================================================
    const musicWidget   = document.getElementById('music-widget');
    const bgAudio       = document.getElementById('bg-audio');
    const musicToggle   = document.getElementById('music-toggle');
    const trackTitleEl  = document.getElementById('music-track-title');
    const prevBtn       = document.getElementById('music-prev');
    const nextBtn       = document.getElementById('music-next');
    const volumeSlider  = document.getElementById('music-volume');

    if (musicWidget && bgAudio && musicToggle) {
        // Fallback tracks in case get_music.php is run in pure static environment
        const defaultTracks = [
            {
                filename: 'BIA - WE ON GO (Official Audio).mp3',
                title: 'BIA - WE ON GO',
                src: 'assets/music/BIA%20-%20WE%20ON%20GO%20%28Official%20Audio%29.mp3'
            },
            {
                filename: 'Drake - National Treasure.mp3',
                title: 'Drake - National Treasure',
                src: 'assets/music/Drake%20-%20National%20Treasure.mp3'
            }
        ];

        let playlist = [...defaultTracks];
        let currentIndex = -1;
        let isUserPaused = false;
        let hasInteracted = false;

        // Synchronously pick and load a random track ready to play immediately upon user click
        currentIndex = Math.floor(Math.random() * playlist.length);
        loadTrack(currentIndex, false);

        // Expose startPortfolioAudio to the intro preloader play button
        window.startPortfolioAudio = function() {
            hasInteracted = true;
            playAudio();
        };

        // Fetch any updated/new tracks in background from server folder
        fetch('get_music.php')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    playlist = data;
                }
            })
            .catch(() => {});

        function loadTrack(index, shouldPlay = true) {
            if (!playlist.length) return;
            const track = playlist[index];
            bgAudio.src = track.src;
            bgAudio.volume = volumeSlider ? parseFloat(volumeSlider.value) : 0.7;
            if (trackTitleEl) {
                trackTitleEl.textContent = track.title;
                trackTitleEl.setAttribute('title', track.title);
            }
            if (shouldPlay) {
                playAudio();
            }
        }

        function playAudio() {
            const playPromise = bgAudio.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        musicWidget.classList.add('is-playing');
                        isUserPaused = false;
                    })
                    .catch((err) => {
                        console.log('Audio playback waiting for gesture:', err);
                        musicWidget.classList.remove('is-playing');
                    });
            }
        }

        function pauseAudio() {
            bgAudio.pause();
            musicWidget.classList.remove('is-playing');
            isUserPaused = true;
        }

        function togglePlayPause() {
            hasInteracted = true;
            if (bgAudio.paused) {
                playAudio();
            } else {
                pauseAudio();
            }
        }

        function nextTrack() {
            if (!playlist.length) return;
            currentIndex = (currentIndex + 1) % playlist.length;
            loadTrack(currentIndex, true);
        }

        function prevTrack() {
            if (!playlist.length) return;
            currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
            loadTrack(currentIndex, true);
        }

        // Toggle button click (play/pause)
        musicToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePlayPause();
        });

        // Controls
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                nextTrack();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                prevTrack();
            });
        }

        // Auto next track when current ends
        bgAudio.addEventListener('ended', () => {
            nextTrack();
        });

        // Audio state listeners
        bgAudio.addEventListener('play', () => {
            musicWidget.classList.add('is-playing');
        });
        bgAudio.addEventListener('pause', () => {
            musicWidget.classList.remove('is-playing');
        });

        // Volume control
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                bgAudio.volume = parseFloat(e.target.value);
            });
            volumeSlider.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }
});





