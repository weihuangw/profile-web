根據 `projects/project.html` 模板，建立一個新的作品詳情頁。

使用者提供的資訊：$ARGUMENTS

請執行以下步驟：

1. 讀取 `projects/project.html` 取得最新模板
2. 確認下一個可用的編號（讀取 projects/ 目錄，找出目前最大的 project-N 編號）
3. 建立新的 `projects/project-[N].html`，填入使用者提供的內容：
   - 標題（title tag 和 h1）
   - 類型（category）
   - 年份（year）
   - 說明文字（description）
   - 圖片路徑（相對路徑 `../images/[資料夾]/[檔名]`）
4. 如果使用者沒有提供圖片路徑，保留 placehold.co 占位圖
5. 完成後告知使用者：新檔案路徑、下一步（可用 /add-work 加入 works.html）

注意：路徑都用 `../` 開頭（因為頁面在 projects/ 子目錄）
