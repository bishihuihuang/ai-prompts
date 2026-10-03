# AI 提示词库（ai-prompts）

纯静态 PWA 提示词管理器：55 套内置提示词 · 24 主题 · 本地存储（localStorage），部署于 GitHub Pages。

**线上地址**：https://bishihuihuang.github.io/ai-prompts/

## 功能

- 提示词的增删改、置顶、标签分类、状态标记、搜索高亮、分页
- 24 套主题（背景图位于 `AI提示词系统/assets/`，按需加载）
- 数据导出 / 导入（JSON），自动备份
- PWA：可安装、离线可用（Service Worker 缓存）

## 目录结构（发布仓库）

```
index.html                     入场动画入口（同会话仅首次播放）
manifest.json / sw.js / favicon.svg   PWA 四件套
AI提示词系统/
  AI提示词管理.html            主应用（JS 经混淆）
  assets/bg-*.jpg              主题背景图（HTML 仅 0.2MB，图片按需加载）
  default_prompts.json         内置默认提示词数据
```

## 构建与发布

源文件不在本仓库，维护流程见本地工作目录的《说明.txt》：改「原版源文件」→ 双击一键发布脚本（混淆 + 提交 + 推送）。

Service Worker 缓存名 `ai-prompts-<构建时间戳>`，每次发版自动换新缓存；页面走网络优先，用户正常刷新即可获得新版，无需强刷。

## 本地预览

双击源 HTML 即可（无需服务器）；assets 需与 HTML 同目录。
