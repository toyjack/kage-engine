# KAGE Engine - ESM Module 使用指南

KAGE Engine 现已支持 ES 模块（ESM）格式，可以通过 `import` 语句直接导入使用。

## 快速开始

### 安装

```bash
npm install kage-engine
```

或者直接在项目中使用（无需安装）：

```bash
git clone https://github.com/toyjack/kage-engine.git
```

## 使用方法

### 方法 1: Node.js 环境

```javascript
import { Kage, Polygons } from 'kage-engine';

// 创建 KAGE 实例
const kage = new Kage();
const polygons = new Polygons();

// 定义笔画数据（例如："十"字）
const strokeData = "1:0:0:20:100:180:100$1:0:0:100:20:100:180";

// 生成字形
kage.makeGlyph2(polygons, strokeData);

// 输出 SVG
const svg = polygons.generateSVG(false);
console.log(svg);
```

### 方法 2: 浏览器环境（使用 script type="module"）

```html
<!DOCTYPE html>
<html>
<head>
  <title>KAGE Engine Example</title>
</head>
<body>
  <canvas id="canvas" width="200" height="200"></canvas>

  <script type="module">
    import { Kage, Polygons } from './src/index.js';

    const kage = new Kage();
    const polygons = new Polygons();

    // 定义字形数据
    kage.kBuhin.push("myChar", "1:0:0:20:100:180:100$1:0:0:100:20:100:180");

    // 生成字形
    kage.makeGlyph(polygons, "myChar");

    // 渲染到 Canvas
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black';

    for(let i = 0; i < polygons.array.length; i++){
      ctx.beginPath();
      ctx.moveTo(polygons.array[i].array[0].x, polygons.array[i].array[0].y);
      for(let j = 1; j < polygons.array[i].array.length; j++){
        ctx.lineTo(polygons.array[i].array[j].x, polygons.array[i].array[j].y);
      }
      ctx.closePath();
      ctx.fill();
    }
  </script>
</body>
</html>
```

### 方法 3: 使用构建工具（Vite、Webpack、Rollup）

```javascript
// main.js
import { Kage, Polygons } from 'kage-engine';

const kage = new Kage();
const polygons = new Polygons();

// 使用示例
kage.kBuhin.push("char", "1:0:0:20:20:180:20");
kage.makeGlyph(polygons, "char");

// 生成 SVG 字符串
const svgString = polygons.generateSVG(false);
```

## API 导出

### 主要类

```javascript
import {
  Kage,      // 核心引擎类
  Polygons,  // 多边形集合类
  Polygon,   // 单个多边形类
  Buhin      // 部件管理类
} from 'kage-engine';
```

### 几何工具函数

```javascript
import {
  point,
  getCrossPoint,
  isCross,
  isCrossBox,
  isCrossBoxWithOthers,
  isCrossWithOthers
} from 'kage-engine';
```

### 曲线计算函数

```javascript
import {
  divide_curve,
  calculateBezier,
  find_offcurve,
  get_candidate
} from 'kage-engine';
```

### 绘制函数（高级用法）

```javascript
import {
  cdDrawCurveU,
  cdDrawBezier,
  cdDrawCurve,
  cdDrawLine,
  dfTransform,
  dfDrawFont
} from 'kage-engine';
```

## 导入特定模块

你也可以导入特定的模块：

```javascript
// 只导入 Kage 类
import { Kage } from 'kage-engine/kage';

// 只导入 Polygons 类
import { Polygons } from 'kage-engine/polygons';

// 只导入几何工具
import { isCross, getCrossPoint } from 'kage-engine/2d';
```

## 完整示例

### 生成汉字 "漢" 并输出 SVG

```javascript
import { Kage, Polygons } from 'kage-engine';
import { writeFileSync } from 'fs';

const kage = new Kage();
const polygons = new Polygons();

// 定义部件
kage.kBuhin.push("u6c35-07",
  "2:7:8:42:12:99:23:124:35$2:7:8:20:62:75:71:97:85$2:7:8:12:123:90:151:81:188"
);

kage.kBuhin.push("u26c29-07",
  "1:0:0:18:29:187:29$1:0:0:73:10:73:48$1:0:0:132:10:132:48"
);

kage.kBuhin.push("u6f22",
  "99:150:0:9:12:73:200:u6c35-07:0:-10:50$99:0:0:54:10:190:199:u26c29-07"
);

// 生成字形
kage.makeGlyph(polygons, "u6f22");

// 输出 SVG
const svg = polygons.generateSVG(false);
writeFileSync('kanji.svg', svg);
console.log('SVG 已保存到 kanji.svg');
```

### 切换字体样式

```javascript
import { Kage, Polygons } from 'kage-engine';

const kage = new Kage();

// 使用明朝体（默认，带装饰）
kage.kShotai = kage.kMincho;
const minchoPolygons = new Polygons();
kage.makeGlyph2(minchoPolygons, "1:0:0:20:100:180:100");

// 使用哥特体（无装饰）
kage.kShotai = kage.kGothic;
const gothicPolygons = new Polygons();
kage.makeGlyph2(gothicPolygons, "1:0:0:20:100:180:100");

// 比较两种样式
console.log('明朝体:', minchoPolygons.generateSVG(false));
console.log('哥特体:', gothicPolygons.generateSVG(false));
```

## 项目结构

```
kage-engine/
├── src/
│   ├── index.js      # 主入口文件
│   ├── kage.js       # 核心引擎
│   ├── polygons.js   # 多边形集合
│   ├── polygon.js    # 单个多边形
│   ├── buhin.js      # 部件管理
│   ├── 2d.js         # 几何工具
│   ├── curve.js      # 曲线计算
│   ├── kagecd.js     # 曲线绘制
│   └── kagedf.js     # 字体绘制
├── examples/
│   ├── esm-node-example.js        # Node.js 示例
│   └── esm-browser-example.html   # 浏览器示例
├── package.json
└── README_ESM.md
```

## 兼容性

### Node.js
- 需要 Node.js 12.20.0+ 或 14.13.1+ 或 16.0.0+
- 支持原生 ESM（`"type": "module"` in package.json）

### 浏览器
- 支持所有现代浏览器（Chrome 61+, Firefox 60+, Safari 11+, Edge 16+）
- 使用 `<script type="module">` 标签

### 构建工具
- ✅ Vite
- ✅ Webpack 5
- ✅ Rollup
- ✅ esbuild
- ✅ Parcel 2

## 示例文件

查看 `examples/` 目录获取更多示例：

- `esm-node-example.js` - Node.js 环境使用示例
- `esm-browser-example.html` - 浏览器环境使用示例

运行 Node.js 示例：

```bash
node examples/esm-node-example.js
```

运行浏览器示例：

```bash
# 使用任何静态服务器，例如：
npx serve .
# 然后访问 http://localhost:3000/examples/esm-browser-example.html
```

## 从旧版本迁移

如果你之前使用的是非 ESM 版本（通过 `<script>` 标签加载），迁移到 ESM 版本非常简单：

### 旧版本（script 标签）

```html
<script src="2d.js"></script>
<script src="buhin.js"></script>
<script src="kage.js"></script>
<!-- ... 其他文件 -->

<script>
  var kage = new Kage();
  // ...
</script>
```

### 新版本（ESM）

```html
<script type="module">
  import { Kage, Polygons } from './src/index.js';

  const kage = new Kage();
  // ...
</script>
```

## 常见问题

### Q: 能否在 CommonJS 项目中使用？

A: 可以，但需要使用动态 import：

```javascript
// CommonJS
(async () => {
  const { Kage, Polygons } = await import('kage-engine');
  const kage = new Kage();
  // ...
})();
```

### Q: 如何在 TypeScript 中使用？

A: 目前还没有 TypeScript 类型定义，但你可以这样使用：

```typescript
// @ts-ignore
import { Kage, Polygons } from 'kage-engine';

const kage: any = new Kage();
```

### Q: 支持 tree-shaking 吗？

A: 支持！使用具名导入可以让打包工具自动去除未使用的代码：

```javascript
// 只导入需要的部分
import { Kage } from 'kage-engine/kage';
import { Polygons } from 'kage-engine/polygons';
```

## 许可证

GPL v3 - 查看 [COPYING](COPYING) 文件获取详情。

## 相关资源

- [项目主页](https://github.com/toyjack/kage-engine)
- [GlyphWiki](http://glyphwiki.org/) - 汉字字形数据库
- [完整文档](PROJECT_ANALYSIS_CN.md) - 详细的项目分析和使用说明
