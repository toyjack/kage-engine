# KAGE Engine 项目分析报告

## 项目概述

**KAGE Engine** 是一个用JavaScript编写的**汉字自动生成引擎**（Kanji Automatic Generation Engine），主要用于根据笔画描述数据自动生成日文汉字的矢量图形。

### 基本信息
- **语言**: JavaScript
- **许可证**: GNU GPL v3
- **用途**: 汉字字形生成、字体渲染
- **输出格式**: SVG、EPS、Canvas
- **坐标系统**: 200x200的标准画布

---

## 核心架构

### 1. 文件结构和职责

```
kage-engine/
├── kage.js          # 核心引擎 - 主类定义和笔画处理逻辑
├── kagedf.js        # 字体绘制 - 各种笔画类型的绘制函数
├── kagecd.js        # 曲线绘制 - 曲线类型笔画的专门处理
├── curve.js         # 曲线计算 - 贝塞尔曲线数学计算
├── polygon.js       # 多边形 - 单个多边形数据结构
├── polygons.js      # 多边形集合 - 多个多边形管理和输出
├── buhin.js         # 部件管理 - 字形组件的存储和检索
├── 2d.js            # 2D几何 - 线段交叉检测等几何计算
├── sample.html      # 浏览器示例
├── sample.js        # 命令行示例
└── COPYING          # GPL v3 许可证
```

---

## 核心概念详解

### 1. 笔画数据格式（Stroke Data）

汉字通过一系列笔画描述来定义，每个笔画是一个由冒号分隔的数字字符串：

```
类型:参数1:参数2:x1:y1:x2:y2:x3:y3:x4:y4
```

**笔画类型**（第一个参数）:
- `0`: 无操作
- `1`: 直线（线段）
- `2`: 曲线（二次贝塞尔）
- `3`: 弯曲线（带转折的曲线）
- `4`: 复杂曲线
- `6`: 贝塞尔曲线（三次）
- `7`: 曲线（另一种变体）
- `99`: 部件引用（引用其他已定义的字形）

**示例**:
```javascript
// 直线: 类型1，从(40,37)到(143,37)
"1:0:2:40:37:143:37"

// 曲线: 类型4，包含控制点
"4:22:5:143:37:12:169:170:169:175:171"

// 部件引用: 类型99，引用"u9ebb"并放置在指定位置
"99:0:0:0:0:200:200:u9ebb:0:0:0"
```

多个笔画用 `$` 符号连接：
```javascript
"1:0:2:40:37:143:37$4:22:5:143:37:12:169:170:169:175:171"
```

### 2. 坐标系统

- 标准画布大小: **200 × 200**
- 左上角为原点 (0, 0)
- X轴向右递增，Y轴向下递增
- 所有坐标都在0-200范围内

### 3. 字体样式（Shotai）

支持两种主要字体样式：

```javascript
kage.kMincho = 0;  // 明朝体（衬线体，类似宋体）
kage.kGothic = 1;  // 哥特体（无衬线体，类似黑体）
```

**明朝体**包含自动调整功能：
- **Hane（はね）**: 挑笔、钩
- **Uroko（うろこ）**: 鱼尾装饰
- **Kakato（かかと）**: 脚部装饰
- **Mage（まげ）**: 转折调整
- **Kirikuchi（きりくち）**: 笔画起始调整

### 4. 部件系统（Buhin）

**Buhin**（部品）是可重用的字形组件：

```javascript
// 定义一个部件
kage.kBuhin.push("u6c35-07", "2:7:8:42:12:99:23:124:35$2:7:8:20:62:75:71:97:85");

// 在其他字形中引用
kage.kBuhin.push("u6f22", "99:150:0:9:12:73:200:u6c35-07:0:-10:50");
```

部件支持：
- **缩放**: 根据目标区域自动缩放
- **拉伸**: 支持非等比拉伸
- **嵌套**: 部件可以引用其他部件

---

## 主要类和API

### 1. Kage 类（核心引擎）

```javascript
var kage = new Kage(size);
```

**参数**:
- `size`: 可选，1=小尺寸，其他=标准尺寸

**主要属性**:
```javascript
kage.kShotai = kage.kMincho;  // 设置字体样式
kage.kRate = 100;              // 渲染精度
kage.kUseCurve = 0;            // 是否使用曲线渲染
kage.kBuhin                    // 部件管理器
```

**主要方法**:

#### makeGlyph(polygons, buhinName)
生成指定部件的字形到polygons对象
```javascript
var polygons = new Polygons();
kage.makeGlyph(polygons, "u6f22");  // 生成"漢"字
```

#### makeGlyph2(polygons, strokeData)
直接从笔画数据生成字形
```javascript
kage.makeGlyph2(polygons, "1:0:0:20:20:180:20");
```

#### makeGlyph3(strokeData)
返回每个笔画对应的polygons数组
```javascript
var result = kage.makeGlyph3("1:0:0:20:20:180:20$1:0:0:20:180:180:180");
// result是数组，每个元素是一个Polygons对象
```

### 2. Buhin 类（部件管理）

```javascript
var buhin = new Buhin();
```

**方法**:
```javascript
// 添加部件
buhin.push("name", "strokeData");
buhin.set("name", "strokeData");

// 搜索部件
var data = buhin.search("name");  // 返回笔画数据或空字符串
```

### 3. Polygons 类（多边形集合）

```javascript
var polygons = new Polygons();
```

**方法**:

#### generateSVG(useCurve)
生成SVG格式输出
```javascript
var svg = polygons.generateSVG(false);  // 生成多边形SVG
var svg = polygons.generateSVG(true);   // 生成曲线SVG（使用二次贝塞尔）
```

#### generateEPS()
生成EPS（PostScript）格式输出
```javascript
var eps = polygons.generateEPS();
```

#### push(polygon)
添加一个多边形（自动进行有效性检查）

#### clear()
清空所有多边形

### 4. Polygon 类（单个多边形）

```javascript
var polygon = new Polygon(number);  // number: 预分配点数（可选）
```

**方法**:
```javascript
polygon.push(x, y, off);        // 添加点，off=1表示曲线控制点
polygon.set(index, x, y, off);  // 设置指定索引的点
polygon.reverse();               // 反转点的顺序
polygon.concat(anotherPolygon); // 连接另一个多边形
```

---

## 使用方法

### 方式1: 浏览器中使用（Canvas渲染）

```html
<!DOCTYPE html>
<html>
<head>
  <script src="2d.js"></script>
  <script src="buhin.js"></script>
  <script src="curve.js"></script>
  <script src="kage.js"></script>
  <script src="kagecd.js"></script>
  <script src="kagedf.js"></script>
  <script src="polygon.js"></script>
  <script src="polygons.js"></script>
  <script>
    function draw() {
      var canvas = document.getElementById("canvas");
      var ctx = canvas.getContext("2d");

      // 创建KAGE实例
      var kage = new Kage();
      var polygons = new Polygons();

      // 定义笔画数据
      kage.kBuhin.push("myChar", "1:0:0:20:20:180:20$1:0:0:20:180:180:180");

      // 生成字形
      kage.makeGlyph(polygons, "myChar");

      // 渲染到Canvas
      ctx.fillStyle = "rgb(0, 0, 0)";
      for(var i = 0; i < polygons.array.length; i++){
        ctx.beginPath();
        ctx.moveTo(polygons.array[i].array[0].x, polygons.array[i].array[0].y);
        for(var j = 1; j < polygons.array[i].array.length; j++){
          ctx.lineTo(polygons.array[i].array[j].x, polygons.array[i].array[j].y);
        }
        ctx.closePath();
        ctx.fill();
      }
    }
  </script>
</head>
<body onload="draw()">
  <canvas id="canvas" width="200" height="200"></canvas>
</body>
</html>
```

### 方式2: Node.js / SpiderMonkey / Rhino（生成SVG）

```javascript
// sample.js
load("2d.js");
load("buhin.js");
load("curve.js");
load("kage.js");
load("kagecd.js");
load("kagedf.js");
load("polygon.js");
load("polygons.js");

var kage = new Kage();
var polygons = new Polygons();

// 定义复杂汉字（例如"漢"）
kage.kBuhin.push("u6c35-07",
  "2:7:8:42:12:99:23:124:35$2:7:8:20:62:75:71:97:85$2:7:8:12:123:90:151:81:188");

kage.kBuhin.push("u26c29-07",
  "1:0:0:18:29:187:29$1:0:0:73:10:73:48$1:22:23:163:59:163:87");

kage.kBuhin.push("u6f22",
  "99:150:0:9:12:73:200:u6c35-07:0:-10:50$99:0:0:54:10:190:199:u26c29-07");

// 生成字形
kage.makeGlyph(polygons, "u6f22");

// 输出SVG
print(polygons.generateSVG(false));
```

**运行**:
```bash
# SpiderMonkey
js sample.js > output.svg

# Rhino
java -jar js.jar sample.js > output.svg
```

### 方式3: 直接使用笔画数据

```javascript
var kage = new Kage();
var polygons = new Polygons();

// 直接从笔画数据生成（不需要预定义）
var strokeData = "1:0:0:20:20:180:20$1:0:0:180:20:180:180$1:0:0:180:180:20:180$1:0:0:20:180:20:20";
kage.makeGlyph2(polygons, strokeData);

// 输出SVG
var svg = polygons.generateSVG(false);
```

### 方式4: 切换字体样式

```javascript
var kage = new Kage();

// 使用明朝体（带装饰）
kage.kShotai = kage.kMincho;
var polygons1 = new Polygons();
kage.makeGlyph(polygons1, "myChar");

// 使用哥特体（无装饰）
kage.kShotai = kage.kGothic;
var polygons2 = new Polygons();
kage.makeGlyph(polygons2, "myChar");
```

---

## 技术特点

### 1. 智能笔画调整

引擎会根据笔画之间的关系自动调整：

- **挑（Hane）调整**: 根据右侧垂直笔画的距离自动调整挑的长度
- **装饰（Uroko）调整**: 检测笔画交叉避免装饰重叠
- **脚部（Kakato）调整**: 根据下方空间调整脚部装饰大小
- **垂直笔画（Tate）调整**: 当多个垂直笔画靠近时调整粗细
- **转折（Mage）调整**: 横向笔画密集时调整转折处理

### 2. 贝塞尔曲线处理

- 支持二次和三次贝塞尔曲线
- 自动计算曲线控制点
- 可在直线和曲线模式间切换（kUseCurve）
- 曲线细分和优化算法

### 3. 几何计算

2d.js提供完整的几何工具：
- 线段交叉检测
- 点在区域内判断
- 两线交点计算
- 矩形碰撞检测

### 4. 部件拉伸算法

支持智能拉伸，参数格式：
```
sx:sy:sx2:sy2
```
- `sx/sy > 100`: 启用拉伸模式，实际值为 sx-200
- 拉伸中心点由 sx2/sy2 定义
- 支持非线性拉伸

---

## 配置参数

### 明朝体参数（标准尺寸）

```javascript
kMinWidthY: 2        // 横向笔画最小宽度
kMinWidthT: 6        // 垂直笔画最小宽度
kWidth: 5            // 标准笔画宽度
kKakato: 3           // 脚部装饰大小
kL2RDfatten: 1.1     // L2RD类型笔画加粗系数
kMage: 10            // 转折尺寸
kUseCurve: 0         // 是否使用曲线（0=否，1=是）
```

### 调整参数

```javascript
// 脚部调整
kAdjustKakatoL: [14, 9, 5, 2, 0]
kAdjustKakatoR: [8, 6, 4, 2]
kAdjustKakatoRangeX: 20
kAdjustKakatoRangeY: [1, 19, 24, 30]
kAdjustKakatoStep: 3

// 装饰调整
kAdjustUrokoX: [24, 20, 16, 12]
kAdjustUrokoY: [12, 11, 9, 8]
kAdjustUrokoLength: [22, 36, 50]
kAdjustUrokoLengthStep: 3
kAdjustUrokoLine: [22, 26, 30]

// 其他调整
kAdjustUroko2Step: 3
kAdjustUroko2Length: 40
kAdjustTateStep: 4
kAdjustMageStep: 5
```

---

## 实际应用场景

### 1. 在线汉字生成器
将笔画数据存储在数据库中，通过Web界面实时生成字形

### 2. 字体工具
批量生成汉字字形，导出为字体文件

### 3. 汉字教学
显示汉字的笔画结构，用于教学演示

### 4. 动态字形编辑
提供交互式的笔画编辑器，实时预览效果

### 5. 字形数据库
构建汉字字形数据库，支持字形检索和分析

---

## 优势与限制

### 优势
- 纯JavaScript实现，跨平台
- 矢量输出，无损缩放
- 支持部件复用，数据量小
- 自动调整算法，质量高
- 灵活的笔画定义格式

### 限制
- 需要准确的笔画数据
- 复杂汉字的数据准备工作量大
- 主要针对日文汉字优化
- 没有现成的汉字数据库（需要自行准备）

---

## 相关项目

这个引擎通常与 **GlyphWiki** 项目配合使用：
- GlyphWiki 是一个开源汉字字形数据库
- 包含大量预定义的笔画数据
- KAGE引擎是其渲染核心

---

## 示例：创建简单汉字"十"

```javascript
// 创建引擎实例
var kage = new Kage();
var polygons = new Polygons();

// "十"字由一横一竖组成
// 横: 从(20, 100) 到 (180, 100)
// 竖: 从(100, 20) 到 (100, 180)
var strokeData = "1:0:0:20:100:180:100$1:0:0:100:20:100:180";

// 生成字形
kage.makeGlyph2(polygons, strokeData);

// 输出SVG
var svg = polygons.generateSVG(false);
console.log(svg);
```

---

## 总结

KAGE Engine 是一个功能强大的汉字生成引擎，特别适合：
- 需要动态生成汉字字形的应用
- 汉字教学和研究
- 字体设计和自动化生成
- 汉字数据库和检索系统

通过灵活的笔画定义和智能调整算法，它能够生成高质量的汉字矢量图形。虽然需要准备详细的笔画数据，但其部件系统大大减少了工作量。

---

## 快速开始检查清单

- [ ] 下载所有JS文件到同一目录
- [ ] 按正确顺序加载所有依赖（见sample.html）
- [ ] 创建Kage和Polygons实例
- [ ] 准备或定义笔画数据
- [ ] 使用kBuhin.push()注册部件
- [ ] 调用makeGlyph()生成字形
- [ ] 通过generateSVG()或Canvas渲染输出

祝使用愉快！
