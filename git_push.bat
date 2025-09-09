@echo off
chcp 65001 >nul
cd /d "E:\大三上\Project_fix"

echo ===== 添加所有修改（包含删除） =====
git add -A
echo ===== 当前状态 =====
git status

echo ===== 输入提交信息 =====
set /p msg=请输入提交信息: 

echo ===== 提交更改 =====
git commit -m "%msg%" 2>nul || echo 没有任何更改可提交

echo ===== 拉取远程最新代码 =====
git pull origin main --rebase 2>nul || echo 拉取远程代码失败或无更新

echo ===== 推送到 GitHub =====
git push origin main 2>nul || echo 推送失败，请检查网络或认证

echo ===== 更新完成 =====
pause
