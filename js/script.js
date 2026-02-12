
console.log("網站腳本已成功載入！");

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
    let touchStartX = 0; // 記錄手指按下的 X 位置
    let touchStartY = 0; // 記錄手指按下的 Y 位置

    workItems.forEach(item => {
        // 手指按下時：記錄起始位置
        item.addEventListener('touchstart', function (e) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        // 手指放開時：判斷是「點」還是「滑」
        item.addEventListener('touchend', function (e) {
            const touchEndX = e.changedTouches[0].clientX; // 手指放開的 X 位置
            const touchEndY = e.changedTouches[0].clientY; // 手指放開的 Y 位置
            const deltaX = Math.abs(touchEndX - touchStartX); // X 方向移動距離
            const deltaY = Math.abs(touchEndY - touchStartY); // Y 方向移動距離

            // 如果手指移動超過 10px，代表是「滑動」，不是「點擊」→ 忽略
            if (deltaX > 10 || deltaY > 10) return;

            // 以下是真正的「點一下」
            if (!this.classList.contains('touched')) {
                e.preventDefault(); // 阻止第一次點擊直接跳頁
                // 先把其他格子的 touched 狀態清掉
                workItems.forEach(other => other.classList.remove('touched'));
                // 幫這個格子加上 touched（觸發遮罩 + 顯示標題）
                this.classList.add('touched');
            }
            // 如果已經有 touched，就不阻止 → 正常跳轉到作品頁面
        });
    });

    // 點擊空白處時，清除所有 touched 狀態
    document.addEventListener('touchend', function (e) {
        if (!e.target.closest('.work-item')) {
            workItems.forEach(item => item.classList.remove('touched'));
        }
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
