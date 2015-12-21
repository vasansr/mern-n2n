var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
var Router = require('react-router').Router
var Route = require('react-router').Route
var Link = require('react-router').Link

var Bug = React.createClass({
	render: function() {
		return(
			<tr className="bug">
				<td className="bug-id">
					<Link to={'/bugs/' + this.props.data._id}>{this.props.data._id}</Link>
				</td>
				<td className="bug-status">{this.props.data.status}</td>
				<td className="bug-priority">{this.props.data.priority}</td>
				<td className="bug-owner">{this.props.data.owner}</td>
				<td className="bug-description">{this.props.data.title}</td>
			</tr>
		);
	}
});

var BugEdit = React.createClass({
	getInitialState: function() {
		return {data: []};
	},

	componentDidMount: function() {
		this.loadData();
	},

	loadData: function() {
		$.ajax({
			url: '/api/bugs/' + this.props.params.id, type: 'GET',
			dataType: 'json',
			success: function(bug) {
				this.setState({data: bug});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(status, err.toString());
			}
		});
	},
	render: function() {
		return(
			<div>
				Edit bug: {this.props.params.id}
				<br/>
				Status: {this.state.data.status}
				<br/>
				Priority: {this.state.data.priority}
				<br/>
				Owner: {this.state.data.owner}
				<br/>
				Title: {this.state.data.title}
				<br/>
				<Link to="/bugs">Back to Bug List</Link><br/>
			</div>
		);
	}
});

var BugFilter = React.createClass({
	render: function() {
		return(
			<form name="filter" onSubmit={this.props.submitHandler}>
				Filter:<br/>
				Priority:
				<select name="priority">
					<option value="">(Any)</option>
					<option value="P1">P1</option>
					<option value="P2">P2</option>
					<option value="P3">P3</option>
				</select>
				Status:
				<select name="status">
					<option value="">(Any)</option>
					<option>New</option>
					<option>Open</option>
					<option>Fixed</option>
					<option>Closed</option>
				</select>
				<button type="submit">Search</button>
			</form>
		);
	}
});

var BugList = React.createClass({

	getInitialState: function() {
		return {data: [], newBug: {title: '', owner: ''}};
	},

	componentDidUpdate: function(prevProps) {
		console.log("componentDidUpdate");
		var oldQuery = prevProps.location.query;
		var newQuery = this.props.location.query;
		if (oldQuery.priority === newQuery.priority &&
				oldQuery.status === newQuery.status) {
			return;
		} else {
			this.loadData();
		}
	},

	componentDidMount: function() {
		console.log("componentDidMount");
		this.loadData();
	},

	loadData: function() {
		var query = this.props.location.query || {};
		var filter = {priority: query.priority, status: query.status};

		$.ajax({
			url: '/api/bugs', type: 'GET',
			data: filter,
			dataType: 'json',
			success: function(bugs) {
				this.setState({data: bugs});
			}.bind(this),		// the bind() lets 'this' for setState be *this* 'this'
			error: function(xhr, status, err) {
				console.error(status, err.toString());
			}
		});
	},

	changeFilter: function(event) {
		if (event) event.preventDefault();
		var form = document.forms.filter;
		this.props.history.push({pathname: '/bugs', search: '?' + $(form).serialize()});
	},

	addBug: function(event) {
		event.preventDefault();

		var form = document.forms.newBug;
		var bug = {owner: form.owner.value, title: form.title.value, priority: 'P3', status: 'Open'};

		$.ajax({
			url: '/api/bugs', type: 'POST', contentType:'application/json',
			data: JSON.stringify(bug),
			dataType: 'json',
			success: function(bug) {
				var bugs = this.state.data;
				bugs.push(bug);
				console.log("Bug add confirmation recd, setting state");
				this.setState({data: bugs});
			}.bind(this),
			error: function(xhr, status, err) {
				// in production, we'd give a message to the user
				console.error(status, err.toString());
			}
		});

		// clear the form for the next entry
		form.owner.value = ""; form.title.value = "";
	},

	render: function() {
		console.log("Rendering", this.state.data.length, "items");
		var bugs = this.state.data.map(function(bug) {
			return (
				<Bug key={bug._id} data={bug} />
			);
		});
		return (
			<div>
				<BugFilter submitHandler={this.changeFilter} />
				<table className="bug-list">
					<thead>
						<tr className="bug header">
							<th className="bug-id">Id</th>
							<th className="bug-status">Status</th>
							<th className="bug-priority">Priority</th>
							<th className="bug-owner">Owner</th>
							<th className="bug-description">Title</th>
						</tr>
					</thead>
					<tbody>
						{bugs}
					</tbody>
				</table>
				<form name="newBug" onSubmit={this.addBug}>
					<input type="text" name="title" size="40" placeholder="Bug Title" />
					<input type="text" name="owner" placeholder="Owner" />
					<button>Add</button>
				</form>
			</div>
		)
	}
});

ReactDOM.render(
	(
		<Router>
			<Route path="/bugs" component={BugList}/>
			<Route path="/bugs/:id" component={BugEdit}/>
		</Router>
	),
	document.getElementById('main')
);

