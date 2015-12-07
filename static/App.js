/*
ReactDOM.render(
	<h1>Hello, world!</h1>,
	document.getElementById('example')
);
*/

var Hello = React.createClass({
	displayName: "Hello",

	render: function () {
		return React.createElement(
			"div",
			null,
			"Hello ",
			React.createElement(
				"b",
				null,
				this.props.message
			),
			"."
		);
	}
});

ReactDOM.render(React.createElement(Hello, { message: "World!" }), document.getElementById('example'));