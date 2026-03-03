# HUANG WEI — 作品集網站開發計畫

> 最後更新：2026-03-03
> 專案路徑：`c:\__Code\profile-web`

---

## 目錄

- [目前網站現況](#目前網站現況)
- [參考研究紀錄](#參考研究紀錄)
- [功能開發計畫](#功能開發計畫)
  - [階段 1：基礎體驗升級](#階段-1基礎體驗升級)
  - [階段 2：藝術家風格強化](#階段-2藝術家風格強化)
  - [階段 3：實驗性功能](#階段-3實驗性功能)
- [目前檔案結構](#目前檔案結構)
- [相關資源檔案](#相關資源檔案)

---

## 目前網站現況

### 已完成的頁面

| 頁面 | 檔案 | 狀態 |
|------|------|------|
| 首頁 | `index.html` | 空殼，直接跳轉到 works.html |
| 作品列表 | `works.html` | 已完成基礎版（10 格，4 個有圖，6 個佔位圖） |
| 關於 | `about.html` | 已完成，有簡介、照片、完整經歷列表 |
| 聯絡 | `contact.html` | 已完成，有 Email 和 Instagram |
| project-10 | `projects/project-10.html` | ✓ ∫\<Sense\>*dt（含 YouTube 嵌入） |
| project-9 | `projects/project-9.html` | ✓ Sedimentary |
| project-8 | `projects/project-8.html` | ✓ MRSP（含點擊播放 mp4） |
| project-7 | `projects/project-7.html` | ✓ INNERSTAR-01 : Reddening |
| project-6 | `projects/project-6.html` | 待填（封面圖已存在：Homoform） |
| project-5 | `projects/project-5.html` | 待填（封面圖已存在：Daniel） |
| project-4 | `projects/project-4.html` | 待填（封面圖已存在：MT） |
| project-3 | `projects/project-3.html` | 待填（封面圖已存在：DIS） |
| project-2 | `projects/project-2.html` | 待填（封面圖已存在：ex） |
| project-1 | `projects/project-1.html` | 空白模板，works.html 中已註解隱藏 |

### 已完成的功能

| 功能 | 說明 | 檔案位置 |
|------|------|---------|
| 響應式漢堡選單 | 手機版三條線選單，點擊展開導覽 | `js/script.js` |
| 深色/淺色主題切換 | 按鈕切換，localStorage 記住選擇 | `js/script.js` + `css/light-theme.css` |
| 手機觸碰 hover 效果 | 第一次點顯示標題，第二次點進入作品頁 | `js/script.js` |
| 回到頂部按鈕 | 作品詳情頁底部的 ↑ 按鈕 | 各 project HTML 內嵌 |
| HTML 圖片懶載入 | `loading="lazy"` 屬性 | 各 project HTML |
| 頁面轉場動畫 | 離開淡出、進入淡入，不影響主題切換 | `css/base.css` + `js/script.js` |
| YouTube 嵌入 | 響應式 iframe 影片嵌入 | `projects/project-10.html` |
| 點擊播放 mp4 | 作品頁圖片點擊後原位播放 loop 影片 | `projects/project-8.html` |

### 視覺設定

| 項目 | 深色主題 | 淺色主題 |
|------|---------|---------|
| 背景色 | `oklch(0.2 0 0)`（深灰） | `oklch(0.92 0 340)`（帶粉淺灰） |
| 文字色 | `#e0e0e0` | `#333` |

### CSS 模組化結構

| 檔案 | 負責區域 |
|------|---------|
| `css/base.css` | 全站基礎樣式（字體、顏色、reset、頁面轉場） |
| `css/header.css` | 導覽列 + 漢堡選單 |
| `css/footer.css` | 頁尾 |
| `css/style.css` | 主樣式（匯入其他 CSS） |
| `css/works.css` | 作品列表頁的格子排列 |
| `css/about.css` | 關於頁面 |
| `css/contact.css` | 聯絡頁面 |
| `css/project.css` | 作品詳情頁 |
| `css/responsive.css` | 響應式斷點 |
| `css/light-theme.css` | 淺色主題覆寫 |

---

## 參考研究紀錄

### 1. main.js — Behance 風格作品集模板

- **來源**：`c:\Users\weihuang\Downloads\main.js`（346KB，7878 行）
- **技術**：Webpack 打包，jQuery 2.2.4
- **可參考的功能**：
  - Lightbox 圖片燈箱（有上一張/下一張/關閉按鈕）
  - Lazy Load v1.9.7 圖片延遲載入
  - 響應式圖片格子（根據螢幕寬度自動調整）
  - 觸控滑動偵測（手機左右滑換圖）
  - 頁面轉場動畫
  - Debounce 防抖函式（優化捲動效能）

### 2. main1.js — Mario Carrillo 的 WebGL Shader 背景

- **來源**：`c:\Users\weihuang\Downloads\main1.js`（102 行）
- **技術**：WebGL + GLSL Shader（輕量 OGL 框架）
- **可參考的功能**：
  - 全螢幕 WebGL 動態背景
  - 兩套 Fragment Shader（首頁 vs 其他頁面用不同效果）
  - 根據 URL 路徑自動切換 Shader
  - 響應式調整（不同螢幕寬度用不同重複次數）
  - requestAnimationFrame 動畫循環
- **已提取的 Shader**：
  - `td_wave_shader.glsl` — 波浪彩色條紋（首頁用）
  - `td_grid_shader.glsl` — 格子方塊動畫（其他頁面用）

### 3. 404 — 404.zero 官方網站

- **來源**：`c:\Users\weihuang\Downloads\404`（HTML 檔，無副檔名）
- **技術**：WebGL + GLSL Ray Marching + Web Audio API
- **可參考的功能**：
  - Ray Marching 3D 噪聲地形（即時渲染）
  - 滑鼠互動控制攝影機和地形
  - 雙音軌 LFO 交叉淡入淡出（聲音呼吸感）
  - 聲音與畫面完全同步（LFO 同時控制音量和亮度）
  - 紅點按鈕切換「藝術模式」和「資訊模式」
  - Email 地址混淆防爬蟲
  - 雙緩衝渲染（backbuffer 回饋效果）
- **已提取的 Shader**：
  - `td_raymarching_404zero.glsl` — Ray Marching 地形（TouchDesigner 版）
- **已提取的音訊系統**：
  - `404zero_audio_system.md` — 完整聲音處理邏輯文件

### 4. Peeky — 作品集平台照片排版機制

- **來源**：`g:\My Drive\wei-Obsidian\projects\peeky-photo-layout.md`
- **技術**：Flexbox + JS 動態計算位置
- **可參考的功能**：
  - 直向（2:3）佔 1 欄、橫向（3:2）佔 2 欄
  - padding-bottom 鎖定長寬比
  - JS 計算同排等高，cover 裁切填滿
  - 類型碼系統（L / l / P / Y / X / S）決定排列 pattern

---

## 功能開發計畫

### 階段 0：Works 頁面排版重構（進行中討論）

#### 0-1. 混合比例排版（Peeky 風格）

- **優先度**：高
- **狀態**：規劃中，尚未決定各作品方向
- **說明**：Works 頁面改為 Flexbox，直向作品佔 1 欄（1/3），橫向作品佔 2 欄（2/3），響應式 3→2→1 欄
- **影響檔案**：`works.html`、`css/works.css`、`js/script.js`
- **實作要點**：
  - 每個 `.work-item` 加 `data-type="landscape"` 或 `data-type="portrait"`
  - JS 讀取視窗寬度決定欄數（>1024px → 3欄，768~1024px → 2欄，<768px → 1欄）
  - 3欄模式：landscape=66.67%、portrait=33.33%，每排湊滿 100%
  - 2欄模式：所有作品 50% 等寬
  - 1欄模式：所有作品 100%
  - JS 計算同排等高，圖片 object-fit: cover
  - resize 事件加 debounce 重算
- **待決定**：10 個作品各自是直向還是橫向（影響排列 pattern）

---

### 階段 1：基礎體驗升級

> 目標：讓現有網站的瀏覽體驗更流暢、更專業

#### 1-1. 圖片 Lightbox 燈箱

- **優先度**：高
- **狀態**：未開始
- **說明**：在作品詳情頁，點擊圖片可以放大全螢幕瀏覽，支援左右切換和關閉
- **參考**：`main.js` 的 Lightbox 模組
- **影響檔案**：`js/script.js`、新增 `css/lightbox.css`、各 project HTML
- **實作要點**：
  - 點擊圖片 → 全螢幕遮罩 + 放大圖片
  - 上一張 / 下一張 按鈕
  - 點擊遮罩或按 ESC 關閉
  - 手機支援左右滑動換圖
  - 純 JS 實作，不依賴 jQuery

#### 1-2. 頁面轉場動畫

- **優先度**：高
- **狀態**：✓ 已完成
- **說明**：頁面切換時淡入淡出，不影響主題切換動畫

#### 1-4. 圖片 Lazy Loading 強化

- **優先度**：低
- **狀態**：部分完成（已有 HTML `loading="lazy"`）
- **說明**：加上 JS 版的 Lazy Loading，支援載入動畫（從模糊到清晰）
- **參考**：`main.js` 的 Lazy Load v1.9.7
- **影響檔案**：`js/script.js`
- **實作要點**：
  - Intersection Observer API
  - 圖片進入視窗時才載入，載入完成後淡入顯示

---

### 階段 2：藝術家風格強化

> 目標：讓網站展現 Audio-Visual 藝術家的獨特風格

#### 2-1. 首頁 WebGL 動態背景

- **優先度**：高
- **狀態**：未開始
- **說明**：取代目前空白的 `index.html`，做一個有 WebGL Shader 動態背景的首頁
- **參考**：`main1.js` 的 Shader 背景、`404` 的 Ray Marching
- **影響檔案**：`index.html`（重寫）、新增 `js/webgl.js`
- **實作要點**：
  - 全螢幕 `<canvas>` 背景
  - GLSL Fragment Shader 動態效果
  - 上面疊加 HUANG WEI 名字和簡單導航
  - 手機版降低解析度或關閉效果

#### 2-3. 捲動動畫（Scroll Animation）

- **優先度**：中
- **狀態**：未開始
- **說明**：頁面內容在捲動時淡入出現
- **影響檔案**：`js/script.js`、`css/base.css`
- **實作要點**：
  - Intersection Observer API 偵測元素進入視窗
  - 元素從下方滑入 + 淡入（translateY + opacity）
  - 只觸發一次

#### 2-4. 作品分類篩選

- **優先度**：低
- **狀態**：未開始
- **說明**：Works 頁面加上分類標籤，可以篩選不同類型的作品
- **影響檔案**：`works.html`、`js/script.js`、`css/works.css`
- **實作要點**：
  - 標籤類別：Performance / Exhibition / Installation / Media Design / All
  - 每個 `.work-item` 加上 `data-category` 屬性
  - 點擊標籤 → 隱藏不符合的作品（淡出動畫）

---

### 階段 4：URL 結構重構

#### 4-1. 去除 URL 中的 .html 副檔名

- **優先度**：低（等內容完成後再處理）
- **狀態**：未開始
- **說明**：GitHub Pages 不原生支援無副檔名 URL，需改用資料夾結構
- **做法**：每個頁面改為 `頁面名稱/index.html`
  ```
  works.html               →  works/index.html          →  /works/
  about.html               →  about/index.html          →  /about/
  contact.html             →  contact/index.html        →  /contact/
  projects/project-10.html →  projects/project-10/index.html  →  /projects/project-10/
  ```
- **注意**：所有內部連結（href）、CSS / JS / 圖片相對路徑全部要重寫，建議等 project-1~6 內容都填完再一次處理

---

### 階段 3：實驗性功能

> 目標：讓網站本身成為一件 Audio-Visual 作品

#### 3-1. 網頁音訊互動

- **優先度**：低（長期目標）
- **狀態**：未開始
- **參考**：`404` 的 Web Audio API + LFO 交叉淡入淡出
- **詳細文件**：`g:\My Drive\wei-Obsidian\projects\404zero_audio_system.md`

#### 3-2. 滑鼠互動式視覺

- **優先度**：低（長期目標）
- **狀態**：未開始
- **參考**：`404` 的滑鼠控制攝影機 + 地形

#### 3-3. 自訂 404 錯誤頁面

- **優先度**：低
- **狀態**：未開始
- **影響檔案**：新增 `404.html`
- **實作要點**：GitHub Pages 需要命名為 `404.html`

---

### 階段 5：部署與分析

#### 5-1. 遷移到 Cloudflare Pages + 開啟 Web Analytics

- **優先度**：中（等網站內容完成後執行）
- **狀態**：未開始
- **說明**：將網站從 GitHub Pages 遷移到 Cloudflare Pages，免費獲得更快速度與內建訪客分析（無 Cookie、不用改程式碼）
- **步驟**：
  1. 在 [cloudflare.com](https://cloudflare.com) 建立免費帳號
  2. Workers & Pages → Create → Pages → Connect to Git
  3. 連結 GitHub 帳號，選擇 `profile-web` repo
  4. Framework preset = `None`，Build command 與 Output directory 留空
  5. 部署完成後確認網站正常（會有 `profile-web.pages.dev` 網址）
  6. 左側 Web Analytics → Add a site → 選 Pages 專案 → 開啟分析
  7. 確認分析資料正常後，可選擇關閉 GitHub Pages
- **優點**：免費、無 Cookie、全球 CDN 加速、不需修改任何程式碼
- **影響檔案**：無（純部署操作）

#### 5-2. Git 分支工作流程

- **狀態**：待遷移後採用
- **策略**：`main` branch 直接對應正式網站，日常開發開 feature branch
- **流程**：
  ```
  開發新功能／修改
       ↓
  開一個 feature branch（如 feature/project-6）
       ↓
  push 到 GitHub → Cloudflare 自動產生預覽網址
       ↓
  確認預覽沒問題
       ↓
  merge 到 main → 正式網站自動更新
  ```
- **說明**：
  - `main` → 正式網站（`profile-web.pages.dev`）
  - 其他任何 branch → Cloudflare 自動產生獨立預覽網址，可實際瀏覽效果
  - 不需要額外維護 production branch，保持簡單

---

### 階段 6：SEO — Google 搜尋優化

> 目標：讓 Google 能搜尋到網站，提升被找到的機率

#### 6-1. 提交 Google Search Console + 建立 sitemap.xml

- **優先度**：中（遷移 Cloudflare 後執行）
- **狀態**：未開始
- **步驟**：
  1. 前往 [search.google.com/search-console](https://search.google.com/search-console) 新增網站
  2. 驗證擁有權（Cloudflare DNS 驗證最簡單）
  3. 在根目錄建立 `sitemap.xml`，列出所有頁面 URL
  4. 在 Search Console 提交 sitemap
- **影響檔案**：新增 `sitemap.xml`

#### 6-2. 補齊所有頁面的 meta description 和 og tags

- **優先度**：中
- **狀態**：未開始
- **說明**：每個頁面的 `<head>` 加上以下標籤，提升搜尋結果的曝光品質
- **需加入標籤**：
  ```html
  <meta name="description" content="作品描述（150字以內）">
  <meta property="og:title" content="作品名稱 — HUANG WEI">
  <meta property="og:description" content="作品描述">
  <meta property="og:image" content="封面圖完整 URL">
  <meta property="og:url" content="頁面完整 URL">
  ```
- **影響檔案**：`works.html`、`about.html`、`contact.html`、所有 `project-N.html`

#### 6-3. 補全圖片 alt 屬性

- **優先度**：低
- **狀態**：未開始
- **說明**：圖片的 `alt` 文字有助於 Google 理解圖片內容，目前部分為空或佔位文字
- **影響檔案**：各 `project-N.html`

---

## 目前檔案結構

```
c:\__Code\profile-web\
│
├── index.html              ← 首頁（空殼，跳轉到 works）
├── works.html              ← 作品列表頁
├── about.html              ← 關於頁面
├── contact.html            ← 聯絡頁面
├── PLAN.md                 ← 本檔案
│
├── css\
│   ├── style.css           ← 主樣式（匯入其他 CSS）
│   ├── base.css            ← 全站基礎（含頁面轉場）
│   ├── header.css          ← 導覽列
│   ├── footer.css          ← 頁尾
│   ├── works.css           ← 作品列表頁
│   ├── about.css           ← 關於頁面
│   ├── contact.css         ← 聯絡頁面
│   ├── project.css         ← 作品詳情頁
│   ├── responsive.css      ← 響應式
│   └── light-theme.css     ← 淺色主題
│
├── js\
│   └── script.js           ← 主要 JS（選單、主題、觸碰、頁面轉場）
│
├── images\
│   ├── SenseDt\            ← ∫<Sense>*dt
│   ├── SED_inst\           ← Sedimentary
│   ├── MRSP\               ← MRSP
│   └── Innerstar\          ← INNERSTAR-01
│
├── projects\
│   ├── project.html        ← 空白模板
│   ├── project-7.html      ← ✓ INNERSTAR-01
│   ├── project-8.html      ← ✓ MRSP
│   ├── project-9.html      ← ✓ Sedimentary
│   ├── project-10.html     ← ✓ ∫<Sense>*dt
│   └── project-1 ~ 6.html  ← 空白模板，待填
│
└── fonts\                  ← 自訂字體（Inter WOFF2）
```

---

## 相關資源檔案

| 檔案 | 說明 | 路徑 |
|------|------|------|
| `peeky-photo-layout.md` | Peeky 平台照片排版機制分析 | `g:\My Drive\wei-Obsidian\projects\` |
| `404zero_audio_system.md` | 404.zero 聲音系統完整解析 | `g:\My Drive\wei-Obsidian\projects\` |
| `shaders.md` | 三段 GLSL Shader 原始碼 | `g:\My Drive\wei-Obsidian\projects\` |

---

## 待辦事項清單

### 內容
- [ ] `project-1` ~ `project-6` 作品內容待填
- [ ] `works.html` 6 個佔位圖待替換

### 功能
- [ ] **階段 0-1**：Works 混合比例排版（需先決定各作品方向）
- [ ] **階段 1-1**：圖片 Lightbox 燈箱
- [ ] **階段 1-4**：圖片 Lazy Loading 強化
- [ ] **階段 2-1**：首頁 WebGL 動態背景
- [ ] **階段 2-3**：捲動動畫（Scroll Animation）
- [ ] **階段 2-4**：作品分類篩選
- [ ] **階段 3-1**：網頁音訊互動
- [ ] **階段 3-2**：滑鼠互動式視覺
- [ ] **階段 3-3**：自訂 404 錯誤頁面
- [ ] **階段 4-1**：URL 結構重構（去除 .html）— 等內容完成後再處理
- [ ] **階段 5-1**：遷移到 Cloudflare Pages + 開啟 Web Analytics — 等內容完成後再執行
- [ ] **階段 6-1**：提交 Google Search Console + sitemap.xml
- [ ] **階段 6-2**：補齊所有頁面 meta description 和 og tags
- [ ] **階段 6-3**：檢查並補全所有圖片 alt 屬性
