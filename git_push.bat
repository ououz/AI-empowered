@echo off
chcp 65001 >nul
cd /d "E:\大三上\Project_fix"

echo ===== 添加所有修改（包含删除） =====
git add -A

echo ===== 输入提交信息 =====
set /p msg=请输入提交信息: 

echo ===== 提交更改 =====
git commit -m "%msg%"

echo ===== 推送到 GitHub =====
git push origin main

echo ===== 更新完成 =====
pause
