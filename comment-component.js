var CommentCompont = React.createClass({
	render: function() {
		return (
			<div>
				<CommentBox onCommentSubmit={this.props.onCommentSubmit} />
				<hr />
				<CommentList commentsList={this.props.commentsList} />
			</div>
		);
	}
});

var CommentBox = React.createClass({
	getInitialState: function() {
		return {
			boxFocused: false,
			text: ''
		}
	},
	showActionBtns: function() {
		this.setState({
			boxFocused:true
		});
	},
	hideActionBtns: function() {
		this.setState({
			boxFocused: false,
			text: ''
		});
	},
	handleTextChange: function(e){
		this.setState({text: e.target.value});
	},
	handleCommentSubmit: function(e) {
		e.preventDefault();
		var text = this.state.text.trim();
		if (!text) {
			return;
		}
		this.props.onCommentSubmit(text);
		this.setState({
			text: ''
		});
	},
	render: function() {
		return (
			<div>
				<form onSubmit={this.handleCommentSubmit}>
					<input onChange={this.handleTextChange} value={this.state.text} type="text" className="form-control" onFocus={this.showActionBtns} />
					<br/>
					<div className={"pull-right " + (this.state.boxFocused ? 'show' : 'hide') } >
						<button className="btn btn-default btn-primary" type="submit"> Post </button>
						<button className="btn btn-default margin-l-10" type="button" onClick={this.hideActionBtns}> Cancel </button>
					</div>
					<div className="clearfix"></div>
				</form>
			</div>
		);
	}
});

var CommentList = React.createClass({
	render: function() {
		var commentNodes = this.props.commentsList.map(function(cmnts,i) {
			return (
				<Comment key={i} comment={cmnts} />
			);
		});
		return (
			<div>
				{commentNodes}
			</div>
		);
	}
});

var Comment = React.createClass({
	render: function() {
		return (
			<div>
				{this.props.comment.user}
				<br/>
				{this.props.comment.text}
			</div>
		);
	}
});



/* consume the comment as below */

var Article = React.createClass({
	getInitialState: function() {
		return {
			commentsList: [{
				id:'1',
				user: 'User Name',
				text: 'Cmnt Text'
			}]
		}
	},
	handleCommentSubmit: function(cmntTex) {
		var resp = {
			user: 'Some User',
			text: cmntTex
		};
		this.state.commentsList.unshift(resp);

		this.setState({
			commentsList: this.state.commentsList
		});
	},
	render: function() {
		return (
			<div className="article-box">
				<div  id="main-div" className="margin-b-10">
					Hello!
				</div>
				<CommentCompont onCommentSubmit={this.handleCommentSubmit} commentsList={this.state.commentsList} /> 
			</div>
			
		);
	}
});

ReactDOM.render (
	<div>
		<Article />	
	</div>,
	document.getElementById('example')
);