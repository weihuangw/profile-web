
console.log("網站腳本已成功載入！");

// ========================
// 修正「上一頁」黑畫面問題
// ========================
// 瀏覽器按「上一頁」時，會從快取（bfcache）還原頁面
// 但還原的頁面可能還帶著 page-leaving（opacity: 0）→ 卡在黑畫面
// pageshow 事件 = 每次頁面「顯示」時都會觸發（包括從快取還原）
// event.persisted = true 代表「這是從快取還原的」，不是重新載入
window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
        // 從快取還原 → 移除淡出狀態，重新顯示頁面
        document.body.classList.remove('page-leaving');  // 移除「正在離開」的狀態
        document.body.classList.remove('no-transition'); // 允許動畫
        document.body.classList.add('page-ready');       // 觸發淡入顯示
    }
});

// 等待 DOM 載入完成
document.addEventListener('DOMContentLoaded', () => {
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
        // 同步更新 html 背景色，避免 body opacity:0 時透出錯誤顏色
        document.documentElement.style.backgroundColor = isLight ? 'oklch(0.92 0 340)' : '#000';
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

    /**
     * 顯示頁面的函式：移除 no-transition，加上 page-ready 來觸發淡入
     */
    function showPage() {
        document.body.classList.remove('no-transition');  // 允許動畫效果
        // requestAnimationFrame = 等瀏覽器準備好下一幀畫面時再執行
        // 這樣 transition 才能正確觸發（瀏覽器需要「看到」opacity:0 的狀態，才能動畫到 opacity:1）
        requestAnimationFrame(() => {
            document.body.classList.add('page-ready');  // 觸發淡入！頁面慢慢顯示出來
        });
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
        showPage();
    } else {
        // 有圖片需要等待 → 每張圖片載入完成時檢查是否「全部」都好了
        let loadedCount = 0;  // 已載入完成的圖片數量

        visibleImages.forEach(img => {
            // 圖片載入成功時
            img.addEventListener('load', () => {
                loadedCount++;  // 完成數量 +1
                if (loadedCount >= visibleImages.length) {
                    showPage();  // 全部載入完成 → 顯示頁面！
                }
            });

            // 圖片載入失敗時（例如網址錯誤）→ 也算「完成」，不要讓頁面永遠卡住
            img.addEventListener('error', () => {
                loadedCount++;
                if (loadedCount >= visibleImages.length) {
                    showPage();
                }
            });
        });

        // 安全機制：最多等 3 秒，即使圖片還沒載入完也強制顯示頁面
        // 避免網路太慢時，使用者看到一片空白太久
        setTimeout(() => {
            if (!document.body.classList.contains('page-ready')) {
                showPage();  // 超時了，強制顯示！
            }
        },2000);
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

            document.body.classList.add('page-leaving');  // 加上淡出效果的 class

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
});
