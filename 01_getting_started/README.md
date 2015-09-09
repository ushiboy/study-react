# Getting Started

進行の都合上、公式のスターターキットを使わずに、npmモジュールで代用します。

参考元URL: https://facebook.github.io/react/docs/getting-started-ja-JP.html

最初に動作環境をセットアップ。動作環境を起動。
```
$ cd 01_getting_started
$ npm install
$ npm run start
```

お好みのブラウザで http://localhost:8080 を開いて「Hello,world!」が表示されれば環境は準備完了。

### Hello World

ReactによるHello Worldの書き方。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Hello React</title>
    <script src="node_modules/react/dist/react.js"></script>
    <script src="node_modules/react/dist/JSXTransformer.js"></script>
  </head>
  <body>
    <div id="example"></div>
    <script type="text/jsx">
      React.render(
        <h1>Hello, world!</h1>,
        document.getElementById('example')
      );
    </script>
  </body>
</html>
```

JSXについて詳しくは
URL: https://facebook.github.io/react/docs/jsx-in-depth-ja-JP.html

### ファイルの分割

リポジトリからクローンした直後のファイルはこの状態になってます。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Hello React</title>
    <script src="node_modules/react/dist/react.js"></script>
    <script src="node_modules/react/dist/JSXTransformer.js"></script>
  </head>
  <body>
    <div id="example"></div>
    <script type="text/jsx" src="src/hello.js"></script>
  </body>
</html>
```

```javascript
// src/hello.js
React.render(
  <h1>Hello, world!</h1>,
  document.getElementById('example')
);
```

### オフラインでの変換

```
$ npm run jsx
```

index.htmlを次のように変更し、変換後のdist/hello.jsファイルでも表示されることを確認。
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Hello React</title>
    <script src="node_modules/react/dist/react.js"></script>
  </head>
  <body>
    <div id="example"></div>
    <script type="text/javascript" src="dist/hello.js"></script>
  </body>
</html>
```

変換後のdist/hello.jsを確認。
```javascript
React.render(
  React.createElement("h1", null, "Hello, world!"),
  document.getElementById('example')
);
```

### JSXTransformerとReact-Toolsについて

すでに非推奨。

参考: http://facebook.github.io/react/blog/2015/06/12/deprecating-jstransform-and-react-tools.html

今後はBabelで。

TypeScriptもJSXのコンパイル対応するようです。
http://www.infoq.com/news/2015/09/typescript16-react
