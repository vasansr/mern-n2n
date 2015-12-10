var Bug = React.createClass({
	render: function() {
		return(
			<tr className="bug">
				<td className="bug-id">{this.props.data._id}</td>
				<td className="bug-owner">{this.props.data.owner}</td>
				<td className="bug-description">{this.props.data.title}</td>
			</tr>
		);
	}
});

var BugList = React.createClass({
	getInitialState: function() {
		return {data: [], newBug: {title: '', owner: ''}};
	},
	componentDidMount: function() {
		getData(function(bugs) {
			this.setState({data: bugs});
		}.bind(this));		// the bind() lets 'this' for setState be *this* 'this'
	},
	addBug: function(event) {
		console.log('Add a new bug ...');
		event.preventDefault();
		var bugs = this.state.data;
		var form = document.forms.newBug;
		bugs.push({_id: allBugs.length+1, owner: form.owner.value, title: form.title.value});
		this.setState({data: bugs});
		// clear the form for the next entry
		form.owner.value = ""; form.title.value = "";
	},
	render: function() {
		var bugs = this.state.data.map(function(bug) {
			return (
				<Bug key={bug._id} data={bug} />
			);
		});
		return (
			<div>
				<table className="bug-list">
					<thead>
						<tr className="bug header">
							<th className="bug-id">Id</th>
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

var allBugs = [
	{_id: 1, owner: 'Vasan', title: '404 Not Found on some files'},
	{_id: 2, owner: 'Sandeep', title: 'Error on console: no property "set" in undefined'},
	{_id: 3, owner: 'Fazle', title: 'Warning: validateDOMNesting(...): <tr> cannot appear as a child of <table>.'}

];

function getData(callback) {
	// return asynchronously as if it were an ajax call
	setTimeout(function() { callback(allBugs); }, 0);
}

ReactDOM.render(
	<BugList />,
	document.getElementById('example')
);

