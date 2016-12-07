---
title: Bootstrap4
---
## Grid Layout
  * `container container-fluid`
    ```css
      /*$grid-breakpoints: (
        xs: 0,
        sm: 576px,
        md: 768px,
        lg: 992px,
        xl: 1200px
      ) !default;

      $container-max-widths: (
        sm: 540px,
        md: 720px,
        lg: 960px,
        xl: 1140px
      ) !default;*/

      @meida(min-width:1200px){width: 1140px;max-width:100%;};xl
      @meida(min-width:992px){width: 960px;max-width:100%;};lg
      @meida(min-width:768px){width: 720px;max-width:100%;};md
      @meida(min-width:576px){width: 540px;max-width:100%;};sm
      .container{
        padding-left: 15px;
        padding-right: 15px;
        margin-left: auto;
        margin-right: auto;
      }
      /*container-fluid: width:100%;*/
    ```
  * `row`
    ```css
      .row{
        margin-bottom: 1rem;
        margin-left: -15px;
        margin-right: -15px;
      }
    ```

  * `col-?-?`
    ```css
      /*col-xs-1:
      col-sm-1:540px
      col-md-1:720px
      col-lg-1:960px
      col-xl-1:1140px    */
      .col-md-12`{
        padding-left: 15px;
        padding-right: 15px;
      }
    ```

  * `offset-xs-0`
    ```css
      .offset-xs-?{
        margin-left:?/12;
      }
    ```

  * `pull-xs-0`
    ```css
      .offset-xs-?{
        right:?/12;
      }
    ```

  * `push-xs-0`
    ```css
      .offset-xs-?{
        left:?/12;
      }
    ```

## Type
*`<h1> 到 <h6>` 均可使用，还提供了 .h1 到 .h6 类，为的是给内联（inline）属性的文本赋予标题的样式
* 在标题内还可以包含 `<small>` 标签或赋予 `.small` 类的元素，可以用来标记副标题
* 通过添加 `.lead` 类可以让段落突出显示。
* 文本高亮可用`<mark>`
* 被删除的文本可用`<del>`
* 对于没用的文本使用`<s>`标签
* 插入文本`<ins>`
* 带下划线的文本`<u>`
* 小号文本`<small>`
* 着重`<strong>`
* 斜体`<em>`
* 缩略语`<abbr>` 元素设置`title`属性。
* 为缩略语添加 `.initialism` 类，可以让 `font-size` 变得稍微小些
* `display-? (1-4)`字体变大
* `.list-unstyled `移除li样式
* `.list-inline-item`li转为内联
* '<dl><dt><dd>'带有描述的短语列表
