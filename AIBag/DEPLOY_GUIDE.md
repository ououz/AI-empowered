# AIBag 部署指南

本文档介绍如何在本地运行项目、推送到 GitHub，并部署到 Render 平台。

---

## 🖥️ 一、本地运行

### 1. 安装依赖
```bash
cd AIBag
npm install
```

### 2. 启动服务
```bash
npm start
```

如果成功，会看到输出：
```
服务器已启动: http://localhost:3001
```

然后在浏览器访问：
```
http://localhost:3001/search.html
```

---

## 🌐 二、推送到 GitHub

### 1. 初始化 git（第一次执行）
```bash
git init
git remote add origin https://github.com/<你的用户名>/AIBag.git
```

### 2. 设置 Git 用户信息（只需执行一次）
```bash
git config --global user.name "你的GitHub用户名"
git config --global user.email "你的GitHub绑定邮箱"
```

### 3. 推送代码
```bash
git add .
git commit -m "Initial commit: upload AIBag project"
git branch -M main
git push -u origin main
```

推送完成后，你可以在 GitHub 仓库里看到项目代码。

---

## 🚀 三、部署到 Render

### 1. 注册并登录
- 打开 [Render 官网](https://render.com/)  
- 使用 GitHub 登录，并授权 Render 访问你的仓库。

### 2. 新建 Web Service
- 控制台 → New + → **Web Service**  
- 选择你的 `AIBag` 仓库  

### 3. 配置部署参数
- **Branch**: `main`  
- **Root Directory**: `AIBag`  
- **Build Command**:
  ```bash
  npm install
  ```
- **Start Command**:
  ```bash
  npm start
  ```

### 4. 修改端口配置
在 `src/server.js` 中，将端口设置为：
```js
const PORT = process.env.PORT || 3001;
```

这样本地运行用 `3001`，Render 会自动使用分配的端口。

### 5. 部署成功
部署完成后，Render 会提供一个公开地址，例如：
```
https://your-app-name.onrender.com
```

---

## 🔄 四、更新代码

每次修改代码后，只需要：
```bash
git add .
git commit -m "update: 修复xxx"
git push origin main
```

Render 会自动重新部署最新版本。

---

## ❗ 五、常见问题

1. **本地能跑，Render 打不开？**  
   - 确认 `server.js` 里用了 `process.env.PORT`  
   - 确认 `Root Directory` 填的是 `AIBag`  

2. **推送时提示 `Author identity unknown`？**  
   - 需要先设置：
     ```bash
     git config --global user.name "你的用户名"
     git config --global user.email "你的邮箱"
     ```

3. **前端请求接口报错？**  
   - 检查 `fetch("/api/chat")` 的路径，Render 部署后必须用相对路径（不要写 localhost）。

---

✅ 至此，你的项目就能在本地和 Render 上正常运行啦。
