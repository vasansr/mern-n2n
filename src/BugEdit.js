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
var ButtonToolbar = require('react-bootstrap/lib/ButtonToolbar');
var Alert = require('react-bootstrap/lib/Alert');

var BugEdit = React.createClass({

	render: function() {
		var success = (
			<Alert bsStyle="success" onDismiss={this.dismissSuccess} dismissAfter={5000}>
				Bug saved to DB successfully.
			</Alert>
		);
		return(
			<div style={{maxWidth: 600}}>
				<Panel header={"Edit bug: " + this.props.params.id}>
					<form name="bugEdit" onSubmit={this.submitEdits}>
						<Input type="select" label="Priority"
							value={this.state.priority} onChange={this.onChangePriority}>
							<option value="P1">P1</option>
							<option value="P2">P2</option>
							<option value="P3">P3</option>
						</Input>
						<Input type="select" label="Status" value={this.state.status} onChange={this.onChangeStatus}>
							<option>New</option>
							<option>Open</option>
							<option>Fixed</option>
							<option>Closed</option>
						</Input>
						<Input type="text" label="Title" value={this.state.title} onChange={this.onChangeTitle}/>
						<Input type="text" label="Owner" value={this.state.owner} onChange={this.onChangeOwner}/>
						<ButtonToolbar>
							<Button type="submit" bsStyle="primary">Submit</Button>
							<Link className="btn btn-link" to="/bugs">Back</Link>
						</ButtonToolbar>
					</form>
				</Panel>
				{this.state.successVisible ? success : null}
			</div>
		);
	},

	getInitialState: function() {
		return {successVisible: false};
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
		var bug = {
			priority: this.state.priority,
			status: this.state.status,
			owner: this.state.owner,
			title: this.state.title
		}

		$.ajax({
			url: '/api/bugs/' + this.props.params.id, type: 'PUT', contentType:'application/json',
			data: JSON.stringify(bug),
			dataType: 'json',
			success: function(bug) {
				this.setState(bug);
				this.showSuccess();
			}.bind(this),
			error: function(xhr, status, err) {
				// in production, we'd give a message to the user
				console.error(status, err.toString());
			}
		});
	},

	showSuccess: function() {
		this.setState({successVisible: true});
	},
	dismissSuccess: function() {
		this.setState({successVisible: false});
	}

});

module.exports = BugEdit;
