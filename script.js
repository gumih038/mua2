document.addEventListener('DOMContentLoaded', function() {
    // ------------------------------------------------
    // ハンバーガーメニュー制御
    // ------------------------------------------------
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const header = document.getElementById('lp-header');
    const body = document.body;
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if(menuBtn && mobileMenu && header) {
        menuBtn.addEventListener('click', () => {
            const isOpen = header.classList.contains('nav-open');
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        function openMenu() {
            header.classList.add('nav-open');
            mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
            // 背景固定（スクロール防止）
            body.style.overflow = 'hidden';
        }

        function closeMenu() {
            header.classList.remove('nav-open');
            mobileMenu.classList.add('opacity-0', 'pointer-events-none');
            body.style.overflow = '';
        }

        // リンククリックでメニューを閉じる
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    // ------------------------------------------------
    // Reserve Button Popup (予約ボタン)
    // ------------------------------------------------
    const reserveBtn = document.getElementById('reserve-btn');
    const reservePopup = document.getElementById('reserve-popup');
    let isPopupOpen = false;

    if(reserveBtn && reservePopup) {
        reserveBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            isPopupOpen = !isPopupOpen;
            if (isPopupOpen) {
                reservePopup.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
            } else {
                reservePopup.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
            }
        });

        // 画面クリックで閉じる
        document.addEventListener('click', (e) => {
            if (isPopupOpen && !reservePopup.contains(e.target)) {
                isPopupOpen = false;
                reservePopup.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
            }
        });
    }

    // ------------------------------------------------
    // Scroll Animation (Fade Up)
    // ------------------------------------------------
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(el => {
        observer.observe(el);
    });

    // ------------------------------------------------
    // Hero Parallax & General Parallax Logic
    // ------------------------------------------------
    const heroSection = document.getElementById('hero-section');
    const heroBg = document.getElementById('hero-bg-wrapper');
    const heroText = document.getElementById('hero-text-wrapper');
    
    // 他のパララックス要素（WorksやTitleなど）
    const parallaxElements = document.querySelectorAll('.parallax-y');

    // ------------------------------------------------
    // Header Background on Scroll & Animation Loop
    // ------------------------------------------------
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        // Header Shadow Logic
        if (header) {
            if (scrollY > 50) {
                header.classList.add('shadow-sm', 'bg-white/80');
                header.classList.remove('bg-white/0');
            } else {
                header.classList.remove('shadow-sm', 'bg-white/80');
                header.classList.add('bg-white/0');
            }
        }

        // 1. Hero Section Logic (Top area specific)
        if (heroSection && heroBg && heroText) {
            const heroHeight = heroSection.offsetHeight;
            
            if (scrollY <= heroHeight) {
                // 背景: ゆっくり下に移動
                const bgTranslate = scrollY * 0.4; 
                // 透明度: スクロールにつれて薄く
                const bgOpacity = 1 - (scrollY / (heroHeight * 0.9)); 
                // 拡大: 少しずつズーム
                const scale = 1 + (scrollY / (heroHeight * 4)); 

                heroBg.style.transform = `translate3d(0, ${bgTranslate}px, 0) scale(${scale})`;
                heroBg.style.opacity = Math.max(bgOpacity, 0);

                // テキスト(ロゴ): 背景より速く上に逃げる + 素早くフェードアウト
                const textTranslate = scrollY * 0.6;
                const textOpacity = 1 - (scrollY / (heroHeight * 0.5)); 

                heroText.style.transform = `translate3d(0, ${textTranslate}px, 0)`;
                heroText.style.opacity = Math.max(textOpacity, 0);
            }
        }

        // 2. General Parallax Elements (Works columns etc.)
        // data-speed属性に応じて移動量を調整
        parallaxElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            // 画面内に入りそうな範囲のみ計算
            if (rect.top < windowHeight && rect.bottom > 0) {
                const speed = parseFloat(el.getAttribute('data-speed')) || 0.05;
                // 画面中心からの距離などをベースに移動量を算出
                // 単純化: スクロール量 * speed だとページ下部でずれすぎるので、
                // 要素が画面に入ってからの相対位置を使うのが理想だが、
                // ここでは簡易的に「画面内でのオフセット」を演出する
                const offset = (windowHeight - rect.top) * speed;
                el.style.transform = `translate3d(0, -${offset}px, 0)`;
            }
        });
    });

    // ------------------------------------------------
    // Voice Marquee Duplication (自動スクロール用複製)
    // ------------------------------------------------
    const voiceTrack = document.getElementById('voice-track');
    if (voiceTrack) {
        // コンテンツ量が少ない場合のために2回複製してループを滑らかに
        const clone = voiceTrack.innerHTML;
        voiceTrack.insertAdjacentHTML('beforeend', clone);
        voiceTrack.insertAdjacentHTML('beforeend', clone);
        voiceTrack.classList.add('animate-marquee');
    }
});
