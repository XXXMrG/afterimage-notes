# Afterimage Notes / 余像札记

一个轻量的 AI 文化海报档案：记录 AI 如何理解一首歌、一部电影或一本书，并把这种理解转译成不同视觉系统的海报。

## Archive model

- **作品**：歌曲、电影或书籍的基本信息与简短内容背景
- **视觉诠释**：一张海报、一段与该版本对应的 AI 理解
- **视觉系统**：同一作品可拥有多个风格版本
- **浏览方式**：编辑式档案首页承担浏览、筛选和快速预览；每件作品拥有独立全页面详情
- **阅读层级**：详情页突出当前视觉版本的 AI 解读，作品背景作为低干扰的事实注释
- **扩展策略**：首页目录可继续增加分册或分页，详情页结构不随馆藏数量增长

当前包含 7 件作品、10 张海报和 2 套视觉系统：

1. **纸上余白 / Paper Zine** — 暖灰纸、大留白、单色锚与扫描印痕
2. **限色丝印 / Limited Screenprint** — 二至四色平涂、负形双关与套色偏移

第二套视觉系统的生成规则参考社区 MIT Skill [qiaomu-mondo-poster-design](https://github.com/joeseesun/qiaomu-mondo-poster-design)，仅迁移有限色丝网印刷、象征物与负形构图等通用语法；前台不使用项目品牌或具体艺术家模仿标签。

## Stack

- Astro
- TypeScript
- Native CSS
- 少量原生客户端 JavaScript
- Netlify static hosting

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

图片和文字均作为静态内容保存在仓库中；站点不收集数据，也不使用分析脚本。
