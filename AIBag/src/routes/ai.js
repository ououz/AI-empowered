// routes/ai.js
const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/chat", async (req, res) => {
    const userMessage = req.body.message;

    try {
        const cozeRes = await axios.post(
            "https://api.coze.cn/open_api/v2/chat",
            {
                bot_id: "7494565313716027404",
                user: "test_user",
                query: userMessage,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.COZE_API_KEY}`, // ✅ 建议从 .env 读取
                    "Content-Type": "application/json",
                },
            }
        );

        const messages = cozeRes.data?.messages || [];
        let reply = "AI 没有回复内容";

        for (const msg of messages) {
            if (msg.type === "answer" && msg.content && msg.content.trim()) {
                reply = msg.content;
                break;
            }

            if (msg.content && msg.content.includes("msg_type") && msg.content.includes("wraped_text")) {
                try {
                    const parsed = JSON.parse(msg.content);
                    const data = typeof parsed.data === "string" ? JSON.parse(parsed.data) : parsed.data;
                    if (data.wraped_text && data.wraped_text.trim()) {
                        reply = data.wraped_text;
                        break;
                    }
                } catch (e) {
                    console.warn("解析结构化 msg.content 失败:", e);
                }
            }
        }

        res.json({ response: reply });
    } catch (error) {
        console.error("调用 Coze 失败：", error.response?.data || error.message);
        res.status(500).json({ error: "AI 服务出错，请稍后再试" });
    }
});

module.exports = router;
