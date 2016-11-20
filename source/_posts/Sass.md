---
title: Sass (Syntactically Awesome StyleSheets)
---
[在线转换工具](http://www.sassmeister.com/)
[编译工具](http://koala-app.com/)
## 语法

Sass 有两种语法。
*  SCSS (Sassy CSS)，是一个 CSS3 语法的扩充版本，文件以 .scss 扩展名。
* 第二种比较老的语法成为缩排语法（或者就称为 "Sass"），文件以 .sass 扩展名。

只要使用 sass-convert 命令行工具，就可以将一种语法转换为另一种语法
```bash
# 将 Sass 转换为 SCSS
$ sass-convert style.sass style.scss
# 将 SCSS 转换为 Sass
$ sass-convert style.scss style.sass
```
*不需要编译的文件或文件夹可加前缀下划线*

## 安装
第一步安装Ruby,启动ruby命令行工具。[下载地址](https://pan.baidu.com/s/1cHwUJG)
```
gem install sass
```

## 用法

### 嵌套
```sass
.parent {
  color: #00ff00;

  .child {
    background-color: #ff0000;
  }
}
// 属性嵌套
.funky {
  font: {
    family: fantasy;
    size: 30em;
    weight: bold;
  }
}
```
*跳出嵌套可以用 `@at-root` 也可以使用@at-root和without在媒体查询的时候实现另一种样式*
```sass
@media print {
    .page {
        width: 8in;
        @at-root (without: media) {
            width: 960px;
        }
    }
}
```

### 引用父选择符： &,可用于BEM规则，如：
```sass
.block {
  width: 97%;

  &-element {
    color: #000;
  }
  &.modify{
    color:#f00;
  }
}
```
*弊端在于sourcemap无法准确定位，优势在于组件化*

### 继承
1. %占位符
```sass
  #context a%extreme {
    color: blue;
    font-weight: bold;
    font-size: 2em;
  }
  .notice{
    @extend %extreme;
  }
```

2. 选择器
```sass
  .error {
    border: 1px #f00;
    background-color: #fdd;
  }
  .seriousError {
    @extend .error;
    border-width: 3px;
  }
```

### mixin
```sass
  @mixin firefox-message($selector) {
    body.firefox #{$selector}:before {
      content: "Hi, Firefox users!";
    }
  }

  @include firefox-message(".header");
```

### 变量
1. 通常
```sass
  $blue : #1875e7;　
　　div {
　　　color : $blue;
　　}
```
2. default应用
```sass
  // 设置默认值，可用于局部变量的重新申明。
  $color:red;
  $color:blue !default;
  p{
      color:$color;//red
  }
  //申明$imgStylePadding为5px
  $imgStylePadding:  5px;

  //导入_imgstyle.scss
  @import 'imgstyle';
```

3. ...应用
```sass
  // 变量后面加...
  // 如box-shadow:0 0 3px rgba(0,0,0,0.3),inset 0 0 3px rgba(255,255,255,0.3);
  @mixin box-shadow($shadow...){
    -webkit-box-shadow:$shadow;
    -moz-box-shadow:$shadow;
    box-shadow:$shadow;
  }
```

4. #{}应用
```sass
  // 变量用#{}包裹
  // 如果用在属性或者选择器上，就得以#{}包裹起来了。
  // $btnClass: btn !default;
  $borderDirection:  top !default;

  .#{$btnClass}{
      border-#{$borderDirection}:1px solid #ccc;
  }
```

5. 多个变量一起申明，然后通过nth($var,index)
```sass
  $linkColor: red blue !default;

  a{
    color:nth($linkColor,1);

    &:hover{
        color:nth($linkColor,2);
    }
  }
```

### 计算功能
```sass
body {
　　　　margin: (14px/2);
　　　　top: 50px + 100px;
　　　　right: $var * 10%;
　　}
```

### 注释
多行注释`/* */`编译后可保留 and 单行注释`//`编译后被删除



```
两个*包裹表示粗体 一个表示斜体 底线 _ 可转换为<em>
```

### 代码引用

```
单行用`包裹 多行可将```置于首末行
```

### 控制指令

`@if`
```sass
  p {
    @if 1 + 1 == 2 { border: 1px solid;  }
    @if 5 < 3      { border: 2px dotted; }
    @if null       { border: 3px double; }
  }
```

`@for`
```sass
  @for $i from 1 through 3 {
  .item-#{$i} { width: 2em * $i; }
  }
```

`@each`
```sass
  @each $animal in puma, sea-slug, egret, salamander {
    .#{$animal}-icon {
      background-image: url('/images/#{$animal}.png');
    }
  }
```

`@while`
```sass
  $i: 6;
  @while $i > 0 {
    .item-#{$i} { width: 2em * $i; }
    $i: $i - 2;
  }
```

### 函数

```sass
$grid-width: 40px;
$gutter-width: 10px;

@function grid-width($n) {
  @return $n * $grid-width + ($n - 1) * $gutter-width;
}

#sidebar { width: grid-width(5); }
```
