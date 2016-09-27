var CommentCompont = React.createClass({
	getInitialState: function(){
		return {
			commentConfig: this.props.commentConfig || {}
		}
	},
	render: function() {
		return (
			<div className={this.state.commentConfig}>
				{this.state.commentConfig.allowNewComment === false? '' : <CommentBox commentSubmitCB={this.props.onCommentSubmit} /> }
				<CommentList commentSubmitCB={this.props.onCommentSubmit} commentDeleteCB={this.props.onCommentDelete} commentsListObj={this.props.commentsData} config={this.state.commentConfig} />
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
	componentDidMount: function() {
		if(this.props.setFocus){
			ReactDOM.findDOMNode(this.refs.inputCommentBox).focus(); 
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
		if(this.props.onCancel){
			this.props.onCancel();
		}
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
		this.props.commentSubmitCB(text);
		this.setState({
			text: ''
		});
	},
	render: function() {
		return (
			<div>
				<form onSubmit={this.handleCommentSubmit}>
					<input onChange={this.handleTextChange} ref="inputCommentBox" value={this.state.text} type="text" className="form-control margin-b-10" onFocus={this.showActionBtns} />

					<div className={"pull-right margin-b-30 " + (this.state.boxFocused ? 'show' : 'hide') } >
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
		var cbFn  =  this.props.commentSubmitCB;
		var dlFn  =  this.props.commentDeleteCB;
		var cmCnf =  this.props.config;
		var commentNodes = this.props.commentsListObj.map(function(cmnt,i) {
			return (
				<Comment commentSubmitFn={cbFn} commentDeleteFn={dlFn} key={i + ' '+  new Date().getTime()} comment={cmnt} configOptions={cmCnf} />
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
	getInitialState: function(){
		return {
			replyenabled: false
		}
	},
	enableReply: function(){
		this.setState({
			replyenabled: true	
		});
	},
	cancelReply: function() {
		this.setState({
			replyenabled: false
		});
	},
	handelCommentReply: function(text) {
		this.props.commentSubmitFn(text, this.props.comment, true);
	},
	handelCommentDelete: function() {
		this.props.commentDeleteFn(this.props.comment);
	},
	render: function() {
		var commentNodes = '';
		if(this.props.comment.reply) {
			var cbFn = this.props.commentSubmitFn;
			var dlFn =  this.props.commentDeleteFn;
			var cmCnf =  this.props.configOptions;
			commentNodes = this.props.comment.reply.map(function(cmnt,i) {
				return (
					<Comment key={'reply '+i + ' ' + new Date().getTime()} comment={cmnt} commentSubmitFn={cbFn} commentDeleteFn={dlFn} configOptions={cmCnf} />
				);
			});
		}
		return (
			<div>
				<table className="table comment-table">
					<tbody>
						<tr>
							<td rowSpan="3" className="media-body"> 
								<img src={this.props.comment.userimg} style={{'width': '35px', 'maxHeight': '35px', 'margin': '5px 15px 5px 0'}} className="img-rounded" />
							</td>
							<td className="comment-actions-row">
								<b>{this.props.comment.user} </b> 
								<div className="pull-right has-feedback">
									<small> 2 days ago </small>
									{this.props.configOptions.allowDelete ?
										<span className="comment-actions" onClick={this.handelCommentDelete}>
											&times;
										</span>
										: ''
									}
								</div>
							</td>
						</tr>
						<tr>
							<td>
								{this.props.comment.text}
							</td>
						</tr>
						{this.props.configOptions.allowReply ?
							<tr>
								<td className="no-border">
									{ this.state.replyenabled ? '': <small> <a href="javascript:void(0);" onClick={this.enableReply}> Reply </a> </small> }
									{ this.state.replyenabled ? <CommentBox onCancel={this.cancelReply} setFocus={true} commentSubmitCB={this.handelCommentReply} /> : '' }
								</td>
							</tr>:<tr><td className="no-border"></td></tr>}
						<tr className={commentNodes ? '': 'hide'}>
							<td className="no-border"></td><td className="no-border"> { commentNodes } </td>
						</tr>
						
					</tbody>
				</table>
			</div>
		);
	}
});



/* consume the comment as below */

var Article = React.createClass({
	getInitialState: function() {
		return {
			commentsList: [],
			commentBoxOptions: {
				allowNewComment: true,
				allowDelete: true,
				allowReply: true,
				cssClass: 'main-class'
			}
		}
	},
	componentDidMount: function(){
		this.setState({
			commentsList: [{
				id: 'c1',
				user: 'User Name',
				userimg: 'userImage.png',
				text: 'Cmnt Text',
				reply: [{
					id: 'a1',
					user: 'User Name1',
					userimg: 'userImage.png',
					text: 'Reply cmnt Text'
				}]
			}]
		});
	},
	handleCommentsDelete: function(cmnt) {
		debugger;
		var newList =  this.state.commentsList.slice(0);

		for(var i=0; i<newList.length; i++) {
			var commentFound = false;
			if(newList[i].id === cmnt.id) { 

				newList.splice(i,1);
				break;
			}
			var allReplies = newList[i].reply;
			for(var j=0; j<allReplies.length; j++) {
				if(allReplies[j].id === cmnt.id) { 
					allReplies.splice(j,1);
					commentFound = true;
					break;
				}
			}
			if(commentFound) {
				break;
			}
		}

		this.setState({
			commentsList: newList
		});
	},
	handleCommentSubmit: function(cmntTex, repliedTo, isReply) {
		

		var newList =  this.state.commentsList.slice(0);

		var resp = {
			id: new Date().getTime(),
			user: 'Some User',
			userimg: 'userImage.png',
			text: cmntTex
		};
		if(isReply) {
			for(var i=0; i<newList.length; i++) {
				var commentFound = false;
				if(newList[i].id === repliedTo.id) { 
					newList[i].reply = newList[i].reply || [];
					newList[i].reply.unshift(resp);
					break;
				}
				var allReplies = newList[i].reply;
				for(var j=0; j<allReplies.length; j++) {
					if(allReplies[j].id === repliedTo.id) { 
						allReplies.splice(j+1,0,resp);
						commentFound = true;
						break;
					}
				}
				if(commentFound) {
					break;
				}
			}
		}
		else { //new comment should come on top...
			newList.unshift(resp);
		}

		this.setState({
			commentsList: newList
		});
	},
	render: function() {
		return (
			<div className="article-box">
				<div  id="main-div" className="margin-b-10">
					Hello!
				</div>
				{this.state.commentsList ? <CommentCompont onCommentSubmit={this.handleCommentSubmit} onCommentDelete={this.handleCommentsDelete} commentsData={this.state.commentsList} commentConfig={this.state.commentBoxOptions} /> : '' }
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