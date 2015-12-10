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
		$.ajax({
			url: '/api/bugs', dataType: 'json',
			cache: false,
			success: function(bugs) {
				this.setState({data: bugs});
			}.bind(this),		// the bind() lets 'this' for setState be *this* 'this'
			error: function(xhr, status, err) {
				console.error(status, err.toString());
			}
		});
	},

	addBug: function(event) {
		event.preventDefault();

		var form = document.forms.newBug;
		var bug = {owner: form.owner.value, title: form.title.value};

		$.ajax({
			url: '/api/bugs', dataType: 'json', contentType:'application/json',
			type: 'POST', data: JSON.stringify(bug),
			success: function(bug) {
				var bugs = this.state.data;
				bugs.push(bug);
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

function getData(callback) {
}

ReactDOM.render(
	<BugList />,
	document.getElementById('example')
);

