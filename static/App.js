var Bug = React.createClass({
	displayName: "Bug",

	render: function () {
		return React.createElement(
			"tr",
			{ className: "bug" },
			React.createElement(
				"td",
				{ className: "bug-id" },
				this.props.data._id
			),
			React.createElement(
				"td",
				{ className: "bug-owner" },
				this.props.data.owner
			),
			React.createElement(
				"td",
				{ className: "bug-description" },
				this.props.data.title
			)
		);
	}
});

var BugList = React.createClass({
	displayName: "BugList",

	getInitialState: function () {
		return { data: [] };
	},
	componentDidMount: function () {
		getData((function (bugs) {
			this.setState({ data: bugs });
		}).bind(this)); // the bind() lets 'this' for setState be *this* 'this'
	},
	render: function () {
		var bugs = this.state.data.map(function (bug) {
			return React.createElement(Bug, { key: bug._id, data: bug });
		});
		return React.createElement(
			"table",
			{ className: "bug-list" },
			React.createElement(
				"thead",
				null,
				React.createElement(
					"tr",
					{ className: "bug header" },
					React.createElement(
						"th",
						{ className: "bug-id" },
						"Id"
					),
					React.createElement(
						"th",
						{ className: "bug-owner" },
						"Owner"
					),
					React.createElement(
						"th",
						{ className: "bug-description" },
						"Title"
					)
				)
			),
			React.createElement(
				"tbody",
				null,
				bugs
			)
		);
	}
});

var allBugs = [{ _id: 1, owner: 'Vasan', title: '404 Not Found on some files' }, { _id: 2, owner: 'Sandeep', title: 'Error on console: no property "set" in undefined' }, { _id: 3, owner: 'Fazle', title: 'Warning: validateDOMNesting(...): <tr> cannot appear as a child of <table>.' }];

function getData(callback) {
	// return asynchronously as if it were an ajax call
	setTimeout(function () {
		callback(allBugs);
	}, 0);
}

ReactDOM.render(React.createElement(BugList, null), document.getElementById('example'));