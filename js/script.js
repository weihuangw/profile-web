
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
    // 第一次點 → 圖片變淡 + 顯示標題（跟電腦版 hover 一樣）
    // 第二次點 → 進入作品頁面
    const workItems = document.querySelectorAll('.work-item'); // 抓到所有作品格子

    workItems.forEach(item => {
        item.addEventListener('touchstart', function (e) {
            // 如果這個格子「還沒被觸碰過」
            if (!this.classList.contains('touched')) {
                e.preventDefault(); // 阻止第一次點擊直接跳頁
                // 先把其他格子的 touched 狀態清掉
                workItems.forEach(other => other.classList.remove('touched'));
                // 幫這個格子加上 touched（觸發變淡 + 顯示標題）
                this.classList.add('touched');
            }
            // 如果已經有 touched，就不阻止 → 正常跳轉到作品頁面
        });
    });

    // 點擊空白處時，清除所有 touched 狀態
    document.addEventListener('touchstart', function (e) {
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
