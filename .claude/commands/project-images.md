幫使用者在 project 頁面排版圖片區塊，參照已完成的 project 頁面的真實寫法。

使用者提供的資訊：$ARGUMENTS

請執行以下步驟：

1. **讀取參考範例**：讀取已完成的三個 project 頁面，理解實際使用的 HTML 圖片排版模式：
   - `projects/project-8.html`（MRSP）— 最複雜，有混排、aspect-ratio、video-swap、caption 等
   - `projects/project-9.html`（Sedimentary）— 有 grid-column: span 2、直式圖等
   - `projects/project-10.html`（∫<Sense>*dt）— 簡潔的 2x2 + 滿版組合

2. **讀取目前正在編輯的 project 頁面**（使用者若有指定就讀那個，否則詢問是哪一個）

3. **對照參考範例**，根據使用者描述的圖片數量與比例，提供對應的 HTML 結構。常見模式：

   **單張滿版**
   ```html
   <img src="../images/[folder]/[file].jpg" alt="" loading="lazy" style="display:block; width:100%; aspect-ratio:3/2; object-fit:cover; margin-top:5px;">
   ```

   **YouTube embed**
   ```html
   <div class="yt-wrapper" style="position:relative; padding-top:56.25%; margin-top:5px;">
       <iframe src="https://www.youtube.com/embed/[VIDEO_ID]?rel=0&iv_load_policy=3"
           title="YouTube video player" loading="lazy"
           style="border:0; position:absolute; top:0; height:100%; width:100%;"
           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
           referrerpolicy="strict-origin-when-cross-origin" allowfullscreen="true">
       </iframe>
   </div>
   ```

   **N 欄等寬 grid**（N = 2 或 3）
   ```html
   <div style="display:grid; grid-template-columns:1fr 1fr [1fr]; gap:5px; margin-top:5px;">
       <img src="../images/[folder]/[file].jpg" alt="" loading="lazy" style="width:100%; aspect-ratio:3/2; object-fit:cover;">
       <!-- 重複 N 次 -->
   </div>
   ```

   **混排（不同比例同排）**：用各自的 fr 值對齊，並在容器加 `aspect-ratio` 讓整排高度一致
   ```html
   <div style="display:grid; grid-template-columns:0.67fr 1.5fr 1.5fr; gap:5px; aspect-ratio:11/3;">
       <img src="..." style="width:100%; height:100%; object-fit:cover;">
       <!-- ... -->
   </div>
   ```

   **span（大圖跨欄）**
   ```html
   <img src="..." style="width:100%; aspect-ratio:3/4; object-fit:cover; grid-column: span 2;">
   ```

   **圖片說明（caption）**
   ```html
   <div class="project-info" style="margin-top:5px; margin-bottom:20px;">
       <p class="caption">[活動名稱] — Photos by [攝影師]</p>
   </div>
   ```

   **標籤式 grid（各圖上方有標題，可點擊切換影片）**：參考 project-8.html 的 `.labeled-grid` + `.video-swap` 寫法

4. **直接修改 HTML 檔案**，將圖片區塊寫入正確位置。圖片路徑用 `../images/[資料夾]/[檔名]`。若圖片尚未確定，使用 placeholder：
   - 3:2 → `https://placehold.co/600x400/111/666`
   - 16:9 → `https://placehold.co/960x540/111/666`
   - 1:1 → `https://placehold.co/480x480/111/666`
   - 4:3 → `https://placehold.co/640x480/111/666`
   - 2:3（直式）→ `https://placehold.co/400x600/111/666`

5. 完成後告知使用者：修改了哪個區塊、有哪些 placeholder 之後需要換成真實圖片

注意：
- 間距統一用 `gap:5px`、`margin-top:5px`
- 圖片全加 `loading="lazy"`
- 不要加 `console.log` 或多餘 error handling
- 混排容器若需要 `aspect-ratio` 計算：容器比 = 各欄比之和；以 3 欄 [2:3, 3:2, 3:2] 為例：2/3 + 3/2 + 3/2 = 11/3
