在 `works.html` 的作品網格中新增一個作品項目。

使用者提供的資訊：$ARGUMENTS

請執行以下步驟：

1. 讀取 `works.html`，找到 `<div class="work-grid">` 區塊
2. 在網格**最前面**（第一個位置）插入新的作品項目，格式如下：
```html
<!-- 作品 [名稱] -->
<a href="projects/project-[N].html" class="work-item">
    <img src="images/[資料夾]/[封面圖].jpg" alt="[作品名]">
    <div class="work-info">
        <span class="work-title">[作品名]</span>
        <span class="work-type">[類型]</span>
    </div>
</a>
```
3. 如果沒有提供封面圖路徑，使用 `https://placehold.co/600x400/EEE/31343C`
4. 完成後告知使用者修改了哪一行、預覽效果描述

注意：最新作品放最前面（視覺上排列在左上角）
