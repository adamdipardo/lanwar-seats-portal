var React = require('react');
var Fluxxor = require('fluxxor');
var History = require('react-router').History;

var RegisterBasicFields = require('./RegisterBasicFields');
var Header = require('./Header');
var Footer = require('./Footer');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Register = React.createClass({

	mixins: [FluxMixin, StoreWatchMixin("UserAccountStore"), History],

	getInitialState: function() {

		return {};

	},

	getStateFromFlux: function() {

		var flux = this.getFlux();

		var UserAccountStore = flux.store("UserAccountStore").getState();

		return {
			isLoggedIn: UserAccountStore.isLoggedIn,
			isLoadingSessionCheck: UserAccountStore.isLoadingSessionCheck,
			isLoadingRegister: UserAccountStore.isLoadingRegister
		};

	},

	handleSubmit: function(e) {

		e.preventDefault();

		if (this.refs.basicFormFields.isValid())
		{
			var formData = this.refs.basicFormFields.getFormData();
			this.getFlux().actions.UserAccountActions.register(formData);
		}

	},

	render: function() {

		// permission
		if (this.state.isLoggedIn && !this.state.isLoadingSessionCheck)
			this.history.pushState(null, '/profile');

		if (this.state.isLoadingRegister)
			var registerButton = <button type="submit" className="pull-right btn btn-primary" disabled="disabled">Registering... <i className="fa fa-circle-o-notch fa-spin"></i></button>;
		else
			var registerButton = <button type="submit" className="pull-right btn btn-primary">Register</button>;

		return (
			<div>
				<Header />
				<div className="container-fluid body">
					<div className="container">
						<div className="row">
							<form className="form" onSubmit={this.handleSubmit}>
							<div className="col-md-2"></div>
							<div className="col-md-8">
								<h2>Register</h2>
								<p>Register to create an account. You will need an account to claim tickets given to you, register or join teams, and sign up for tournaments.</p>
								<RegisterBasicFields ref="basicFormFields"/>
								{registerButton}
							</div>
							<div className="col-md-2"></div>
							</form>
						</div>
					</div>
				</div>
				<Footer />
			</div>
		);

	}

});

module.exports = Register;