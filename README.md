# 簡易登入系統

## 使用說明
啟動 mongodb 服務 ( 開啟mongod服務，用mongo查看資料庫 )

運行 app.js 

在 http://localhost:3000/ 運作

## 實現功能
1.註冊

2.登入 / 登出

3.購物車

## 使用技術
1.http 架構下的 koa 框架 (koa-session, koa-router, koa-logger, koa-static )

2.ejs engine (koa-views)

3.mongodb

4.儲存在瀏覽器的 localStorage 

## 檔案位置
app.js 為後端主程式

model.js 為 mongodb 資料庫控制程式

html 放在 view 資料夾

css 放在 public 資料夾
