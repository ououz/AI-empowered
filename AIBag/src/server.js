// server.js
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001
//const PORT = process.env.PORT || 3001;


app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const cozeRes = await axios.post(
      'https://api.coze.cn/open_api/v2/chat',
      {
        bot_id: '7494565313716027404',
        user: 'test_user',
        query: userMessage
      },
      {
        headers: {
          Authorization: 'Bearer pat_HNxawBZE1X7oc9cs9sOO3OiOkc2jA9gUqADTjJYKRNVVFq7rLu8Co7pWRA2dg8lI',
          'Content-Type': 'application/json'
        }
      }
    );

    console.log("Coze 返回的消息：", JSON.stringify(cozeRes.data?.messages, null, 2));
    const messages = cozeRes.data?.messages || [];
    let reply = 'AI 没有回复内容';

    for (const msg of messages) {
      // 直接找 type === 'answer' 的回复
      if (msg.type === 'answer' && msg.content && msg.content.trim()) {
        reply = msg.content;
        break;
      }

      // 兜底：有些 bot 会把文本藏在 msg.data.wraped_text 中
      if (msg.content && msg.content.includes('msg_type') && msg.content.includes('wraped_text')) {
        try {
          const parsed = JSON.parse(msg.content);
          const data = typeof parsed.data === 'string' ? JSON.parse(parsed.data) : parsed.data;
          if (data.wraped_text && data.wraped_text.trim()) {
            reply = data.wraped_text;
            break;
          }
        } catch (e) {
          console.warn('解析结构化 msg.content 失败:', e);
        }
      }
    }

    res.json({ response: reply });
  } catch (error) {
    console.error('调用 Coze 失败：', error.response?.data || error.message);
    res.status(500).json({ error: 'AI 服务出错，请稍后再试' });
  }
});

app.listen(PORT, () => {
  console.log(`服务器已启动：http://localhost:${PORT}`);
});
