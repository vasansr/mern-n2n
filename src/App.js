/*
ReactDOM.render(
	<h1>Hello, world!</h1>,
	document.getElementById('example')
);
*/

var Hello = React.createClass({
	render: function(){
		return (
			<div>
			Hello <b>{this.props.message}</b>.
			</div>
			)
	}
});

ReactDOM.render(<Hello message="World!"/>, document.getElementById('example'));
