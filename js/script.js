// 這裡將會撰寫 JavaScript 程式碼
// 目前暫時留空，等待未來加入互動功能
console.log("網站腳本已成功載入！");

// 等待 DOM 載入完成
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active'); // 新增：讓按鈕也切換 active 狀態，以便做變形動畫
        });
    }
});
