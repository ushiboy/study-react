# BabelでES6な書き方に挑戦

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

あとで

### var to let

あとで

### module import export

あとで

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

### arrow function

あとで

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

```javascript
// src/entry.js
import React from 'react';
import CommentBox from './CommentBox';

React.render(
  <CommentBox url="/api/comments" pollInterval={2000} />,
  document.getElementById('content')
);
```
