# HUANG WEI — 個人作品集網站

## 技術棧
- 純 HTML5 + CSS3 + Vanilla JavaScript，**無框架、無建置工具**
- 完全靜態網站，不需要 npm install

## 檔案結構
```
/
├── index.html          # 重導向到 works.html
├── works.html          # 作品列表（10 格網格）
├── about.html          # 關於頁面
├── contact.html        # 聯絡頁面
├── css/
│   ├── style.css       # 主入口，用 @import 引入所有 CSS
│   ├── base.css        # 全域樣式、字體、顏色變數
│   ├── header.css      # 導覽列 + 漢堡選單
│   ├── footer.css      # 頁尾
│   ├── works.css       # 作品網格
│   ├── about.css       # 關於頁面
│   ├── project.css     # 作品詳情頁
│   ├── contact.css     # 聯絡頁面
│   ├── responsive.css  # 所有媒體查詢
│   └── light-theme.css # 淺色主題覆寫（.light-theme class）
├── js/script.js        # 漢堡選單、主題切換、頁面過渡
├── fonts/              # 自託管 Inter WOFF2
├── images/             # 作品圖片（依作品分子資料夾）
└── projects/
    ├── project.html    # 空白模板
    └── project-1.html ~ project-10.html
```

## 色彩系統
- **深色主題（預設）**：背景 `#000`，文字 `#e0e0e0`
- **淺色主題**：`oklch(0.92 0 340)` 背景，透過 `.light-theme` class 切換
- 主題由 `localStorage.getItem('theme')` 控制

## 字體
- 英文：Inter（自託管 WOFF2，支援字重 100–900 可變字體）
- 中文 fallback：`Microsoft JhengHei`

## 作品頁規則
- 作品詳情頁在 `projects/project-N.html`
- CSS 路徑：`../css/style.css`（注意相對路徑）
- JS 路徑：`../js/script.js`
- 圖片路徑：`../images/[作品資料夾名]/[檔名]`
- 每頁必須有主題初始化 script（防閃爍，見 project.html 開頭）

## 作品列表格式（works.html）
```html
<a href="projects/project-N.html" class="work-item">
    <img src="images/[資料夾]/[封面圖].jpg" alt="[作品名]">
    <div class="work-info">
        <span class="work-title">[作品名]</span>
        <span class="work-type">[類型]</span>
    </div>
</a>
```

## 開發注意事項
- 新增 CSS 樣式優先加到對應的模組檔，不要直接寫在 HTML 的 style 屬性
- 響應式樣式統一放在 `responsive.css`
- 不需要加 `console.log` 或多餘的 error handling
- 圖片使用 `loading="lazy"` 屬性
