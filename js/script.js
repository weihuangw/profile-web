
console.log("網站腳本已成功載入！");

// 等待 DOM 載入完成
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        const header = document.querySelector('header'); // 取得 header 元素
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active'); // 讓按鈕也切換 active 狀態，以便做變形動畫
            header.classList.toggle('menu-open'); // 讓 header 知道選單已打開
            document.body.classList.toggle('menu-open'); // 新增：鎖定背景滾動
        });
    }
});
