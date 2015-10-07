# BabelでES6な書き方に挑戦

## Commentコンポーネント

まずCommentコンポーネントを題材に書き換え。

```javascript
// src/Comment.js
import React from 'react';
import marked from 'marked';

export default class Comment extends React.Component {

  render() {
    let rawMarkup = marked(this.props.children.toString(), { sanitize: true });
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
    );
  }

}
```

### class構文を利用

##### クラス定義と継承

https://babeljs.io/docs/learn-es2015/#classes

private, publicなどのアクセス修飾子はなし。

class構文で定義したクラスをnewなしでインスタンス生成しようとするとエラーになる。

継承を行った場合、子クラスのコンストラクタ内でsuperを呼ぶ前にthisにアクセスするとエラーになる。
子クラスのコンストラクタを省略すると、渡された引数を親クラスのコンストラクタに直接渡すことになる。

```javascript
// クラスの定義
class Animal {

  // コンストラクタ
  constructor(name) {
    // プロパティ
    this.name = name;
  }

  // インスタンスメソッド
  greet() {
    console.log("Hello, I'm " + this.name);
  }

  // スタティックメソッド
  static create(name) {
    return new Animal(name);
  }
}

// 継承
class Person extends Animal {

  constructor(name) {
    // 親のコンストラクタ呼び出し（明示的な呼び出しが必要）
    super(name);
  }

  greet() {
    // 親のメソッド呼び出し
    super.greet();
  }
}
```

##### Reactコンポーネントのクラスの作り方

React.Componentクラスを継承してクラスを作る。

### ブロックスコープ

##### letとconstによるブロックスコープ変数の定義

https://babeljs.io/docs/learn-es2015/#let-const

letとconstはブロックスコープな宣言ができる。
letは再代入可、constは再代入不可。

### モジュール

##### モジュール定義と読み込み

https://babeljs.io/docs/learn-es2015/#modules

名前付きエクスポートとインポート
```javascript
// module.js
export var foo = 'foo';
export function bar() {};
export class Baz {
  baz() {}
}

// import.js
import { foo, bar, Baz} from './module';
console.log(foo); // foo
bar();
new Baz();

import { foo as poo} from './module';
console.log(poo); // foo

import * as module from './module';
console.log(module.foo); // foo
```

デフォルトエクスポート
```javascript
// foo.js
export default 'foo';

// bar.js
export default function() {
  console.log('bar');
};

// baz.js
export default class {
  baz() {
    console.log('baz')
  }
}

// import.js
import a from './foo';
import b from './bar';
import c from './baz';
console.log(a); // foo
b(); // bar
new c().baz(); // baz
```

名前付きエクスポートとデフォルトエクスポートの合わせ技

```javascript
// a.js
export default "hoge";
export var aaa = 'bbb';

/// b.js
import hoge, { aaa } from './a';

console.log(hoge);
console.log(aaa);
```

## CommentListコンポーネント

CommentListを書き換え。

```javascript
// src/CommentList.js
import React from 'react';
import Comment from './Comment';

export default class CommentList extends React.Component {

  render() {
    let commentNodes = this.props.data.map(comment => {
      return (
        <Comment key={comment.id} author={comment.author}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }

}
```

### アロー関数

##### アロー関数とthisの補足

https://babeljs.io/docs/learn-es2015/#arrows-and-lexical-this

```javascript

var a = (a, b) => {
  return a + b;
};

// {}, return 省略
var b = (a, b) => a + b;

// (), {}, return 省略
var c = n => n * n;

// 引数がない場合()は省略不可
var d = () => { return 123; };

// thisの補足
var hoge = {
  name: 'test',
  foo: function() {
    setTimeout(() => {
      // thisはhogeになる
      console.log(this.name);
    }, 1000);
  }
}
```

## CommentFormコンポーネント

CommentFormの書き換え。

```javascript
// src/CommentForm.js
import React from 'react';

export default class CommentForm extends React.Component {

  handleSubmit(e) {
    e.preventDefault();
    let author = React.findDOMNode(this.refs.author).value.trim();
    let text = React.findDOMNode(this.refs.text).value.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({ author: author, text: text });
    React.findDOMNode(this.refs.author).value = '';
    React.findDOMNode(this.refs.text).value = '';
    return;
  }

  render() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit.bind(this)}>
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something..." ref="text" />
        <input type="submit" value="Post" />
      </form>
    );
  }

}
```

##### （つまづきポイント）ハンドラに渡すメソッドのthis

実はReact#createClassには[autoBinding機能](https://github.com/facebook/react/blob/0.13-stable/src/classic/class/ReactClass.js#L694)があった。

React#createClassで生成されたコンポーネントはこれによりメソッドのthisが補足されていたが、
ES6のclassシンタックスで書くと標準通りになるのでthisを明示的に指定する必要がある。

今回はオーソドックスにFunction#bindを利用してthis.handleSubmitのthisを束縛している。

他の方法は[こちら](http://blog.shouldbee.at/2015/07/06/prevent-undefiend-this-in-react/)を参照。

## CommentBoxコンポーネント

CommentBoxの書き換え。

```javascript
// src/CommentBox.js
import React from 'react';
import $ from 'jquery';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

export default class CommentBox extends React.Component {

  constructor() {
    super();
    this.state =  { data: [] };
  }

  loadCommentsFromServer() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: data => {
        this.setState({data: data});
      },
      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString());
      }
    });
  }

  handleCommentSubmit(comment) {
    let comments = this.state.data;
    let newComments = comments.concat([comment]);
    this.setState({ data: newComments });
    $.ajax({
      url: this.props.url,
      contentType: 'application/json',
      dataType: 'json',
      type: 'POST',
      data: JSON.stringify(comment),
      success: data => {
        this.setState({data: comments.concat([data])});
      },
      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString());
      }
    });
  }

  componentDidMount() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer.bind(this), this.props.pollInterval);
  }

  render() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit.bind(this)} />
      </div>
    );
  }
}
```

ライフサイクルメソッドgetInitialStateはES6のclassシンタックスでは使えない。
そのため、コンストラクタ内で初期化を行う。

こちらでもsetIntervalに渡すloadCommentsFromServerメソッドのthisをbindで指定する。


## エントリポイントの書き換え

entryの書き換え

```javascript
// src/entry.js
import React from 'react';
import CommentBox from './CommentBox';

React.render(
  <CommentBox url="/api/comments" pollInterval={2000} />,
  document.getElementById('content')
);
```
