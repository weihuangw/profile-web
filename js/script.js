
console.log("網站腳本已成功載入！");

// 頁面載入時，確保 color-scheme 與主題同步（影響瀏覽器頁面切換時的底色）
if (localStorage.getItem('theme') === 'light') {
    document.documentElement.style.colorScheme = 'light';
}

// ========================
// 修正「上一頁」黑畫面問題
// ========================
// 瀏覽器按「上一頁」時，會從快取（bfcache）還原頁面
// 但還原的頁面可能還帶著 page-leaving（opacity: 0）→ 卡在黑畫面
// pageshow 事件 = 每次頁面「顯示」時都會觸發（包括從快取還原）
// event.persisted = true 代表「這是從快取還原的」，不是重新載入
window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
        // 從快取還原 → 確保 main 過場狀態重置
        const main = document.querySelector('main');
        if (main) {
            main.classList.remove('page-leaving');
            main.classList.add('page-ready');
        }
    }
});

// 等待 DOM 載入完成
document.addEventListener('DOMContentLoaded', () => {
    // no-transition 移除後才能啟用主題切換動畫，body.page-ready 標記已就緒
    void document.body.offsetHeight;
    document.body.classList.remove('no-transition');
    document.body.classList.add('page-ready');

    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // ========================
    // 漢堡選單功能
    // ========================
    if (menuToggle && navLinks) {
        const header = document.querySelector('header'); // 取得 header 元素
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active'); // 讓按鈕也切換 active 狀態，以便做旋轉動畫
            header.classList.toggle('menu-open'); // 讓 header 知道選單已打開
            document.body.classList.toggle('menu-open'); // 鎖定背景滾動
        });
    }

    // ========================
    // 深色/淺色主題切換功能
    // ========================
    // 注意：主題的「初始載入」已由每個 HTML 頁面裡的內嵌 <script> 處理
    // 這裡只負責「按鈕點擊時的切換」功能

    // 切換主題的函式（預設深色，點擊切換為淺色）
    function toggleTheme() {
        document.body.classList.toggle('light-theme');
        // 儲存目前的選擇，下次開網頁時會記住
        const isLight = document.body.classList.contains('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        // 同步更新 html 背景色與 color-scheme，避免 body opacity:0 時透出錯誤顏色
        document.documentElement.style.backgroundColor = isLight ? 'oklch(0.92 0 340)' : 'oklch(0.12 0 0)';
        document.documentElement.style.colorScheme = isLight ? 'light' : 'dark';
    }

    // --- 建立電腦版按鈕（固定在右下角） ---
    const desktopToggle = document.createElement('button');
    desktopToggle.className = 'theme-toggle';
    desktopToggle.setAttribute('aria-label', '切換深色/淺色主題');
    document.body.appendChild(desktopToggle);
    desktopToggle.addEventListener('click', toggleTheme);

    // ========================
    // 手機版作品圖片觸碰效果
    // ========================
    // 手機沒有滑鼠 hover，所以用 JS 偵測觸碰
    // 第一次「點」 → 顯示遮罩 + 標題（跟電腦版 hover 一樣）
    // 第二次「點」 → 進入作品頁面
    // 「滑動」 → 不觸發效果（避免捲動頁面時卡住）
    const workItems = document.querySelectorAll('.work-item'); // 抓到所有作品格子
    let hasMoved = false; // 記錄手指是否有移動過（有移動 = 滑動，不是點擊）

    // ⚠️ 關鍵：在 document 層級監聽，而不是在格子上
    // 原因：iOS/手機瀏覽器偵測到「這是滑動手勢」時，會攔截元素上的 touchmove
    // 導致格子的 touchmove 根本沒觸發，hasMoved 永遠是 false，誤判成點擊
    // 在 document 最上層監聽就能繞過這個問題
    document.addEventListener('touchstart', function () {
        hasMoved = false; // 每次手指按下，重設旗標
    }, { passive: true }); // passive: true = 告訴瀏覽器「我不會阻止滑動」，效能更好

    document.addEventListener('touchmove', function () {
        hasMoved = true; // 只要有移動，就標記
    }, { passive: true });

    workItems.forEach(item => {
        // 手指放開時：判斷是「點」還是「滑」
        item.addEventListener('touchend', function (e) {
            // 如果手指有移動過，代表是「滑動」→ 阻止跳頁
            if (hasMoved) {
                e.preventDefault();
            }
            // 沒有移動 → 直接讓瀏覽器跟隨連結（進入作品頁面）
        });
    });

    // ========================
    // 頁面轉場動畫（淡出 → 等圖片載入 → 淡入）
    // ========================
    // 像餐廳上菜：不是做好一道端一道，而是整桌菜都準備好了才掀開蓋子
    //
    // 完整流程：
    // 1. 點擊連結 → 舊頁面淡出（0.3 秒）
    // 2. 跳到新頁面 → 新頁面先隱藏（opacity: 0）
    // 3. 等待畫面上「看得到的圖片」都載入完成
    // 4. 全部準備好 → 新頁面淡入顯示（0.4 秒）

    // ---------- 淡入部分：等可見圖片載入完成才顯示頁面 ----------

    /**
     * 判斷一張圖片是否在「目前螢幕看得到的範圍」內
     * getBoundingClientRect() 會回傳圖片的位置資訊
     * 如果圖片的頂部 < 螢幕高度，代表至少有一部分是看得到的
     */
    function isInViewport(img) {
        const rect = img.getBoundingClientRect();  // 取得圖片在螢幕上的位置
        return rect.top < window.innerHeight;      // 圖片頂部是否在螢幕可見範圍內
    }

    // ========================
    // 瀑布流 Masonry 排版
    // ========================
    // 原理：grid-auto-rows: 1px 讓每列只有 1px 高
    // JS 依圖片的真實寬高比算出每個 item 要 span 幾列，撐出正確高度
    // 這樣 Grid 還是照橫向（左→右）排列，不像 CSS columns 會直向填欄
    function layoutMasonry() {
        const grid = document.querySelector('.work-grid');
        if (!grid) return;

        // 手機版不做 masonry，清掉 JS 設定的樣式讓 CSS 自然排列
        // 用 matchMedia 確保與 CSS max-width: 768px 判斷完全一致
        if (window.matchMedia('(max-width: 768px)').matches) {
            grid.querySelectorAll('.work-item').forEach(item => {
                item.style.gridRowEnd = '';
                const img = item.querySelector('img');
                if (img) img.style.height = '';
            });
            return;
        }

        const gap = parseFloat(getComputedStyle(grid).rowGap) || 0;

        grid.querySelectorAll('.work-item').forEach(item => {
            const img = item.querySelector('img');
            if (!img || !img.naturalWidth) return;

            const colWidth = item.getBoundingClientRect().width;
            const renderedHeight = colWidth * (img.naturalHeight / img.naturalWidth);
            const span = Math.round((renderedHeight + gap) / (1 + gap));
            item.style.gridRowEnd = `span ${span}`;
            // grid area 精確高度 = span 列(各 1px) + (span-1) 個 row-gap
            // 把圖片設成這個高度，讓 item 完全貼合 grid area，縫隙就只剩純 row-gap
            const gridAreaHeight = span + (span - 1) * gap;
            img.style.height = `${gridAreaHeight}px`;
        });
    }

    // 視窗縮放時重新計算（先淡出 grid，重算後淡入，遮住位置跳動）
    // 只追蹤寬度變化：iOS Safari 滾動時工具列收起會改變高度但不改寬度
    // 若只有高度變（捲動），直接略過，避免 grid 反覆淡出淡入造成閃爍
    let masonryTimer;
    let lastWidth = window.innerWidth;
    window.addEventListener('resize', () => {
        const currentWidth = window.innerWidth;
        if (currentWidth === lastWidth) return;
        lastWidth = currentWidth;

        clearTimeout(masonryTimer);
        const grid = document.querySelector('.work-grid');
        if (grid) grid.style.opacity = '0';
        masonryTimer = setTimeout(() => {
            layoutMasonry();
            if (grid) grid.style.opacity = '';
        }, 150);
    });

    /**
     * 顯示頁面的函式：移除 no-transition，加上 page-ready 來觸發淡入
     */
    function showPage() {
        layoutMasonry(); // 圖片載入完成後，計算瀑布流排版

        // 逐格淡入：每個 work-item 依序用 workReveal 動畫出現
        // 180ms = body 淡入時間，之後 items 才開始逐格出現
        const workItems = document.querySelectorAll('.work-item');
        workItems.forEach((item, i) => {
            item.style.opacity = '0';
            item.style.animation = `workReveal 0.5s ease ${180 + i * 40}ms both`;
        });

        // 動畫全部播完後清掉 animation style，明確寫死 opacity: 1
        // 避免 iOS Safari scroll repaint 時閃回 animation 初始幀（opacity: 0）
        const lastDelay = 180 + (workItems.length - 1) * 40;
        setTimeout(() => {
            workItems.forEach(item => {
                item.style.animation = '';
                item.style.opacity = '1';
            });
        }, lastDelay + 550); // 最後一個 delay + 動畫時長(500ms) + buffer

        // main 淡入（body 已在 DOMContentLoaded 時顯示，這裡只處理內容區）
        const main = document.querySelector('main');
        requestAnimationFrame(() => {
            if (main) main.classList.add('page-ready');
        });
    }

    // --- 載入進度條 ---
    const progressBar = document.createElement('div');
    progressBar.className = 'page-progress';
    document.body.appendChild(progressBar);

    function completeProgress() {
        progressBar.style.width = '100%';
        setTimeout(() => { progressBar.style.opacity = '0'; }, 300);
    }

    // --- 收集螢幕上「看得到的圖片」 ---
    const allImages = document.querySelectorAll('img');  // 抓到頁面上所有 <img>
    const visibleImages = [];  // 存放「目前看得到」的圖片

    allImages.forEach(img => {
        if (isInViewport(img) && !img.complete) {
            // 圖片在螢幕範圍內，而且還沒載入完成 → 需要等它
            // img.complete = true 代表圖片已經在快取中，不用等
            visibleImages.push(img);
        }
    });

    if (visibleImages.length === 0) {
        // 沒有需要等待的圖片（可能是沒圖片的頁面，或圖片都已經在快取中）
        // → 直接顯示頁面
        completeProgress();
        showPage();
    } else {
        // 有圖片需要等待 → 每張圖片載入完成時檢查是否「全部」都好了
        let loadedCount = 0;  // 已載入完成的圖片數量

        visibleImages.forEach(img => {
            const onDone = () => {
                loadedCount++;
                progressBar.style.width = (loadedCount / visibleImages.length * 100) + '%';
                if (loadedCount >= visibleImages.length) {
                    completeProgress();
                    showPage();
                }
            };
            // 圖片載入成功時
            img.addEventListener('load', onDone);
            // 圖片載入失敗時（例如網址錯誤）→ 也算「完成」，不要讓頁面永遠卡住
            img.addEventListener('error', onDone);
        });

        // 安全機制：最多等 2 秒，即使圖片還沒載入完也強制顯示頁面
        // 避免網路太慢時，使用者看到一片空白太久
        setTimeout(() => {
            if (!document.body.classList.contains('page-ready')) {
                completeProgress();
                showPage();  // 超時了，強制顯示！
            }
        }, 2000);
    }

    // ---------- 淡出部分：點連結時先淡出再跳頁 ----------

    // 找到頁面上所有的 <a> 連結
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');  // 取得連結的目標網址

            // 以下情況「不需要」轉場效果，直接正常跳轉：
            // 1. 沒有 href 的連結
            // 2. # 開頭的錨點連結（同頁面內跳轉）
            // 3. target="_blank" 開新分頁的連結
            // 4. mailto: 或 tel: 等特殊連結
            // 5. javascript: 開頭的連結
            if (!href ||
                href.startsWith('#') ||
                this.target === '_blank' ||
                href.startsWith('mailto:') ||
                href.startsWith('tel:') ||
                href.startsWith('javascript:')) {
                return;  // 直接結束，不做轉場
            }

            // 6. 如果連結目標就是「目前這個頁面」→ 不重新載入，也不做轉場
            // 例如：你已經在 works.html，又點了 WORKS 連結，畫面不該閃一下
            // this.href 是瀏覽器自動補全的完整網址（例如 http://...../works.html）
            // window.location.href 是目前頁面的完整網址
            // 兩者一樣 = 點的就是當前頁面
            if (this.href === window.location.href) {
                e.preventDefault();  // 阻止重新載入
                // 關閉手機版選單（移除所有 active 狀態）
                if (navLinks) navLinks.classList.remove('active');
                if (menuToggle) menuToggle.classList.remove('active');
                const header = document.querySelector('header');
                if (header) header.classList.remove('menu-open');
                document.body.classList.remove('menu-open');
                return;
            }

            e.preventDefault();  // 阻止瀏覽器立刻跳頁

            // 只讓 main 淡出，header 維持不動
            const main = document.querySelector('main');
            if (main) {
                main.classList.add('page-leaving');
            }

            // 等淡出動畫結束後（150 毫秒 = 0.15 秒），才真正跳到新頁面
            setTimeout(() => {
                window.location.href = href;  // 跳轉到目標頁面
            }, 150);
        });
    });

    // --- 建立手機版按鈕（放在選單最後面） ---
    if (navLinks) {
        const mobileLi = document.createElement('li');
        mobileLi.className = 'theme-toggle-mobile';
        const mobileBtn = document.createElement('button');
        mobileBtn.className = 'theme-toggle';
        mobileBtn.setAttribute('aria-label', '切換深色/淺色主題');
        mobileLi.appendChild(mobileBtn);
        navLinks.appendChild(mobileLi);
        mobileBtn.addEventListener('click', toggleTheme);
    }

    // ========================
    // Lightbox（FLIP 展開 + 前後導覽，只在 Project 頁啟用）
    // ========================
    function initLightbox() {
        if (!document.querySelector('.project-header')) return;

        const lbImages = Array.from(document.querySelectorAll('main section img'));
        if (lbImages.length === 0) return;

        // 建立 overlay 結構
        const overlay = document.createElement('div');
        overlay.className = 'lb-overlay';

        const prevBtn = document.createElement('button');
        prevBtn.className = 'lb-btn lb-prev';
        prevBtn.setAttribute('aria-label', '上一張');
        prevBtn.innerHTML = `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18,4 8,14 18,24"/></svg>`;

        const nextBtn = document.createElement('button');
        nextBtn.className = 'lb-btn lb-next';
        nextBtn.setAttribute('aria-label', '下一張');
        nextBtn.innerHTML = `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="10,4 20,14 10,24"/></svg>`;

        const lbImg = document.createElement('img');
        lbImg.className = 'lb-img';

        overlay.appendChild(prevBtn);
        overlay.appendChild(lbImg);
        overlay.appendChild(nextBtn);
        document.body.appendChild(overlay);

        let isOpen = false;
        let srcImg = null;
        let currentIdx = -1;
        let navigating = false;

        // 縮放 / 拖移狀態
        let zoom = 1, panX = 0, panY = 0, baseScale = 1;
        let isPinching = false, pinchStartDist = 0, pinchStartZoom = 1;
        let pinchMidX = 0, pinchMidY = 0, pinchStartPanX = 0, pinchStartPanY = 0;
        let swipeStartX = 0, dragStartX = 0, dragStartY = 0, dragStartPanX = 0, dragStartPanY = 0;

        function getTouchDist(t) {
            return Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
        }

        function applyImgTransform(animated) {
            lbImg.style.transition = animated ? 'transform 0.25s ease' : 'none';
            lbImg.style.transform = `translate(${panX}px, ${panY}px) scale(${baseScale * zoom})`;
        }

        function clampPan() {
            const cssW = parseFloat(lbImg.style.width) || 0;
            const cssH = parseFloat(lbImg.style.height) || 0;
            // 實際顯示尺寸 = CSS 尺寸 × baseScale × zoom
            const maxX = Math.max(0, (cssW * baseScale * zoom - window.innerWidth) / 2);
            const maxY = Math.max(0, (cssH * baseScale * zoom - window.innerHeight) / 2);
            panX = Math.max(-maxX, Math.min(maxX, panX));
            panY = Math.max(-maxY, Math.min(maxY, panY));
        }

        function resetZoom(animated) {
            zoom = 1; panX = 0; panY = 0;
            applyImgTransform(animated);
        }

        function calcFinalSize(nw, nh) {
            const maxW = window.innerWidth * 0.92;
            const maxH = window.innerHeight * 0.92;
            const scale = Math.min(maxW / nw, maxH / nh, 1);
            return { w: nw * scale, h: nh * scale };
        }

        function updateNavBtns() {
            prevBtn.style.visibility = currentIdx > 0 ? 'visible' : 'hidden';
            nextBtn.style.visibility = currentIdx < lbImages.length - 1 ? 'visible' : 'hidden';
        }

        function open(img) {
            if (isOpen) return;
            isOpen = true;
            srcImg = img;
            currentIdx = lbImages.indexOf(img);

            const first = img.getBoundingClientRect();
            const nw = img.naturalWidth || first.width;
            const nh = img.naturalHeight || first.height;
            const { w, h } = calcFinalSize(nw, nh);
            // CSS 尺寸設為原始解析度（上限 4x 顯示尺寸），讓 GPU texture 有足夠像素供放大
            const cssW = Math.min(nw, w * 4);
            const cssH = Math.round(nh * (cssW / nw));
            baseScale = w / cssW; // 縮回顯示大小的比例

            lbImg.src = img.src;
            lbImg.style.width = cssW + 'px';
            lbImg.style.height = cssH + 'px';
            lbImg.style.opacity = '1';

            // Invert：把 lbImg 用 transform 移到 srcImg 的位置
            const dx = first.left + first.width / 2 - window.innerWidth / 2;
            const dy = first.top + first.height / 2 - window.innerHeight / 2;
            const sx = first.width / cssW;
            const sy = first.height / cssH;

            document.body.style.overflow = 'hidden';
            overlay.style.pointerEvents = 'all';
            lbImg.style.transition = 'none';
            lbImg.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
            overlay.style.transition = 'none';
            overlay.style.opacity = '0';
            void overlay.offsetHeight;

            // Play：動畫到中央（scale 到 baseScale = 顯示大小）
            lbImg.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            overlay.style.transition = 'opacity 0.25s ease';
            requestAnimationFrame(() => {
                lbImg.style.transform = `translate(0, 0) scale(${baseScale})`;
                overlay.style.opacity = '1';
            });

            updateNavBtns();
        }

        function close() {
            if (!isOpen) return;

            // 縮放中先重置，確保 FLIP 從正中央出發
            if (zoom !== 1 || panX !== 0 || panY !== 0) {
                resetZoom(false);
                void lbImg.offsetHeight;
            }

            const first = srcImg.getBoundingClientRect();
            const w = parseFloat(lbImg.style.width);
            const h = parseFloat(lbImg.style.height);
            const dx = first.left + first.width / 2 - window.innerWidth / 2;
            const dy = first.top + first.height / 2 - window.innerHeight / 2;
            const sx = first.width / w;
            const sy = first.height / h;

            lbImg.style.transition = 'transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            overlay.style.transition = 'opacity 0.22s ease';
            lbImg.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
            overlay.style.opacity = '0';

            overlay.addEventListener('transitionend', function handler(e) {
                if (e.propertyName !== 'opacity') return;
                overlay.removeEventListener('transitionend', handler);
                document.body.style.overflow = '';
                overlay.style.pointerEvents = 'none';
                lbImg.style.transition = 'none';
                lbImg.style.transform = 'translate(0, 0) scale(1)';
                lbImg.style.width = '';
                lbImg.style.height = '';
                lbImg.src = '';
                isOpen = false;
                srcImg = null;
                currentIdx = -1;
            });
        }

        function navigate(dir) {
            if (navigating) return;
            const newIdx = currentIdx + dir;
            if (newIdx < 0 || newIdx >= lbImages.length) return;

            navigating = true;
            resetZoom(false);
            currentIdx = newIdx;
            srcImg = lbImages[currentIdx];

            lbImg.style.transition = 'opacity 0.15s ease';
            lbImg.style.opacity = '0';

            setTimeout(() => {
                lbImg.src = srcImg.src;

                function applySize() {
                    const nw2 = lbImg.naturalWidth, nh2 = lbImg.naturalHeight;
                    const { w } = calcFinalSize(nw2, nh2);
                    const cssW2 = Math.min(nw2, w * 4);
                    const cssH2 = Math.round(nh2 * (cssW2 / nw2));
                    baseScale = w / cssW2;
                    lbImg.style.width = cssW2 + 'px';
                    lbImg.style.height = cssH2 + 'px';
                    applyImgTransform(false); // 套用新的 baseScale（zoom 已重置為 1）
                    lbImg.style.transition = 'opacity 0.15s ease';
                    lbImg.style.opacity = '1';
                    navigating = false;
                }

                if (lbImg.complete && lbImg.naturalWidth) {
                    applySize();
                } else {
                    lbImg.addEventListener('load', applySize, { once: true });
                }
            }, 150);

            updateNavBtns();
        }

        lbImages.forEach(img => {
            if (img.closest('.video-swap')) return; // 影片縮圖：保留在序列中但不綁 lightbox click
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', () => open(img));
        });

        overlay.addEventListener('click', close);
        prevBtn.addEventListener('click', e => { e.stopPropagation(); navigate(-1); });
        nextBtn.addEventListener('click', e => { e.stopPropagation(); navigate(1); });

        document.addEventListener('keydown', e => {
            if (!isOpen) return;
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') navigate(-1);
            if (e.key === 'ArrowRight') navigate(1);
        });

        // 手機手勢：雙指縮放 + 拖移 + 單指滑動導覽
        overlay.addEventListener('touchstart', e => {
            if (!isOpen) return;
            if (e.touches.length === 2) {
                isPinching = true;
                pinchStartDist = getTouchDist(e.touches);
                pinchStartZoom = zoom;
                // 記錄雙指中心點（viewport 座標）與此時的 pan 位置
                pinchMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
                pinchMidY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
                pinchStartPanX = panX;
                pinchStartPanY = panY;
            } else {
                swipeStartX = e.touches[0].clientX;
                dragStartX = e.touches[0].clientX;
                dragStartY = e.touches[0].clientY;
                dragStartPanX = panX;
                dragStartPanY = panY;
            }
        });

        overlay.addEventListener('touchmove', e => {
            if (!isOpen) return;
            e.preventDefault(); // 阻止瀏覽器原生 pinch-zoom / 滾動介入
            if (e.touches.length === 2) {
                const dist = getTouchDist(e.touches);
                const newZoom = Math.max(1, Math.min(4, pinchStartZoom * dist / pinchStartDist));
                // 以雙指中心點為縮放原點，讓指尖下的畫面位置不移動
                const W = window.innerWidth, H = window.innerHeight;
                panX = pinchMidX - W / 2 - (pinchMidX - W / 2 - pinchStartPanX) * newZoom / pinchStartZoom;
                panY = pinchMidY - H / 2 - (pinchMidY - H / 2 - pinchStartPanY) * newZoom / pinchStartZoom;
                zoom = newZoom;
                clampPan();
                applyImgTransform(false);
            } else if (e.touches.length === 1 && zoom > 1) {
                panX = dragStartPanX + e.touches[0].clientX - dragStartX;
                panY = dragStartPanY + e.touches[0].clientY - dragStartY;
                clampPan();
                applyImgTransform(false);
            }
        }, { passive: false }); // passive: false 才能呼叫 preventDefault()

        overlay.addEventListener('touchend', e => {
            if (!isOpen) return;
            if (isPinching) {
                isPinching = false;
                if (zoom < 1.05) resetZoom(true); // 微幅 pinch 直接彈回
                // 還剩一根手指時，重設拖移起點為當下位置
                // 否則下一個 touchmove 會用舊起點計算 pan，造成跳位
                if (e.touches.length === 1) {
                    dragStartX = e.touches[0].clientX;
                    dragStartY = e.touches[0].clientY;
                    dragStartPanX = panX;
                    dragStartPanY = panY;
                    swipeStartX = e.touches[0].clientX;
                }
                return;
            }
            if (zoom > 1) return; // 縮放中不觸發導覽或關閉
            const delta = e.changedTouches[0].clientX - swipeStartX;
            if (Math.abs(delta) > 50) navigate(delta < 0 ? 1 : -1);
            else close();
        });
    }
    initLightbox();

    // ========================
    // 捲動淡入動畫（Project 頁 + About 頁）
    // ========================
    if (document.querySelector('.project-header') || document.querySelector('.about-section')) {
        document.querySelectorAll('section img, section video').forEach(el => {
            if (!el.closest('.video-swap')) {
                el.classList.add('scroll-reveal');
            }
        });

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    revealObserver.unobserve(el);
                    if (el.tagName === 'IMG' && !el.complete) {
                        const show = () => el.classList.add('visible');
                        el.addEventListener('load', show, { once: true });
                        setTimeout(show, 1500);
                    } else {
                        el.classList.add('visible');
                    }
                }
            });
        }, { threshold: 0.08 });

        document.querySelectorAll('.scroll-reveal').forEach(el => {
            revealObserver.observe(el);
        });
    }
});
