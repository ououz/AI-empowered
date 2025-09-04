# AIBag 部署与维护手册

## 一、准备环境
1. **代码结构**
   ```
   AIBag/
   ├─ package.json   （已修改 start 为 node src/server.js）
   └─ src/
      ├─ server.js   （后端，Express）
      ├─ index.html  （首页）
      ├─ search.html （聊天页面）
      └─ ...其他静态文件
   ```

2. **必须修改**
   - 在 `src/server.js` 里找到：
     ```js
     "Authorization": "Bearer your-api-key"
     ```
     替换成你自己的 **Coze API Key**。

---

## 二、本地运行
1. 进入目录：
   ```bash
   cd AIBag
   npm install
   npm start
   ```
2. 启动成功后访问：
   ```
   http://localhost:3001/index.html
   http://localhost:3001/search.html
   ```

---

## 三、部署到云端（推荐 Render 免费服务）
### 1. 注册
- 打开 [https://render.com](https://render.com)  
- 用 GitHub 账号登录  

### 2. 上传代码
1. 把 `AIBag` 文件夹推到你自己的 GitHub 仓库。  
2. 在 Render 新建 **Web Service**。  
   - 选择 GitHub 仓库  
   - Branch: `main`  
   - Root directory: `AIBag`  
   - Build command:  
     ```bash
     npm install
     ```
   - Start command:  
     ```bash
     npm start
     ```

### 3. 环境变量
在 Render 的 **Environment → Environment Variables** 里添加：  
```
COZE_API_KEY = 你的Coze API Key
PORT = 10000
```
（然后在 `server.js` 里用 `process.env.COZE_API_KEY` 替代硬编码）

### 4. 部署
- 部署完成后，会得到一个类似：
  ```
  https://aibag.onrender.com
  ```
- 直接访问：
  ```
  https://aibag.onrender.com/index.html
  https://aibag.onrender.com/search.html
  ```

---

## 四、维持时间
- **Render 免费版**：服务如果 15 分钟没访问会休眠，重新访问会自动唤醒。  
- **免费额度**：每月大概 750 小时（相当于一个服务全天运行）。  
- 所以你能 **长期免费用**，不会只维持几天。  

如果 Render 免费版不够用，可以：
- 腾讯云 / 阿里云 服务器（便宜，但要自己运维）  
- Vercel（更适合纯静态，不太适合 Node 后端）

---

## 五、后续快速复做流程（失效时重来）
只要记住 3 步：  
1. `git clone` 拉取代码  
2. 设置环境变量（COZE_API_KEY, PORT）  
3. `npm install && npm start` 或者重新在 Render 部署  
