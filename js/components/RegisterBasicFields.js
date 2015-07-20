var React = require('react');
var Fluxxor = require('fluxxor');
var classNames = require('classnames');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var RegisterBasicFields = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin("TicketTypesStore")],

	getInitialState: function() {
		return {
			errors: {}
		};
	},

	getStateFromFlux: function() {

		var flux = this.getFlux();

		var TicketTypesStore = flux.store("TicketTypesStore").getState();
		var BuyTicketsStore = flux.store("BuyTicketsStore").getState();

		return {
			ticketTypes: TicketTypesStore.ticketTypes,
			isLoading: TicketTypesStore.isLoading,
			getTicketTypesError: TicketTypesStore.getTicketTypesError,
			formData: BuyTicketsStore.formData		
		}

	},

	isValid: function() {

		var fields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword'];

		// validate
		var errors = {};

		// check for required fields
		fields.forEach(function(field){
			var value = this.refs[field].getDOMNode().value.trim();

			if (!value)
				errors[field] = 'Please fill out this field';

			if (field == 'email' && !(/@/.test(value)))
				errors[field] = 'Please enter a valid email address';
		}.bind(this));

		// check passwords
		var passwordValue = this.refs['password'].getDOMNode().value.trim();
		var confirmPasswordValue = this.refs['confirmPassword'].getDOMNode().value.trim();

		if (passwordValue != confirmPasswordValue || passwordValue.length < 6)
		{
			errors['password'] = 'Passwords must match and be at least 6 characters long';
			errors['confirmPassword'] = '';
		}

		this.setState({errors: errors});

		isValid = true;
		for (var error in errors)
		{
			isValid = false;
			break;
		}

		return isValid;

	},

	getFormData: function() {
		return {
			firstName: this.refs.firstName.getDOMNode().value,
			lastName: this.refs.lastName.getDOMNode().value,
			email: this.refs.email.getDOMNode().value,
			password: this.refs.password.getDOMNode().value
		};
	},

	render: function() {
		return (
			<div>
				<div className="row">
					<div className="col-md-6">
						{this.renderField('firstName', 'First Name', 'text', this.state.formData['firstName'])}
					</div>
					<div className="col-md-6">
						{this.renderField('lastName', 'Last Name', 'text', this.state.formData['lastName'])}
					</div>
					<div className="col-md-12">
						{this.renderField('email', 'Email', 'email', this.state.formData['email'])}
					</div>
					<div className="col-md-6">
						{this.renderField('password', 'Password', 'password')}
					</div>
					<div className="col-md-6">
						{this.renderField('confirmPassword', 'Confirm Password', 'password')}
					</div>
				</div>
			</div>
		);
	},

	renderField: function(id, label, type, value) {
		var classes = classNames({
			'form-group': true,
			'has-error': id in this.state.errors
		});

		var errorString = id in this.state.errors ? <span className="help-block">{this.state.errors[id]}</span> : "";

		return (
			<div className={classes}>
				<label htmlFor={id}>{label}</label>
				<input type={type} name={id} id={id} ref={id} value={value} onChange={this.changeFieldValue} className="form-control"/>
				{errorString}
			</div>
		);
	},

	changeFieldValue: function(event) {
		var formData = this.state.formData;
		formData[event.target.id] = event.target.value;
		this.setState({formData: formData});
	}
});

module.exports = RegisterBasicFields;