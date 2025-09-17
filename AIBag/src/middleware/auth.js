const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
    const h = req.headers.authorization || "";
    const token = h.startsWith("Bearer ") ? h.slice(7) : null;
    if (!token) return res.status(401).json({ msg: "未登录" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret_key");
        req.user = { id: decoded.userId };
        next();
    } catch {
        return res.status(401).json({ msg: "Token 无效或已过期" });
    }
};
