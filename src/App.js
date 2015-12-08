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
	render: function() {
		var bugs = this.props.data.map(function(bug) {
			return (
				<Bug key={bug._id} data={bug} />
			);
		});
		return (
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
		)
	}
});

var allBugs = [
	{_id: 1, owner: 'Vasan', title: '404 Not Found on some files'},
	{_id: 2, owner: 'Sandeep', title: 'Error on console: no property "set" in undefined'},
	{_id: 3, owner: 'Fazle', title: 'Warning: validateDOMNesting(...): <tr> cannot appear as a child of <table>.'}

];

ReactDOM.render(
	<BugList data={allBugs}/>,
	document.getElementById('example')
);

