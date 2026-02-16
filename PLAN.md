# HUANG WEI — 作品集網站開發計畫

> 最後更新：2026-02-15
> 專案路徑：`c:\__Antigravity\profile-web`

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
| 作品列表 | `works.html` | 已完成，10 格作品（1 個有圖，9 個佔位圖） |
| 關於 | `about.html` | 已完成，有簡介、照片、完整經歷列表 |
| 聯絡 | `contact.html` | 已完成，有 Email 和 Instagram |
| 作品詳情 | `projects/project-1.html` ~ `project-10.html` | project-10 已完成（∫\<Sense\>*dt），其餘待填內容 |

### 已完成的功能

| 功能 | 說明 | 檔案位置 |
|------|------|---------|
| 響應式漢堡選單 | 手機版三條線選單，點擊展開導覽 | `js/script.js` |
| 深色/淺色主題切換 | 按鈕切換，localStorage 記住選擇 | `js/script.js` + `css/light-theme.css` |
| 手機觸碰 hover 效果 | 第一次點顯示標題，第二次點進入作品頁 | `js/script.js` |
| 回到頂部按鈕 | 作品詳情頁底部的 ↑ 按鈕 | 各 project HTML 內嵌 |
| HTML 圖片懶載入 | `loading="lazy"` 屬性 | 各 project HTML |
| YouTube 嵌入 | 響應式 iframe 影片嵌入 | `projects/project-10.html` |

### CSS 模組化結構

| 檔案 | 負責區域 |
|------|---------|
| `css/base.css` | 全站基礎樣式（字體、顏色、reset） |
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
  - Google Analytics 流量追蹤
  - Cookie 同意橫幅
  - 防止圖片右鍵下載
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
  - 可拖曳的 UI 面板
  - Email 地址混淆防爬蟲
  - 雙緩衝渲染（backbuffer 回饋效果）
- **已提取的 Shader**：
  - `td_raymarching_404zero.glsl` — Ray Marching 地形（TouchDesigner 版）
- **已提取的音訊系統**：
  - `404zero_audio_system.md` — 完整聲音處理邏輯文件

---

## 功能開發計畫

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
- **狀態**：未開始
- **說明**：頁面切換時加上淡入淡出效果，避免硬切
- **參考**：`main.js` 的 pageTransition 模組
- **影響檔案**：`js/script.js`、`css/base.css`
- **實作要點**：
  - 離開頁面時 → 淡出（opacity 0）
  - 進入頁面時 → 淡入（opacity 1）
  - 用 CSS transition + JS 控制
  - 注意：不要影響到現有的主題切換動畫

#### 1-3. 作品頁 Prev / Next 導航

- **優先度**：中
- **狀態**：未開始
- **說明**：作品詳情頁底部加上「← 上一個作品 / 下一個作品 →」按鈕
- **影響檔案**：各 project HTML、`css/project.css`
- **實作要點**：
  - 固定在頁面底部（footer 上方）
  - 顯示上/下一個作品的名稱
  - 最後一個作品的 Next → 回到第一個（循環）

#### 1-4. 圖片 Lazy Loading 強化

- **優先度**：低
- **狀態**：部分完成（已有 HTML `loading="lazy"`）
- **說明**：加上 JS 版的 Lazy Loading，支援載入動畫（從模糊到清晰）
- **參考**：`main.js` 的 Lazy Load v1.9.7
- **影響檔案**：`js/script.js`
- **實作要點**：
  - Intersection Observer API（現代瀏覽器內建）
  - 圖片載入前顯示低解析度佔位或 blur 效果
  - 圖片進入視窗時才開始載入
  - 載入完成後淡入顯示

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
  - GLSL Fragment Shader 動態效果（可用你已有的 Shader 作品）
  - 上面疊加 HUANG WEI 的名字和簡單導航
  - 點擊或捲動進入 Works 頁面
  - 注意效能：手機上可能需要降低解析度或關閉效果
  - 參考 `main1.js` 的響應式處理（不同螢幕用不同參數）

#### 2-2. 影片封面取代靜態圖片

- **優先度**：中
- **狀態**：未開始
- **說明**：Works 頁面的作品格子，hover 時播放短影片預覽
- **影響檔案**：`works.html`、`css/works.css`、`js/script.js`
- **實作要點**：
  - 預設顯示靜態圖片（縮圖）
  - 滑鼠 hover 時自動播放短影片（3~5 秒循環，靜音）
  - 手機版維持靜態圖片（節省流量）
  - 影片格式：MP4（相容性最好）
  - 需要為每個作品準備一段短預覽影片

#### 2-3. 捲動動畫（Scroll Animation）

- **優先度**：中
- **狀態**：未開始
- **說明**：頁面內容在捲動時淡入出現，增加瀏覽節奏感
- **影響檔案**：`js/script.js`、`css/base.css`
- **實作要點**：
  - Intersection Observer API 偵測元素進入視窗
  - 元素從下方滑入 + 淡入（translateY + opacity）
  - 只觸發一次（出現過就不再重複動畫）
  - 適用於：作品格子、About 頁面的各區塊、作品詳情頁的圖片

#### 2-4. 作品分類篩選

- **優先度**：低
- **狀態**：未開始
- **說明**：Works 頁面加上分類標籤，可以篩選不同類型的作品
- **影響檔案**：`works.html`、`js/script.js`、`css/works.css`
- **實作要點**：
  - 標籤類別：Performance / Exhibition / Installation / Media Design / All
  - 每個 `.work-item` 加上 `data-category` 屬性
  - 點擊標籤 → 隱藏不符合的作品（加上淡出動畫）
  - 預設顯示 All

---

### 階段 3：實驗性功能

> 目標：讓網站本身成為一件 Audio-Visual 作品

#### 3-1. 網頁音訊互動

- **優先度**：低（長期目標）
- **狀態**：未開始
- **說明**：在首頁或特定作品頁加入聲音元素，聲音與畫面同步
- **參考**：`404` 的 Web Audio API + LFO 交叉淡入淡出
- **詳細文件**：`c:\Users\weihuang\Downloads\404zero_audio_system.md`
- **實作要點**：
  - Web Audio API（AudioContext + GainNode）
  - 需要使用者點擊才能啟動聲音（瀏覽器規定）
  - LFO 控制音量 + GLSL 亮度同步
  - 準備環境音或噪聲音軌（mp3 / ogg）

#### 3-2. 滑鼠互動式視覺

- **優先度**：低（長期目標）
- **狀態**：未開始
- **說明**：滑鼠位置影響網頁上的視覺效果
- **參考**：`404` 的滑鼠控制攝影機 + 地形
- **實作要點**：
  - 追蹤滑鼠位置，傳給 GLSL Shader 作為 uniform
  - 可以影響：背景顏色、粒子方向、形狀變化
  - 手機版用陀螺儀或觸碰位置取代

#### 3-3. 自訂 404 錯誤頁面

- **優先度**：低
- **狀態**：未開始
- **說明**：找不到頁面時顯示一個有趣的藝術頁面
- **參考**：`404` 的 Ray Marching 效果
- **影響檔案**：新增 `404.html`
- **實作要點**：
  - WebGL 動態背景 + 「Page Not Found」文字
  - 可以用你的 Shader 作品作為背景
  - 加上返回首頁的連結
  - GitHub Pages 需要把檔案命名為 `404.html`

---

## 目前檔案結構

```
c:\__Antigravity\profile-web\
│
├── index.html              ← 首頁（目前空殼，跳轉到 works）
├── works.html              ← 作品列表頁
├── about.html              ← 關於頁面
├── contact.html            ← 聯絡頁面
├── README.md
│
├── css\
│   ├── style.css           ← 主樣式（匯入其他 CSS）
│   ├── base.css            ← 全站基礎
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
│   └── script.js           ← 主要 JS（選單、主題、觸碰效果）
│
├── images\
│   └── SenseDt\            ← ∫<Sense>*dt 作品圖片
│
├── projects\
│   ├── project-1.html      ← 作品 1（待填內容）
│   ├── project-2.html      ← 作品 2（待填內容）
│   ├── ...
│   └── project-10.html     ← ∫<Sense>*dt（已完成）
│
└── fonts\                  ← 自訂字體
```

---

## 相關資源檔案

從參考網站提取出來的學習資源，存放在 Downloads：

| 檔案 | 說明 | 路徑 |
|------|------|------|
| `shaders.md` | 三段 GLSL Shader 原始碼（含中文註解） | `c:\Users\weihuang\Downloads\shaders.md` |
| `td_wave_shader.glsl` | 波浪條紋 Shader（TouchDesigner 版） | `c:\Users\weihuang\Downloads\td_wave_shader.glsl` |
| `td_grid_shader.glsl` | 格子方塊 Shader（TouchDesigner 版） | `c:\Users\weihuang\Downloads\td_grid_shader.glsl` |
| `td_raymarching_404zero.glsl` | Ray Marching 地形 Shader（TouchDesigner 版） | `c:\Users\weihuang\Downloads\td_raymarching_404zero.glsl` |
| `404zero_audio_system.md` | 404.zero 聲音系統完整解析 | `c:\Users\weihuang\Downloads\404zero_audio_system.md` |

---

## 待辦事項清單

- [ ] **階段 1-1**：圖片 Lightbox 燈箱
- [ ] **階段 1-2**：頁面轉場動畫
- [ ] **階段 1-3**：作品頁 Prev / Next 導航
- [ ] **階段 1-4**：圖片 Lazy Loading 強化
- [ ] **階段 2-1**：首頁 WebGL 動態背景
- [ ] **階段 2-2**：影片封面取代靜態圖片
- [ ] **階段 2-3**：捲動動畫（Scroll Animation）
- [ ] **階段 2-4**：作品分類篩選
- [ ] **階段 3-1**：網頁音訊互動
- [ ] **階段 3-2**：滑鼠互動式視覺
- [ ] **階段 3-3**：自訂 404 錯誤頁面
- [ ] **其他**：補齊 project-1 ~ project-9 的作品內容
