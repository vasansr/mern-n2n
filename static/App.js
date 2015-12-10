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
		return { data: [], newBug: { title: '', owner: '' } };
	},
	componentDidMount: function () {
		getData((function (bugs) {
			this.setState({ data: bugs });
		}).bind(this)); // the bind() lets 'this' for setState be *this* 'this'
	},
	addBug: function (event) {
		console.log('Add a new bug ...');
		event.preventDefault();
		var bugs = this.state.data;
		var form = document.forms.newBug;
		bugs.push({ _id: allBugs.length + 1, owner: form.owner.value, title: form.title.value });
		this.setState({ data: bugs });
		// clear the form for the next entry
		form.owner.value = "";form.title.value = "";
	},
	render: function () {
		var bugs = this.state.data.map(function (bug) {
			return React.createElement(Bug, { key: bug._id, data: bug });
		});
		return React.createElement(
			"div",
			null,
			React.createElement(
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
			),
			React.createElement(
				"form",
				{ name: "newBug", onSubmit: this.addBug },
				React.createElement("input", { type: "text", name: "title", size: "40", placeholder: "Bug Title" }),
				React.createElement("input", { type: "text", name: "owner", placeholder: "Owner" }),
				React.createElement(
					"button",
					null,
					"Add"
				)
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