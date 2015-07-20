var React = require('React');
var Fluxxor = require('fluxxor');

var FluxMixin = Fluxxor.FluxMixin(React);

var FormInput = React.createClass({
	mixins: [FluxMixin],

	getInitialState: function() {
		return {
			newValue: "",
			hasError: false
		};
	},

	handleValueChange: function(e) {

		this.setState({newValue: e.target.value});

	},

	handleBlur: function(e) {

		if (this.props.validation.isRequired && this.state.newValue.trim() == "")
			this.setState({hasError: true});

	},

	render: function() {
		var cx = React.addons.classSet;
		var classes = cx({
			'form-group': true,
			'has-error': this.props.hasError
		});

		return (
			<div className="form-group">
				<label htmlFor={this.props.name}>{this.props.niceName}</label>
				<input type={this.props.type} name={this.props.name} id={this.props.name} value={this.state.newValue} onChange={this.handleValueChange} onBlur={this.handleBlur} className="form-control" />
			</div>
		);
	}
});

module.exports = FormInput;