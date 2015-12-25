var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
var Router = require('react-router').Router
var Route = require('react-router').Route
var Link = require('react-router').Link

var Paper = require('material-ui/lib/paper');
var Card = require('material-ui/lib/card/card');
var CardHeader = require('material-ui/lib/card/card-header');
var CardText = require('material-ui/lib/card/card-text');
var RaisedButton = require('material-ui/lib/raised-button');
var FlatButton = require('material-ui/lib/flat-button');
var SelectField = require('material-ui/lib/select-field');
var TextField = require('material-ui/lib/text-field');
var Snackbar = require('material-ui/lib/snackbar');
var Avatar = require('material-ui/lib/avatar');
var FontIcon = require('material-ui/lib/font-icon');
var Colors = require('material-ui/lib/styles').Colors;
var Table = require('material-ui/lib/table/table');
var TableBody = require('material-ui/lib/table/table-body');
var TableHeader = require('material-ui/lib/table/table-header');
var TableHeaderColumn = require('material-ui/lib/table/table-header-column');
var TableRow = require('material-ui/lib/table/table-row');
var TableRowColumn = require('material-ui/lib/table/table-row-column');

injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var priorityValues = [
	{ payload: 'P1', text: 'P1' },
	{ payload: 'P2', text: 'P2' },
	{ payload: 'P3', text: 'P3' },
];

var statusValues = [
	{ payload: 'New', text: 'New' },
	{ payload: 'Open', text: 'Open' },
	{ payload: 'Closed', text: 'Closed' },
];

var anyValue = '*';

var anyOption = [
	{ payload: anyValue, text: '(Any)' },
];

var priorityFilterValues = anyOption.concat(priorityValues);
var statusFilterValues = anyOption.concat(statusValues);

var BugEdit = React.createClass({
	render: function() {
		return(
			<div style={{maxWidth: 800}}>
				<Card>
					<CardHeader title="Edit Bug" subtitle={this.props.params.id}
						avatar={
							<Avatar backgroundColor={Colors.teal500} icon={
								<FontIcon className="fa fa-bug"></FontIcon>
							}>
							</Avatar>
						} />
					<CardText>
						<SelectField fullWidth={true} value={this.state.priority} onChange={this.onChangePriority}
								menuItems={priorityValues} floatingLabelText="Priority" />
						<br/>
						<SelectField fullWidth={true} value={this.state.status} onChange={this.onChangeStatus}
								menuItems={statusValues} floatingLabelText="Status" />
						<br/>
						<TextField fullWidth={true} floatingLabelText="Bug Title" multiLine={true}
								value={this.state.title} onChange={this.onChangeTitle}/>
						<br/>
						<TextField fullWidth={true} floatingLabelText="Owner"
								value={this.state.owner} onChange={this.onChangeOwner}/>
						<br/>
						<RaisedButton label="Save" primary={true} onTouchTap={this.submit} />
						<FlatButton label="Back to Bug List" onTouchTap={this.backToBugs} />
						<Snackbar ref="successMessage" message="Changes saved, thank you." 
								autoHideDuration={5000} action="ok" onActionTouchTap={this.dismissSuccessMessage} />
					</CardText>
				</Card>
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
	submit: function() {
		var bug = this.state;

		$.ajax({
			url: '/api/bugs/' + this.props.params.id, type: 'PUT', contentType:'application/json',
			data: JSON.stringify(bug),
			dataType: 'json',
			success: function(bug) {
				this.setState(bug);
				this.refs.successMessage.show();
			}.bind(this),
			error: function(xhr, status, err) {
				// in production, we'd give a message to the user
				console.error(status, err.toString());
			}
		});
	},

	backToBugs: function() {
		this.props.history.push({pathname: '/bugs'});
	},

	dismissSuccessMessage: function() {
		this.refs.successMessage.dismiss();
	}

});

var BugFilter = React.createClass({
	render: function() {
		return(
			<Card initiallyExpanded={true}>
				<CardHeader title="Filter" subtitle="Show a subset of records"
					actAsExpander={true} showExpandableButton={true}
					avatar={
						<Avatar backgroundColor={Colors.teal500} icon={
							<FontIcon className="fa fa-filter"></FontIcon>
						}>
						</Avatar>
					}
				/>
				<CardText expandable={true} style={{paddingTop: 8}}>
					<SelectField value={this.state.priority} onChange={this.onChangePriority}
						menuItems={priorityFilterValues} floatingLabelText="Priority" />&nbsp;
					<SelectField value={this.state.status} onChange={this.onChangeStatus}
						menuItems={statusFilterValues} floatingLabelText="Status" />
					<br/>
					<RaisedButton label="Apply" primary={true} onTouchTap={this.submit} />
					<br/> {/* Give some space for the select dropdown */}
					<br/>
					<br/>
				</CardText>
			</Card>
		);
	},

	getInitialState: function() {
		return {priority: this.props.init.priority || anyValue, status: this.props.init.status || anyValue};
	},

	onChangePriority: function(e) {
		this.setState({priority: e.target.value});
	},
	onChangeStatus: function(e) {
		this.setState({status: e.target.value});
	},

	submit: function() {
		var filter = {};
		if (this.state.priority != anyValue) filter.priority = this.state.priority;
		if (this.state.status != anyValue) filter.status = this.state.status;
		this.props.submitHandler(filter);
	}
});

var Bug = React.createClass({
	render: function() {
		return(
			<TableRow>
				<TableRowColumn style={{height: 24, width: 180}}>
					<Link to={'/bugs/' + this.props.data._id}>{this.props.data._id}</Link>
				</TableRowColumn>
				<TableRowColumn style={{height: 24, width: 40}}>{this.props.data.status}</TableRowColumn>
				<TableRowColumn style={{height: 24, width: 40}}>{this.props.data.priority}</TableRowColumn>
				<TableRowColumn style={{height: 24, width: 60}}>{this.props.data.owner}</TableRowColumn>
				<TableRowColumn style={{height: 24}}>{this.props.data.title}</TableRowColumn>
			</TableRow>
		);
	}
});

var BugList = React.createClass({

	getInitialState: function() {
		return {data: []};
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
		var queryString = $.param(filter);
		var searchString = (queryString != '') ? '?' + queryString : '';
		this.props.history.push({pathname: '/bugs', search: searchString});
	},

	addBug: function(bug) {
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
		var bugRows = this.state.data.map(function(bug) {
			return (
				<Bug key={bug._id} data={bug} />
			);
		});
		return (
			<div>
				<BugFilter submitHandler={this.changeFilter} init={this.props.location.query}/>
				<Paper zDepth={1} style={{marginTop: 10, marginBottom: 10}}>
					<Table>
						<TableHeader displaySelectAll={false} adjustForCheckbox={false}>
							<TableRow>
								<TableHeaderColumn style={{width: 180}}>Id</TableHeaderColumn>
								<TableHeaderColumn style={{width: 40}}>Status</TableHeaderColumn>
								<TableHeaderColumn style={{width: 40}}>Priority</TableHeaderColumn>
								<TableHeaderColumn style={{width: 60}}>Owner</TableHeaderColumn>
								<TableHeaderColumn>Title</TableHeaderColumn>
							</TableRow>
						</TableHeader>
						<TableBody stripedRows={true}>
							{bugRows}
						</TableBody>
					</Table>
				</Paper>
				<AddBug submitHandler={this.addBug} />
			</div>
		)
	}
});

var AddBug = React.createClass({
	render: function() {
		return (
			<Card initiallyExpanded={true}>
				<CardHeader title="Create" subtitle="Add a new bug"
					actAsExpander={true} showExpandableButton={true}
					avatar={
						<Avatar backgroundColor={Colors.teal500} icon={
							<FontIcon className="fa fa-plus"></FontIcon>
						} />
					}
				/>
				<CardText expandable={true} style={{paddingTop: 8}}>
					<TextField hintText="Bug Title" value={this.state.title} onChange={this.onChangeTitle}/>
					<br />
					<TextField hintText="Owner" value={this.state.owner} onChange={this.onChangeOwner}/>
					<br />
					<RaisedButton label="Add" primary={true} onTouchTap={this.submit}/>
				</CardText>
			</Card>
		)
	},

	getInitialState: function() {
		return {owner: '', title: ''};
	},
	onChangeTitle: function(e) {
		this.setState({'title': e.target.value});
	},
	onChangeOwner: function(e) {
		this.setState({'owner': e.target.value});
	},
	submit: function() {
		this.props.submitHandler({
			owner: this.state.owner, title: this.state.title,
			priority: 'P3', status: 'New'
		});
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

