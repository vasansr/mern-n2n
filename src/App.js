var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
var Router = require('react-router').Router
var Route = require('react-router').Route
var Link = require('react-router').Link

var Button = require('react-bootstrap/lib/Button');
var Panel = require('react-bootstrap/lib/Panel');
var Grid = require('react-bootstrap/lib/Grid');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');
var Input = require('react-bootstrap/lib/Input');
var ButtonInput = require('react-bootstrap/lib/ButtonInput');

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
	render: function() {
		return(
			<div>
				Edit bug: {this.props.params.id}
				<br/>
				<form name="bugEdit" onSubmit={this.submitEdits}>
					Priority:
					<select name="priority" value={this.state.priority} onChange={this.onChangePriority}>
						<option value="">(Any)</option>
						<option value="P1">P1</option>
						<option value="P2">P2</option>
						<option value="P3">P3</option>
					</select>
					<br/>
					Status:
					<select value={this.state.status} onChange={this.onChangeStatus}>
						<option value="">(Any)</option>
						<option>New</option>
						<option>Open</option>
						<option>Fixed</option>
						<option>Closed</option>
					</select>
					<br/>
					Owner: <input type="text" value={this.state.owner} onChange={this.onChangeOwner}/>
					<br/>
					Title: <input type="text" value={this.state.title} onChange={this.onChangeTitle}/>
					<br/>
					<button type="submit">Submit</button>
				</form>
				<Link to="/bugs">Back to Bug List</Link><br/>
			</div>
		);
	},

	getInitialState: function() {
		return {};
	},

	componentDidMount: function() {
		this.loadData();
	},

	loadData: function() {
		$.ajax({
			url: '/api/bugs/' + this.props.params.id, type: 'GET',
			dataType: 'json',
			success: function(bug) {
				this.setState(bug);
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(status, err.toString());
			}
		});
	},

	onChangePriority: function(e) {
		this.setState({priority: e.target.value});
	},
	onChangeStatus: function(e) {
		this.setState({status: e.target.value});
	},
	onChangeOwner: function(e) {
		this.setState({owner: e.target.value});
	},
	onChangeTitle: function(e) {
		this.setState({title: e.target.value});
	},
	submitEdits: function(e) {
		e.preventDefault();
		var bug = this.state;

		$.ajax({
			url: '/api/bugs/' + this.props.params.id, type: 'PUT', contentType:'application/json',
			data: JSON.stringify(bug),
			dataType: 'json',
			success: function(bug) {
				this.setState(bug);
			}.bind(this),
			error: function(xhr, status, err) {
				// in production, we'd give a message to the user
				console.error(status, err.toString());
			}
		});
	}

});

var BugFilter = React.createClass({
	render: function() {
		return(
			<Panel collapsible defaultExpanded={true} header="Filter">
				<Grid fluid={true}>
					<Row>
						<Col xs={12} sm={6} md={4}>
							<Input type="select" label="Priority"
								value={this.state.priority} onChange={this.onChangePriority}>
								<option value="">(Any)</option>
								<option value="P1">P1</option>
								<option value="P2">P2</option>
								<option value="P3">P3</option>
							</Input>
						</Col>
						<Col xs={12} sm={6} md={4}>
							<Input type="select" label="Status" value={this.state.status} onChange={this.onChangeStatus}>
								<option value="">(Any)</option>
								<option>New</option>
								<option>Open</option>
								<option>Fixed</option>
								<option>Closed</option>
							</Input>
						</Col>
						<Col xs={12} sm={6} md={4}>
							<Input label="&nbsp;">
								<ButtonInput value="Search" bsStyle="primary" onClick={this.submit} />
							</Input>
						</Col>
					</Row>
				</Grid>
			</Panel>
		);
	},

	getInitialState: function() {
		return {priority: this.props.init.priority, status: this.props.init.status};
	},

	onChangePriority: function(e) {
		this.setState({priority: e.target.value});
	},
	onChangeStatus: function(e) {
		this.setState({status: e.target.value});
	},

	submit: function(e) {
		if (e) e.preventDefault();
		this.props.submitHandler(this.state);
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

	changeFilter: function(filter) {
		this.props.history.push({pathname: '/bugs', search: '?' + $.param(filter)});
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
				<BugFilter submitHandler={this.changeFilter} init={this.props.location.query}/>
				<Panel>
					<table className="table table-striped table-bordered table-condensed">
						<thead>
							<tr>
								<th>Id</th>
								<th>Status</th>
								<th>Priority</th>
								<th>Owner</th>
								<th>Title</th>
							</tr>
						</thead>
						<tbody>
							{bugs}
						</tbody>
					</table>
				</Panel>
				<Panel header="Add Bug">
					<form name="newBug" onSubmit={this.addBug}>
						<Input type="text" name="title" label="Bug Title" />
						<Input type="text" name="owner" label="Owner" />
						<ButtonInput value="Add" bsStyle="primary" type="submit" />
					</form>
				</Panel>
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

