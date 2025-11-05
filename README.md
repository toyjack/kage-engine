# KAGE Engine

**KAGE (Kanji Automatic Generation Engine)** - 汉字自动生成引擎

一个用于根据笔画描述数据自动生成日文汉字矢量图形的 JavaScript 引擎。

## 特性

- ✅ 支持明朝体（衬线）和哥特体（无衬线）两种字体样式
- ✅ 智能笔画调整和装饰优化
- ✅ 部件复用系统
- ✅ 多种输出格式：SVG、EPS、Canvas
- ✅ 支持 ES 模块（ESM）
- ✅ 纯 JavaScript 实现，跨平台兼容

## 快速开始

### ES 模块方式（推荐）

```javascript
import { Kage, Polygons } from './src/index.js';

const kage = new Kage();
const polygons = new Polygons();

// 定义笔画数据
kage.kBuhin.push("myChar", "1:0:0:20:100:180:100$1:0:0:100:20:100:180");

// 生成字形
kage.makeGlyph(polygons, "myChar");

// 输出 SVG
const svg = polygons.generateSVG(false);
console.log(svg);
```

### 传统方式（script 标签）

```html
<script src="2d.js"></script>
<script src="buhin.js"></script>
<script src="curve.js"></script>
<script src="kage.js"></script>
<script src="kagecd.js"></script>
<script src="kagedf.js"></script>
<script src="polygon.js"></script>
<script src="polygons.js"></script>

<script>
  var kage = new Kage();
  var polygons = new Polygons();
  // ...
</script>
```

## 文档

- **[ESM 使用指南](README_ESM.md)** - ES 模块详细使用说明
- **[项目分析文档](PROJECT_ANALYSIS_CN.md)** - 完整的架构分析和 API 文档

## 示例

查看 `examples/` 目录：

- `esm-node-example.js` - Node.js 使用示例
- `esm-browser-example.html` - 浏览器使用示例
- `sample.html` - 传统方式示例
- `sample.js` - 命令行示例

## 安装

```bash
# 克隆仓库
git clone https://github.com/toyjack/kage-engine.git
cd kage-engine

# 运行 Node.js 示例
node examples/esm-node-example.js

# 或在浏览器中打开示例
# examples/esm-browser-example.html
```

## 项目结构

```
kage-engine/
├── src/              # ESM 模块源代码
│   ├── index.js      # 主入口
│   ├── kage.js       # 核心引擎
│   ├── polygons.js   # 多边形管理
│   └── ...
├── examples/         # 使用示例
├── *.js              # 原始文件（传统方式）
├── package.json      # NPM 配置
└── README.md         # 本文件
```

## API 概览

### 核心类

- `Kage` - 主引擎类，处理笔画生成和调整
- `Polygons` - 多边形集合，管理生成的图形数据
- `Polygon` - 单个多边形
- `Buhin` - 部件管理器

### 主要方法

```javascript
// 生成字形
kage.makeGlyph(polygons, buhinName)
kage.makeGlyph2(polygons, strokeData)

// 输出
polygons.generateSVG(useCurve)  // 生成 SVG
polygons.generateEPS()           // 生成 EPS

// 字体样式
kage.kShotai = kage.kMincho     // 明朝体
kage.kShotai = kage.kGothic     // 哥特体
```

## 笔画数据格式

笔画通过字符串描述：

```
类型:参数1:参数2:x1:y1:x2:y2:x3:y3:x4:y4
```

多个笔画用 `$` 分隔：

```javascript
"1:0:0:20:100:180:100$1:0:0:100:20:100:180"  // "十" 字
```

## 许可证

GPL v3 - 查看 [COPYING](COPYING) 文件

## 相关项目

- [GlyphWiki](http://glyphwiki.org/) - 汉字字形数据库
- 本引擎通常与 GlyphWiki 配合使用，作为其渲染核心

## 贡献

欢迎提交 Issue 和 Pull Request！

## 致谢

KAGE Engine 是 GlyphWiki 项目的一部分，感谢所有贡献者。
