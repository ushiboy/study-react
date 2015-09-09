# Tutorial

React公式のチュートリアルを元に、進行の都合上JSXTransformerを使わない方式にソースを変えてあります。

参考元URL: https://facebook.github.io/react/docs/tutorial-ja-JP.html

最初に環境のセットアップ。動作確認環境を起動。
```
$ cd 02_tutorial
$ npm install
$ npm run gulp
```
お好みのブラウザで http://localhost:8080 を開いて、「Hello, world! I am a CommentBox.」が表示されたら環境の起動は完了。

### 始めてみましょう

##### 公式との差異について

開始直後のindex.htmlファイルは次のようになっています。

script[src="dist/main.js"]は、srcディレクトリ配下のJavaScriptファイルを依存関係含めてビルド（JSXを変換）したものを参照しています。

公式のようにindex.htmlのscriptタグ内にコードを書くのではなく、srcディレクトリ配下のJavaScriptファイルを追加・変更して作業を進めていきます。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Hello React</title>
  </head>
  <body>
    <div id="content"></div>
    <script type="text/javascript" src="dist/main.js"></script>
  </body>
</html>
```

### 最初のコンポーネント

最初のコンポーネントCommentBox。

```javascript
// src/CommentBox.js
var React = require('react');

var CommentBox = React.createClass({
  render: function() {
    return (
      <div className="commentBox">
        Hello, world! I am a CommentBox.
      </div>
    );
  }
});

module.exports = CommentBox;
```

CommentBoxを実際に動作させる部分はアプリケーションのエントリポイントとしてファイルを分離してあります。

```javascript
// src/entry.js
var React = require('react');
var CommentBox = require('./CommentBox');

React.render(
  <CommentBox />,
  document.getElementById('content')
);
```

##### JSXについて補足

* HTMLっぽいだけでHTMLではない。
* classをclassName、forをhtmlForみたいに書かなければいけない場合がある。


### コンポーネントの組み立て

CommentListとCommentFormの骨組みをそれぞれ個別ファイルで追加。

```javascript
// src/CommentList.js
var React = require('react');

var CommentList = React.createClass({
  render: function() {
    return (
      <div className="commentList">
        Hello, world! I am a CommentList.
      </div>
    );
  }
});

module.exports = CommentList;
```

```javascript
// src/CommentForm.js
var React = require('react');

var CommentForm = React.createClass({
  render: function() {
    return (
      <div className="commentForm">
        Hello, world! I am a CommentForm.
      </div>
    );
  }
});

module.exports = CommentForm;
```

追加したコンポーネントを使うようにCommentBoxを更新。

```javascript
// src/CommentBox.js
var React = require('react');
var CommentList = require('./CommentList');
var CommentForm = require('./CommentForm');


var CommentBox = React.createClass({
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList />
        <CommentForm />
      </div>
    );
  }
});

module.exports = CommentBox;
```

### Props を使う

Commentコンポーネントを追加。

```javascript
// src/Comment.js
var React = require('react');

var Comment = React.createClass({
  render: function() {
    return (
        <div className="comment">
          <h2 className="commentAuthor">
            {this.props.author}
          </h2>
          {this.props.children}
        </div>
    );
  }
});

module.exports = Comment;
```

### コンポーネントのプロパティ

```javascript
// src/CommentList.js
var React = require('react');
var Comment = require('./Comment');

var CommentList = React.createClass({
  render: function() {
    return (
      <div className="commentList">
        <Comment author="Pete Hunt">This is one comment</Comment>
        <Comment author="Jordan Walke">This is *another* comment</Comment>
      </div>
    );
  }
});

module.exports = CommentList;
```

### Markdown の追加

Commentでmarkedを利用してマークダウン対応。

```javascript
// src/Comment.js
var React = require('react');
var marked = require('marked');

var Comment = React.createClass({
  render: function() {
    return (
        <div className="comment">
          <h2 className="commentAuthor">
            {this.props.author}
          </h2>
          {marked(this.props.children.toString())}
        </div>
    );
  }
});

module.exports = Comment;
```

ここで一旦ブラウザでhtmlタグがエスケープされてしまっていることを確認。
htmlタグを使えるようにするために,dangerouslySetInnerHTMLを使って書き換え。

```javascript
// src/Comment.js
var React = require('react');
var marked = require('marked');

var Comment = React.createClass({
  render: function() {
    var rawMarkup = marked(this.props.children.toString(), { sanitize: true });
    return (
        <div className="comment">
          <h2 className="commentAuthor">
            {this.props.author}
          </h2>
          <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
        </div>
    );
  }
});

module.exports = Comment;
```

### データモデルとの連携

アプリケーションのエントリポイントでデータを渡す。

```javascript
// src/entry.js
var React = require('react');
var CommentBox = require('./CommentBox');

var data = [
    { author: 'Pete Hunt', text: 'This is one comment' },
    { author: 'Jordan Walke', text: 'This is *another* comment' }
];

React.render(
  <CommentBox data={data} />,
  document.getElementById('content')
);
```

```javascript
// src/CommentBox.js
var React = require('react');
var CommentList = require('./CommentList');
var CommentForm = require('./CommentForm');

var CommentBox = React.createClass({
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.props.data} />
        <CommentForm />
      </div>
    );
  }
});

module.exports = CommentBox;
```

```javascript
// src/CommentList.js
var React = require('react');
var Comment = require('./Comment');

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment) {
      return (
          <Comment author={comment.author}>
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
});

module.exports = CommentList;
```

### サーバからのデータの取得

```javascript
// src/entry.js
var React = require('react');
var CommentBox = require('./CommentBox');

React.render(
  <CommentBox url="comments.json" />,
  document.getElementById('content')
);
```

### Reactive state

```javascript
// src/CommentBox.js
var React = require('react');
var CommentList = require('./CommentList');
var CommentForm = require('./CommentForm');

var CommentBox = React.createClass({
  getInitialState: function() {
    return { data: [] };
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm />
      </div>
    );
  }
});

module.exports = CommentBox;
```

##### ライフサイクルメソッドについて

コンポーネントの生成、実行、破棄などのライフサイクルのイベント事に呼ばれるメソッド。


##### keyの話

Virtual DOMが効率よく差分を変更するのを助けるために、ユニークなキーを割り当てて使います。


#### State の更新

comments.json
```json
[
  {"author": "Pete Hunt", "text": "This is one comment"},
  {"author": "Jordan Walke", "text": "This is *another* comment"}
]
```

```javascript
// src/CommentBox.js
var React = require('react');
var $ = require('jquery');
var CommentList = require('./CommentList');
var CommentForm = require('./CommentForm');

var CommentBox = React.createClass({
  getInitialState: function() {
    return { data: [] };
  },
  componentDidMount: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm />
      </div>
    );
  }
});

module.exports = CommentBox;
```

```javascript

var React = require('react');
var $ = require('jquery');
var CommentList = require('./CommentList');
var CommentForm = require('./CommentForm');

var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return { data: [] };
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm />
      </div>
    );
  }
});

module.exports = CommentBox;
```

```javascript
var React = require('react');
var CommentBox = require('./CommentBox');

React.render(
  <CommentBox url="comments.json" pollInterval={2000} />,
  document.getElementById('content')
);
```

### 新しいコメントの追加

```javascript
// src/CommentForm.js
var React = require('react');

var CommentForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var author = React.findDOMNode(this.refs.author).value.trim();
    var text = React.findDOMNode(this.refs.text).value.trim();
    if (!text || !author) {
      return;
    }
    React.findDOMNode(this.refs.author).value = '';
    React.findDOMNode(this.refs.text).value = '';
    return;
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something..." ref="text" />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

module.exports = CommentForm;
```

```javascript

var React = require('react');
var $ = require('jquery');
var CommentList = require('./CommentList');
var CommentForm = require('./CommentForm');

var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment) {

  },
  getInitialState: function() {
    return { data: [] };
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});

module.exports = CommentBox;
```

```javascript
var React = require('react');

var CommentForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var author = React.findDOMNode(this.refs.author).value.trim();
    var text = React.findDOMNode(this.refs.text).value.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({ author: author, text: text });
    React.findDOMNode(this.refs.author).value = '';
    React.findDOMNode(this.refs.text).value = '';
    return;
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something..." ref="text" />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

module.exports = CommentForm;
```

```javascript
var React = require('react');
var $ = require('jquery');
var CommentList = require('./CommentList');
var CommentForm = require('./CommentForm');

var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment) {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return { data: [] };
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});

module.exports = CommentBox;
```

### 最適化: 先読み更新

```javascript
var React = require('react');
var $ = require('jquery');
var CommentList = require('./CommentList');
var CommentForm = require('./CommentForm');

var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment) {
    var comments = this.state.data;
    var newComments = comments.concat([comment]);
    this.setState({ data: newComments });
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return { data: [] };
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});

module.exports = CommentBox;
```
